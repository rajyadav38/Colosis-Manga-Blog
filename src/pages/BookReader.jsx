import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookReader() {
  const { id } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;

  const [bookHtml, setBookHtml] = useState("");
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBook();
    fetchReviews();

    if (user) {
      fetchUserReview();
    }
    if (user) {
      fetch(`${API_URL}/api/stories/view/${id}/${user.id}`, {
        method: "PUT",
      });
    }
  }, []);

  const fetchBook = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stories/${id}`);

      const data = await res.json();

      const cleanedHtml = data.generatedBookHtml
        ?.replace(/<style[\s\S]*?<\/style>/gi, "")
        ?.replace(/<\/?html[^>]*>/gi, "")
        ?.replace(/<\/?body[^>]*>/gi, "")
        ?.replace(/text-shadow:[^;]+;/gi, "")
        ?.replace(/filter:[^;]+;/gi, "");

      setBookHtml(cleanedHtml || "");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/${id}`);

      const data = await res.json();

      setReviews(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserReview = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/user/${id}/${user.id}`);

      const data = await res.json();

      if (data) {
        setUserReview(data);
        setRating(data.rating);
        setComment(data.comment);
      } else {
        setUserReview(null);
        setRating(5);
        setComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const confirmDelete = window.confirm("Delete your review?");

      if (!confirmDelete) return;

      await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      setComment("");
      setRating(5);
      setUserReview(null);

      fetchReviews();
      fetchUserReview();

      alert("Review Deleted");
    } catch (error) {
      console.log(error);
    }
  };
  const submitReview = async () => {
    try {
      if (!comment.trim()) {
        alert("Please write a review");
        return;
      }

      await fetch(`${API_URL}/api/reviews/create`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          storyId: id,
          userId: user.id,
          username: user.username,
          rating,
          comment,
        }),
      });

      alert(userReview ? "Review Updated" : "Review Added");

      fetchReviews();
      fetchUserReview();
    } catch (error) {
      console.log(error);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="container py-5">
        <h3>Loading Book...</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(90deg, #0b1020 0%, #161d35 50%, #0b1020 100%)",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fdfcf8",
          padding: "60px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* BOOK CONTENT */}

        <div
          dangerouslySetInnerHTML={{
            __html: bookHtml,
          }}
        />

        {/* REVIEWS */}

        <hr className="my-5" />

        <h2 className="mb-4">⭐ Reader Reviews</h2>

        <div className="card p-4 mb-4">
          <h5 className="mb-3">
            Average Rating: {averageRating} ⭐ ({reviews.length} Reviews)
          </h5>

          {user ? (
            <>
              <select
                className="form-select mb-3"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                <option value={3}>⭐⭐⭐ 3 Stars</option>
                <option value={2}>⭐⭐ 2 Stars</option>
                <option value={1}>⭐ 1 Star</option>
              </select>

              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button className="btn btn-primary" onClick={submitReview}>
                {userReview ? "Update Review" : "Submit Review"}
              </button>
            </>
          ) : (
            <p>Please login to write a review.</p>
          )}
        </div>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="card p-3 mb-3 shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5>@{review.username}</h5>

                <div style={{ color: "#ffc107" }}>
                  {"⭐".repeat(review.rating)}
                </div>
              </div>

              <p className="mt-2">{review.comment}</p>

              <small className="text-muted">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>

              {user && review.userId === user.id && (
                <button
                  className="btn btn-danger btn-sm mt-3"
                  onClick={() => deleteReview(review._id)}
                >
                  🗑 Delete Review
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MangaReader() {
  const { id } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchStory();
    fetchChapters();
    if (user) {
      fetchUserReview();

      fetch(`${API_URL}/api/stories/view/${id}/${user.id}`, {
        method: "PUT",
      });
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const percent = (scrollTop / docHeight) * 100;

      setProgress(percent);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchStory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stories/${id}`);
      const data = await res.json();

      setStory(data);
      setLikes(data.likes || 0);

      if (user && data.likedBy) {
        setLiked(data.likedBy.includes(user.id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChapters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chapters/${id}`);
      const data = await res.json();

      setChapters(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stories/like/${id}/${user.id}`, {
        method: "PUT",
      });

      const data = await res.json();

      setLikes(data.likes);
      setLiked(data.likedBy.includes(user.id));
    } catch (error) {
      console.log(error);
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

  const deleteReview = async (reviewId) => {
    try {
      const confirmDelete = window.confirm("Delete review?");

      if (!confirmDelete) return;

      await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      fetchReviews();
      fetchUserReview();

      alert("Review Deleted");
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
  if (!story) {
    return <div className="container py-5">Loading Manga...</div>;
  }

  return (
    <div
      style={{
        background: "#0b1020",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      {/* Progress Bar */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${progress}%`,
          height: "5px",
          background: "#ff4d79",
          zIndex: 9999,
          transition: "0.2s",
          boxShadow: "0 0 15px #ff4d79",
        }}
      />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Cover Section */}

        <div className="text-center mb-5">
          <img
            src={story.coverImage}
            alt={story.title}
            style={{
              width: "260px",
              borderRadius: "20px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
              marginBottom: "25px",
              transition: "0.3s",
            }}
          />

          <h1
            style={{
              color: "#fff",
              fontSize: "64px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            {story.title}
          </h1>

          <h5
            style={{
              color: "#ff4d79",
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "25px",
            }}
          >
            @{story.authorUsername}
          </h5>

          <p
            style={{
              color: "#d7d7d7",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "2",
              fontSize: "20px",
            }}
          >
            {story.description}
          </p>

          <div
            className="d-flex justify-content-center gap-4 mt-4"
            style={{
              fontSize: "20px",
            }}
          >
            <span>👁 {story.views}</span>

            <button
              className="btn btn-sm"
              onClick={handleLike}
              style={{
                background: liked ? "#ff4d88" : "#1b223d",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "6px 18px",
              }}
            >
              ❤️ {likes}
            </button>

            <span>📚 {chapters.length} Chapters</span>
          </div>
        </div>

        {/* Chapters */}

        {chapters.map((chapter) => (
          <div key={chapter._id} className="mb-5">
            {/* Chapter Header */}

            <div
              className="text-center py-5 mb-5"
              style={{
                background: "linear-gradient(135deg,#1c233d,#262f52)",
                borderRadius: "25px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 10px 40px rgba(255,77,121,0.12)",
              }}
            >
              <h2
                className="fw-bold"
                style={{
                  color: "#ffffff",
                  fontSize: "42px",
                  marginBottom: "15px",
                }}
              >
                Chapter {chapter.chapterNumber}
              </h2>

              <h4
                style={{
                  color: "#ff7aa2",
                  fontWeight: "600",
                  fontSize: "28px",
                }}
              >
                {chapter.title}
              </h4>
            </div>

            {/* Pages */}

            {chapter.pages?.map((page, index) => (
              <div key={index} className="mb-4">
                <img
                  src={page.imageUrl}
                  alt=""
                  style={{
                    width: "100%",
                    maxWidth: "700px",
                    display: "block",
                    margin: "0 auto",
                    borderRadius: "14px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                  }}
                />

                <div
                  className="text-center mt-2"
                  style={{
                    color: "#999",
                    fontSize: "14px",
                  }}
                >
                  Page {page.pageNumber}
                </div>

                {page.caption && (
                  <div
                    className="text-center mt-3"
                    style={{
                      color: "#ddd",
                      maxWidth: "700px",
                      margin: "0 auto",
                      lineHeight: "1.8",
                    }}
                  >
                    {page.caption}
                  </div>
                )}
              </div>
            ))}

            {/* Divider */}

            <div
              className="text-center py-5"
              style={{
                color: "#666",
                fontSize: "24px",
              }}
            >
              ━━━━━━━━━━━━━━━━━━━
            </div>
          </div>
        ))}

        {/* End Section */}

        <div
          className="text-center py-5"
          style={{
            color: "#ffffff",
          }}
        >
          <h2
            style={{
              color: "#ff4d79",
              fontWeight: "800",
              fontSize: "42px",
            }}
          >
            ✨ The End ✨
          </h2>

          <p
            style={{
              color: "#ccc",
              fontSize: "18px",
              marginTop: "15px",
            }}
          >
            Thanks for reading {story.title}
          </p>
        </div>

        <div
          className="mt-5"
          style={{
            background: "#151b30",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <h2
            style={{
              color: "#fff",
            }}
          >
            ⭐ Reader Reviews
          </h2>

          <h5
            style={{
              color: "#ccc",
            }}
          >
            Average Rating: {averageRating} ⭐ ({reviews.length} Reviews)
          </h5>

          {user ? (
            <>
              <select
                className="form-select my-3"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>⭐⭐⭐⭐⭐</option>

                <option value={4}>⭐⭐⭐⭐</option>

                <option value={3}>⭐⭐⭐</option>

                <option value={2}>⭐⭐</option>

                <option value={1}>⭐</option>
              </select>

              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Write review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button className="btn btn-danger" onClick={submitReview}>
                {userReview ? "Update Review" : "Submit Review"}
              </button>
            </>
          ) : (
            <p
              style={{
                color: "#ccc",
              }}
            >
              Login to review this manga.
            </p>
          )}

          <hr
            style={{
              borderColor: "#333",
            }}
          />

          {reviews.map((review) => (
            <div key={review._id} className="card p-3 mb-3">
              <h5>@{review.username}</h5>

              <div>{"⭐".repeat(review.rating)}</div>

              <p>{review.comment}</p>

              {user && review.userId === user.id && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteReview(review._id)}
                >
                  Delete Review
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

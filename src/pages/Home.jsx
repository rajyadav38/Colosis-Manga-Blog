import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ theme }) {
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);

  const fetchPublishedStories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stories/published");

      const data = await res.json();

      setStories(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPublishedStories();
  }, []);

  const handleLike = async (storyId) => {
    try {
      await fetch(`http://localhost:5000/api/stories/like/${storyId}`, {
        method: "PUT",
      });

      fetchPublishedStories();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="container py-4"
      style={{
        color: theme.text,
      }}
    >
      <h1 className="fw-bold mb-4">📚 Latest Published Stories</h1>

      {stories.length === 0 ? (
        <p>No published stories yet.</p>
      ) : (
        <div className="row">
          {stories.map((story) => (
            <div key={story._id} className="col-lg-4 col-md-6 mb-4">
              <div
                className="card border-0 shadow-lg h-100"
                style={{
                  background: theme.card,
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                {/* Cover Image */}
                <img
                  src={`http://localhost:5000/uploads/${story.coverImage}`}
                  alt={story.title}
                  style={{
                    width: "100%",
                    height: "320px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body d-flex flex-column">
                  <h3
                    className="fw-bold"
                    style={{
                      color: theme.accent,
                    }}
                  >
                    {story.title}
                  </h3>

                  <p className="text-muted mb-2">by @{story.authorUsername}</p>

                  <p
                    style={{
                      minHeight: "60px",
                    }}
                  >
                    {story.description}
                  </p>

                  <div className="d-flex gap-3 mb-3">
                    <span>👁️ {story.views}</span>

                    <span>❤️ {story.likes}</span>
                  </div>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn"
                      style={{
                        background: theme.accent,
                        color: "white",
                      }}
                      onClick={() => navigate(`/book/${story._id}`)}
                    >
                      📖 Read Book
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleLike(story._id)}
                    >
                      ❤️ Like
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatorDashboard({ theme }) {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const user = JSON.parse(localStorage.getItem("user"));

  const [stories, setStories] = useState([]);
  const [reels, setReels] = useState([]);
  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
  });

  useEffect(() => {
    fetchStories();
    fetchReels();
    fetchFollowers();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stories/author/${user.id}`);

      const data = await res.json();

      setStories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReels = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reels/user/${user.id}`);

      const data = await res.json();

      setReels(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/follow-stats/${user.id}`);

      const data = await res.json();

      setFollowStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalViews = stories.reduce(
    (sum, story) => sum + (story.views || 0),
    0,
  );

  const totalLikes = stories.reduce(
    (sum, story) => sum + (story.likes || 0),
    0,
  );

  const publishedStories = stories.filter((story) => story.isPublished).length;

  const draftStories = stories.filter((story) => !story.isPublished).length;

  const reelLikes = reels.reduce((sum, reel) => sum + (reel.likes || 0), 0);

  const totalChapters = stories.reduce(
    (sum, story) => sum + (story.chapterCount || 0),
    0,
  );

  const topStory =
    stories.length > 0
      ? [...stories].sort((a, b) => b.views - a.views)[0]
      : null;

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4" style={{ color: theme.text }}>
        📊 Creator Dashboard
      </h1>

      {/* Stats */}

      <div className="d-flex flex-wrap gap-3 mb-5">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            className="card shadow border-0 text-center p-3"
            style={{ background: theme.card }}
          >
            <h5>📚 Stories</h5>
            <h2>{stories.length}</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            className="card shadow border-0 text-center p-3"
            style={{ background: theme.card }}
          >
            <h5>🎬 Scrolls</h5>
            <h2>{reels.length}</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            className="card shadow border-0 text-center p-3"
            style={{ background: theme.card }}
          >
            <h5>👥 Followers</h5>
            <h2>{followStats.followers}</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            className="card shadow border-0 text-center p-3"
            style={{ background: theme.card }}
          >
            <h5>👁️ Views</h5>
            <h2>{totalViews}</h2>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          className="card shadow border-0 text-center p-3"
          style={{ background: theme.card }}
        >
          <h5>❤️ Story Likes</h5>
          <h2>{totalLikes}</h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          className="card shadow border-0 text-center p-3"
          style={{ background: theme.card }}
        >
          <h5>🎬 Scroll Likes</h5>
          <h2>{reelLikes}</h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          className="card shadow border-0 text-center p-3"
          style={{ background: theme.card }}
        >
          <h5>🚀 Published</h5>
          <h2>{publishedStories}</h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          className="card shadow border-0 text-center p-3"
          style={{ background: theme.card }}
        >
          <h5>📝 Drafts</h5>
          <h2>{draftStories}</h2>
        </div>
      </div>

      <div
        className="card border-0 shadow-lg p-4 mb-4"
        style={{
          background: theme.card,
          borderRadius: "20px",
        }}
      >
        <h3>👑 {user.username}</h3>

        <div className="progress mt-2">
          <div
            className="progress-bar"
            style={{
              width: `${Math.min((totalViews / 100) * 100, 100)}%`,
              background: theme.accent,
            }}
          />
        </div>

        <small>Reach 100 views to level up.</small>
      </div>

      <h2 className="fw-bold mt-4 mb-3" style={{ color: theme.text }}>
        ⚡ Quick Actions
      </h2>

      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <button
            className="btn w-100 py-3"
            style={{
              background: theme.accent,
              color: "white",
            }}
            onClick={() => navigate("/create")}
          >
            ➕ Create Story
          </button>
        </div>

        <div className="col-md-3">
          <button
            className="btn btn-dark w-100 py-3"
            onClick={() => navigate("/scrolls")}
          >
            🎬 Manage Scrolls
          </button>
        </div>

        <div className="col-md-3">
          <button
            className="btn btn-warning w-100 py-3"
            onClick={() => {
              const drafts = stories.filter((story) => !story.isPublished);

              setStories(drafts);
            }}
          >
            📝 Draft Stories
          </button>
        </div>

        <div className="col-md-3">
          <button
            className="btn btn-success w-100 py-3"
            onClick={() => navigate("/analytics")}
          >
            📊 Analytics
          </button>
        </div>
      </div>

      <h2 className="fw-bold mb-3" style={{ color: theme.text }}>
        🏆 Creator Highlights
      </h2>

      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div
            className="card shadow border-0 p-4 h-100"
            style={{
              background: theme.card,
              minHeight: "160px",
            }}
          >
            <h5>📚 Total Chapters</h5>
            <h2>{totalChapters}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card shadow border-0 p-4 h-100"
            style={{
              background: theme.card,
              minHeight: "160px",
            }}
          >
            <h5>🔥 Top Story</h5>

            <strong>{topStory ? topStory.title : "No Stories"}</strong>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card shadow border-0 p-4 h-100"
            style={{
              background: theme.card,
              minHeight: "160px",
            }}
          >
            <h5>💰 Earnings</h5>

            <h2>₹0</h2>

            <small>Coming Soon</small>
          </div>
        </div>
      </div>

      {/* Stories */}

      <h2 className="fw-bold mb-3" style={{ color: theme.text }}>
        📚 My Stories
      </h2>

      <div className="row">
        {stories.map((story) => (
          <div key={story._id} className="col-lg-4 col-md-6 mb-4">
            <div
              className="card border-0 shadow h-100"
              style={{
                background: theme.card,
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <img
                src={story.coverImage}
                alt={story.title}
                style={{
                  height: "260px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />

              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h4>{story.title}</h4>

                  <span
                    className={`badge ${
                      story.isPublished ? "bg-success" : "bg-warning"
                    }`}
                  >
                    {story.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <p>{story.description}</p>

                <div className="mb-3">
                  <div>👁️ Views: {story.views}</div>
                  <div>❤️ Likes: {story.likes}</div>
                </div>

                <button
                  className="btn w-100"
                  style={{
                    background: theme.accent,
                    color: "white",
                  }}
                  onClick={() => navigate(`/story/manage/${story._id}`)}
                >
                  Manage Story
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scrolls */}

      <h2 className="fw-bold mt-5 mb-3" style={{ color: theme.text }}>
        🎬 My Scrolls
      </h2>

      <div className="row">
        {reels.map((reel) => (
          <div key={reel._id} className="col-lg-4 col-md-6 mb-4">
            <div
              className="card border-0 shadow"
              style={{
                background: theme.card,
                borderRadius: "20px",
              }}
            >
              <video
                src={reel.videoUrl}
                controls
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                }}
              />

              <div className="card-body">
                <p>{reel.caption}</p>

                <div className="mt-2">❤️ {reel.likes}</div>

                <div>👁️ {reel.views || 0}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

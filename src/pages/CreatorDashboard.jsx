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

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4" style={{ color: theme.text }}>
        📊 Creator Dashboard
      </h1>

      {/* Stats */}

      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <div
            className="card shadow border-0 text-center p-3"
            style={{ background: theme.card }}
          >
            <h5>📚 Stories</h5>
            <h2>{stories.length}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card shadow border-0 text-center p-3"
            style={{ background: theme.card }}
          >
            <h5>🎬 Scrolls</h5>
            <h2>{reels.length}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card shadow border-0 text-center p-3"
            style={{ background: theme.card }}
          >
            <h5>👥 Followers</h5>
            <h2>{followStats.followers}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card shadow border-0 text-center p-3"
            style={{ background: theme.card }}
          >
            <h5>👁️ Views</h5>
            <h2>{totalViews}</h2>
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
                <h4>{story.title}</h4>

                <p>{story.description}</p>

                <div className="mb-3">
                  👁️ {story.views} &nbsp;&nbsp; ❤️ {story.likes}
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

                <div>❤️ {reel.likes}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

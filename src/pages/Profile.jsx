import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { animateCards } from "../utils/animations";

export default function Profile({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);

  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
  });

  const [activeTab, setActiveTab] = useState("stories");

  const [stories, setStories] = useState([]);
  const [reels, setReels] = useState([]);

  const fetchProfile = useCallback(async () => {
    try {
      // profile
      const profileRes = await fetch(
        `http://localhost:5000/api/profile/${user.id}`,
      );

      const profileData = await profileRes.json();

      setProfile(profileData);

      // followers
      const statsRes = await fetch(
        `http://localhost:5000/api/follow-stats/${user.id}`,
      );

      const statsData = await statsRes.json();

      setFollowStats(statsData);

      // stories
      const storiesRes = await fetch(
        `http://localhost:5000/api/stories/author/${user.id}`,
      );

      const storiesData = await storiesRes.json();

      setStories(storiesData);

      // reels
      const reelsRes = await fetch(
        `http://localhost:5000/api/reels/user/${user.id}`,
      );

      const reelsData = await reelsRes.json();

      setReels(reelsData);
    } catch (error) {
      console.log(error);
    }
  }, [user.id]);

  useEffect(() => {
    animateCards();
    fetchProfile();
  }, [fetchProfile, location.pathname]);

  if (!profile) {
    return (
      <div className="container py-5">
        <h3>Loading Profile...</h3>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ color: theme.text }}>
      {/* Profile Header */}
      <div
        className="anime-card glow p-4 mb-4"
        style={{
          background: theme.card,
          borderRadius: "20px",
        }}
      >
        <div className="d-flex align-items-center">
          <img
            src={
              profile.avatar ||
              `https://ui-avatars.com/api/?name=${profile.username}`
            }
            alt="avatar"
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `4px solid ${theme.accent}`,
            }}
          />

          <div className="ms-4">
            <h2 className="fw-bold">{profile.username}</h2>

            <p className="text-muted mb-2">@{profile.username}</p>

            <p>{profile.bio || "No bio added yet."}</p>

            <div className="d-flex gap-4 mt-3">
              <div>
                <strong>{stories.length + reels.length}</strong> Posts
              </div>

              <div>
                <strong>{followStats.followers}</strong> Followers
              </div>

              <div>
                <strong>{followStats.following}</strong> Following
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <button
        className="btn w-100 mb-4"
        style={{
          background: "#444",
          color: "white",
        }}
        onClick={() => navigate("/edit-profile")}
      >
        Edit Profile
      </button>

      {/* Instagram Style Tabs */}
      <div
        className="d-flex justify-content-center mb-4"
        style={{
          borderTop: "1px solid #ddd",
          paddingTop: "15px",
        }}
      >
        <button
          className={`btn mx-2 ${
            activeTab === "stories" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveTab("stories")}
        >
          📚 Stories
        </button>

        <button
          className={`btn mx-2 ${
            activeTab === "scrolls" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveTab("scrolls")}
        >
          🎬 Scrolls
        </button>
      </div>

      {/* STORIES */}
      {activeTab === "stories" && (
        <div className="row">
          {stories.length === 0 ? (
            <h5 className="text-center">No stories yet</h5>
          ) : (
            stories.map((story) => (
              <div className="col-lg-3 col-md-4 col-6 mb-4" key={story._id}>
                <div
                  className="card border-0 shadow h-100"
                  style={{
                    background: theme.card,
                    borderRadius: "15px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/book/${story._id}`)}
                >
                  <img
                    src={`http://localhost:5000/uploads/${story.coverImage}`}
                    alt={story.title}
                    style={{
                      height: "250px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="card-body">
                    <h6 className="fw-bold">{story.title}</h6>

                    <small>
                      👁️ {story.views}
                      {" • "}
                      ❤️ {story.likes}
                    </small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SCROLLS */}
      {activeTab === "scrolls" && (
        <div className="row">
          {reels.length === 0 ? (
            <h5 className="text-center">No scrolls yet</h5>
          ) : (
            reels.map((reel) => (
              <div className="col-lg-3 col-md-4 col-6 mb-4" key={reel._id}>
                <video
                  src={reel.videoUrl}
                  controls
                  style={{
                    width: "100%",
                    height: "350px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { animateCards } from "../utils/animations";

export default function Profile({ theme }) {
  const [avatar, setAvatar] = useState(null);
  const posts = [1, 2, 3, 4, 5, 6];

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "User";

  const navigate = useNavigate();

  useEffect(() => animateCards(), []);

  return (
    <div className="container py-4" style={{ color: theme.text }}>
      <div className="d-flex align-items-center mb-4 anime-card glow">
        <img
          src={avatar || "https://via.placeholder.com/120"}
          className="rounded-circle glow"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
          alt=""
        />

        <div className="ms-4">
          <h3 className="fw-bold">{username}</h3>
          <p className="text-muted">@{username}</p>

          <div className="d-flex gap-4">
            <div>
              <strong>34</strong> Posts
            </div>
            <div>
              <strong>2.1k</strong> Followers
            </div>
            <div>
              <strong>120</strong> Following
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}

      <button
        className="btn w-100 mb-4"
        style={{ background: "#444", color: "white" }}
        onClick={() => navigate("/edit-profile")}
      >
        Edit Profile
      </button>

      <h4 className="fw-bold mb-3">Your Manga Posts</h4>

      <div className="row g-2 anime-card glow">
        {posts.map((p) => (
          <div className="col-4" key={p}>
            <img
              src={`https://via.placeholder.com/300x300?text=Post+${p}`}
              className="img-fluid rounded"
              style={{ height: "120px", objectFit: "cover" }}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { animateCards } from "../utils/animations";

export default function Profile({ theme }) {
  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState(null);
  const posts = [1, 2, 3, 4, 5, 6];
  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  // reusable fetch function
  const fetchProfile = useCallback(() => {
    fetch(`http://localhost:5000/api/profile/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => console.log(err));

    fetch(`http://localhost:5000/api/follow-stats/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFollowStats(data);
      })
      .catch((err) => console.log(err));
  }, [user.id]);

  useEffect(() => {
    animateCards();
    fetchProfile();
  }, [fetchProfile, location.pathname]);

  if (!profile) {
    return <h3 style={{ color: theme.text }}>Loading profile...</h3>;
  }

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
          <h3 className="fw-bold">{profile.username}</h3>
          <p className="text-muted">@{profile.username}</p>

          <p style={{ maxWidth: "400px", marginTop: "8px" }}>
            {profile.bio || "No bio added yet."}
          </p>

          <div className="d-flex gap-4 mt-2">
            <div>
              <strong>34</strong> Posts
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

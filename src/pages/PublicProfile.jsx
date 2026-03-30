import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PublicProfile({ theme }) {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/profile/${username}`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [username]);

  if (!profile) {
    return <div className="container py-5">Loading...</div>;
  }

  return (
    <div className="container py-4" style={{ color: theme.text }}>
      <div className="d-flex align-items-center mb-4 anime-card glow">
        <img
          src={profile.avatar || "https://via.placeholder.com/120"}
          className="rounded-circle glow"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
          }}
          alt=""
        />

        <div className="ms-4">
          <h3 className="fw-bold">{profile.username}</h3>
          <p className="text-muted">@{profile.username}</p>
          <p>{profile.bio || "No bio yet"}</p>
        </div>
      </div>
    </div>
  );
}

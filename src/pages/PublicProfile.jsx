import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PublicProfile({ theme }) {
  const { username } = useParams();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
  });

  // fetch public profile by username
  const fetchProfile = () => {
    fetch(`http://localhost:5000/api/users/profile/${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("PUBLIC PROFILE:", data);

        setProfile(data);

        fetch(
          `http://localhost:5000/api/is-following/${currentUser.id}/${data.id}`,
        )
          .then((res) => res.json())
          .then((followData) => setIsFollowing(followData.isFollowing));

        fetch(`http://localhost:5000/api/follow-stats/${data.id}`)
          .then((res) => res.json())
          .then((statsData) => setFollowStats(statsData));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    const url = isFollowing
      ? "http://localhost:5000/api/unfollow"
      : "http://localhost:5000/api/follow";

    const method = isFollowing ? "DELETE" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: currentUser.id,
          followingId: profile.id,
        }),
      });

      const data = await res.json();

      alert(data.message);

      setIsFollowing(!isFollowing);

      // refresh counts after follow/unfollow
      fetch(`http://localhost:5000/api/follow-stats/${profile.id}`)
        .then((res) => res.json())
        .then((statsData) => setFollowStats(statsData));
    } catch (error) {
      console.log(error);
    }
  };

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

          <div className="d-flex gap-4 mt-2">
            <div>
              <strong>{followStats.followers}</strong> Followers
            </div>
            <div>
              <strong>{followStats.following}</strong> Following
            </div>
          </div>

          {/* Follow button */}
          {currentUser.id !== profile.id && (
            <button
              className="btn mt-3"
              style={{
                background: isFollowing ? "#555" : theme.accent,
                color: "white",
              }}
              onClick={handleFollowToggle}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

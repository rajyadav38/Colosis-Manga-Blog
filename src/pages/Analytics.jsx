import React, { useEffect, useState } from "react";

export default function Analytics({ theme }) {
  const API_URL = process.env.REACT_APP_API_URL;

  const user = JSON.parse(localStorage.getItem("user"));

  const [stories, setStories] = useState([]);
  const [reels, setReels] = useState([]);

  useEffect(() => {
    fetchStories();
    fetchReels();
  }, []);

  const fetchStories = async () => {
    const res = await fetch(`${API_URL}/api/stories/author/${user.id}`);

    const data = await res.json();

    setStories(data);
  };

  const fetchReels = async () => {
    const res = await fetch(`${API_URL}/api/reels/user/${user.id}`);

    const data = await res.json();

    setReels(data);
  };

  const totalViews = stories.reduce(
    (sum, story) => sum + (story.views || 0),
    0,
  );

  const totalLikes = stories.reduce(
    (sum, story) => sum + (story.likes || 0),
    0,
  );

  const reelLikes = reels.reduce((sum, reel) => sum + (reel.likes || 0), 0);

  const topStory =
    stories.length > 0
      ? [...stories].sort((a, b) => b.views - a.views)[0]
      : null;

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4" style={{ color: theme.text }}>
        📊 Analytics
      </h1>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card p-4 shadow" style={{ background: theme.card }}>
            <h5>Total Views</h5>
            <h2>{totalViews}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 shadow" style={{ background: theme.card }}>
            <h5>Story Likes</h5>
            <h2>{totalLikes}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 shadow" style={{ background: theme.card }}>
            <h5>Scroll Likes</h5>
            <h2>{reelLikes}</h2>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow" style={{ background: theme.card }}>
        <h3>🔥 Top Performing Story</h3>

        {topStory ? (
          <>
            <h4>{topStory.title}</h4>

            <p>👁️ {topStory.views} Views</p>

            <p>❤️ {topStory.likes} Likes</p>
          </>
        ) : (
          <p>No stories yet.</p>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { animateCards } from "../utils/animations";

export default function Scrolls({ theme }) {
  const [likes, setLikes] = useState([0, 0, 0]);
  const [comments, setComments] = useState([[], [], []]);
  const [input, setInput] = useState("");

  const reels = [
    "https://cdn.pixabay.com/video/2020/11/23/57327-486718308_large.mp4",
    "https://cdn.pixabay.com/video/2021/10/27/94787-634880935_large.mp4",
    "https://cdn.pixabay.com/video/2021/04/26/72755-538846745_large.mp4",
  ];

  useEffect(() => animateCards(), []);

  const shareReel = (url) => {
    navigator.clipboard.writeText(url);
    alert("🔗 Reel link copied!");
  };

  return (
    <div className="container py-4" style={{ color: theme.text }}>
      <h2 className="fw-bold mb-3">🎬 Explore Scrolls</h2>

      <div className="d-flex flex-column gap-4">
        {reels.map((url, index) => (
          <div
            key={index}
            className="p-3 shadow-lg rounded-lg anime-card glow"
            style={{
              background: theme.card,
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            {/* Reel Video */}
            <video
              src={url}
              controls
              className="w-100 rounded mb-2"
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />

            {/* Like / Share */}
            <div className="d-flex align-items-center gap-3 mb-2">
              <button
                className="btn btn-sm"
                style={{ background: theme.accent, color: "white" }}
                onClick={() =>
                  setLikes(likes.map((v, i) => (i === index ? v + 1 : v)))
                }
              >
                ❤️ {likes[index]}
              </button>

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => shareReel(url)}
              >
                🔗 Share
              </button>
            </div>

            {/* Comment Input */}
            <input
              className="form-control form-control-sm mb-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a comment..."
            />

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                const copy = [...comments];
                copy[index].push(input);
                setComments(copy);
                setInput("");
              }}
            >
              Comment
            </button>

            {/* Comment List */}
            <ul className="list-group mt-2 small">
              {comments[index].map((c, i) => (
                <li className="list-group-item" key={i}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

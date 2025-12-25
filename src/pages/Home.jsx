import React, { useState, useEffect } from "react";
import { animateCards } from "../utils/animations";

export default function Home({ theme }) {
  const [preview, setPreview] = useState(null);

  // Trending state (moved from Trending component)
  const [likes, setLikes] = useState([0, 0, 0, 0]);
  const [comments, setComments] = useState([[], [], [], []]);
  const [input, setInput] = useState("");

  // Latest Manga
  const latest = [1, 2, 3, 4];

  useEffect(() => animateCards(), []);

  return (
    <div className="container py-4" style={{ color: theme.text }}>
      {/* ✍️ Write Manga */}
      <h2 className="mb-3 fw-bold">✍️ Write Your Manga Story</h2>

      <div
        className="p-4 shadow-lg rounded-lg anime-card glow mb-5"
        style={{ background: theme.card }}
      >
        <label className="fw-semibold">Upload Manga Image</label>
        <input
          type="file"
          className="form-control mb-3"
          accept="image/*"
          onChange={(e) => setPreview(URL.createObjectURL(e.target.files[0]))}
        />

        {preview && (
          <img src={preview} className="rounded mb-3 img-fluid" alt="preview" />
        )}

        <label className="fw-semibold">Story (max 500 words)</label>
        <textarea className="form-control mb-3" rows="7" maxLength="500" />

        <button
          className="btn glow w-100"
          style={{ background: theme.accent, color: "white" }}
        >
          Post Manga
        </button>
      </div>

      {/* 🔥 Trending Manga */}
      <h2 className="mb-3 fw-bold">🔥 Trending Manga</h2>

      <div className="row g-3 mb-5">
        {[1, 2, 3, 4].map((item, index) => (
          <div className="col-12 col-md-4" key={item}>
            <div
              className="p-3 shadow-lg rounded-lg anime-card glow"
              style={{ background: theme.card }}
            >
              <img
                src={`https://via.placeholder.com/300x200?text=Manga+${item}`}
                className="img-fluid rounded mb-2"
                alt=""
              />

              <h5 className="fw-bold" style={{ color: theme.accent }}>
                Manga Title {item}
              </h5>

              <button
                className="btn glow btn-sm mb-2"
                style={{ background: theme.accent, color: "white" }}
                onClick={() =>
                  setLikes(likes.map((v, i) => (i === index ? v + 1 : v)))
                }
              >
                ❤️ {likes[index]}
              </button>

              <input
                className="form-control form-control-sm mb-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add comment..."
              />

              <button
                className="btn glow btn-outline-secondary btn-sm"
                onClick={() => {
                  const copy = [...comments];
                  copy[index].push(input);
                  setComments(copy);
                  setInput("");
                }}
              >
                Comment
              </button>

              <ul className="list-group mt-2 small">
                {comments[index].map((c, i) => (
                  <li className="list-group-item" key={i}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 🆕 Latest Manga */}
      <h2 className="mb-3 fw-bold">🆕 Latest Manga</h2>

      <div className="row g-3 mb-5">
        {latest.map((l) => (
          <div className="col-6 col-md-3" key={l}>
            <div
              className="p-2 shadow rounded anime-card glow"
              style={{ background: theme.card }}
            >
              <img
                src={`https://via.placeholder.com/300x300?text=Latest+${l}`}
                className="img-fluid rounded"
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

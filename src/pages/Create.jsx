import React, { useState, useEffect } from "react";
import { animateCards } from "../utils/animations";

export default function Create({ theme }) {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");

  useEffect(() => animateCards(), []);

  return (
    <div className="container py-4" style={{ color: theme.text }}>
      <h2 className="fw-bold mb-3">🎥 Create Scroll</h2>

      <div
        className="p-4 rounded shadow-lg anime-card glow"
        style={{ background: theme.card }}
      >
        {/* Upload Video */}
        <label className="fw-semibold">Upload Your scroll</label>
        <input
          type="file"
          accept="video/*"
          className="form-control mb-3"
          onChange={(e) => setVideo(URL.createObjectURL(e.target.files[0]))}
        />

        {/* Preview Video */}
        {video && (
          <video
            src={video}
            className="w-100 rounded mb-3"
            controls
            style={{ maxHeight: "360px", objectFit: "cover" }}
          />
        )}

        {/* Caption */}
        <label className="fw-semibold">Caption</label>
        <textarea
          className="form-control mb-3"
          rows="3"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Post Button */}
        <button
          className="btn w-100 glow"
          style={{ background: theme.accent, color: "white" }}
        >
          Post Reel
        </button>
      </div>
    </div>
  );
}

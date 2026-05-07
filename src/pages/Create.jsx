import React, { useState, useEffect } from "react";
import { animateCards } from "../utils/animations";

export default function Create({ theme }) {
  const [video, setVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => animateCards(), []);

  const handleUpload = async () => {
    if (!videoFile) {
      alert("Please select a video");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("video", videoFile);
      formData.append("userId", user.id);
      formData.append("username", user.username);
      formData.append("caption", caption);

      const res = await fetch("http://localhost:5000/api/reels/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      alert(data.message);

      // reset form
      setVideo(null);
      setVideoFile(null);
      setCaption("");
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      alert(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ color: theme.text }}>
      <h2 className="fw-bold mb-3">🎥 Create Scroll</h2>

      <div
        className="p-4 rounded shadow-lg anime-card glow"
        style={{ background: theme.card }}
      >
        {/* Upload Video */}
        <label className="fw-semibold">Upload Your Scroll</label>

        <input
          type="file"
          accept="video/*"
          className="form-control mb-3"
          onChange={(e) => {
            const file = e.target.files[0];

            setVideoFile(file);

            setVideo(URL.createObjectURL(file));
          }}
        />

        {/* Preview Video */}
        {video && (
          <video
            src={video}
            className="w-100 rounded mb-3"
            controls
            style={{
              maxHeight: "360px",
              objectFit: "cover",
            }}
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
          style={{
            background: theme.accent,
            color: "white",
          }}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Post Reel"}
        </button>
      </div>
    </div>
  );
}

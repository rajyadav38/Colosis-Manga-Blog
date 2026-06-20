import React, { useState, useEffect } from "react";
import { animateCards } from "../utils/animations";
import { useNavigate } from "react-router-dom";
export default function Create({ theme }) {
  const [video, setVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [description, setDescription] = useState("");
  const [storyType, setStoryType] = useState("novel");
  const [genres, setGenres] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
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

      const res = await fetch(`${API_URL}/api/reels/create`, {
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
  const handleCreateStory = async () => {
    try {
      const formData = new FormData();

      formData.append("authorId", user.id);
      formData.append("authorUsername", user.username);

      formData.append("title", storyTitle);
      formData.append("description", description);

      formData.append("type", storyType);

      formData.append("genres", genres);

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const res = await fetch(`${API_URL}/api/stories/create`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      navigate(`/story/manage/${data._id}`);

      setStoryTitle("");
      setDescription("");
      setGenres("");
      setCoverImage(null);
    } catch (error) {
      console.log(error);
      alert("Failed to create story");
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
      <hr className="my-5" />

      <h2 className="fw-bold mb-3">📚 Create Story</h2>

      <div
        className="p-4 rounded shadow-lg anime-card glow"
        style={{
          background: theme.card,
        }}
      >
        <label className="fw-semibold">Cover Image</label>

        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={(e) => setCoverImage(e.target.files[0])}
        />

        <label className="fw-semibold">Story Title</label>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter story title..."
          value={storyTitle}
          onChange={(e) => setStoryTitle(e.target.value)}
        />

        <label className="fw-semibold">Description</label>

        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Describe your story..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="fw-semibold">Story Type</label>

        <select
          className="form-control mb-3"
          value={storyType}
          onChange={(e) => setStoryType(e.target.value)}
        >
          <option value="novel">Novel</option>

          <option value="manga">Manga</option>

          <option value="comic">Comic</option>
        </select>

        <label className="fw-semibold">Genres</label>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Fantasy, Action, Romance..."
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
        />

        <button
          className="btn w-100 glow"
          style={{
            background: theme.accent,
            color: "white",
          }}
          onClick={handleCreateStory}
        >
          Create Story
        </button>
      </div>
    </div>
  );
}

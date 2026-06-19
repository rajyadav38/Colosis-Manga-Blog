import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile({ theme }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [avatarFile, setAvatarFile] = useState(null);
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let avatarUrl = user?.avatar || "";

      // Upload avatar to Cloudinary first
      if (avatarFile) {
        const formData = new FormData();

        formData.append("avatar", avatarFile);

        const uploadRes = await fetch(
          `http://localhost:5000/api/users/upload-avatar/${user.id}`,
          {
            method: "POST",
            body: formData,
          },
        );

        const uploadData = await uploadRes.json();

        avatarUrl = uploadData.avatar;
      }

      const res = await fetch(
        "http://localhost:5000/api/users/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id,
            username,
            bio,
            avatar: avatarUrl,
          }),
        },
      );

      const data = await res.json();

      alert(data.message);

      // update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          username,
          avatar: avatarUrl,
        }),
      );

      navigate("/profile");
    } catch (error) {
      console.log("Update error:", error);
      alert("Something went wrong");
    }
  };
  return (
    <div
      className="container py-5"
      style={{ color: theme.text, maxWidth: "600px" }}
    >
      <h2 className="fw-bold mb-4 text-center">Edit Profile</h2>

      <div
        className="p-4 shadow rounded anime-card glow"
        style={{ background: theme.card }}
      >
        <form onSubmit={handleSubmit}>
          <label className="fw-semibold">Username</label>
          <input
            className="form-control mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="fw-semibold">Bio</label>
          <textarea
            className="form-control mb-3"
            rows="3"
            placeholder="Tell people about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <label className="fw-semibold">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />

          <button
            className="btn w-100"
            style={{ background: theme.accent, color: "white" }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ theme, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) {
      alert("❌ Invalid credentials");
      return;
    }

    localStorage.setItem("user", JSON.stringify(found));
    setUser(found);
    window.location.href = "/";
  };

  return (
    <div
      className="container py-5"
      style={{ color: theme.text, maxWidth: 420 }}
    >
      <h2 className="fw-bold mb-4 text-center">🔐 Login</h2>

      <div
        className="p-4 shadow rounded anime-card glow"
        style={{ background: theme.card }}
      >
        <input
          className="form-control mb-3"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn w-100 glow"
          style={{ background: theme.accent, color: "white" }}
          onClick={login}
        >
          Login
        </button>

        <p className="text-center mt-3">
          New user? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup({ theme }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {
    if (!email.endsWith("@gmail.com")) {
      alert("❌ Only Gmail IDs allowed");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.username === username)) {
      alert("❌ Username already exists");
      return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Account created! Please login.");
  };

  return (
    <div
      className="container py-5"
      style={{ color: theme.text, maxWidth: 420 }}
    >
      <h2 className="fw-bold mb-4 text-center">📝 Sign Up</h2>

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
          className="form-control mb-3"
          placeholder="Gmail ID"
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={signup}
        >
          Create Account
        </button>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

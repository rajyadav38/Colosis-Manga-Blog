import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login({ theme, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      alert("❌ Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ NAVIGATE FIRST
      navigate("/");

      // ❌ REMOVE alert (or replace with toast)
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };
  return (
    <div
      className="container py-5 auth-page"
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

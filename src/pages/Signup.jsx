import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup({ theme }) {
  // 🔴 STATE DEFINITIONS (THIS FIXES YOUR ERROR)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    if (!username || !email || !password) {
      alert("❌ Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("✅ Signup successful! Please login");
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

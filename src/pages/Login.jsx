import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import "./Auth.css";
import logo from "../assets/colosis-logo.png";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const googleUser = result.user;

      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: googleUser.uid,
          username: googleUser.displayName,
          email: googleUser.email,
          avatar: googleUser.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      setUser(data.user);

      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Google Login Failed");
    }
  };

  const login = async () => {
    if (!username || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login Failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      setUser(data.user);

      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Colosis" className="auth-logo-img" />
        </div>

        <h2 className="auth-title">Welcome Back</h2>

        <input
          className="form-control auth-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="position-relative">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <i
            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
            style={{
              position: "absolute",
              right: "18px",
              top: "18px",
              color: "#94a3b8",
              cursor: "pointer",
            }}
            onClick={() => setShowPassword(!showPassword)}
          />

          <p className="text-end mb-3" style={{ fontSize: "14px" }}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>

        <button className="auth-btn" onClick={login}>
          Login
        </button>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <i className="bi bi-google me-2"></i>
          Continue with Google
        </button>

        <p className="auth-link">
          New user? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}

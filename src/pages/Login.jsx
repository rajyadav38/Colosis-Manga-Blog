import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import "./Auth.css";
import logo from "../assets/colosis-logo.png";
import toast from "react-hot-toast";
import { useLoading } from "../context/LoadingContext";
export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { startLoading, finishLoading } = useLoading();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      startLoading();

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
        toast.error(data.message);
        finishLoading();
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      setUser(data.user);

      toast.success(`Welcome ${data.user.username} 🚀`);

      setTimeout(() => {
        finishLoading();
        navigate("/");
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error("Google Login Failed");
      finishLoading();
    } finally {
      setGoogleLoading(false);
    }
  };
  const login = async () => {
    if (!username || !password) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);
    startLoading();

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login Failed");
        finishLoading();
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      setUser(data.user);

      toast.success("Welcome back to Colosis 🚀");

      setTimeout(() => {
        finishLoading();
        navigate("/");
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
      finishLoading();
    } finally {
      setLoading(false);
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
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </p>
        </div>

        <button className="auth-btn" onClick={login} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Connecting...
            </>
          ) : (
            <>
              <i className="bi bi-google me-2"></i>
              Continue with Google
            </>
          )}
        </button>

        <p className="auth-link">
          New user? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}

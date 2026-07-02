import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./Auth.css";
import logo from "../assets/colosis-logo.png";
import toast from "react-hot-toast";
import { useLoading } from "../context/LoadingContext";
export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { startLoading, finishLoading } = useLoading();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      startLoading();

      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          username: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Google signup failed");
        finishLoading();
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      toast.success(`Welcome ${data.user.username} 🚀`);

      setTimeout(() => {
        finishLoading();
        navigate("/");
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error("Google signup failed.");
      finishLoading();
    } finally {
      setGoogleLoading(false);
    }
  };
  const signup = async () => {
    if (!username || !email || !password) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);
    startLoading();

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        finishLoading();
        return;
      }

      localStorage.setItem("verifyEmail", email.trim().toLowerCase());

      toast.success("OTP sent to your email ✨");

      setTimeout(() => {
        finishLoading();
        localStorage.setItem("otpExpiry", Date.now() + 60000);
        navigate("/verify-email");
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

        <h2 className="auth-title">Create Your Account</h2>

        <input
          className="form-control auth-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          className="form-control auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={signup} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <button
          className="google-btn"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
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
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

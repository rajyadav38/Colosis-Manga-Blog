import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const sendOtp = async () => {
    if (!email) {
      return alert("Please enter your email.");
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/send-reset-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      localStorage.setItem("resetEmail", email);

      alert("OTP sent to your email.");

      navigate("/verify-otp");
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img
            src={require("../assets/colosis-logo.png")}
            alt="Colosis"
            className="auth-logo-img"
          />
        </div>

        <h2 className="auth-title">Forgot Password</h2>

        <input
          type="email"
          className="form-control auth-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="auth-btn" onClick={sendOtp}>
          Send OTP
        </button>

        <p className="auth-link">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

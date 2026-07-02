import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const email = localStorage.getItem("resetEmail");

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtpExpiry");

      alert("Password reset successful.");

      navigate("/login");
    } catch (error) {
      console.log(error);
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

        <h2 className="auth-title">Reset Password</h2>

        <input
          type="password"
          className="form-control auth-input"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="form-control auth-input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={resetPassword}>
          Reset Password
        </button>
      </div>
    </div>
  );
}

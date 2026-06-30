import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const email = localStorage.getItem("verifyEmail");

  const verify = async () => {
    const res = await fetch(`${API_URL}/api/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Email verified successfully");

    localStorage.removeItem("verifyEmail");

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Verify Email</h2>

        <input
          className="form-control auth-input"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="auth-btn" onClick={verify}>
          Verify
        </button>
      </div>
    </div>
  );
}

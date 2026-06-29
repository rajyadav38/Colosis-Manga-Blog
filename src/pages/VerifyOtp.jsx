import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const email = localStorage.getItem("resetEmail");

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-reset-otp`, {
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
        return alert(data.message);
      }

      navigate("/reset-password");
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

        <h2 className="auth-title">Verify OTP</h2>

        <input
          className="form-control auth-input"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="auth-btn" onClick={verifyOtp}>
          Verify OTP
        </button>
      </div>
    </div>
  );
}

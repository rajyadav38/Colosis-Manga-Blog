import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const email = localStorage.getItem("resetEmail");

  // Restore timer after refresh
  useEffect(() => {
    const expiry = localStorage.getItem("resetOtpExpiry");

    if (expiry) {
      const remaining = Math.floor((Number(expiry) - Date.now()) / 1000);

      if (remaining > 0) {
        setTimer(remaining);
        setCanResend(false);
      } else {
        setTimer(0);
        setCanResend(true);
      }
    }
  }, []);

  // Countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

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
        toast.error(data.message);
        return;
      }

      toast.success("OTP Verified ✨");

      localStorage.removeItem("resetOtpExpiry");

      setTimeout(() => {
        navigate("/reset-password");
      }, 1200);
    } catch (error) {
      console.log(error);
      toast.error("Verification failed");
    }
  };

  const resendOtp = async () => {
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
        toast.error(data.message);
        return;
      }

      toast.success("New OTP sent ✨");

      setTimer(60);
      setCanResend(false);

      localStorage.setItem("resetOtpExpiry", Date.now() + 60000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to resend OTP");
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

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "20px",
          }}
        >
          Enter the OTP sent to
          <br />
          <b>{email}</b>
        </p>

        <input
          className="form-control auth-input"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <div className="text-center mt-3">
          {canResend ? (
            <button
              className="btn btn-link p-0"
              onClick={resendOtp}
              style={{
                color: "#ff4fd8",
                textDecoration: "none",
              }}
            >
              Resend OTP
            </button>
          ) : (
            <p
              style={{
                color: "#94a3b8",
                marginBottom: 0,
              }}
            >
              Resend OTP in 0:
              {timer < 10 ? `0${timer}` : timer}
            </p>
          )}
        </div>

        <button className="auth-btn mt-3" onClick={verifyOtp}>
          Verify OTP
        </button>
      </div>
    </div>
  );
}

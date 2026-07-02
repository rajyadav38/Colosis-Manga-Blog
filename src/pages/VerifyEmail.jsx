import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const email = localStorage.getItem("verifyEmail");
  useEffect(() => {
    const expiry = localStorage.getItem("otpExpiry");

    if (expiry) {
      const remaining = Math.floor((expiry - Date.now()) / 1000);

      if (remaining > 0) {
        setTimer(remaining);
        setCanResend(false);
      } else {
        setTimer(0);
        setCanResend(true);
      }
    }
  }, []);

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
  const resendOtp = async () => {
    try {
      const email = localStorage.getItem("verifyEmail");

      const res = await fetch(`${API_URL}/api/auth/resend-verification-otp`, {
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

      localStorage.setItem("otpExpiry", Date.now() + 60000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to resend OTP");
    }
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

        <button className="auth-btn" onClick={verify}>
          Verify
        </button>
      </div>
    </div>
  );
}

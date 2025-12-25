import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo.png";

export default function Navbar({
  theme,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  user,
  setUser,
}) {
  return (
    <nav
      className="navbar navbar-expand-lg px-3 shadow-sm"
      style={{ background: theme.card }}
    >
      <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
        <img
          src={Logo}
          alt="logo"
          width={44}
          height={44}
          style={{ borderRadius: "50%" }}
        />
        <span
          style={{
            color: theme.text,
            fontSize: 20,
            fontFamily: "'Zen Tokyo Zoo', cursive",
            letterSpacing: "1px",
          }}
        >
          COLOSIS
        </span>
      </Link>

      <div
        className="d-flex align-items-center justify-content-center flex-grow-1"
        style={{ gap: "20px" }}
      >
        <Link
          className="nav-link"
          to="/"
          style={{
            color: theme.text,
            fontFamily: "'Kaushan Script', cursive",
            fontSize: "20px",
          }}
        >
          Home
        </Link>

        <Link
          className="nav-link"
          to="/create"
          style={{
            color: theme.text,
            fontFamily: "'Kaushan Script', cursive",
            fontSize: "20px",
          }}
        >
          Create
        </Link>

        <Link
          className="nav-link"
          to="/scrolls"
          style={{
            color: theme.text,
            fontFamily: "'Kaushan Script', cursive",
            fontSize: "20px",
          }}
        >
          Scrolls
        </Link>

        <Link
          className="nav-link"
          to="/chat"
          style={{
            color: theme.text,
            fontFamily: "'Kaushan Script', cursive",
            fontSize: "20px",
          }}
        >
          Chat
        </Link>

        <Link
          className="nav-link"
          to="/profile"
          style={{
            color: theme.text,
            fontFamily: "'Kaushan Script', cursive",
            fontSize: "20px",
          }}
        >
          Profile
        </Link>

        {/* 🔍 SEARCH BAR */}
        <input
          type="text"
          placeholder="Search manga, scrolls, users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control form-control-sm"
          style={{
            width: "240px",
            borderRadius: "20px",
            padding: "6px 14px",
            fontFamily: "'Kaushan Script', cursive",
            background: theme.bg,
            color: theme.text,
            border: `1px solid ${theme.accent}`,
            outline: "none",
          }}
        />
      </div>

      <button
        className="btn btn-sm"
        style={{
          background: theme.accent,
          fontFamily: "'Kaushan Script', cursive",
          color: "white",
          borderRadius: "18px",
        }}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "🌞 Light" : "🌙 Dark"}
      </button>
      {user ? (
        <button
          className="btn btn-sm ms-2"
          style={{ background: "#444", color: "white" }}
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          className="btn btn-sm ms-2"
          style={{ background: theme.accent, color: "white" }}
        >
          Login
        </Link>
      )}
    </nav>
  );
}

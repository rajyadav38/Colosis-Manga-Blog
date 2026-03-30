import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // -------------------------------
  // Live Search Suggestions
  // -------------------------------

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`http://localhost:5000/api/users/search-users/${searchQuery}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error(err));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <nav
      className="navbar navbar-expand-lg px-3 mobile-grid-nav"
      style={{ background: theme.card }}
    >
      <Link
        to="/"
        className="navbar-brand d-flex align-items-center nav-logo"
        style={{ padding: "4px 0" }}
      >
        <img src={Logo} alt="Colosis" className="navbar-logo" />
      </Link>

      <div
        className="d-flex align-items-center justify-content-center flex-grow-1"
        style={{ gap: "20px" }}
      >
        <ul className="navbar-nav mx-auto desktop-nav-links">
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
        </ul>
      </div>

      {/* 🔍 SEARCH BAR + LIVE RESULTS */}

      <div style={{ position: "relative", width: "240px" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control form-control-sm navbar-search nav-search"
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

        {/* Suggestions Dropdown */}

        {results.length > 0 && (
          <div
            className="shadow rounded mt-1"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              background: theme.card,
              zIndex: 1000,
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {results.map((result) => (
              <div
                key={result.id}
                className="p-2"
                style={{
                  cursor: "pointer",
                  color: theme.text,
                  borderBottom: "1px solid #333",
                }}
                onClick={() => {
                  navigate(`/profile/${result.username}`);
                  setSearchQuery("");
                  setResults([]);
                }}
              >
                @{result.username}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="d-flex align-items-center gap-2 ms-auto nav-actions">
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
      </div>
    </nav>
  );
}

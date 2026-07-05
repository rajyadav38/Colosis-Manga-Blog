import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/colosis-logo.png";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiEdit3,
  FiMessageCircle,
  FiVideo,
  FiSearch,
} from "react-icons/fi";
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
  const API_URL = process.env.REACT_APP_API_URL;
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`${API_URL}/api/users/search-users/${searchQuery}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error(err));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, API_URL]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <nav
        className="navbar-modern"
        style={{
          background: theme.card,
          color: theme.text,
        }}
      >
        {/* Logo */}
        <Link to="/" className="navbar-brand nav-logo">
          <img src={logo} alt="Colosis" className="navbar-logo" />
        </Link>

        {/* DESKTOP ICONS */}
        <div className="desktop-nav-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-icon-link ${isActive ? "active-nav" : ""}`
            }
          >
            <FiHome />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              `nav-icon-link ${isActive ? "active-nav" : ""}`
            }
          >
            <FiEdit3 />
            <span>Create</span>
          </NavLink>

          <NavLink
            to="/scrolls"
            className={({ isActive }) =>
              `nav-icon-link ${isActive ? "active-nav" : ""}`
            }
          >
            <FiVideo />
            <span>Scrolls</span>
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `nav-icon-link ${isActive ? "active-nav" : ""}`
            }
          >
            <FiMessageCircle />
            <span>Chat</span>
          </NavLink>
        </div>

        {/* SEARCH */}
        <div className="nav-search-container">
          {showSearch && (
            <div className="nav-search-dropdown">
              <div className="nav-search-wrapper">
                <FiSearch className="search-input-icon" />

                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="nav-search-input"
                />
              </div>

              {results.length > 0 && (
                <div className="search-results">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="search-user"
                      onClick={() => {
                        navigate(`/profile/${result.username}`);
                        setSearchQuery("");
                        setResults([]);
                        setShowSearch(false);
                      }}
                    >
                      @{result.username}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <button
            className="mobile-search-btn"
            onClick={() => setShowSearch(!showSearch)}
          >
            <FiSearch />
          </button>
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌞" : "🌙"}
          </button>

          {user && (
            <div className="dropdown">
              <button
                className="profile-btn dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user.avatar ? (
                  <img src={user.avatar} className="nav-profile-img" alt="" />
                ) : (
                  "👤"
                )}

                <span>{user.username}</span>
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    👤 Profile
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/dashboard">
                    📊 Creator Dashboard
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/edit-profile">
                    ✏️ Edit Profile
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={logout}
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      {showSearch && (
        <div className="search-overlay">
          <div className="overlay-search-box">
            <FiSearch className="overlay-search-icon" />

            <input
              type="text"
              placeholder="Search for users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="overlay-search-input"
            />

            {results.length > 0 && (
              <div className="search-results">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="search-user"
                    onClick={() => {
                      navigate(`/profile/${result.username}`);
                      setSearchQuery("");
                      setResults([]);
                      setShowSearch(false);
                    }}
                  >
                    @{result.username}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-nav-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-icon-link ${isActive ? "active-nav" : ""}`
          }
        >
          <FiHome />
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            `nav-icon-link ${isActive ? "active-nav" : ""}`
          }
        >
          <FiEdit3 />
        </NavLink>

        <NavLink
          to="/scrolls"
          className={({ isActive }) =>
            `nav-icon-link ${isActive ? "active-nav" : ""}`
          }
        >
          <FiVideo />
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `nav-icon-link ${isActive ? "active-nav" : ""}`
          }
        >
          <FiMessageCircle />
        </NavLink>
      </div>
    </>
  );
}

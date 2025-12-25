import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { lightTheme, darkTheme } from "./theme/themes";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/Home";
import Create from "./pages/Create";
import Scrolls from "./pages/Scrolls";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function MangaBlogApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = darkMode ? darkTheme : lightTheme;

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  return (
    <div style={{ background: theme.bg, minHeight: "100vh" }}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login theme={theme} setUser={setUser} />}
          />
          <Route path="/signup" element={<Signup theme={theme} />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute user={user}>
                <>
                  <Navbar
                    theme={theme}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    user={user}
                    setUser={setUser}
                  />

                  <Routes>
                    <Route path="/" element={<Home theme={theme} />} />
                    <Route path="/create" element={<Create theme={theme} />} />
                    <Route
                      path="/scrolls"
                      element={<Scrolls theme={theme} />}
                    />
                    <Route path="/chat" element={<Chat theme={theme} />} />
                    <Route
                      path="/profile"
                      element={<Profile theme={theme} />}
                    />
                  </Routes>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

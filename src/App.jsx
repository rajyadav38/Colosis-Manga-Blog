import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { lightTheme, darkTheme } from "./theme/themes";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import MobileNav from "./components/MobileNav";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Scrolls from "./pages/Scrolls";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditProfile from "./pages/EditProfile";
import PublicProfile from "./pages/PublicProfile";
import StoryManager from "./pages/StoryManager";
import CreatorDashboard from "./pages/CreatorDashboard";
import ReadStory from "./pages/ReadStory";
import BookReader from "./pages/BookReader";
import Analytics from "./pages/Analytics";
import MangaReader from "./pages/MangaReader";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
export default function MangaBlogApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = darkMode ? darkTheme : lightTheme;

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser || storedUser === "undefined") {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.log("Invalid user in localStorage");
      return null;
    }
  });

  return (
    <div
      className={darkMode ? "app dark" : "app"}
      style={{ minHeight: "100vh" }}
    >
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login theme={theme} setUser={setUser} />}
          />
          <Route path="/signup" element={<Signup theme={theme} />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/verify-otp" element={<VerifyOtp />} />

          <Route path="/reset-password" element={<ResetPassword />} />

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
                    <Route
                      path="/edit-profile"
                      element={<EditProfile theme={theme} />}
                    />
                    <Route
                      path="/profile/:username"
                      element={<PublicProfile theme={theme} />}
                    />
                    <Route
                      path="/story/manage/:id"
                      element={<StoryManager theme={theme} />}
                    />
                    <Route
                      path="/story/read/:id"
                      element={<ReadStory theme={theme} />}
                    />
                    <Route path="/book/:id" element={<BookReader />} />
                    <Route
                      path="/dashboard"
                      element={<CreatorDashboard theme={theme} />}
                    />
                    <Route
                      path="/analytics"
                      element={<Analytics theme={theme} />}
                    />
                    <Route path="/manga/:id" element={<MangaReader />} />
                  </Routes>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
        <MobileNav />
      </Router>
    </div>
  );
}

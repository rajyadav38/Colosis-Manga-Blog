import React from "react";
import Login from "../pages/Login";

export default function ProtectedRoute({ user, children }) {
  if (!user) {
    window.location.href = "/login";
    return null;
  }
  return children;
}

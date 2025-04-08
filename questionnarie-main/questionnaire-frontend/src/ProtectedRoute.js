// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
  const token = localStorage.getItem("token"); // Get token from localStorage
// console.log("user",user);
// console.log("token",token);
  if (!token || !user || !roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
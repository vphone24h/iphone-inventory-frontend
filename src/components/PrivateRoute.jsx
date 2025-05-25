import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwt_decode(token);

    if (requiredRole && decoded.role !== requiredRole) {
      return <Navigate to="/not-authorized" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;

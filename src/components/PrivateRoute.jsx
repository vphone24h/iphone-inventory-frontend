import React from "react";
import { Navigate } from "react-router-dom";
// Sửa import jwt_decode đúng chuẩn esm
import * as jwt_decode from "jwt-decode";

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Dùng jwt_decode.default để decode token
    const decoded = jwt_decode.default(token);

    if (requiredRole && decoded.role !== requiredRole) {
      return <Navigate to="/not-authorized" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;

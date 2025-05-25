import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";  // dùng import bình thường

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Nếu không có token => chuyển về login
    return <Navigate to="/login" replace />;
  }

  try {
    // Giải mã token
    const decoded = jwt_decode(token);

    // Nếu có requiredRole và role không khớp => chuyển về not authorized
    if (requiredRole && decoded.role !== requiredRole) {
      return <Navigate to="/not-authorized" replace />;
    }

    // Token hợp lệ, role đủ quyền => render children
    return children;
  } catch (error) {
    // Token sai hoặc decode lỗi => chuyển về login
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;

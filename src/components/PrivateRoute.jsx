import React from "react";
import { Navigate } from "react-router-dom";
// Sửa import jwt_decode đúng chuẩn esm
import * as jwt_decode from "jwt-decode";

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Nếu không có token => chuyển về login
    return <Navigate to="/login" replace />;
  }

  try {
    // Dùng jwt_decode.default để decode token
    const decoded = jwt_decode.default(token);

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

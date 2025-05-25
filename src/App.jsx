import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";   // <-- Bổ sung import AdminLogin
import DangKy from "./pages/DangKy";
import QuenMatKhau from "./pages/QuenMatKhau";
import ResetMatKhau from "./pages/ResetMatKhau";
import NhapHang from "./pages/NhapHang";
import XuatHang from "./pages/XuatHang";
import TonKhoSoLuong from "./pages/TonKhoSoLuong";
import BaoCao from "./BaoCao"; // giữ đúng nếu không nằm trong /pages
import PrivateRoute from "./components/PrivateRoute";
import CongNo from "./pages/CongNo";
import QuanLyUser from "./pages/QuanLyUser"; // Bổ sung import trang quản lý user
import NotAuthorized from "./pages/NotAuthorized"; // Nếu chưa có, bạn tạo trang này

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />  {/* <-- Thêm route đăng nhập admin */}
      <Route path="/dang-ky" element={<DangKy />} />
      <Route path="/quen-mat-khau" element={<QuenMatKhau />} />
      <Route path="/reset-mat-khau/:token" element={<ResetMatKhau />} />

      {/* Private routes (bảo vệ chung, cho user đã đăng nhập) */}
      <Route
        path="/nhap-hang"
        element={
          <PrivateRoute>
            <NhapHang />
          </PrivateRoute>
        }
      />
      <Route
        path="/xuat-hang"
        element={
          <PrivateRoute>
            <XuatHang />
          </PrivateRoute>
        }
      />
      <Route
        path="/ton-kho-so-luong"
        element={
          <PrivateRoute>
            <TonKhoSoLuong />
          </PrivateRoute>
        }
      />
      <Route
        path="/bao-cao"
        element={
          <PrivateRoute>
            <BaoCao />
          </PrivateRoute>
        }
      />
      <Route
        path="/cong-no"
        element={
          <PrivateRoute>
            <CongNo />
          </PrivateRoute>
        }
      />

      {/* Route mới: Quản lý user chờ duyệt - chỉ admin được vào */}
      <Route
        path="/quanlyuser"
        element={
          <PrivateRoute requiredRole="admin">
            <QuanLyUser />
          </PrivateRoute>
        }
      />

      {/* Route trang không đủ quyền */}
      <Route path="/not-authorized" element={<NotAuthorized />} />
    </Routes>
  );
}

export default App;

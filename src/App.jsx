import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DangKy from "./pages/DangKy";
import QuenMatKhau from "./pages/QuenMatKhau";
import ResetMatKhau from "./pages/ResetMatKhau";
import NhapHang from "./pages/NhapHang";
import XuatHang from "./pages/XuatHang";
import TonKhoSoLuong from "./pages/TonKhoSoLuong";
import BaoCao from "./BaoCao"; // giữ đúng nếu không nằm trong /pages
import PrivateRoute from "./components/PrivateRoute";
import CongNo from "./pages/CongNo";
import AdminXetDuyet from "./pages/AdminXetDuyet"; // Trang admin xét duyệt (tạo file này)

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
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

      {/* Private route dành riêng cho admin xét duyệt (chỉ admin mới được vào) */}
      <Route
        path="/admin-xet-duyet"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminXetDuyet />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

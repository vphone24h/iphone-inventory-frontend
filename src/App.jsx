import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Các trang công khai
import Login from "./pages/Login";
import DangKy from "./pages/DangKy";
import QuenMatKhau from "./pages/QuenMatKhau";
import ResetMatKhau from "./pages/ResetMatKhau";

// Các trang cần bảo vệ
import NhapHang from "./pages/NhapHang";
import XuatHang from "./pages/XuatHang";
import TonKhoSoLuong from "./pages/TonKhoSoLuong";
import BaoCao from "./BaoCao";

// Component bảo vệ route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Route công khai */}
        <Route path="/login" element={<Login />} />
        <Route path="/dang-ky" element={<DangKy />} />
        <Route path="/quen-mat-khau" element={<QuenMatKhau />} />
        <Route path="/reset-mat-khau/:token" element={<ResetMatKhau />} />

        {/* ✅ Route cần đăng nhập */}
        <Route path="/nhap-hang" element={<PrivateRoute><NhapHang /></PrivateRoute>} />
        <Route path="/xuat-hang" element={<PrivateRoute><XuatHang /></PrivateRoute>} />
        <Route path="/ton-kho" element={<PrivateRoute><TonKhoSoLuong /></PrivateRoute>} />
        <Route path="/bao-cao" element={<PrivateRoute><BaoCao /></PrivateRoute>} />

        {/* ✅ Trang mặc định */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DangKy from "./pages/DangKy";
import QuenMatKhau from "./pages/QuenMatKhau";
import ResetMatKhau from "./pages/ResetMatKhau";
import NhapHang from "./pages/NhapHang";
import XuatHang from "./pages/XuatHang";
import TonKhoSoLuong from "./pages/TonKhoSoLuong";
import BaoCao from "./pages/BaoCao"; // ✅ Đã sửa đúng đường dẫn
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dang-ky" element={<DangKy />} />
        <Route path="/quen-mat-khau" element={<QuenMatKhau />} />
        <Route path="/reset-mat-khau/:token" element={<ResetMatKhau />} />

        {/* Private routes */}
        <Route path="/nhap-hang" element={<PrivateRoute><NhapHang /></PrivateRoute>} />
        <Route path="/xuat-hang" element={<PrivateRoute><XuatHang /></PrivateRoute>} />
        <Route path="/ton-kho-so-luong" element={<PrivateRoute><TonKhoSoLuong /></PrivateRoute>} />
        <Route path="/bao-cao" element={<PrivateRoute><BaoCao /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

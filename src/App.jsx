import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DangKy from "./pages/DangKy";
import QuenMatKhau from "./pages/QuenMatKhau";
import ResetMatKhau from "./pages/ResetMatKhau";
import NhapHang from "./pages/NhapHang";
import XuatHang from "./pages/XuatHang";
import TonKhoSoLuong from "./pages/TonKhoSoLuong";
import BaoCao from "./BaoCao"; // Báo cáo nằm ngoài /pages
import PrivateRoute from "./components/PrivateRoute"; // ⚠️ Nếu có dùng bảo vệ route

function App() {
  return (
    <Router>
      <Routes>
        {/* Công khai */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dang-ky" element={<DangKy />} />
        <Route path="/quen-mat-khau" element={<QuenMatKhau />} />
        <Route path="/reset-mat-khau/:token" element={<ResetMatKhau />} />

        {/* Cần đăng nhập */}
        <Route path="/nhap-hang" element={<NhapHang />} />
        <Route path="/xuat-hang" element={<XuatHang />} />
        <Route path="/ton-kho" element={<TonKhoSoLuong />} />
        <Route path="/bao-cao" element={<BaoCao />} />
      </Routes>
    </Router>
  );
}

export default App;

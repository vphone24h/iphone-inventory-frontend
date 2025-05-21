import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import DangKy from "./DangKy";
import QuenMatKhau from "./QuenMatKhau";
import NhapHang from "./NhapHang";
import XuatHang from "./XuatHang";
import TonKhoSoLuong from "./TonKhoSoLuong";
import BaoCao from "./BaoCao";
import PrivateRoute from "../components/PrivateRoute"; // ✅ import

function App() {
  return (
    <Routes>
      {/* Các route không cần đăng nhập */}
      <Route path="/login" element={<Login />} />
      <Route path="/dang-ky" element={<DangKy />} />
      <Route path="/quen-mat-khau" element={<QuenMatKhau />} />

      {/* ✅ Các route cần đăng nhập */}
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
        path="/ton-kho"
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

      {/* Redirect root về login nếu không có path cụ thể */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;

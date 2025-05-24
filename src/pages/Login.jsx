import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      alert("❌ Thiếu cấu hình biến môi trường VITE_API_URL");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Đăng nhập thành công");
        localStorage.setItem("token", data.token);
        navigate("/nhap-hang");
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      alert("❌ Không thể kết nối tới server");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="bg-black bg-opacity-90 rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo-vphone.png"
            alt="VPhone24h Logo"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">VPhone24h</h1>
        <p className="text-gray-300 text-center mb-6">
          Hệ thống quản lý kho hàng điện thoại
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-300 text-left mb-1">Tên đăng nhập (Email)</label>
            <input
              type="email"
              placeholder="Nhập email đăng nhập"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-gray-300 text-left mb-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-400 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="mr-2 accent-orange-500"
              />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/quen-mat-khau" className="text-sm text-blue-400 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        <div className="text-center text-gray-400 text-sm mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="text-blue-400 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded bg-white text-center">
      <h1 className="text-2xl font-bold mb-4">🔐 Đăng nhập Admin</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          ❓{" "}
          <Link to="/quen-mat-khau" className="text-blue-500 hover:underline">
            Quên mật khẩu?
          </Link>
        </p>
        <p className="mt-2">
          🚀 Chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="text-green-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

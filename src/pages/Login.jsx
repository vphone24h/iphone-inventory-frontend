import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Đăng nhập thành công");
        // TODO: lưu token vào localStorage và chuyển trang nếu cần
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
      const res = await fetch(`${API}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("");
        navigate("/admin-dashboard"); // Bạn nhớ tạo route /admin-dashboard tương ứng trong App.jsx
      } else {
        setMessage(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối server");
      console.error("Lỗi đăng nhập admin:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded bg-white text-center">
      <h1 className="text-2xl font-bold mb-6">🔐 Đăng nhập Admin</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email Admin"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
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
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Đăng nhập Admin
        </button>
      </form>

      {message && (
        <p className="mt-4 text-red-600 font-semibold">{message}</p>
      )}

      <p className="mt-6 text-sm text-gray-600">
        Bạn là thành viên?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-blue-500 hover:underline"
          type="button"
        >
          Đăng nhập tại đây
        </button>
      </p>
    </div>
  );
}

export default AdminLogin;

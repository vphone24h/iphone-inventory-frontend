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
      // Lấy URL backend từ biến môi trường, bỏ dấu '/' cuối nếu có
      const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
      
      // Gửi yêu cầu đăng nhập admin
      const res = await fetch(`${API}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Lưu token vào localStorage
        localStorage.setItem("token", data.token);
        setMessage("");
        
        // Điều hướng thẳng đến trang admin dashboard
        navigate("/admin-dashboard");
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
      <form onSubmit={handleLogin} className="flex flex-col gap-4" autoComplete="off">
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
    </div>
  );
}

export default AdminLogin;

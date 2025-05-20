import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DangKy() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/admin-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Đăng ký thành công!");
        navigate("/login"); // Chuyển về trang đăng nhập
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      alert("❌ Lỗi khi kết nối tới server");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded bg-white text-center">
      <h1 className="text-2xl font-bold mb-6">📝 Đăng ký tài khoản Admin</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Đăng ký
        </button>
      </form>

      {/* Liên kết trở lại trang đăng nhập */}
      <p className="mt-4 text-sm text-gray-600">
        🔐 Đã có tài khoản?{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </button>
      </p>
    </div>
  );
}

export default DangKy;

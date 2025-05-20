import { useState } from "react";
import { useNavigate } from "react-router-dom";

function QuenMatKhau() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Đã gửi email khôi phục mật khẩu! Vui lòng kiểm tra hộp thư.");
      } else {
        setMessage(`❌ ${data.message || "Gửi email thất bại."}`);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded bg-white text-center">
      <h1 className="text-2xl font-bold mb-4">🔁 Quên mật khẩu</h1>

      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Nhập email đã đăng ký"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <a
          onClick={() => navigate("/dang-nhap")}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          🔙 Quay lại đăng nhập
        </a>
      </div>
    </div>
  );
}

export default QuenMatKhau;

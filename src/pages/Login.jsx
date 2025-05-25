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
    <div
      style={{
        minHeight: "100vh",
        background: "#fafbfc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#18191a",
          borderRadius: 16,
          padding: 38,
          minWidth: 380,
          maxWidth: 400,
          boxShadow: "0 6px 24px #0002"
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <img
            src="/logo-vphone.png"
            alt="VPhone24h Logo"
            style={{ width: 54, height: 54, objectFit: "contain", marginBottom: 8 }}
          />
          <div style={{ fontWeight: 700, fontSize: 22, color: "#ff4d1c", marginBottom: 2 }}>
            VPhone24h
          </div>
          <div style={{ color: "#cccccc", fontSize: 15, marginTop: 2, marginBottom: 6 }}>
            Hệ thống quản lý kho hàng điện thoại chuyên nghiệp
          </div>
        </div>
        <form onSubmit={handleLogin} autoComplete="off">
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: "#fff", display: "block", marginBottom: 6 }}>Tên đăng nhập</label>
            <input
              type="email"
              placeholder="Nhập email đăng nhập"
              style={{
                width: "100%",
                padding: "12px 10px",
                background: "#23272b",
                color: "#fff",
                border: "1px solid #282a36",
                borderRadius: 6,
                marginBottom: 4
              }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label style={{ color: "#fff", display: "block", marginBottom: 6 }}>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              style={{
                width: "100%",
                padding: "12px 10px",
                background: "#23272b",
                color: "#fff",
                border: "1px solid #282a36",
                borderRadius: 6
              }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}>
            <label style={{ color: "#ccc", display: "flex", alignItems: "center", fontSize: 15 }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ marginRight: 6, accentColor: "#ff4d1c" }}
              />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/quen-mat-khau" style={{ color: "#33aaff", fontSize: 15, textDecoration: "none" }}>
              Quên mật khẩu?
            </Link>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#2196f3",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              borderRadius: 6,
              padding: "12px 0",
              fontSize: 17,
              marginBottom: 18,
              cursor: "pointer"
            }}
          >
            Đăng nhập
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <span style={{ color: "#aaa", fontSize: 14 }}>
            Chưa có tài khoản?{" "}
            <Link to="/dang-ky" style={{ color: "#2196f3", textDecoration: "underline" }}>
              Đăng ký ngay
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;

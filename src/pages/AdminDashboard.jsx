import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">🎯 Trang quản trị Admin</h1>
      
      <p>Chào mừng admin! Bạn có thể thực hiện các thao tác quản lý tại đây.</p>

      <div className="mt-6 space-x-4">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => navigate("/quanlyuser")}
        >
          Quản lý user chờ duyệt
        </button>

        <button
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          onClick={() => navigate("/bao-cao")}
        >
          Xem báo cáo
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import ChiTietDonHang from "./ChiTietDonHang";
import LogoutButton from "../components/LogoutButton";

function BaoCao() {
  const [data, setData] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [filter, setFilter] = useState("Hôm nay");
  const [branch, setBranch] = useState("all");
  const [showDetails, setShowDetails] = useState(false);

  const predefined = {
    "Hôm nay": [new Date(), new Date()],
    "Hôm qua": [
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() - 1)),
    ],
    "Tuần này": [
      new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)),
      new Date(),
    ],
    "Tháng này": [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
    "Năm nay": [new Date(new Date().getFullYear(), 0, 1), new Date()],
  };

  const fetchData = async (fromDate, toDate, branch) => {
    try {
      const res = await fetch(`http://localhost:4000/api/bao-cao-loi-nhuan?from=${fromDate}&to=${toDate}&branch=${branch}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  useEffect(() => {
    if (filter !== "Tùy chọn") {
      const [f, t] = predefined[filter];
      const fromDate = f.toISOString().slice(0, 10);
      const toDate = t.toISOString().slice(0, 10);
      setFrom(fromDate);
      setTo(toDate);
      fetchData(fromDate, toDate, branch);
    }
  }, [filter, branch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (from && to) {
      fetchData(from, to, branch);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 relative">
      {/* ✅ Nút đăng xuất ở góc phải */}
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      <h2 className="text-2xl font-bold mb-4">📊 Báo cáo lợi nhuận</h2>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border px-3 py-2 rounded">
          {["Hôm nay", "Hôm qua", "Tuần này", "Tháng này", "Năm nay", "Tùy chọn"].map(option => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="border px-3 py-2 rounded">
          <option value="all">Tất cả chi nhánh</option>
          <option value="Dĩ An">Chi nhánh Dĩ An</option>
          <option value="Gò Vấp">Chi nhánh Gò Vấp</option>
          <option value="Thủ Đức">Chi nhánh Thủ Đức</option>
        </select>

        {filter === "Tùy chọn" && (
          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border px-2 py-2 rounded" required />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border px-2 py-2 rounded" required />
            <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Áp dụng</button>
          </form>
        )}
      </div>

      {/* Tổng quan báo cáo */}
      {data ? (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-semibold">
            <div>
              <p className="text-gray-500">Số đơn</p>
              <p>{data.totalDevicesSold}</p>
            </div>
            <div>
              <p className="text-gray-500">Doanh thu</p>
              <button
                className="text-blue-600 font-semibold underline hover:text-blue-800 transition duration-200"
                onClick={() => setShowDetails(!showDetails)}
              >
                {data.totalRevenue.toLocaleString()} đ{" "}
                <span className="text-sm font-normal">(nhấn vào xem chi tiết)</span>
              </button>
            </div>
            <div>
              <p className="text-gray-500">Chi phí</p>
              <p>{data.totalCost.toLocaleString()} đ</p>
            </div>
            <div>
              <p className="text-gray-500">Lợi nhuận</p>
              <p className="text-green-700">{data.totalProfit.toLocaleString()} đ</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Đang tải dữ liệu...</p>
      )}

      {/* Chi tiết đơn hàng khi click */}
      {showDetails && (
        <ChiTietDonHang from={from} to={to} branch={branch} />
      )}
    </div>
  );
}

export default BaoCao;

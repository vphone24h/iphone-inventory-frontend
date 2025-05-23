import { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";

function XuatHang() {
  const [formData, setFormData] = useState({
    imei: "",
    sold_date: "",
    sku: "",
    product_name: "",
    price_sell: "",
    customer_name: "",
    warranty: "",
    note: "",
  });

  const [message, setMessage] = useState("");
  const [profit, setProfit] = useState(null);

  // THÊM: Quản lý danh sách đơn xuất & edit
  const [sales, setSales] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách đơn xuất khi load trang hoặc khi thay đổi
  const fetchSales = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/xuat-hang-list`);
      const data = await res.json();
      setSales(data.items || []);
    } catch (err) {
      setSales([]);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Khi nhập IMEI sẽ tự động fill tên máy & SKU nếu tìm thấy
  const handleImeiChange = async (e) => {
    const imei = e.target.value;
    setFormData((prev) => ({ ...prev, imei }));
    if (imei.length >= 8) {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ton-kho`);
      const data = await res.json();
      const found = (data.items || []).find(item => item.imei === imei);
      if (found) {
        setFormData((prev) => ({
          ...prev,
          product_name: found.product_name || found.tenSanPham || "",
          sku: found.sku || "",
        }));
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // THÊM: Nộp hoặc cập nhật đơn xuất
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProfit(null);

    try {
      let url = `${import.meta.env.VITE_API_URL}/api/xuat-hang`;
      let method = "POST";
      if (editingId) {
        url = `${import.meta.env.VITE_API_URL}/api/xuat-hang/${editingId}`;
        method = "PUT";
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ " + data.message);
        setProfit(data.profit);
        setFormData({
          imei: "",
          sold_date: "",
          sku: "",
          product_name: "",
          price_sell: "",
          customer_name: "",
          warranty: "",
          note: "",
        });
        setEditingId(null);
        fetchSales();
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối tới server");
    }
  };

  // Sửa đơn xuất (fill form để edit)
  const handleEdit = (item) => {
    setFormData({
      imei: item.imei || "",
      sold_date: item.sold_date ? item.sold_date.slice(0, 10) : "",
      sku: item.sku || "",
      product_name: item.product_name || "",
      price_sell: item.price_sell || "",
      customer_name: item.customer_name || "",
      warranty: item.warranty || "",
      note: item.note || "",
    });
    setEditingId(item._id);
    setMessage("");
    setProfit(item.profit || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xoá đơn xuất
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn xoá đơn xuất này?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/xuat-hang/${id}`, { method: "DELETE" });
    fetchSales();
  };

  const inputClass = "w-full border p-2 rounded h-10";

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10 relative">
      {/* Đăng xuất */}
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      {/* 🚀 Menu điều hướng nhanh */}
      <div className="flex justify-center space-x-2 mb-6">
        <button
          onClick={() => (window.location.href = "/nhap-hang")}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          📥 Nhập hàng
        </button>
        <button
          onClick={() => (window.location.href = "/xuat-hang")}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          📤 Xuất hàng
        </button>
        <button
          onClick={() => (window.location.href = "/ton-kho-so-luong")}
          className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
        >
          📦 Tồn kho
        </button>
        <button
          onClick={() => (window.location.href = "/bao-cao")}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          📋 Báo cáo
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
        Xuất hàng iPhone
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="imei"
          placeholder="IMEI cần bán"
          value={formData.imei}
          onChange={handleImeiChange}
          className={inputClass}
          required
        />
        <input
          type="date"
          name="sold_date"
          value={formData.sold_date}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU sản phẩm"
          value={formData.sku}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="product_name"
          placeholder="Tên sản phẩm"
          value={formData.product_name}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="number"
          name="price_sell"
          placeholder="Giá bán"
          value={formData.price_sell}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="text"
          name="customer_name"
          placeholder="Tên khách hàng"
          value={formData.customer_name}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="warranty"
          placeholder="Bảo hành (VD: 6 tháng)"
          value={formData.warranty}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="note"
          placeholder="Ghi chú"
          value={formData.note}
          onChange={handleChange}
          className={inputClass}
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
        >
          {editingId ? "Cập nhật" : "Xuất hàng"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-semibold text-blue-600">{message}</p>
      )}

      {profit !== null && (
        <p className="mt-2 text-center text-green-600 font-semibold">
          💰 Lợi nhuận: {profit.toLocaleString()}đ
        </p>
      )}

      {/* DANH SÁCH ĐƠN XUẤT */}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-2">Danh sách đơn xuất hàng</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">IMEI</th>
              <th className="border p-2">SKU</th>
              <th className="border p-2">Tên sản phẩm</th>
              <th className="border p-2 text-center">Giá bán</th>
              <th className="border p-2">Ngày bán</th>
              <th className="border p-2">Khách hàng</th>
              <th className="border p-2">Bảo hành</th>
              <th className="border p-2">Ghi chú</th>
              <th className="border p-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((item) => (
              <tr key={item._id}>
                <td className="border p-2">{item.imei}</td>
                <td className="border p-2">{item.sku}</td>
                <td className="border p-2">{item.product_name}</td>
                <td className="border p-2 text-center">{item.price_sell?.toLocaleString()}đ</td>
                <td className="border p-2">{item.sold_date?.slice(0, 10)}</td>
                <td className="border p-2">{item.customer_name}</td>
                <td className="border p-2">{item.warranty}</td>
                <td className="border p-2">{item.note}</td>
                <td className="border p-2 text-center space-x-1">
                  <button onClick={() => handleEdit(item)} className="bg-yellow-400 text-white px-2 py-1 rounded">✏️</button>
                  <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-2 py-1 rounded">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default XuatHang;

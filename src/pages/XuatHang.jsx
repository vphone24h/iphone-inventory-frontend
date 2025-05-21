import { useState } from "react";
import LogoutButton from "../components/LogoutButton"; // Thêm dòng này

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProfit(null);

    try {
      const res = await fetch("http://localhost:4000/api/xuat-hang", {
        method: "POST",
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
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối tới server");
    }
  };

  const inputClass = "w-full border p-2 rounded h-10";

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10 relative">
      {/* Nút đăng xuất ở góc trên bên phải */}
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Xuất hàng iPhone</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="imei"
          placeholder="IMEI cần bán"
          value={formData.imei}
          onChange={handleChange}
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
          Xuất hàng
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
    </div>
  );
}

export default XuatHang;

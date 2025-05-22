import { useState } from "react";
import LogoutButton from "../components/LogoutButton";

function NhapHang() {
  const [formData, setFormData] = useState({
    imei: "",
    product_name: "",
    sku: "",
    price_import: "",
    import_date: "",
    supplier: "",
    branch: "",
    note: "",
    tenSanPham: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/nhap-hang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tenSanPham: formData.product_name || formData.tenSanPham,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setFormData({
          imei: "",
          product_name: "",
          sku: "",
          price_import: "",
          import_date: "",
          supplier: "",
          branch: "",
          note: "",
          tenSanPham: "",
        });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối tới server");
    }
  };

  const inputClass = "w-full border p-2 rounded h-10";

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10 relative">
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

      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Nhập hàng iPhone
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="imei"
          placeholder="IMEI"
          value={formData.imei}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="text"
          name="product_name"
          placeholder="Tên sản phẩm (VD: iPhone 13 Pro Max)"
          value={formData.product_name}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU (VD: IP13PM-128-ĐEN)"
          value={formData.sku}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="number"
          name="price_import"
          placeholder="Giá nhập"
          value={formData.price_import}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="date"
          name="import_date"
          value={formData.import_date}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="text"
          name="supplier"
          placeholder="Nhà cung cấp"
          value={formData.supplier}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="branch"
          placeholder="Chi nhánh (VD: Dĩ An, Tân Bình...)"
          value={formData.branch}
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Nhập hàng
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-semibold text-green-600">
          {message}
        </p>
      )}
    </div>
  );
}

export default NhapHang;

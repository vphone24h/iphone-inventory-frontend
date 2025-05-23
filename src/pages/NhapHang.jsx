import { useState, useEffect } from "react";
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
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const [editingItemId, setEditingItemId] = useState(null);

  const inputClass = "w-full border p-2 rounded h-10";

  const fetchItems = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ton-kho`);
      const data = await res.json();
      setItems(data.items);
    } catch (err) {
      console.error("❌ Lỗi khi tải dữ liệu nhập hàng:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingItemId ? "PUT" : "POST";
      const url = editingItemId
        ? `${import.meta.env.VITE_API_URL}/api/nhap-hang/${editingItemId}`
        : `${import.meta.env.VITE_API_URL}/api/nhap-hang`;

      const res = await fetch(url, {
        method,
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
        setEditingItemId(null);
        fetchItems();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối tới server");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      imei: item.imei,
      product_name: item.tenSanPham,
      sku: item.sku,
      price_import: item.price_import,
      import_date: item.import_date?.slice(0, 10) || "",
      supplier: item.supplier,
      branch: item.branch,
      note: item.note,
      tenSanPham: item.tenSanPham,
    });
    setEditingItemId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá mục này không?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/nhap-hang/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`🗑️ ${data.message}`);
        fetchItems();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Lỗi khi xoá mục");
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.imei?.toLowerCase().includes(search.toLowerCase()) ||
      item.tenSanPham?.toLowerCase().includes(search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow mt-10 relative">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      {/* Menu điều hướng nhanh */}
      <div className="flex justify-center space-x-2 mb-6">
        <button onClick={() => (window.location.href = "/nhap-hang")} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">📥 Nhập hàng</button>
        <button onClick={() => (window.location.href = "/xuat-hang")} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">📤 Xuất hàng</button>
        <button onClick={() => (window.location.href = "/ton-kho-so-luong")} className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">📦 Tồn kho</button>
        <button onClick={() => (window.location.href = "/bao-cao")} className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">📋 Báo cáo</button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Nhập hàng iPhone</h2>

      {/* Form nhập */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {Object.entries({
          imei: "IMEI",
          product_name: "Tên sản phẩm",
          sku: "SKU",
          price_import: "Giá nhập",
          import_date: "Ngày nhập",
          supplier: "Nhà cung cấp",
          branch: "Chi nhánh",
          note: "Ghi chú"
        }).map(([key, label]) => (
          <input
            key={key}
            type={key === "price_import" ? "number" : key === "import_date" ? "date" : "text"}
            name={key}
            placeholder={label}
            value={formData[key]}
            onChange={handleChange}
            className={inputClass}
            required={key !== "note" && key !== "supplier" && key !== "branch"}
          />
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
          {editingItemId ? "Cập nhật" : "Nhập hàng"}
        </button>
      </form>

      {message && <p className="mt-4 text-center font-semibold text-green-600">{message}</p>}

      {/* Danh sách */}
      <div className="mt-10">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm IMEI, Tên, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-4"
        />
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">IMEI</th>
              <th className="border p-2">Tên sản phẩm</th>
              <th className="border p-2">SKU</th>
              <th className="border p-2 text-center">Giá nhập</th>
              <th className="border p-2">Ngày nhập</th>
              <th className="border p-2">Nhà cung cấp</th>
              <th className="border p-2">Chi nhánh</th>
              <th className="border p-2">Ghi chú</th>
              <th className="border p-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => (
              <tr key={item._id}>
                <td className="border p-2">{item.imei}</td>
                <td className="border p-2">{item.tenSanPham}</td>
                <td className="border p-2">{item.sku}</td>
                <td className="border p-2 text-center">{item.price_import?.toLocaleString()}đ</td>
                <td className="border p-2">{item.import_date?.slice(0, 10)}</td>
                <td className="border p-2">{item.supplier}</td>
                <td className="border p-2">{item.branch}</td>
                <td className="border p-2">{item.note}</td>
                <td className="border p-2 text-center space-x-1">
                  <button onClick={() => handleEdit(item)} className="bg-yellow-400 text-white px-2 py-1 rounded">✏️</button>
                  <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-2 py-1 rounded">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NhapHang;

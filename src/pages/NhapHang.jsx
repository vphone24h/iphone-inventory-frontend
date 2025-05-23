import { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
    quantity: "",
    category: ""
  });

  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const [editingItemId, setEditingItemId] = useState(null);

  const inputClass = "w-full border p-2 rounded h-10";

  const fetchItems = async () => {
    try {
      const res = await fetch(${import.meta.env.VITE_API_URL}/api/ton-kho);
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingItemId ? "PUT" : "POST";
      const url = editingItemId
        ? ${import.meta.env.VITE_API_URL}/api/nhap-hang/${editingItemId}
        : ${import.meta.env.VITE_API_URL}/api/nhap-hang;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tenSanPham: formData.product_name || formData.tenSanPham })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(✅ ${data.message});
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
          quantity: "",
          category: ""
        });
        setEditingItemId(null);
        fetchItems();
      } else {
        setMessage(❌ ${data.message});
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối tới server");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      imei: item.imei,
      product_name: item.product_name || item.tenSanPham,
      sku: item.sku,
      price_import: item.price_import,
      import_date: item.import_date?.slice(0, 10) || "",
      supplier: item.supplier,
      branch: item.branch,
      note: item.note,
      tenSanPham: item.tenSanPham,
      quantity: item.quantity || "",
      category: item.category || ""
    });
    setEditingItemId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá mục này không?")) return;
    try {
      const res = await fetch(${import.meta.env.VITE_API_URL}/api/nhap-hang/${id}, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setMessage(🗑️ ${data.message});
        fetchItems();
      } else {
        setMessage(❌ ${data.message});
      }
    } catch (err) {
      setMessage("❌ Lỗi khi xoá mục");
    }
  };

  const exportToExcel = () => {
    const dataToExport = items.map((item) => ({
      IMEI: item.imei,
      Tên_sản_phẩm: item.product_name || item.tenSanPham,
      SKU: item.sku,
      Giá_nhập: item.price_import,
      Ngày_nhập: item.import_date?.slice(0, 10),
      Số_lượng: item.quantity,
      Thư_mục: item.category,
      Nhà_cung_cấp: item.supplier,
      Chi_nhánh: item.branch,
      Ghi_chú: item.note
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NhapHang");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "danh_sach_nhap_hang.xlsx");
  };

  const importFromExcel = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      for (const row of data) {
        await fetch(${import.meta.env.VITE_API_URL}/api/nhap-hang, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imei: row.IMEI,
            product_name: row.Tên_sản_phẩm,
            sku: row.SKU,
            price_import: row.Giá_nhập,
            import_date: row.Ngày_nhập,
            supplier: row.Nhà_cung_cấp,
            branch: row.Chi_nhánh,
            note: row.Ghi_chú,
            quantity: row.Số_lượng,
            category: row.Thư_mục,
            tenSanPham: row.Tên_sản_phẩm
          })
        });
      }
      fetchItems();
      alert("✅ Đã nhập từ Excel thành công!");
    };
    reader.readAsBinaryString(file);
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.imei?.toLowerCase().includes(search.toLowerCase()) ||
      (item.product_name || item.tenSanPham)?.toLowerCase().includes(search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(search.toLowerCase());
    const matchDate = filterDate ? item.import_date?.slice(0, 10) === filterDate : true;
    const matchBranch = filterBranch ? item.branch === filterBranch : true;
    const matchCategory = filterCategory ? item.category === filterCategory : true;
    return matchSearch && matchDate && matchBranch && matchCategory;
  });

  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow mt-10 relative">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      <div className="flex justify-center space-x-2 mb-6">
        <button onClick={() => (window.location.href = "/nhap-hang")} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">📥 Nhập hàng</button>
        <button onClick={() => (window.location.href = "/xuat-hang")} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">📤 Xuất hàng</button>
        <button onClick={() => (window.location.href = "/ton-kho-so-luong")} className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">📦 Tồn kho</button>
        <button onClick={() => (window.location.href = "/bao-cao")} className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">📋 Báo cáo</button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Nhập hàng iPhone</h2>

      <div className="flex gap-4 mb-4">
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border p-2 rounded w-40" placeholder="Ngày nhập" />
        <input type="text" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="border p-2 rounded w-40" placeholder="Chi nhánh" />
        <input type="text" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border p-2 rounded w-40" placeholder="Thư mục" />
      </div>

      <div className="flex justify-between mb-4 gap-4">
        <label className="flex items-center bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
          📤 Nhập từ Excel
          <input type="file" accept=".xlsx,.xls" onChange={importFromExcel} hidden />
        </label>
        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          ⬇️ Xuất Excel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {Object.entries({ imei: "IMEI", product_name: "Tên sản phẩm", sku: "SKU", price_import: "Giá nhập", import_date: "Ngày nhập", supplier: "Nhà cung cấp", branch: "Chi nhánh", note: "Ghi chú", quantity: "Số lượng", category: "Thư mục" }).map(([key, label]) => (
          <input
            key={key}
            type={key === "price_import" || key === "quantity" ? "number" : key === "import_date" ? "date" : "text"}
            name={key}
            placeholder={label}
            value={formData[key] || ""}
            onChange={handleChange}
            className={inputClass}
            required={key !== "imei" && key !== "note" && key !== "supplier" && key !== "branch" && key !== "category"}
          />
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
          {editingItemId ? "Cập nhật" : "Nhập hàng"}
        </button>
      </form>

      {message && <p className="mt-4 text-center font-semibold text-green-600">{message}</p>}

      <div className="mt-10">
        <input type="text" placeholder="🔍 Tìm kiếm IMEI, Tên, SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="border px-4 py-2 rounded w-full mb-4" />
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">IMEI</th>
              <th className="border p-2">Tên sản phẩm</th>
              <th className="border p-2">SKU</th>
              <th className="border p-2 text-center">Giá nhập</th>
              <th className="border p-2">Ngày nhập</th>
              <th className="border p-2">Số lượng</th>
              <th className="border p-2">Thư mục</th>
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
                <td className="border p-2">{item.product_name || item.tenSanPham}</td>
                <td className="border p-2">{item.sku}</td>
                <td className="border p-2 text-center">{item.price_import?.toLocaleString()}đ</td>
                <td className="border p-2">{item.import_date?.slice(0, 10)}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">{item.category}</td>
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
            <button key={i + 1} onClick={() => setPage(i + 1)} className={px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NhapHang;
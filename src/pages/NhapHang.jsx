import { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function NhapHang() {
  // ... [TOÀN BỘ HOOKS, HÀM LOGIC GIỮ NGUYÊN như code bạn gửi ở trên] ...
  // (copy nguyên phần khai báo state, useEffect, handle, import/export Excel...)

  // [Đoạn này mình rút gọn để bạn copy dễ, chỉ thay phần return bên dưới]
  // HÃY GIỮ TOÀN BỘ CODE LOGIC NHƯ CODE GỐC TRƯỚC ĐOẠN return()

  return (
    <div style={{ background: "#f6f7f9", minHeight: "100vh", padding: 24 }}>
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 12
      }}>
        <LogoutButton />
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: "#222", marginBottom: 2 }}>Nhập hàng</h2>
      <div style={{ color: "#aaa", fontSize: 16, marginBottom: 26 }}>
        Nhập hàng VPhone24h &bull; Quản lý nhập hàng từ nhà cung cấp vào kho
      </div>

      {/* Chức năng nhập/xuất excel */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        <label style={{
          background: "#222",
          color: "#fff",
          borderRadius: 6,
          padding: "9px 18px",
          fontWeight: 500,
          cursor: "pointer"
        }}>
          📥 Nhập từ Excel
          <input type="file" accept=".xlsx,.xls" onChange={importFromExcel} hidden />
        </label>
        <button onClick={exportToExcel} style={{
          background: "#222",
          color: "#fff",
          borderRadius: 6,
          padding: "9px 18px",
          fontWeight: 500,
          border: "none",
          cursor: "pointer"
        }}>
          ⬇️ Xuất Excel
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "350px 1fr",
        gap: 20,
        marginBottom: 32,
      }}>
        {/* THÔNG TIN CHUNG */}
        <div style={{
          background: "#18191a",
          borderRadius: 14,
          padding: 22,
          color: "#fff",
          minWidth: 300
        }}>
          <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 16 }}>Thông tin chung</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "#ccc", display: "block", marginBottom: 4 }}>Ngày nhập</label>
            <input
              name="import_date"
              type="date"
              value={formData.import_date}
              onChange={handleChange}
              style={{
                background: "#23272b",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: 6,
                padding: "8px 12px",
                width: "100%"
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "#ccc", display: "block", marginBottom: 4 }}>Chi nhánh</label>
            <div style={{ display: "flex", gap: 5 }}>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                style={{
                  background: "#23272b",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 6,
                  padding: "8px 12px",
                  width: "100%"
                }}
                required
              >
                <option value="">Chọn chi nhánh</option>
                {branches.map(b => (
                  <option key={b._id} value={b.name}>{b.name}</option>
                ))}
              </select>
              <button type="button" style={{
                background: "#222", color: "#fff", borderRadius: 6, border: "none", padding: "0 9px", fontSize: 20
              }} title="Thêm" onClick={() => { setShowBranchModal(true); setEditBranchId(null); setBranchInput(''); }}>+</button>
            </div>
          </div>
          <div>
            <label style={{ color: "#ccc", display: "block", marginBottom: 4 }}>Danh mục</label>
            <div style={{ display: "flex", gap: 5 }}>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  background: "#23272b",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 6,
                  padding: "8px 12px",
                  width: "100%"
                }}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(c => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <button type="button" style={{
                background: "#222", color: "#fff", borderRadius: 6, border: "none", padding: "0 9px", fontSize: 20
              }} title="Thêm" onClick={() => { setShowCategoryModal(true); setEditCategoryId(null); setCategoryInput(''); }}>+</button>
            </div>
          </div>
        </div>

        {/* THÊM SẢN PHẨM */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#18191a",
            borderRadius: 14,
            padding: 22,
            color: "#fff",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 13,
            alignItems: "end"
          }}
        >
          <div style={{ gridColumn: "1 / 4", fontWeight: 600, fontSize: 17, marginBottom: 4 }}>
            Thêm sản phẩm
          </div>
          <div>
            <label style={{ color: "#ccc" }}>IMEI</label>
            <input
              name="imei"
              value={formData.imei}
              onChange={handleChange}
              placeholder="Nhập IMEI"
              required
              style={{
                background: "#23272b",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: 6,
                width: "100%"
              }}
            />
          </div>
          <div>
            <label style={{ color: "#ccc" }}>Tên sản phẩm</label>
            <input
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
              required
              style={{
                background: "#23272b",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: 6,
                width: "100%"
              }}
            />
          </div>
          <div>
            <label style={{ color: "#ccc" }}>SKU</label>
            <input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Nhập SKU"
              style={{
                background: "#23272b",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: 6,
                width: "100%"
              }}
            />
          </div>
          <div>
            <label style={{ color: "#ccc" }}>Giá nhập</label>
            <input
              name="price_import"
              type="number"
              value={formData.price_import}
              onChange={handleChange}
              placeholder="Giá nhập"
              required
              style={{
                background: "#23272b",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: 6,
                width: "100%"
              }}
            />
          </div>
          <div>
            <label style={{ color: "#ccc" }}>Số lượng</label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Số lượng"
              required
              style={{
                background: "#23272b",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: 6,
                width: "100%"
              }}
            />
          </div>
          <div>
            <label style={{ color: "#ccc" }}>Nhà cung cấp</label>
            <input
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Nhà cung cấp"
              style={{
                background: "#23272b",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: 6,
                width: "100%"
              }}
            />
          </div>
          <div style={{ gridColumn: "1 / 3" }}>
            <label style={{ color: "#ccc" }}>Ghi chú</label>
            <input
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Nhập ghi chú"
              style={{
                background: "#23272b",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: 6,
                width: "100%"
              }}
            />
          </div>
          <div style={{ textAlign: "right" }}>
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
                fontSize: 16,
                cursor: "pointer"
              }}
            >
              {editingItemId ? "Cập nhật" : "Thêm sản phẩm"}
            </button>
          </div>
        </form>
      </div>

      {/* MESSAGE */}
      {message && (
        <div style={{ textAlign: "center", fontWeight: 600, color: "#21ba45", marginBottom: 16 }}>
          {message}
        </div>
      )}

      {/* BẢNG DANH SÁCH NHẬP */}
      <div style={{
        background: "#18191a",
        borderRadius: 14,
        padding: 22,
        color: "#fff",
        marginTop: 24
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Danh sách sản phẩm nhập kho</div>
          <div style={{ textAlign: "right", fontWeight: 600 }}>
            {/* Tổng cộng: */}
            <span style={{ fontSize: 15, color: "#fff" }}>
              Tổng cộng: {filteredItems.reduce((s, i) => s + Number(i.price_import) * Number(i.quantity || 1), 0).toLocaleString()} đ
            </span>
            <br />
            <span style={{ color: "#aaa", fontSize: 13 }}>
              Số lượng: {filteredItems.reduce((s, i) => s + Number(i.quantity || 1), 0)} sản phẩm
            </span>
          </div>
        </div>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sản phẩm, IMEI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: 280,
            marginBottom: 15,
            background: "#23272b",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 6,
            padding: "7px 12px"
          }}
        />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", color: "#fff", background: "transparent" }}>
            <thead>
              <tr style={{ background: "#23272b" }}>
                <th>IMEI</th>
                <th>Tên sản phẩm</th>
                <th>SKU</th>
                <th>Giá nhập</th>
                <th>Ngày nhập</th>
                <th>Số lượng</th>
                <th>Thư mục</th>
                <th>Nhà cung cấp</th>
                <th>Chi nhánh</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", color: "#aaa", padding: 30 }}>
                    Chưa có sản phẩm nào. Vui lòng thêm sản phẩm vào danh sách nhập kho.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.imei}</td>
                    <td>{item.product_name || item.tenSanPham}</td>
                    <td>{item.sku}</td>
                    <td>{item.price_import?.toLocaleString()}đ</td>
                    <td>{item.import_date?.slice(0, 10)}</td>
                    <td>{item.quantity}</td>
                    <td>{item.category}</td>
                    <td>{item.supplier}</td>
                    <td>{item.branch}</td>
                    <td>{item.note}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          background: "#ffc700",
                          color: "#23272b",
                          border: "none",
                          borderRadius: 5,
                          padding: "3px 10px",
                          marginRight: 4,
                          cursor: "pointer"
                        }}
                      >✏️</button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{
                          background: "#db2828",
                          color: "#fff",
                          border: "none",
                          borderRadius: 5,
                          padding: "3px 10px",
                          cursor: "pointer"
                        }}
                      >🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 20 }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1}
              onClick={() => setPage(i + 1)}
              style={{
                padding: "6px 13px",
                borderRadius: 6,
                border: "none",
                background: page === i + 1 ? "#2196f3" : "#222",
                color: page === i + 1 ? "#fff" : "#bbb",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >{i + 1}</button>
          ))}
        </div>
      </div>

      {/* Các modal branch/category giữ nguyên như code cũ của bạn */}
      {/* ... modal code ... */}
    </div>
  );
}

export default NhapHang;

import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";

function CongNo() {
  const [debts, setDebts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // {customer_name, customer_phone, ...}
  const [customerDebt, setCustomerDebt] = useState({ total_debt: 0, total_paid: 0, debt_history: [] });
  const [payAmount, setPayAmount] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [historyModal, setHistoryModal] = useState({ open: false, history: [] });
  const [detailModal, setDetailModal] = useState({ open: false, orders: [] });

  // Lấy danh sách khách hàng còn nợ
  const fetchDebts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-list`);
    const data = await res.json();
    setDebts(data.items || []);
  };

  // Chọn khách hàng để thao tác tổng (truyền cả object khách)
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer); // lưu nguyên object {customer_name, customer_phone,...}
    setCustomerDebt({
      total_debt: customer.total_debt || 0,
      total_paid: customer.total_paid || 0,
      debt_history: customer.debt_history || []
    });
    setPayAmount("");
    setAddAmount("");
  };

  // Trừ nợ tổng cho khách (truyền cả customer_name & customer_phone)
  const handlePayDebt = async () => {
    if (!payAmount || isNaN(payAmount)) return alert("Nhập số tiền muốn trả");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-pay-customer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: selectedCustomer.customer_name,
        customer_phone: selectedCustomer.customer_phone,
        amount: payAmount
      }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Đã cập nhật công nợ!");
      setPayAmount("");
      fetchDebts();
      setCustomerDebt({
        ...customerDebt,
        total_debt: data.total_debt,
        total_paid: data.total_paid,
        debt_history: data.debt_history
      });
    } else {
      alert("❌ " + (data.message || "Cập nhật công nợ thất bại!"));
    }
  };

  // Cộng thêm nợ tổng cho khách (truyền cả customer_name & customer_phone)
  const handleAddDebt = async () => {
    if (!addAmount || isNaN(addAmount)) return alert("Nhập số tiền muốn cộng nợ");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-add-customer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: selectedCustomer.customer_name,
        customer_phone: selectedCustomer.customer_phone,
        amount: addAmount
      }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Đã cộng thêm nợ!");
      setAddAmount("");
      fetchDebts();
      setCustomerDebt({
        ...customerDebt,
        total_debt: data.total_debt,
        total_paid: data.total_paid,
        debt_history: data.debt_history
      });
    } else {
      alert("❌ " + (data.message || "Cộng nợ thất bại!"));
    }
  };

  // Lịch sử trả/cộng nợ
  const handleShowHistory = (history) => {
    setHistoryModal({ open: true, history: history || [] });
  };

  // Xem chi tiết sản phẩm khách đã mua
  const handleShowDetail = async (customer) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-orders?customer_name=${encodeURIComponent(customer.customer_name)}&customer_phone=${encodeURIComponent(customer.customer_phone || "")}`
    );
    const data = await res.json();
    setDetailModal({ open: true, orders: data.orders || [] });
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow mt-10 relative">
      {/* Nút logout + quay lại xuất hàng trên cùng bên phải */}
      <div className="absolute top-4 right-4 flex gap-2">
        <LogoutButton />
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
          onClick={() => window.location.href = "/xuat-hang"}
        >
          ← Quay lại Xuất hàng
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
        Công nợ khách hàng
      </h2>

      {/* Danh sách khách còn công nợ */}
      {!selectedCustomer && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Danh sách khách còn công nợ:</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Khách hàng</th>
                <th className="border p-2">SĐT</th>
                <th className="border p-2">Đã trả</th>
                <th className="border p-2">Còn nợ</th>
                <th className="border p-2">Thao tác</th>
                <th className="border p-2">Lịch sử</th>
                <th className="border p-2">Xem chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt, i) => (
                <tr key={i}>
                  <td className="border p-2">{debt.customer_name}</td>
                  <td className="border p-2">{debt.customer_phone || "—"}</td>
                  <td className="border p-2 text-right text-green-700">{Number(debt.total_paid).toLocaleString()}đ</td>
                  <td className="border p-2 text-right text-red-600 font-bold">{Number(debt.total_debt).toLocaleString()}đ</td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => handleSelectCustomer(debt)}
                    >
                      Cộng/Trừ nợ
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-gray-300 text-black px-2 py-1 rounded"
                      onClick={() => handleShowHistory(debt.debt_history)}
                    >
                      Xem
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-yellow-400 text-black px-2 py-1 rounded"
                      onClick={() => handleShowDetail(debt)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {debts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-3 text-gray-500">
                    Không có công nợ nào!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Thao tác tổng cho từng khách hàng */}
      {selectedCustomer && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold">
                Công nợ của: <span className="text-blue-700">{selectedCustomer.customer_name}</span>
                {selectedCustomer.customer_phone && (
                  <span className="ml-4 text-gray-700">
                    | SĐT: <b className="text-green-700">{selectedCustomer.customer_phone}</b>
                  </span>
                )}
              </h3>
              <div className="mt-2">
                <span className="mr-6">Đã trả: <b className="text-green-700">{Number(customerDebt.total_paid).toLocaleString()}đ</b></span>
                <span>Còn nợ: <b className="text-red-600">{Number(customerDebt.total_debt).toLocaleString()}đ</b></span>
              </div>
            </div>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded ml-3"
              onClick={() => {
                setSelectedCustomer(null);
                setCustomerDebt({ total_debt: 0, total_paid: 0, debt_history: [] });
              }}
            >
              ← Quay lại danh sách nợ
            </button>
          </div>
          {/* Giao diện cộng/trừ nợ tổng */}
          <div className="flex gap-8 mt-3">
            <div>
              <input
                type="number"
                min="0"
                placeholder="Trả nợ"
                className="border rounded px-2 py-1 w-32 mr-2"
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={handlePayDebt}
              >
                Trừ nợ
              </button>
            </div>
            <div>
              <input
                type="number"
                min="0"
                placeholder="Cộng nợ"
                className="border rounded px-2 py-1 w-32 mr-2"
                value={addAmount}
                onChange={e => setAddAmount(e.target.value)}
              />
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={handleAddDebt}
              >
                + Nợ
              </button>
            </div>
            <div>
              <button
                className="bg-gray-300 text-black px-3 py-1 rounded"
                onClick={() => handleShowHistory(customerDebt.debt_history)}
              >
                Xem lịch sử
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal lịch sử trả/cộng nợ */}
      {historyModal.open && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px] max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-lg"
              onClick={() => setHistoryModal({ open: false, history: [] })}
            >✖</button>
            <h3 className="text-lg font-bold mb-3">Lịch sử trả/cộng nợ</h3>
            <ul className="space-y-2">
              {historyModal.history && historyModal.history.length > 0 ? (
                historyModal.history.map((item, idx) => (
                  <li key={idx} className={`p-2 rounded ${item.type === "add" ? "bg-red-100" : "bg-green-100"}`}>
                    <b>{item.type === "add" ? "Cộng nợ" : "Trả nợ"}:</b> {Number(item.amount).toLocaleString()}đ
                    <span className="ml-2 text-xs text-gray-500">{item.date ? (item.date.slice(0, 10) + " " + item.date.slice(11, 19)) : ""}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">Chưa có lịch sử trả/cộng nợ.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Modal chi tiết sản phẩm khách đã mua */}
      {detailModal.open && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-lg"
              onClick={() => setDetailModal({ open: false, orders: [] })}
            >✖</button>
            <h3 className="text-lg font-bold mb-3">Danh sách sản phẩm khách đã mua</h3>
            <table className="w-full border text-sm mb-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">IMEI</th>
                  <th className="border p-2">Sản phẩm</th>
                  <th className="border p-2">Giá bán</th>
                  <th className="border p-2">Ngày bán</th>
                </tr>
              </thead>
              <tbody>
                {detailModal.orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-3 text-gray-500">
                      Không có sản phẩm nào!
                    </td>
                  </tr>
                ) : (
                  detailModal.orders.map((order, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{order.imei}</td>
                      <td className="border p-2">{order.product_name}</td>
                      <td className="border p-2 text-right">{Number(order.price_sell).toLocaleString()}đ</td>
                      <td className="border p-2">{order.sold_date?.slice(0,10)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CongNo;

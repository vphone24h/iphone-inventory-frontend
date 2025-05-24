import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";

function CongNo() {
  const [debts, setDebts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payAmount, setPayAmount] = useState({});
  const [addAmount, setAddAmount] = useState({});
  const [customerPhone, setCustomerPhone] = useState("");
  const [historyModal, setHistoryModal] = useState({open: false, history: []});

  // Lấy danh sách khách hàng còn nợ
  const fetchDebts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-list`);
    const data = await res.json();
    setDebts(data.items || []);
  };

  // Xem chi tiết từng khách
  const handleSelectCustomer = async (customer_name) => {
    setSelectedCustomer(customer_name);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-orders?customer_name=${encodeURIComponent(customer_name)}`);
    const data = await res.json();
    setOrders(data.orders || []);
    if (data.orders && data.orders.length > 0) {
      setCustomerPhone(data.orders[0].customer_phone || "");
    } else {
      setCustomerPhone("");
    }
    setPayAmount({});
    setAddAmount({});
  };

  // Trừ nợ từng đơn (theo id)
  const handlePayDebt = async (orderId) => {
    if (!payAmount[orderId] || isNaN(payAmount[orderId])) return alert("Nhập số tiền muốn trả");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-pay/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: payAmount[orderId] }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Đã cập nhật công nợ!");
      setPayAmount((prev) => ({ ...prev, [orderId]: "" }));
      handleSelectCustomer(selectedCustomer);
      fetchDebts();
    } else {
      alert("❌ " + (data.message || "Cập nhật công nợ thất bại!"));
    }
  };

  // Cộng thêm nợ
  const handleAddDebt = async (orderId) => {
    if (!addAmount[orderId] || isNaN(addAmount[orderId])) return alert("Nhập số tiền muốn cộng nợ");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-add/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: addAmount[orderId] }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Đã cộng thêm nợ!");
      setAddAmount((prev) => ({ ...prev, [orderId]: "" }));
      handleSelectCustomer(selectedCustomer);
      fetchDebts();
    } else {
      alert("❌ " + (data.message || "Cộng nợ thất bại!"));
    }
  };

  // Lịch sử trả/cộng nợ
  const handleShowHistory = (history) => {
    setHistoryModal({open: true, history: history || []});
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
        Công nợ khách hàng
      </h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Danh sách khách còn công nợ:</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Khách hàng</th>
              <th className="border p-2">Số tiền nợ</th>
              <th className="border p-2">Xem chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {debts.map((debt, i) => (
              <tr key={i}>
                <td className="border p-2">{debt.customer_name}</td>
                <td className="border p-2 text-right text-red-600 font-bold">{Number(debt.total_debt).toLocaleString()}đ</td>
                <td className="border p-2 text-center">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => handleSelectCustomer(debt.customer_name)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
            {debts.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-3 text-gray-500">
                  Không có công nợ nào!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold">
                Công nợ của: <span className="text-blue-700">{selectedCustomer}</span>
                {customerPhone && (
                  <span className="ml-4 text-gray-700">
                    | SĐT: <b className="text-green-700">{customerPhone}</b>
                  </span>
                )}
              </h3>
            </div>
            {/* Nút quay lại Xuất hàng */}
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded ml-3"
              onClick={() => window.location.href = "/xuat-hang"}
            >
              ← Quay lại Xuất hàng
            </button>
          </div>
          <button
            className="mb-2 text-sm text-gray-500 underline"
            onClick={() => {
              setSelectedCustomer(null);
              setOrders([]);
              setCustomerPhone("");
            }}
          >
            ← Quay lại danh sách nợ
          </button>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">IMEI</th>
                <th className="border p-2">Sản phẩm</th>
                <th className="border p-2">Giá bán</th>
                <th className="border p-2">Đã trả</th>
                <th className="border p-2">Còn nợ</th>
                <th className="border p-2">Ngày bán</th>
                <th className="border p-2">Thao tác</th>
                <th className="border p-2">Lịch sử</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="border p-2">{order.imei}</td>
                  <td className="border p-2">{order.product_name}</td>
                  <td className="border p-2 text-right">{Number(order.price_sell).toLocaleString()}đ</td>
                  <td className="border p-2 text-right">{Number(order.da_tra || 0).toLocaleString()}đ</td>
                  <td className="border p-2 text-right text-red-600">{Number(order.debt).toLocaleString()}đ</td>
                  <td className="border p-2">{order.sold_date?.slice(0,10)}</td>
                  <td className="border p-2">
                    <div className="flex flex-col gap-1">
                      {/* Trừ nợ */}
                      {Number(order.debt) > 0 && (
                        <div className="flex gap-1 items-center">
                          <input
                            type="number"
                            min="0"
                            placeholder="Trả nợ"
                            className="border rounded px-2 py-1 w-20"
                            value={payAmount[order._id] || ""}
                            onChange={e =>
                              setPayAmount((prev) => ({
                                ...prev,
                                [order._id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            className="bg-green-600 text-white px-2 py-1 rounded"
                            onClick={() => handlePayDebt(order._id)}
                          >
                            Trừ nợ
                          </button>
                        </div>
                      )}
                      {/* Cộng nợ */}
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          min="0"
                          placeholder="Cộng nợ"
                          className="border rounded px-2 py-1 w-20"
                          value={addAmount[order._id] || ""}
                          onChange={e =>
                            setAddAmount((prev) => ({
                              ...prev,
                              [order._id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleAddDebt(order._id)}
                        >
                          + Nợ
                        </button>
                      </div>
                      {/* Trạng thái thanh toán */}
                      {Number(order.debt) === 0 && (
                        <span className="text-green-600">Đã thanh toán</span>
                      )}
                    </div>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-gray-300 text-black px-2 py-1 rounded"
                      onClick={() => handleShowHistory(order.debt_history)}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Không có đơn còn nợ!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal lịch sử trả/cộng nợ */}
      {historyModal.open && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px] max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-lg"
              onClick={() => setHistoryModal({open: false, history: []})}
            >✖</button>
            <h3 className="text-lg font-bold mb-3">Lịch sử trả/cộng nợ</h3>
            <ul className="space-y-2">
              {historyModal.history && historyModal.history.length > 0 ? (
                historyModal.history.map((item, idx) => (
                  <li key={idx} className={`p-2 rounded ${item.type === "add" ? "bg-red-100" : "bg-green-100"}`}>
                    <b>{item.type === "add" ? "Cộng nợ" : "Trả nợ"}:</b> {Number(item.amount).toLocaleString()}đ
                    <span className="ml-2 text-xs text-gray-500">{item.date ? (item.date.slice(0,10) + " " + item.date.slice(11,19)) : ""}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">Chưa có lịch sử trả/cộng nợ.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default CongNo;

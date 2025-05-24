import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";

function CongNo() {
  const [debts, setDebts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payAmount, setPayAmount] = useState("");

  // Lấy danh sách khách hàng còn nợ
  const fetchDebts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-list`);
    const data = await res.json();
    setDebts(data.items || []);
  };

  // Xem chi tiết từng khách
  const handleSelectCustomer = async (customer_name) => {
    setSelectedCustomer(customer_name);
    // Lấy danh sách đơn còn nợ của khách này
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-orders?customer_name=${encodeURIComponent(customer_name)}`);
    const data = await res.json();
    setOrders(data.orders || []);
  };

  // Cập nhật/trả nợ cho khách này
  const handlePayDebt = async (orderId) => {
    if (!payAmount || isNaN(payAmount)) return alert("Nhập số tiền muốn trả");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cong-no/cong-no-pay/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: payAmount }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Đã cập nhật công nợ!");
      setPayAmount("");
      handleSelectCustomer(selectedCustomer);
      fetchDebts();
    } else {
      alert("❌ " + (data.message || "Cập nhật công nợ thất bại!"));
    }
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
          <h3 className="font-semibold mb-2">
            Công nợ của: <span className="text-blue-700">{selectedCustomer}</span>
          </h3>
          <button
            className="mb-2 text-sm text-gray-500 underline"
            onClick={() => {
              setSelectedCustomer(null);
              setOrders([]);
            }}
          >
            ← Quay lại
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
                <th className="border p-2">Trả nợ</th>
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
                    {Number(order.debt) > 0 ? (
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          min="0"
                          className="border rounded px-2 py-1 w-20"
                          value={payAmount}
                          onChange={e => setPayAmount(e.target.value)}
                        />
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => handlePayDebt(order._id)}
                        >
                          Trừ nợ
                        </button>
                      </div>
                    ) : (
                      <span className="text-green-600">Đã thanh toán</span>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    Không có đơn còn nợ!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CongNo;

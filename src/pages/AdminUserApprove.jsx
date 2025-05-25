import { useEffect, useState } from "react";

function AdminUserApprove() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/pending-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi khi lấy danh sách: ${res.statusText}`);
        }

        const data = await res.json();
        setUsers(data.users || data); // tùy backend trả data thế nào
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/approve-user/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Duyệt user lỗi: ${res.statusText}`);
      }

      setUsers((users) => users.filter((u) => u._id !== id));
      alert("Đã duyệt user!");
    } catch (err) {
      alert(err.message || "Lỗi không xác định khi duyệt user");
    }
  };

  if (loading) return <div>Đang tải danh sách user...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;

  return (
    <div style={{ padding: 30 }}>
      <h2>Danh sách user chờ duyệt</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Duyệt</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                Không có user nào cần duyệt
              </td>
            </tr>
          )}
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>
                <button onClick={() => handleApprove(u._id)}>Duyệt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserApprove;

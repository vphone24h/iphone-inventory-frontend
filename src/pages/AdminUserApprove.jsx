import { useEffect, useState } from "react";

function AdminUserApprove() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/pending-users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const handleApprove = async (id) => {
    await fetch(`/api/approve-user/${id}`, { method: "POST" });
    setUsers(users => users.filter(u => u._id !== id));
    alert("Đã duyệt user!");
  };

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
          {users.map(u => (
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

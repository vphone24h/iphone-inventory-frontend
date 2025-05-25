function NotAuthorized() {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>Bạn không có quyền truy cập trang này.</h1>
      <p>Vui lòng liên hệ quản trị viên để được cấp quyền.</p>
    </div>
  );
}

export default NotAuthorized;

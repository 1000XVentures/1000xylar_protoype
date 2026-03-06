import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main
        style={{
          marginLeft: 220,
          flex: 1,
          padding: 40,
          backgroundColor: "var(--bg)",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

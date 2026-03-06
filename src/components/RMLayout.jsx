import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function RMLayout() {
  const navigate = useNavigate();
  const { user, logout } = useApp();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      {/* Top Nav */}
      <header
        style={{
          height: 56,
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          gap: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Wordmark */}
        <button
          onClick={() => navigate("/rm/clients")}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: 18,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginRight: 40,
          }}
        >
          Xylar
        </button>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: 8, flex: 1 }}>
          {[
            { label: "My Clients", path: "/rm/clients" },
            { label: "Sessions", path: "/rm/sessions" },
          ].map((item) => (
            <RMNavLink key={item.path} path={item.path} label={item.label} />
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            className="btn-primary"
            style={{ height: 34, padding: "0 18px", fontSize: 13 }}
            onClick={() => navigate("/home")}
          >
            Start Demo
          </button>
          <span
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            {user?.name}
          </span>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: "var(--accent-light)",
              color: "var(--accent)",
              fontFamily: '"Inter", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {user?.initials}
          </div>
          <button
            onClick={logout}
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 12,
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <div style={{ padding: "36px 40px" }}>
        <Outlet />
      </div>
    </div>
  );
}

function RMNavLink({ path, label }) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname.startsWith(path);
  return (
    <button
      onClick={() => navigate(path)}
      style={{
        fontFamily: '"Inter", sans-serif',
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        color: active ? "var(--accent)" : "var(--text-secondary)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 12px",
        borderRadius: "var(--radius)",
        transition: "color 0.12s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = "var(--text-secondary)";
      }}
    >
      {label}
    </button>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
    ),
  },
  {
    label: "Relationship Managers",
    path: "/admin/rms",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="11" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M9.5 11.5c0-1.5 1-2.8 2.3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: "Clients",
    path: "/admin/clients",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="4.5" r="2.8" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M1.5 12.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: "Sessions",
    path: "/admin/sessions",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: "Portfolios",
    path: "/admin/portfolios",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M5 5V3.5A1.5 1.5 0 0 1 6.5 2h1A1.5 1.5 0 0 1 9 3.5V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.5 2.5l1 1M10.5 10.5l1 1M11.5 2.5l-1 1M3.5 10.5l-1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();

  function isActive(path) {
    if (path === "/admin/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  }

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      {/* Wordmark */}
      <div style={{ padding: "24px 20px 0", display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: 18,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          Xylar
        </span>
        <span
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 9,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--accent)",
            marginLeft: 8,
            marginTop: 2,
          }}
        >
          Admin
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ marginTop: 32, flex: 1, padding: "0 10px" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 10px",
                borderRadius: "var(--radius)",
                border: "none",
                cursor: "pointer",
                fontFamily: '"Inter", sans-serif',
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? "var(--accent)" : "var(--text-secondary)",
                backgroundColor: active ? "var(--accent-light)" : "transparent",
                textAlign: "left",
                transition: "background-color 0.12s ease, color 0.12s ease",
                marginBottom: 2,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "var(--accent-light)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <span style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User info + sign out */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "var(--accent-light)",
              color: "var(--accent)",
              fontFamily: '"Inter", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {user?.initials ?? "XA"}
          </div>
          <div>
            <div
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-primary)",
                lineHeight: 1.3,
              }}
            >
              {user?.name ?? "Xylar Admin"}
            </div>
            <button
              onClick={logout}
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 11,
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

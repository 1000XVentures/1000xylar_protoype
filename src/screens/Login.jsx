import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TrustStrip from "../components/TrustStrip";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  function handleLogin(id, password) {
    const found = login(id, password);
    if (!found) return;
    if (found.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/home");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          padding: "40px 40px 36px",
        }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: 32,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Xylar
          </div>
          <div
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 11,
              fontWeight: 500,
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            MMP Demo Portal
          </div>
        </div>

        {/* Trust strip */}
        <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 20, marginBottom: 28 }}>
          <TrustStrip />
        </div>

        {/* Login buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            className="btn-primary"
            style={{ width: "100%", height: 48, fontSize: 14 }}
            onClick={() => handleLogin("RM-00001", "xylar2026")}
          >
            Continue as Relationship Manager
          </button>

          <button
            onClick={() => handleLogin("ADMIN-001", "xylar@admin2026")}
            style={{
              width: "100%",
              height: 48,
              fontSize: 14,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              color: "var(--text-secondary)",
              backgroundColor: "var(--surface-muted)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-muted)")}
          >
            Continue as Admin
          </button>
        </div>
      </div>

      <p
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 11,
          color: "var(--text-muted)",
          textAlign: "center",
          maxWidth: 400,
          marginTop: 24,
          lineHeight: 1.6,
        }}
      >
        Xylar operates under RBI's Account Aggregator (AA) framework. Client data never leaves the consent boundary.
      </p>
    </div>
  );
}

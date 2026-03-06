import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Nav() {
  const navigate = useNavigate();
  const { session, selectedPortfolio, setSelectedPortfolio } = useApp();

  function handleChange() {
    setSelectedPortfolio(null);
    navigate("/onboarding");
  }

  return (
    <nav
      className="no-print"
      style={{
        height: 56,
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        flexShrink: 0,
      }}
    >
      {/* Left: wordmark */}
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          fontSize: 18,
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
          cursor: "pointer",
        }}
        onClick={() => navigate("/home")}
      >
        Xylar
      </div>

      {/* Centre: breadcrumb */}
      <div
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 12,
          color: "var(--text-muted)",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        MF Intelligence{" "}
        <span style={{ margin: "0 4px" }}>→</span>
        Portfolio Analysis
      </div>

      {/* Right: portfolio chip + change + separator + RM name */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {selectedPortfolio && (
          <>
            <div
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 12,
                fontWeight: 500,
                color: "var(--accent)",
                backgroundColor: "var(--accent-light)",
                border: "1px solid rgba(44,74,110,0.2)",
                borderRadius: 20,
                padding: "4px 12px",
              }}
            >
              {selectedPortfolio.label}
            </div>
            <button
              onClick={handleChange}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: '"Inter", sans-serif',
                fontSize: 12,
                color: "var(--accent)",
                padding: 0,
              }}
            >
              Change
            </button>
            <div style={{ width: 1, height: 18, backgroundColor: "var(--border)" }} />
          </>
        )}
        <span
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          {session?.name}
        </span>
      </div>
    </nav>
  );
}

import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ACT_ROUTES = ["/insights", "/analysis", "/replay", "/portfolio", "/memo"];

export default function TopNav({ actNumber }) {
  const navigate = useNavigate();
  const { session, selectedPortfolio, setSelectedPortfolio, logout } = useApp();

  function handleEndSession() {
    logout();
    navigate("/login");
  }

  function handleChange() {
    setSelectedPortfolio(null);
    navigate("/onboarding");
  }

  const act = actNumber ?? null;

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
        position: "relative",
      }}
    >
      {/* Left: wordmark */}
      <div
        onClick={() => navigate("/home")}
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          fontSize: 18,
          color: "var(--text-primary)",
          cursor: "pointer",
          letterSpacing: "-0.01em",
          flexShrink: 0,
        }}
      >
        Xylar
      </div>

      {/* Centre: Act indicator */}
      {act && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 11,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
            }}
          >
            Act {act} of 4
          </div>
          {/* 4-segment progress strip */}
          <div style={{ display: "flex", gap: 3 }}>
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  width: 20,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: n <= act ? "var(--accent)" : "var(--accent-light)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {!act && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: '"Inter", sans-serif',
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          {selectedPortfolio ? "Select Portfolio" : ""}
        </div>
      )}

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
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
                padding: "3px 10px",
                maxWidth: 160,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
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
            <div style={{ width: 1, height: 16, backgroundColor: "var(--border)" }} />
          </>
        )}

        {/* RM initials */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "var(--accent-light)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: '"Inter", sans-serif',
            fontSize: 11,
            fontWeight: 600,
            color: "var(--accent)",
            flexShrink: 0,
          }}
        >
          {session?.initials ?? "RM"}
        </div>

        <button
          onClick={handleEndSession}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: '"Inter", sans-serif',
            fontSize: 12,
            color: "var(--text-muted)",
            padding: 0,
          }}
        >
          End session
        </button>
      </div>
    </nav>
  );
}

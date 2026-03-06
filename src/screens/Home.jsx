import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TrustStrip from "../components/TrustStrip";

export default function Home() {
  const navigate = useNavigate();
  const { session, logout } = useApp();

  const firstName = session?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ height: 56, backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", flexShrink: 0 }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Xylar</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{session?.name}</span>
          <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "var(--accent-light)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>
            {session?.initials}
          </div>
          <div style={{ width: 1, height: 18, backgroundColor: "var(--border)" }} />
          <button onClick={() => { logout(); navigate("/login"); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", padding: 0 }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px 80px" }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: 40, color: "var(--text-primary)", margin: 0, textAlign: "center" }}>
          {greeting}, {firstName}.
        </h1>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: "var(--text-muted)", marginTop: 8, marginBottom: 0, textAlign: "center" }}>
          Ready to begin a client session.
        </p>

        <div style={{ marginTop: 48, width: "100%", maxWidth: 480 }}>
          <button
            onClick={() => navigate("/onboarding")}
            style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", transition: "background-color 0.15s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--surface)")}
          >
            <div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>New Client Session</div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)" }}>Select a portfolio and walk through the full analysis.</div>
            </div>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 18, color: "var(--text-secondary)", flexShrink: 0, marginLeft: 20 }}>→</span>
          </button>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 12 }}>
            10 demo sessions available this month
          </p>
        </div>
      </div>

      <div style={{ padding: "0 40px 32px", display: "flex", justifyContent: "center" }}>
        <TrustStrip />
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function RMSessions() {
  const navigate = useNavigate();
  const { sessions, clients, user, setSelectedClient, setSelectedPortfolio } = useApp();

  const mySessions = [...sessions.filter((s) => s.rm_id === user?.id)].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  function getClient(cid) {
    return clients.find((c) => c.id === cid);
  }

  function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
        My Sessions
      </h1>
      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}>
        Your demo session history
      </p>

      {mySessions.length === 0 ? (
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 48, textAlign: "center" }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: "var(--text-muted)" }}>
            No sessions yet. Start a demo from your client list.
          </div>
          <button className="btn-primary" style={{ height: 40, padding: "0 20px", fontSize: 13, marginTop: 20 }} onClick={() => navigate("/rm/clients")}>
            Go to My Clients
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mySessions.map((s) => {
            const client = getClient(s.client_id);
            return (
              <div
                key={s.id}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                    {client?.name ?? "Unknown Client"}
                    {s.pdf_exported && (
                      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 9, textTransform: "uppercase", color: "var(--positive)", backgroundColor: "var(--positive-light)", padding: "2px 6px", borderRadius: 2 }}>
                        PDF
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", marginTop: 4, display: "flex", gap: 16 }}>
                    <span style={{ textTransform: "capitalize" }}>{s.portfolio_used}</span>
                    <span>{fmtDate(s.date)}</span>
                    <span>{s.duration_minutes ?? 0}min</span>
                    <span>{s.acts_completed ?? 0} of 4 acts</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (client) {
                      setSelectedClient(client);
                      if (s.portfolio_used) setSelectedPortfolio({ id: s.portfolio_used });
                    }
                    navigate("/home");
                  }}
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: 12,
                    color: "var(--accent)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  Replay
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

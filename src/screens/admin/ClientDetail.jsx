import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

function StatCard({ label, value }) {
  return (
    <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, flex: 1 }}>
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

function ActDots({ completed, total = 4 }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: i < completed ? "var(--accent)" : "var(--border)",
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

export default function AdminClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, rms, setSelectedClient, setSelectedPortfolio } = useApp();

  const client = clients.find((c) => c.id === id);
  if (!client) {
    return (
      <div>
        <button onClick={() => navigate("/admin/clients")} style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}>
          ← Client Profiles
        </button>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)" }}>Client not found.</p>
      </div>
    );
  }

  const rm = rms.find((r) => r.id === client.rm_id);
  const sessions = [...(client.sessions ?? [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const pdfs = sessions.filter((s) => s.pdf_exported).length;
  const lastSession = sessions[0];

  function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/clients")}
        style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 24 }}
      >
        ← Client Profiles
      </button>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 600, color: "var(--text-primary)" }}>
          {client.name}
        </h1>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", marginTop: 6, display: "flex", gap: 16 }}>
          <span>Managed by {rm?.name ?? client.rm_id}</span>
          <span>Joined {fmtDate(client.created_at)}</span>
          {client.phone && <span>{client.phone}</span>}
          {client.email && <span>{client.email}</span>}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        <StatCard label="Sessions" value={sessions.length} />
        <StatCard label="PDFs Exported" value={pdfs} />
        <StatCard label="Last Active" value={lastSession ? fmtDate(lastSession.date) : "—"} />
      </div>

      {/* Client details */}
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 24 }}>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Client Details</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}>
          {[
            ["Phone", client.phone || "—"],
            ["Email", client.email || "—"],
            ["Notes", client.notes || "—"],
            ["Preferred Portfolio", client.preferred_portfolio || "TBD"],
          ].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)" }}>
                {label === "Preferred Portfolio" && client.preferred_portfolio ? (
                  <span style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)", padding: "3px 8px", borderRadius: 3, fontSize: 11, textTransform: "capitalize" }}>
                    {val}
                  </span>
                ) : val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session history */}
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600 }}>
          Session History
        </div>

        {sessions.length === 0 ? (
          <div style={{ padding: 24, fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)" }}>
            No sessions yet.
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr 100px 80px 80px", padding: "10px 24px", backgroundColor: "var(--surface-muted)", borderBottom: "1px solid var(--border)" }}>
              {["Date", "Portfolio", "Acts", "Duration", "PDF", ""].map((h) => (
                <div key={h} style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{h}</div>
              ))}
            </div>
            {sessions.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr 1fr 100px 80px 80px",
                  padding: "14px 24px",
                  borderBottom: i < sessions.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "center",
                }}
              >
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13 }}>{fmtDate(s.date)}</div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, textTransform: "capitalize" }}>{s.portfolio_used}</div>
                <div><ActDots completed={s.acts_completed} /></div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)" }}>{s.duration_minutes}min</div>
                <div>
                  {s.pdf_exported ? (
                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--positive)", fontWeight: 600 }}>✓</span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  )}
                </div>
                <div />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Start demo */}
      <button
        className="btn-primary"
        style={{ width: "100%", height: 44 }}
        onClick={() => {
          setSelectedClient(client);
          if (client.preferred_portfolio) setSelectedPortfolio({ id: client.preferred_portfolio });
          navigate("/home");
        }}
      >
        Start Demo →
      </button>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../../context/AppContext";

function ActDots({ completed, total = 4 }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
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

export default function AdminSessions() {
  const { sessions, clients, rms } = useApp();

  const [filterRm, setFilterRm] = useState("all");
  const [filterPortfolio, setFilterPortfolio] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  function getClientName(cid) {
    return clients.find((c) => c.id === cid)?.name ?? "Unknown";
  }

  function getRmName(rmId) {
    return rms.find((r) => r.id === rmId)?.name ?? rmId;
  }

  function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  const filtered = sessions.filter((s) => {
    if (filterRm !== "all" && s.rm_id !== filterRm) return false;
    if (filterPortfolio !== "all" && s.portfolio_used !== filterPortfolio) return false;
    if (fromDate && s.date < fromDate) return false;
    if (toDate && s.date > toDate) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPdfs = filtered.filter((s) => s.pdf_exported).length;
  const avgDuration = filtered.length
    ? Math.round(filtered.reduce((acc, s) => acc + (s.duration_minutes ?? 0), 0) / filtered.length)
    : 0;

  const allPortfolios = [...new Set(sessions.map((s) => s.portfolio_used).filter(Boolean))];

  return (
    <div>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--text-primary)" }}>
          Session Log
        </h1>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
          All demo sessions across all RMs
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
        <select
          value={filterRm}
          onChange={(e) => setFilterRm(e.target.value)}
          style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "8px 14px", fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)", backgroundColor: "var(--surface)", outline: "none", cursor: "pointer" }}
        >
          <option value="all">All RMs</option>
          {rms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <select
          value={filterPortfolio}
          onChange={(e) => setFilterPortfolio(e.target.value)}
          style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "8px 14px", fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)", backgroundColor: "var(--surface)", outline: "none", cursor: "pointer" }}
        >
          <option value="all">All Portfolios</option>
          {allPortfolios.map((p) => <option key={p} value={p} style={{ textTransform: "capitalize" }}>{p}</option>)}
        </select>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "8px 14px", fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)", backgroundColor: "var(--surface)", outline: "none" }} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "8px 14px", fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)", backgroundColor: "var(--surface)", outline: "none" }} />
      </div>

      {/* Stat strip */}
      <div style={{ display: "flex", gap: 32, marginTop: 24, fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)" }}>
        <span><strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong> Total Sessions</span>
        <span><strong style={{ color: "var(--text-primary)" }}>{totalPdfs}</strong> PDFs Exported</span>
        <span><strong style={{ color: "var(--text-primary)" }}>{avgDuration}min</strong> Avg Duration</span>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginTop: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1.5fr 1.2fr 120px 80px 80px",
            padding: "12px 20px",
            backgroundColor: "var(--surface-muted)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["Date", "RM", "Client", "Portfolio", "Acts", "Duration", "PDF"].map((h) => (
            <div key={h} style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{h}</div>
          ))}
        </div>

        {sorted.map((s, i) => (
          <div
            key={s.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr 1.5fr 1.2fr 120px 80px 80px",
              padding: "14px 20px",
              borderBottom: i < sorted.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center",
            }}
          >
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13 }}>{fmtDate(s.date)}</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)" }}>{getRmName(s.rm_id)}</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500 }}>{getClientName(s.client_id)}</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, textTransform: "capitalize", color: "var(--text-secondary)" }}>{s.portfolio_used}</div>
            <div><ActDots completed={s.acts_completed ?? 0} /></div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)" }}>{s.duration_minutes ?? 0}min</div>
            <div>
              {s.pdf_exported ? (
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 9, textTransform: "uppercase", color: "var(--positive)", backgroundColor: "var(--positive-light)", padding: "2px 6px", borderRadius: 2 }}>
                  PDF
                </span>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>—</span>
              )}
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div style={{ padding: "32px 20px", fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)" }}>
            No sessions match the filters.
          </div>
        )}
      </div>
    </div>
  );
}

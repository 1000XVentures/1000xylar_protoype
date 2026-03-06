import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function AdminClientList() {
  const navigate = useNavigate();
  const { clients, rms } = useApp();

  const [search, setSearch] = useState("");
  const [filterRm, setFilterRm] = useState("all");

  function getRmName(rmId) {
    return rms.find((r) => r.id === rmId)?.name ?? rmId;
  }

  function lastSession(c) {
    if (!c.sessions || c.sessions.length === 0) return null;
    return [...c.sessions].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }

  function fmtDate(d) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchRm = filterRm === "all" || c.rm_id === filterRm;
    return matchSearch && matchRm;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--text-primary)" }}>
            Client Profiles
          </h1>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
            All clients across all Relationship Managers
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ height: 40, padding: "0 20px", fontSize: 13 }}
          onClick={() => navigate("/admin/clients/new")}
        >
          + Add Client
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <input
          type="text"
          className="input-field"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240, height: 38 }}
        />
        <select
          value={filterRm}
          onChange={(e) => setFilterRm(e.target.value)}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "8px 14px",
            fontFamily: '"Inter", sans-serif',
            fontSize: 13,
            color: "var(--text-primary)",
            backgroundColor: "var(--surface)",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="all">All RMs</option>
          {rms.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginTop: 24,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1.5fr 80px 1.5fr 80px",
            padding: "12px 20px",
            backgroundColor: "var(--surface-muted)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["Name", "RM", "Preferred Portfolio", "Sessions", "Last Session", "Actions"].map((h) => (
            <div key={h} style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
              {h}
            </div>
          ))}
        </div>

        {filtered.map((c, i) => {
          const ls = lastSession(c);
          return (
            <div
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1.5fr 80px 1.5fr 80px",
                padding: "16px 20px",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
                alignItems: "center",
                transition: "background-color 0.1s ease",
              }}
              onClick={() => navigate(`/admin/clients/${c.id}`)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)" }}>{getRmName(c.rm_id)}</div>
              <div>
                {c.preferred_portfolio ? (
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, backgroundColor: "var(--accent-light)", color: "var(--accent)", padding: "3px 8px", borderRadius: 3, textTransform: "capitalize" }}>
                    {c.preferred_portfolio}
                  </span>
                ) : (
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>TBD</span>
                )}
              </div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, textAlign: "center" }}>{c.sessions?.length ?? 0}</div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)" }}>
                {ls ? fmtDate(ls.date) : "No sessions"}
              </div>
              <div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/admin/clients/${c.id}`); }}
                  style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  View
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: "32px 20px", fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)" }}>
            No clients found.
          </div>
        )}
      </div>
    </div>
  );
}

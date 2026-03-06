import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function RMClients() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clients, user, setSelectedClient, setSelectedPortfolio } = useApp();

  const myClients = clients.filter((c) => c.rm_id === user?.id);
  const success = location.state?.created;

  function fmtDate(d) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function lastSession(c) {
    if (!c.sessions || c.sessions.length === 0) return null;
    return [...c.sessions].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }

  return (
    <div>
      {/* Success message */}
      {success && (
        <div style={{ backgroundColor: "var(--positive-light)", borderLeft: "3px solid var(--positive)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 20, fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--positive)" }}>
          Client "{success}" added successfully.
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--text-primary)" }}>My Clients</h1>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Client profiles you have added</p>
        </div>
        <button className="btn-primary" style={{ height: 40, padding: "0 20px", fontSize: 13 }} onClick={() => navigate("/rm/clients/new")}>
          + Add Client
        </button>
      </div>

      {myClients.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>No clients yet.</div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Add your first client to get started.</div>
          <button className="btn-primary" style={{ height: 40, padding: "0 20px", fontSize: 13 }} onClick={() => navigate("/rm/clients/new")}>
            + Add Client
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {myClients.map((c) => {
            const ls = lastSession(c);
            const notesPreview = c.notes ? (c.notes.length > 60 ? c.notes.slice(0, 60) + "…" : c.notes) : "";
            return (
              <div
                key={c.id}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: 24,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ display: "flex", gap: 14, flex: 1 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-light)",
                      color: "var(--accent)",
                      fontFamily: '"Inter", sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                      {c.name}
                    </div>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {c.preferred_portfolio ? `Prefers ${c.preferred_portfolio}` : "Portfolio TBD"}
                    </div>
                    {notesPreview && (
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                        {notesPreview}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0, marginLeft: 20 }}>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)" }}>
                    {c.sessions?.length ?? 0} session{(c.sessions?.length ?? 0) !== 1 ? "s" : ""}
                  </div>
                  {ls && (
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>
                      Last: {fmtDate(ls.date)}
                    </div>
                  )}
                  <button
                    className="btn-primary"
                    style={{ height: 34, padding: "0 16px", fontSize: 13, marginTop: 4 }}
                    onClick={() => {
                      setSelectedClient(c);
                      if (c.preferred_portfolio) setSelectedPortfolio({ id: c.preferred_portfolio });
                      navigate("/home");
                    }}
                  >
                    Start Demo →
                  </button>
                  <button
                    style={{
                      height: 28,
                      padding: "0 12px",
                      fontSize: 12,
                      fontFamily: '"Inter", sans-serif',
                      color: "var(--text-secondary)",
                      backgroundColor: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/rm/clients/${c.id}`)}
                  >
                    View History
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

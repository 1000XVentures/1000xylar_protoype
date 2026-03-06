import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import appSettings from "../../data/appSettings.json";

function StatCard({ label, value, sub }) {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        flex: 1,
      }}
    >
      <div
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 10,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 32,
          fontWeight: 600,
          color: "var(--text-primary)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 12,
          color: "var(--text-secondary)",
          marginTop: 6,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { rms, clients, sessions } = useApp();

  const pdfCount = sessions.filter((s) => s.pdf_exported).length;
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const sessionsPct = Math.round(
    (appSettings.sessions_used / appSettings.total_demo_sessions_allowed) * 100
  );

  function getClientName(clientId) {
    const c = clients.find((x) => x.id === clientId);
    return c ? c.name : "Unknown";
  }

  function getRmName(rmId) {
    const r = rms.find((x) => x.id === rmId);
    return r ? r.name : rmId;
  }

  function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div>
      {/* Header */}
      <div>
        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 28,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Good morning, Xylar Admin.
        </h1>
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 6,
          }}
        >
          MMP Demo Operations · {appSettings.product_version} · Launch:{" "}
          {fmtDate(appSettings.launch_date)}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
        <StatCard label="Active RMs" value={rms.filter((r) => r.status === "active").length} sub="Across all demo sessions" />
        <StatCard label="Client Profiles" value={clients.length} sub="Added by RMs" />
        <StatCard label="Sessions Run" value={sessions.length} sub={`of ${appSettings.total_demo_sessions_allowed} allowed`} />
        <StatCard label="PDFs Exported" value={pdfCount} sub="Delivered to clients" />
      </div>

      {/* Usage bar */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
          marginTop: 32,
        }}
      >
        <div
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Demo Session Usage
        </div>
        <div
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 12,
            color: "var(--text-secondary)",
            marginTop: 4,
            marginBottom: 14,
          }}
        >
          {sessions.length} of {appSettings.total_demo_sessions_allowed} sessions
          used · {appSettings.total_demo_sessions_allowed - sessions.length} remaining before April 1st
        </div>
        <div
          style={{
            width: "100%",
            height: 6,
            backgroundColor: "var(--border)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.round((sessions.length / appSettings.total_demo_sessions_allowed) * 100))}%`,
              height: "100%",
              backgroundColor: "var(--accent)",
              borderRadius: 3,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>
            {sessions.length} used
          </span>
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--positive)" }}>
            {appSettings.total_demo_sessions_allowed - sessions.length} remaining
          </span>
        </div>
      </div>

      {/* Two column section */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24, marginTop: 32 }}>
        {/* Recent sessions */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600 }}>
              Recent Sessions
            </span>
            <button
              onClick={() => navigate("/admin/sessions")}
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 12,
                color: "var(--accent)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              View all →
            </button>
          </div>

          {recentSessions.length === 0 ? (
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", marginTop: 16 }}>
              No sessions yet.
            </p>
          ) : (
            recentSessions.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "14px 0",
                  borderBottom: i < recentSessions.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500 }}>
                    {getClientName(s.client_id)}
                  </div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {getRmName(s.rm_id)} · {s.portfolio_used}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>
                    {fmtDate(s.date)}
                  </div>
                  {s.pdf_exported && (
                    <span
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: 9,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: "var(--positive)",
                        backgroundColor: "var(--positive-light)",
                        padding: "2px 6px",
                        borderRadius: 2,
                        display: "inline-block",
                        marginTop: 4,
                      }}
                    >
                      PDF
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* RM activity */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
          }}
        >
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            RM Activity
          </div>
          {rms.map((rm, i) => {
            const rmSessions = sessions.filter((s) => s.rm_id === rm.id);
            return (
              <div
                key={rm.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom: i < rms.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-light)",
                      color: "var(--accent)",
                      fontFamily: '"Inter", sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {rm.initials}
                  </div>
                  <div>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500 }}>
                      {rm.name}
                    </div>
                    <span
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: 9,
                        textTransform: "uppercase",
                        color: rm.status === "active" ? "var(--positive)" : "var(--text-muted)",
                        backgroundColor: rm.status === "active" ? "var(--positive-light)" : "var(--surface-muted)",
                        padding: "2px 6px",
                        borderRadius: 2,
                        display: "inline-block",
                      }}
                    >
                      {rm.status ?? "active"}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600 }}>
                    {rmSessions.length}
                  </div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>
                    sessions
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        <button
          className="btn-outline"
          style={{ height: 40, padding: "0 20px", fontSize: 13 }}
          onClick={() => navigate("/admin/rms/new")}
        >
          + Add RM
        </button>
        <button
          className="btn-outline"
          style={{ height: 40, padding: "0 20px", fontSize: 13 }}
          onClick={() => navigate("/admin/clients/new")}
        >
          + Add Client
        </button>
      </div>
    </div>
  );
}

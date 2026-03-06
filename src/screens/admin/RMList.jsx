import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function AdminRMList() {
  const navigate = useNavigate();
  const { rms, clients, sessions } = useApp();

  function rmClients(rmId) {
    return clients.filter((c) => c.rm_id === rmId).length;
  }

  function rmSessions(rmId) {
    return sessions.filter((s) => s.rm_id === rmId).length;
  }

  function rmPdfs(rmId) {
    return sessions.filter((s) => s.rm_id === rmId && s.pdf_exported).length;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--text-primary)" }}>
            Relationship Managers
          </h1>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
            Manage RM access and monitor demo activity
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ height: 40, padding: "0 20px", fontSize: 13 }}
          onClick={() => navigate("/admin/rms/new")}
        >
          + Add RM
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginTop: 32,
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.2fr 80px 80px 80px 100px 80px",
            padding: "12px 20px",
            backgroundColor: "var(--surface-muted)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["Name", "RM ID", "Clients", "Sessions", "PDFs", "Status", "Actions"].map((h) => (
            <div
              key={h}
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 10,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {rms.map((rm, i) => (
          <div
            key={rm.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 80px 80px 80px 100px 80px",
              padding: "16px 20px",
              borderBottom: i < rms.length - 1 ? "1px solid var(--border)" : "none",
              cursor: "pointer",
              transition: "background-color 0.1s ease",
              alignItems: "center",
            }}
            onClick={() => navigate(`/admin/rms/${rm.id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {/* Name */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-light)",
                  color: "var(--accent)",
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 10,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {rm.initials}
              </div>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500 }}>
                {rm.name}
              </span>
            </div>

            {/* RM ID */}
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)" }}>
              {rm.id}
            </div>

            {/* Clients */}
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, textAlign: "center" }}>
              {rmClients(rm.id)}
            </div>

            {/* Sessions */}
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, textAlign: "center" }}>
              {rmSessions(rm.id)}
            </div>

            {/* PDFs */}
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, textAlign: "center" }}>
              {rmPdfs(rm.id)}
            </div>

            {/* Status */}
            <div>
              <span
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: rm.status === "inactive" ? "var(--text-muted)" : "var(--positive)",
                  backgroundColor: rm.status === "inactive" ? "var(--surface-muted)" : "var(--positive-light)",
                  padding: "3px 8px",
                  borderRadius: 3,
                }}
              >
                {rm.status === "inactive" ? "Inactive" : "Active"}
              </span>
            </div>

            {/* Actions */}
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/rms/${rm.id}`);
                }}
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
                View
              </button>
            </div>
          </div>
        ))}

        {rms.length === 0 && (
          <div style={{ padding: "32px 20px", fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)" }}>
            No relationship managers yet.
          </div>
        )}
      </div>
    </div>
  );
}

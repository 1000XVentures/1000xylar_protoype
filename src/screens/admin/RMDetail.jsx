import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

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
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function AdminRMDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rms, clients, sessions, deactivateRm, setSelectedClient, setSelectedPortfolio } = useApp();

  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [deactivated, setDeactivated] = useState(false);

  const rm = rms.find((r) => r.id === id);
  if (!rm) {
    return (
      <div>
        <button onClick={() => navigate("/admin/rms")} style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}>
          ← Relationship Managers
        </button>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)" }}>RM not found.</p>
      </div>
    );
  }

  const rmClients = clients.filter((c) => c.rm_id === id);
  const rmSessions = sessions.filter((s) => s.rm_id === id);
  const rmPdfs = rmSessions.filter((s) => s.pdf_exported).length;
  const lastSession = [...rmSessions].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function getClientName(cid) {
    return clients.find((c) => c.id === cid)?.name ?? "Unknown";
  }

  function handleDeactivate() {
    deactivateRm(id);
    setDeactivated(true);
    setShowDeactivateConfirm(false);
  }

  function handlePasswordReset(e) {
    e.preventDefault();
    setPassError("");
    if (newPass.length < 8) { setPassError("Password must be at least 8 characters."); return; }
    if (newPass !== confirmPass) { setPassError("Passwords do not match."); return; }
    setPassSuccess(true);
    setShowResetForm(false);
    setNewPass("");
    setConfirmPass("");
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/rms")}
        style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 24 }}
      >
        ← Relationship Managers
      </button>

      {deactivated && (
        <div style={{ backgroundColor: "var(--warning-light)", border: "1px solid var(--warning)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 20, fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--warning)" }}>
          RM account has been deactivated.
        </div>
      )}

      {passSuccess && (
        <div style={{ backgroundColor: "var(--positive-light)", borderLeft: "3px solid var(--positive)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 20, fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--positive)" }}>
          Password has been reset successfully (demo only — no real auth).
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "var(--accent-light)",
            color: "var(--accent)",
            fontFamily: '"Inter", sans-serif',
            fontSize: 18,
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
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 600, color: "var(--text-primary)" }}>
            {rm.name}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)" }}>{rm.id}</span>
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: rm.status === "inactive" ? "var(--text-muted)" : "var(--positive)",
                backgroundColor: rm.status === "inactive" ? "var(--surface-muted)" : "var(--positive-light)",
                padding: "2px 6px",
                borderRadius: 2,
              }}
            >
              {rm.status === "inactive" ? "Inactive" : "Active"}
            </span>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)" }}>
              Joined {fmtDate(rm.joined)}
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        <StatCard label="Clients" value={rmClients.length} />
        <StatCard label="Sessions" value={rmSessions.length} />
        <StatCard label="PDFs Exported" value={rmPdfs} />
        <StatCard label="Last Active" value={lastSession ? fmtDate(lastSession.date) : "—"} />
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Clients */}
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600 }}>Clients</span>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, backgroundColor: "var(--accent-light)", color: "var(--accent)", padding: "2px 8px", borderRadius: 10 }}>
              {rmClients.length}
            </span>
          </div>
          {rmClients.length === 0 ? (
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)" }}>No clients assigned.</p>
          ) : (
            rmClients.map((c, i) => (
              <div
                key={c.id}
                style={{
                  padding: "12px 0",
                  borderBottom: i < rmClients.length - 1 ? "1px solid var(--border)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {c.preferred_portfolio ?? "Portfolio TBD"} · {c.sessions.length} session{c.sessions.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      setSelectedClient(c);
                      if (c.preferred_portfolio) setSelectedPortfolio({ id: c.preferred_portfolio });
                      navigate("/home");
                    }}
                    style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Start Demo
                  </button>
                  <button
                    onClick={() => navigate(`/admin/clients/${c.id}`)}
                    style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Session log */}
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24 }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Session Log</div>
          {rmSessions.length === 0 ? (
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)" }}>No sessions yet.</p>
          ) : (
            [...rmSessions].sort((a, b) => new Date(b.date) - new Date(a.date)).map((s, i, arr) => (
              <div
                key={s.id}
                style={{
                  padding: "12px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500 }}>{getClientName(s.client_id)}</div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {s.portfolio_used} · {s.duration_minutes}min
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>{fmtDate(s.date)}</div>
                  {s.pdf_exported && (
                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 9, textTransform: "uppercase", color: "var(--positive)", backgroundColor: "var(--positive-light)", padding: "2px 6px", borderRadius: 2, display: "inline-block", marginTop: 2 }}>
                      PDF
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Account management */}
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24 }}>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Account Settings</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => { setShowResetForm((v) => !v); setShowDeactivateConfirm(false); }}
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 13,
              color: "var(--warning)",
              backgroundColor: "transparent",
              border: "1px solid var(--warning)",
              borderRadius: "var(--radius)",
              padding: "9px 18px",
              cursor: "pointer",
            }}
          >
            Reset Password
          </button>
          <button
            onClick={() => { setShowDeactivateConfirm((v) => !v); setShowResetForm(false); }}
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 13,
              color: "var(--negative)",
              backgroundColor: "transparent",
              border: "1px solid var(--negative)",
              borderRadius: "var(--radius)",
              padding: "9px 18px",
              cursor: "pointer",
              opacity: rm.status === "inactive" ? 0.4 : 1,
            }}
            disabled={rm.status === "inactive"}
          >
            Deactivate RM
          </button>
        </div>

        {showResetForm && (
          <form onSubmit={handlePasswordReset} style={{ marginTop: 20, maxWidth: 400 }}>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">New Password</label>
              <input type="password" className="input-field" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Min 8 characters" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Confirm Password</label>
              <input type="password" className="input-field" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Repeat password" />
            </div>
            {passError && <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--negative)", marginBottom: 10 }}>{passError}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setShowResetForm(false)} style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "9px 16px" }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ height: 38, padding: "0 20px", fontSize: 13 }}>Save Password</button>
            </div>
          </form>
        )}

        {showDeactivateConfirm && (
          <div style={{ marginTop: 20, fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)" }}>
            This will prevent {rm.id} from logging in. Are you sure?{" "}
            <button onClick={() => setShowDeactivateConfirm(false)} style={{ color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", fontFamily: '"Inter", sans-serif', fontSize: 13, textDecoration: "underline" }}>Cancel</button>
            {" "}
            <button onClick={handleDeactivate} style={{ color: "var(--negative)", background: "none", border: "none", cursor: "pointer", fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, textDecoration: "underline" }}>Deactivate</button>
          </div>
        )}
      </div>
    </div>
  );
}

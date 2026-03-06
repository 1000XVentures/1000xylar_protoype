import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TrustStrip from "../components/TrustStrip";

function IconEye({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function Login() {
  const [rmId, setRmId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const found = login(rmId.trim(), password);
    if (!found) {
      setError("Incorrect credentials. Please try again.");
      return;
    }
    if (found.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/home");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          padding: "40px 40px 36px",
        }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: 32, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Xylar
          </div>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8 }}>
            Relationship Manager Portal
          </div>
        </div>

        {/* Trust strip inside card */}
        <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 20, marginBottom: 24 }}>
          <TrustStrip />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 18 }}>
            <label className="input-label" htmlFor="rmId">RM ID</label>
            <input id="rmId" type="text" className="input-field" placeholder="RM–00001" value={rmId} onChange={(e) => setRmId(e.target.value)} autoComplete="username" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="input-label" htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input id="password" type={showPassword ? "text" : "password"} className="input-field" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", color: "var(--text-muted)" }} aria-label={showPassword ? "Hide" : "Show"}>
                <IconEye open={showPassword} />
              </button>
            </div>
          </div>

          {error && (
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--negative)", marginBottom: 14, marginTop: -10 }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: "100%" }}>
            Continue
          </button>
        </form>
      </div>

      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", textAlign: "center", maxWidth: 400, marginTop: 24, lineHeight: 1.6 }}>
        Xylar operates under RBI's Account Aggregator (AA) framework. Client data never leaves the consent boundary.
      </p>
    </div>
  );
}

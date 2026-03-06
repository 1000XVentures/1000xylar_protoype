import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

function Field({ label, id, helper, error, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label className="input-label" htmlFor={id}>{label}</label>
      {children}
      {helper && !error && (
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 5 }}>{helper}</div>
      )}
      {error && (
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--negative)", marginTop: 5 }}>{error}</div>
      )}
    </div>
  );
}

export default function AdminRMNew() {
  const navigate = useNavigate();
  const { addRm, rms } = useApp();

  const [name, setName] = useState("");
  const [rmId, setRmId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [touched, setTouched] = useState({});

  function blur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  const errors = {};
  if (touched.name && name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (touched.rmId) {
    if (!/^RM-\d{5}$/.test(rmId)) errors.rmId = "Must match format RM-00000.";
    else if (rms.find((r) => r.id === rmId)) errors.rmId = "This RM ID is already taken.";
  }
  if (touched.password && password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (touched.confirmPass && confirmPass !== password) errors.confirmPass = "Passwords do not match.";

  const isValid =
    name.trim().length >= 2 &&
    /^RM-\d{5}$/.test(rmId) &&
    !rms.find((r) => r.id === rmId) &&
    password.length >= 8 &&
    confirmPass === password;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    const initials = name
      .trim()
      .split(" ")
      .map((w) => w[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("");
    addRm({
      id: rmId,
      password,
      name: name.trim(),
      role: "rm",
      initials,
      joined: new Date().toISOString().split("T")[0],
      status: "active",
    });
    navigate("/admin/rms", { state: { created: rmId } });
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/rms")}
        style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 24 }}
      >
        ← Relationship Managers
      </button>

      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--text-primary)", marginBottom: 32 }}>
        Add Relationship Manager
      </h1>

      <div
        style={{
          maxWidth: 560,
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 36,
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Full Name *" id="name" error={errors.name}>
            <input
              id="name"
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => blur("name")}
              placeholder="e.g. Vikram Singh"
              style={errors.name ? { borderColor: "var(--negative)" } : {}}
            />
          </Field>

          <Field label="RM ID *" id="rmId" helper="Must start with RM- prefix" error={errors.rmId}>
            <input
              id="rmId"
              type="text"
              className="input-field"
              value={rmId}
              onChange={(e) => setRmId(e.target.value)}
              onBlur={() => blur("rmId")}
              placeholder="RM-00003"
              style={errors.rmId ? { borderColor: "var(--negative)" } : {}}
            />
          </Field>

          <Field label="Temporary Password *" id="password" error={errors.password}>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => blur("password")}
              placeholder="Min 8 characters"
              style={errors.password ? { borderColor: "var(--negative)" } : {}}
            />
          </Field>

          <Field label="Confirm Password *" id="confirmPass" error={errors.confirmPass}>
            <input
              id="confirmPass"
              type="password"
              className="input-field"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              onBlur={() => blur("confirmPass")}
              placeholder="Repeat password"
              style={errors.confirmPass ? { borderColor: "var(--negative)" } : {}}
            />
          </Field>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
            <button
              type="button"
              onClick={() => navigate("/admin/rms")}
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 13,
                color: "var(--text-secondary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px 20px",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ height: 40, padding: "0 24px", fontSize: 13, opacity: isValid ? 1 : 0.4, cursor: isValid ? "pointer" : "not-allowed" }}
              disabled={!isValid}
            >
              Create RM Account →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

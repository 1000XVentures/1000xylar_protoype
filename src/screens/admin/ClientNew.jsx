import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const PORTFOLIO_OPTIONS = [
  { id: "conservative", label: "Conservative" },
  { id: "growth", label: "Growth" },
  { id: "aggressive", label: "Aggressive" },
  { id: null, label: "Decide during demo" },
];

export default function AdminClientNew() {
  const navigate = useNavigate();
  const { addClient, user, rms } = useApp();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [portfolio, setPortfolio] = useState(undefined);
  const [rmId, setRmId] = useState(rms[0]?.id ?? "");
  const [touched, setTouched] = useState({});

  function blur(f) { setTouched((t) => ({ ...t, [f]: true })); }

  const errors = {};
  if (touched.name && name.trim().length < 2) errors.name = "Name is required.";
  if (touched.phone && phone.trim().length < 6) errors.phone = "Valid phone number required.";

  const isValid = name.trim().length >= 2 && phone.trim().length >= 6;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    const id = `C${Date.now()}`;
    addClient({
      id,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      rm_id: rmId || (user?.role === "rm" ? user.id : rms[0]?.id),
      preferred_portfolio: portfolio ?? null,
      created_at: new Date().toISOString().split("T")[0],
      sessions: [],
    });
    navigate("/admin/clients", { state: { created: name.trim() } });
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/clients")}
        style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 24 }}
      >
        ← Client Profiles
      </button>

      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--text-primary)", marginBottom: 32 }}>
        Add Client Profile
      </h1>

      <div style={{ maxWidth: 520, backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 32 }}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 18 }}>
            <label className="input-label" htmlFor="cname">Full Name *</label>
            <input id="cname" type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => blur("name")} placeholder="e.g. Vikram Rao" style={errors.name ? { borderColor: "var(--negative)" } : {}} />
            {errors.name && <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--negative)", marginTop: 5 }}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="input-label" htmlFor="cphone">Phone *</label>
            <input id="cphone" type="text" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => blur("phone")} placeholder="+91 98200 XXXXX" style={errors.phone ? { borderColor: "var(--negative)" } : {}} />
            {errors.phone && <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--negative)", marginTop: 5 }}>{errors.phone}</div>}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="input-label" htmlFor="cemail">Email (optional)</label>
            <input id="cemail" type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="input-label" htmlFor="cnotes">Notes (optional)</label>
            <textarea
              id="cnotes"
              className="input-field"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Investment preferences, goals, context…"
              rows={3}
              style={{ height: "auto", padding: "10px 14px", resize: "vertical" }}
            />
          </div>

          {rms.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <label className="input-label">Assign RM</label>
              <select
                value={rmId}
                onChange={(e) => setRmId(e.target.value)}
                style={{ width: "100%", height: 44, border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0 14px", fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)", backgroundColor: "var(--surface)", outline: "none" }}
              >
                {rms.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
              </select>
            </div>
          )}

          {/* Portfolio radio cards */}
          <div style={{ marginBottom: 18 }}>
            <label className="input-label">Preferred Portfolio (optional)</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
              {PORTFOLIO_OPTIONS.map((opt) => {
                const selected = portfolio === opt.id;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setPortfolio(opt.id)}
                    style={{
                      padding: "12px 16px",
                      border: `1px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: "var(--radius)",
                      backgroundColor: selected ? "var(--accent-light)" : "var(--surface)",
                      fontFamily: '"Inter", sans-serif',
                      fontSize: 13,
                      color: selected ? "var(--accent)" : "var(--text-primary)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontWeight: selected ? 500 : 400,
                      transition: "all 0.1s ease",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button type="button" onClick={() => navigate("/admin/clients")} style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "10px 20px" }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ height: 40, padding: "0 24px", fontSize: 13 }} disabled={!isValid}>
              Save Client →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

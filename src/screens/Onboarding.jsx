import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";
import portfoliosData from "../data/portfolios.json";

function fmt(n) { return "₹" + n.toLocaleString("en-IN"); }

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="var(--positive)" />
      <path d="M5 8l2.5 2.5L11 5.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 10V3M8 3L5.5 5.5M8 3l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { setSelectedPortfolio } = useApp();
  const [selected, setSelected] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  function handleContinue() {
    if (!selected) return;
    const p = portfoliosData.find(p => p.id === selected);
    setSelectedPortfolio(p);
    navigate("/insights");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <TopNav />
      <div style={{ flex: 1, padding: "40px 40px 60px", maxWidth: 1080, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px" }}>
          Select a Portfolio
        </h1>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", margin: "0 0 40px", lineHeight: 1.6 }}>
          Choose a sample portfolio or upload the client's Consolidated Account Statement (CAS).
        </p>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 36 }}>
          {portfoliosData.map((p) => {
            const isSelected = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                style={{
                  background: isSelected ? "var(--accent-light)" : "var(--surface)",
                  border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: 28,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s ease, border-color 0.15s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "var(--accent-light)"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "var(--surface)"; }}
              >
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.5 }}>{p.description}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {[["Funds", p.funds.length], ["Risk Profile", p.riskProfile], ["Horizon", p.horizon]].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{label}</span>
                      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid var(--border)", marginTop: 20, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>Total Invested</span>
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{fmt(p.summary.totalInvested)}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "36px 0 20px" }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)" }}>or</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
        </div>

        {/* CAS Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{ border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-lg)", height: 88, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", backgroundColor: "var(--surface)", transition: "background-color 0.15s ease, border-color 0.15s ease", marginBottom: 32 }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-light)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
        >
          {uploadedFile ? (
            <><CheckIcon /><div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--positive)", fontWeight: 500 }}>{uploadedFile}</div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>Uploaded successfully</div></div></>
          ) : (
            <><span style={{ color: "var(--text-muted)" }}><UploadIcon /></span><div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Upload CAS Statement (PDF)</div><div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Includes full transaction history and zero holdings</div></div></>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setUploadedFile(f.name); }} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleContinue} disabled={!selected} className="btn-primary" style={{ opacity: selected ? 1 : 0.4, cursor: selected ? "pointer" : "not-allowed" }}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

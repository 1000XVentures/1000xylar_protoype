import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";
import DataBadge from "../components/DataBadge";

function fmt(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="9" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M7 9V6.5a3 3 0 016 0V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="10" cy="13.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

export default function Memo() {
  const navigate = useNavigate();
  const { selectedPortfolio, setSelectedPortfolio, session } = useApp();
  const memoRef = useRef(null);

  async function handleExportPDF() {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(memoRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pdfW) / canvas.width;

      const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

      // Header
      pdf.setFontSize(9);
      pdf.setTextColor(160, 157, 151);
      pdf.text(`Xylar  |  Confidential  |  RM Use Only  |  ${date}`, pdfW / 2, 8, { align: "center" });

      // Content
      let y = 14;
      let remaining = imgH;
      let sourceY = 0;

      while (remaining > 0) {
        const pageH = Math.min(remaining, pdfH - 22);
        pdf.addImage(imgData, "PNG", 0, y, pdfW, (pageH / imgH) * imgH, undefined, "FAST");
        remaining -= pageH;
        sourceY += pageH;
        if (remaining > 0) {
          pdf.addPage();
          y = 14;
          pdf.setFontSize(9);
          pdf.setTextColor(160, 157, 151);
          pdf.text(`Xylar  |  Confidential  |  RM Use Only  |  ${date}`, pdfW / 2, 8, { align: "center" });
        }
      }

      // Footer on last page
      pdf.setFontSize(8);
      pdf.setTextColor(160, 157, 151);
      pdf.text(`Policy-based estimates. Source: CAMS RTA. Analysis as of ${date}.`, pdfW / 2, pdfH - 6, { align: "center" });

      pdf.save(`Xylar_Intelligence_Memo_${date.replace(/ /g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  }

  if (!selectedPortfolio) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
        <TopNav />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => navigate("/onboarding")} className="btn-primary">Select a Portfolio</button>
        </div>
      </div>
    );
  }

  const p = selectedPortfolio;
  const s = p.summary;
  const snap = p.memo.snapshot;
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <div style={{ flex: 1, padding: "40px 40px 60px", maxWidth: 960, margin: "0 auto", width: "100%" }}>

        {/* Top actions */}
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <button onClick={() => navigate("/portfolio")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", padding: 0 }}>← Portfolio Intelligence</button>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => { setSelectedPortfolio(null); navigate("/onboarding"); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", padding: 0 }}>Run on another portfolio</button>
            <button onClick={handleExportPDF} className="btn-primary">Export PDF</button>
          </div>
        </div>

        {/* MEMO CONTENT */}
        <div ref={memoRef} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "48px 48px 40px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

          {/* Memo header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Executive Intelligence Memo</h1>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>
              Prepared by Xylar · {date} · Confidential — RM Use Only
            </div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>
              Coverage: {s.covered_categories} categories | Uncovered exposure: {s.uncovered_exposure_pct}% (flagged, analysis limited)
            </div>
            <div style={{ height: 1, backgroundColor: "var(--border)" }} />
          </div>

          {/* Section 1 — Portfolio Snapshot */}
          <div style={{ marginBottom: 36 }}>
            <SectionLabel>Portfolio Snapshot</SectionLabel>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {[
                ["Value", fmt(snap.value)],
                ["Funds", snap.fund_count],
                ["Eff. Diversification", snap.eff_diversification + " stocks"],
                ["Top Stock %", snap.top_stock_pct + "%"],
                ["Top AMC %", snap.top_amc_pct + "%"],
                ["Covered Categories", snap.covered_categories],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 600, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{val}</div>
                </div>
              ))}
            </div>
            <DataBadge timestamp={s.data_as_of} source={s.source} />
          </div>

          {/* Section 2 — Key Truths */}
          <div style={{ marginBottom: 36 }}>
            <SectionLabel>What the Machine Saw</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {p.key_truths.map((truth, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0, marginTop: 7 }} />
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{truth}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 — Journey Delta */}
          <div style={{ marginBottom: 36 }}>
            <SectionLabel>Your MF Journey (Policy-Based View)</SectionLabel>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginBottom: 16 }}>
              {[
                ["Actual Value", fmt(s.currentValue), null],
                ["Benchmark (TRI)", fmt(s.benchmarkValue), null],
                ["With Xylar", fmt(s.xylarValue), "var(--accent)"],
              ].map(([label, val, color]) => (
                <div key={label}>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 600, color: color ?? "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, color: "var(--positive)", marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>
              +{fmt(s.xylarValue - s.currentValue)} incremental (policy-based)
            </div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
              No leverage. Limited churn. Human-approved actions.
            </p>
          </div>

          {/* Section 4 — Top 3 Leakage Drivers */}
          <div style={{ marginBottom: 36 }}>
            <SectionLabel>Where the Gap Came From</SectionLabel>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Rank", "Driver", "₹ Impact", "bps", "Confidence"].map(col => (
                    <th key={col} style={{ padding: "8px 12px", fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", textAlign: col === "Driver" ? "left" : "right", borderBottom: "1px solid var(--border)", background: "transparent" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.leakage_drivers.map((d) => (
                  <tr key={d.rank}>
                    <td style={{ padding: "10px 12px", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{d.rank}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{d.label}</div>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>{d.what_happened}</div>
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--negative)", fontVariantNumeric: "tabular-nums", borderBottom: "1px solid var(--border)" }}>−{fmt(d.impact_rupees)}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums", borderBottom: "1px solid var(--border)" }}>{d.impact_bps}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>{d.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 5 — Watchlist */}
          <div style={{ marginBottom: 36 }}>
            <SectionLabel>Next 30–90 Days</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {p.watchlist.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "var(--warning)", flexShrink: 0, marginTop: 7 }} />
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6 — Next Step (gated) */}
          <div style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}><LockIcon /></div>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                Portfolio-specific recommendations and an action plan are available once you onboard as a client. This memo is provided as a diagnostic, not a sales document.
              </p>
            </div>
            <div className="no-print" style={{ display: "flex", gap: 12 }}>
              <button className="btn-primary">Request onboarding</button>
              <button className="btn-outline">Schedule next review</button>
            </div>
          </div>

          {/* Memo footer */}
          <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: "var(--text-muted)", fontStyle: "italic", margin: 0, textAlign: "center" }}>
              Policy-based estimates. Source: CAMS RTA. Analysis as of {date}. This is a diagnostic — not investment advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

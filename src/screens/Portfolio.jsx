import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";
import DataBadge from "../components/DataBadge";
import EvidencePanel from "../components/EvidencePanel";
import evidenceWidgets from "../data/evidenceWidgets.json";

function fmt(n) {
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

function buildProblems(portfolio, widgets) {
  const problems = [];
  const s = portfolio.signals;
  if (s.bad_apples?.length > 0 && widgets.bad_apples) {
    problems.push({ key: "bad_apples", priority: "high", name: "Underperforming Funds", why: "One or more funds have ranked in the bottom quartile for 3+ consecutive quarters", impact: widgets.bad_apples.impact_rupees ?? 0 });
  }
  if (s.overlap_clusters?.length > 0 && widgets.overlap) {
    problems.push({ key: "overlap", priority: "high", name: "Fund Overlap / Redundancy", why: "Multiple funds share high holdings overlap — reducing effective diversification without improving returns", impact: widgets.overlap.impact_rupees ?? 0 });
  }
  if (s.allocation_drift && widgets.allocation_drift) {
    problems.push({ key: "allocation_drift", priority: "medium", name: "Allocation Drift", why: "Current category weights have drifted from the target allocation — risk posture has changed implicitly", impact: widgets.allocation_drift.impact_rupees ?? 0 });
  }
  if (s.tax_stcg_exposure > 0 && widgets.tax) {
    problems.push({ key: "tax", priority: "medium", name: "STCG Exposure", why: "Short-term capital gains exposure can be reduced by pacing redemptions — no portfolio change required", impact: widgets.tax.impact_rupees ?? 0 });
  }
  if (s.rec_gap_categories?.length > 0 && widgets.rec_gap) {
    problems.push({ key: "rec_gap", priority: "medium", name: "Below-Threshold Fund Selection", why: "Certain categories hold funds ranked below Xylar's 75th-percentile threshold", impact: widgets.rec_gap?.impact_rupees ?? 0 });
  }
  return problems;
}

export default function Portfolio() {
  const navigate = useNavigate();
  const { selectedPortfolio } = useApp();
  const [expandedCard, setExpandedCard] = useState(null);
  const [panelKey, setPanelKey] = useState(null);
  const [panelWidget, setPanelWidget] = useState(null);

  if (!selectedPortfolio) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
        <TopNav actNumber={4} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => navigate("/onboarding")} className="btn-primary">Select a Portfolio</button>
        </div>
      </div>
    );
  }

  const p = selectedPortfolio;
  const s = p.summary;
  const widgets = evidenceWidgets[p.id] ?? {};
  const problems = buildProblems(p, widgets);

  function openEvidence(key) {
    setPanelKey(key);
    setPanelWidget(widgets[key] ?? null);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <TopNav actNumber={4} />

      <div style={{ flex: 1, padding: "40px 40px 60px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 8 }}>ACT 4</div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Current Portfolio Intelligence</h1>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Diagnostic only — what needs attention right now</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/analysis")} style={{ height: 36, padding: "0 16px", backgroundColor: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", cursor: "pointer", transition: "background-color 0.15s ease" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>← Waterfall</button>
            <button onClick={() => window.print()} className="no-print" style={{ height: 36, padding: "0 16px", backgroundColor: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", cursor: "pointer", transition: "background-color 0.15s ease" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>Export Analysis</button>
          </div>
        </div>

        {/* Health Snapshot */}
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px 24px", marginTop: 28, marginBottom: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[
              ["Total Value", fmt(s.currentValue)],
              ["# Funds", s.fund_count],
              ["Eff. Diversification", s.effective_diversification_stocks + " stocks"],
              ["Top Stock", s.top_stock_exposure_pct + "%" + (s.top_stock_exposure_pct > 8 ? " ⚠" : "")],
              ["Top AMC", s.top_amc_concentration_pct + "%"],
              ["Covered", s.covered_categories + " categories"],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 600, color: value?.toString().includes("⚠") ? "var(--warning)" : "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{value}</div>
              </div>
            ))}
          </div>
          <DataBadge timestamp={s.data_as_of} source={s.source} />
        </div>

        {/* Problem Stack */}
        {problems.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {problems.slice(0, 5).map((prob) => {
              const isHigh = prob.priority === "high";
              const isExpanded = expandedCard === prob.key;
              return (
                <div key={prob.key} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderLeft: `3px solid ${isHigh ? "var(--negative)" : "var(--warning)"}`, borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div
                    style={{ padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "background-color 0.15s ease" }}
                    onClick={() => setExpandedCard(isExpanded ? null : prob.key)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{prob.name}</div>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)" }}>{prob.why}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      {prob.impact > 0 && (
                        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--negative)", fontVariantNumeric: "tabular-nums" }}>−{fmt(prob.impact)}</div>
                      )}
                      <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", padding: 0 }} onClick={(e) => { e.stopPropagation(); openEvidence(prob.key); }}>
                        Show evidence →
                      </button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease", color: "var(--text-muted)", flexShrink: 0 }}>
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  {isExpanded && widgets[prob.key] && (
                    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 24px", backgroundColor: "var(--surface-muted)" }}>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{widgets[prob.key].finding}</div>
                      {widgets[prob.key].counterfactual && (
                        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--accent)", paddingLeft: 12, borderLeft: "2px solid var(--accent)", lineHeight: 1.5, marginBottom: 12 }}>→ {widgets[prob.key].counterfactual}</div>
                      )}
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>Confidence: {widgets[prob.key].confidence}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Fund Holdings Table */}
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 28 }}>
          <div style={{ padding: "18px 24px 14px", borderBottom: "2px solid var(--border-strong)" }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Fund Holdings</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Fund Name", "Category", "Plan", "Allocation", "XIRR", "Current Value"].map((col) => (
                  <th key={col} style={{ padding: "10px 20px", fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", textAlign: col === "Fund Name" || col === "Category" || col === "Plan" ? "left" : "right", borderBottom: "1px solid var(--border)", background: "transparent" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.funds.map((fund, i) => {
                const isBadApple = p.signals.bad_apples?.some(b => b.fund_id === fund.id);
                return (
                  <tr key={fund.id} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")} style={{ transition: "background-color 0.1s ease" }}>
                    <td style={{ padding: "12px 20px", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                        {fund.name}
                        {isBadApple && <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, backgroundColor: "var(--negative-light)", color: "var(--negative)", padding: "2px 7px", borderRadius: 10, fontWeight: 500 }}>Underperforming</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>NAV ₹{fund.nav}</div>
                    </td>
                    <td style={{ padding: "12px 20px", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>{fund.category}</td>
                    <td style={{ padding: "12px 20px", fontFamily: '"Inter", sans-serif', fontSize: 12, borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <span style={{ color: fund.planType === "Direct" ? "var(--positive)" : "var(--warning)", fontWeight: 500 }}>{fund.planType}</span>
                    </td>
                    <td style={{ padding: "12px 20px", textAlign: "right", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                        <div style={{ width: 80, height: 4, backgroundColor: "var(--accent-light)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${fund.allocation_pct}%`, backgroundColor: "var(--accent)", borderRadius: 2 }} />
                        </div>
                        <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums", minWidth: 28 }}>{fund.allocation_pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px", textAlign: "right", fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: fund.xirr >= 12 ? "var(--positive)" : fund.xirr < 9 ? "var(--negative)" : "var(--text-secondary)", fontVariantNumeric: "tabular-nums", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>{fund.xirr}%</td>
                    <td style={{ padding: "12px 20px", textAlign: "right", fontFamily: '"Inter", sans-serif', fontSize: 13, fontVariantNumeric: "tabular-nums", color: "var(--text-primary)", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>{fmt(fund.currentValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Recommendations gate */}
        <div style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 28 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}><LockIcon /></div>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
              Portfolio-specific recommendations and an action plan are available once you onboard as a client.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-primary">Request onboarding</button>
            <button className="btn-outline">Schedule next review</button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
          <button onClick={() => navigate("/memo")} className="btn-primary">View Executive Memo →</button>
        </div>
      </div>

      <EvidencePanel widgetKey={panelKey} widget={panelWidget} onClose={() => { setPanelWidget(null); setPanelKey(null); }} />
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";
import DataBadge from "../components/DataBadge";
import GapHighlight from "../components/GapHighlight";
import PortfolioScore from "../components/PortfolioScore";
import SignalChip from "../components/SignalChip";
import EvidencePanel from "../components/EvidencePanel";
import evidenceWidgets from "../data/evidenceWidgets.json";

function fmt(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
}

function computeScore(portfolio) {
  let score = 85;
  const s = portfolio.signals;
  if (s.bad_apples?.length > 0) score -= 18;
  if (s.overlap_clusters?.length > 0) score -= 14;
  if (s.allocation_drift) score -= 8;
  if (s.poor_entry_events?.length > 0) score -= 6;
  if (s.tax_stcg_exposure > 200000) score -= 6;
  return Math.max(10, Math.min(100, Math.round(score)));
}

function MetricCard({ label, value, sub, accentLeft, badge }) {
  return (
    <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: "20px 24px", borderLeft: accentLeft ? "3px solid var(--accent)" : undefined, flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1, fontVariantNumeric: "tabular-nums", marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{sub}</div>}
      {badge && <DataBadge timestamp={badge.ts} source={badge.src} />}
    </div>
  );
}

const SIGNAL_LABELS = {
  allocation_drift: { label: "Allocation Drift", priority: "medium" },
  overlap: { label: "Fund Overlap", priority: "high" },
  bad_apples: { label: "Underperformers", priority: "high" },
  tax_stcg_exposure: { label: "STCG Exposure", priority: "medium" },
  poor_entry_events: { label: "Entry Timing", priority: "medium" },
  selection_quality: { label: "Selection Quality", priority: "medium" },
};

const MARKER_COLORS = {
  action: "var(--accent)",
  missed: "var(--border)",
  lumpsum: "var(--warning)",
  drift: "var(--accent-mid)",
};

export default function Analysis() {
  const navigate = useNavigate();
  const { selectedPortfolio } = useApp();
  const [openSignal, setOpenSignal] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  if (!selectedPortfolio) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
        <TopNav actNumber={2} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: "var(--text-muted)" }}>No portfolio selected.</p>
          <button onClick={() => navigate("/onboarding")} className="btn-primary">Select a Portfolio</button>
        </div>
      </div>
    );
  }

  const p = selectedPortfolio;
  const s = p.summary;
  const widgets = evidenceWidgets[p.id] ?? {};
  const score = computeScore(p);

  // Build signal list
  const signals = [];
  if (p.signals.bad_apples?.length > 0) signals.push("bad_apples");
  if (p.signals.overlap_clusters?.length > 0) signals.push("overlap");
  if (p.signals.allocation_drift) signals.push("allocation_drift");
  if (p.signals.poor_entry_events?.length > 0) signals.push("selection_quality");
  if (p.signals.tax_stcg_exposure > 0) signals.push("tax_stcg_exposure");

  // Timeline layout
  const markers = p.timeline_markers ?? [];
  const timelineW = Math.max(markers.length * 120 + 80, 800);
  const baseY = 100;

  const markerPositions = markers.map((m, i) => ({ ...m, x: 60 + i * 110 }));

  const activeWidget = openSignal ? widgets[openSignal] : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <TopNav actNumber={2} />

      <div style={{ flex: 1, padding: "40px 40px 60px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 8 }}>ACT 2</div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Your MF Journey Since Inception</h1>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Capital invested → withdrawn → what it became</p>
          </div>
          <button onClick={() => window.print()} className="no-print btn-outline" style={{ height: 36, padding: "0 16px", fontSize: 12 }}>Export Analysis</button>
        </div>

        {/* 4 Metric cards */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 12, marginBottom: 28 }}>
          <MetricCard label="Total Invested" value={fmt(s.totalInvested)} sub={`Net: ${fmt(s.netInvested)}`} badge={{ ts: s.data_as_of, src: s.source }} />
          <MetricCard label="Current Value" value={fmt(s.currentValue)} sub={`+${fmt(s.currentValue - s.netInvested)} gain`} badge={{ ts: s.data_as_of, src: s.source }} />
          <MetricCard label="Your XIRR" value={`${s.xirr_actual}%`} sub="Actual return rate" badge={{ ts: s.data_as_of, src: s.source }} />

          {/* Gap indicator */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 4px", flexShrink: 0 }}>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 600, color: "var(--positive)", fontVariantNumeric: "tabular-nums" }}>
              +{(s.xirr_xylar - s.xirr_actual).toFixed(1)}%
            </div>
            <div style={{ fontSize: 14, color: "var(--positive)" }}>↑</div>
          </div>

          <MetricCard label="Xylar XIRR" value={`${s.xirr_xylar}%`} sub="Policy-based projection" accentLeft badge={{ ts: s.data_as_of, src: s.source }} />
        </div>

        {/* Gap highlight + Score row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px 28px", marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <GapHighlight actual={s.currentValue} xylar={s.xylarValue} />
          <PortfolioScore score={score} />
        </div>

        {/* Timeline */}
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px 28px 20px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 16 }}>Investment Timeline</div>

          <div style={{ position: "relative", width: timelineW, minWidth: "100%" }}>
            <svg width={timelineW} height={baseY + 40} style={{ overflow: "visible" }}>
              {/* Baseline */}
              <line x1="20" y1={baseY} x2={timelineW - 20} y2={baseY} stroke="var(--border)" strokeWidth="1" />

              {/* Ghost Xylar line */}
              {markerPositions.length > 1 && (
                <path
                  d={`M ${markerPositions[0].x} ${baseY - 20} ${markerPositions.map((m, i) => `L ${m.x} ${baseY - 20 - i * 6}`).join(" ")}`}
                  fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4 3"
                />
              )}
              {/* Actual value line */}
              {markerPositions.length > 1 && (
                <path
                  d={`M ${markerPositions[0].x} ${baseY - 10} ${markerPositions.map((m, i) => `L ${m.x} ${baseY - 10 - i * 4}`).join(" ")}`}
                  fill="none" stroke="var(--accent)" strokeWidth="2"
                />
              )}

              {markerPositions.map((m) => {
                const isLarge = m.type === "lumpsum" || m.type === "action";
                const color = MARKER_COLORS[m.type] ?? "var(--accent)";
                return (
                  <g key={m.date + m.label} style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredMarker(m)}
                    onMouseLeave={() => setHoveredMarker(null)}
                  >
                    <line x1={m.x} y1={baseY} x2={m.x} y2={baseY - 30} stroke={color} strokeWidth={isLarge ? 1.5 : 1} />
                    <circle cx={m.x} cy={baseY - 30} r={isLarge ? 7 : 4} fill={color} stroke="var(--surface)" strokeWidth={1.5} />
                    {m.impact_rupees !== 0 && (
                      <text x={m.x} y={baseY + 20} textAnchor="middle" fontSize={9} fontFamily='"Inter", sans-serif' fill={m.impact_rupees < 0 ? "var(--negative)" : "var(--positive)"}>
                        {m.impact_rupees < 0 ? "-" : "+"}₹{Math.abs(m.impact_rupees / 1000)}K
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Date + label below */}
            <div style={{ display: "flex", gap: 0, position: "relative" }}>
              {markerPositions.map((m) => (
                <div key={m.date} style={{ position: "absolute", left: m.x - 44, width: 88, textAlign: "center" }}>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: "var(--text-muted)" }}>{m.date}</div>
                </div>
              ))}
            </div>

            {/* Hover tooltip */}
            {hoveredMarker && (
              <div style={{ position: "absolute", left: hoveredMarker.x, top: baseY - 110, transform: "translateX(-50%)", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "10px 14px", fontFamily: '"Inter", sans-serif', fontSize: 12, zIndex: 20, minWidth: 180, pointerEvents: "none" }}>
                <div style={{ color: "var(--text-secondary)", fontWeight: 500, marginBottom: 3 }}>{hoveredMarker.label}</div>
                <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>{hoveredMarker.date}</div>
                {hoveredMarker.amount !== 0 && <div style={{ color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{hoveredMarker.amount > 0 ? fmt(hoveredMarker.amount) : fmt(Math.abs(hoveredMarker.amount)) + " withdrawn"}</div>}
                {hoveredMarker.impact_rupees !== 0 && <div style={{ color: hoveredMarker.impact_rupees < 0 ? "var(--negative)" : "var(--positive)", marginTop: 2 }}>Impact: {hoveredMarker.impact_rupees < 0 ? "-" : "+"}{fmt(Math.abs(hoveredMarker.impact_rupees))}</div>}
              </div>
            )}

            {/* Legend */}
            <div style={{ display: "flex", gap: 20, marginTop: 48, fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>
              {[["var(--accent)", "Actual value"], ["var(--text-muted)", "Xylar projected"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={c} strokeWidth={c.includes("muted") ? 1 : 2} strokeDasharray={c.includes("muted") ? "4 2" : "none"} /></svg>
                  {l}
                </div>
              ))}
              {[["var(--accent)", "SIP / Action"], ["var(--warning)", "Lumpsum"], ["var(--accent-mid)", "Drift event"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill={c} /></svg>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signal chips */}
        <div className="no-print" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {signals.map((sig) => {
            const meta = SIGNAL_LABELS[sig];
            if (!meta || !widgets[sig]) return null;
            return (
              <SignalChip
                key={sig}
                signal={{ ...meta, id: sig }}
                onClick={() => setOpenSignal(sig)}
              />
            );
          })}
        </div>

        {/* Opportunity cost drivers */}
        {p.leakage_drivers?.length > 0 && (
          <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px 28px", marginBottom: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 16 }}>Opportunity Cost Drivers</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {p.leakage_drivers.map((d) => (
                <div key={d.rank} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{d.label}</div>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)" }}>{d.what_happened}</div>
                  </div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--negative)", fontVariantNumeric: "tabular-nums", marginLeft: 20, flexShrink: 0 }}>
                    −{fmt(d.impact_rupees)}
                  </div>
                </div>
              ))}
            </div>
            <DataBadge timestamp={s.data_as_of} source={s.source} />
          </div>
        )}

        {/* Holdings table */}
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 32 }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Holdings</div>
            <button onClick={() => navigate("/portfolio")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", padding: 0 }}>Full Portfolio Analysis →</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Fund Name", "Category", "Allocation", "XIRR", "Current Value"].map((col) => (
                  <th key={col} style={{ padding: "10px 24px", fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", textAlign: col === "Fund Name" || col === "Category" ? "left" : "right", borderBottom: "1px solid var(--border)", background: "transparent" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.funds.map((fund, i) => (
                <tr key={fund.id} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")} style={{ transition: "background-color 0.1s ease" }}>
                  <td style={{ padding: "12px 24px", fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div>{fund.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{fund.planType}</div>
                  </td>
                  <td style={{ padding: "12px 24px", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>{fund.category}</td>
                  <td style={{ padding: "12px 24px", textAlign: "right", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                      <div style={{ width: 80, height: 4, backgroundColor: "var(--accent-light)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${fund.allocation_pct}%`, backgroundColor: "var(--accent)", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right" }}>{fund.allocation_pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 24px", textAlign: "right", fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: fund.xirr >= 12 ? "var(--positive)" : fund.xirr < 9 ? "var(--negative)" : "var(--text-secondary)", fontVariantNumeric: "tabular-nums", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>{fund.xirr}%</td>
                  <td style={{ padding: "12px 24px", textAlign: "right", fontFamily: '"Inter", sans-serif', fontSize: 13, fontVariantNumeric: "tabular-nums", color: "var(--text-primary)", borderBottom: i < p.funds.length - 1 ? "1px solid var(--border)" : "none" }}>{fmt(fund.currentValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => navigate("/replay")} className="btn-primary">Replay My Decisions →</button>
        </div>
      </div>

      <EvidencePanel
        widgetKey={openSignal}
        widget={activeWidget}
        onClose={() => setOpenSignal(null)}
      />
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";
import DataBadge from "../components/DataBadge";
import EvidencePanel from "../components/EvidencePanel";
import evidenceWidgets from "../data/evidenceWidgets.json";

function fmt(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + Math.abs(n).toLocaleString("en-IN");
}

function fmtSigned(n) {
  if (n === 0) return "₹0";
  const abs = fmt(Math.abs(n));
  return n > 0 ? `+${abs}` : `−${abs}`;
}

const MARKER_COLORS = { action: "var(--accent)", missed: "var(--border)", lumpsum: "var(--warning)", drift: "var(--accent-mid)" };
const MARKER_SHAPES = { action: "circle", missed: "circle-outline", lumpsum: "triangle", drift: "diamond" };

const TAB_KEYS = ["allocation_drift", "overlap", "selection_quality", "bad_apples", "tax"];
const TAB_LABELS = {
  allocation_drift: "Allocation Drift",
  overlap: "Overlap",
  selection_quality: "Decision Quality",
  bad_apples: "Bad Apples",
  tax: "Tax",
};

export default function Replay() {
  const navigate = useNavigate();
  const { selectedPortfolio } = useApp();
  const [view, setView] = useState("chrono"); // chrono | impact
  const [activeTab, setActiveTab] = useState("allocation_drift");
  const [panelWidget, setPanelWidget] = useState(null);
  const [panelKey, setPanelKey] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  if (!selectedPortfolio) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
        <TopNav actNumber={3} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => navigate("/onboarding")} className="btn-primary">Select a Portfolio</button>
        </div>
      </div>
    );
  }

  const p = selectedPortfolio;
  const s = p.summary;
  const widgets = evidenceWidgets[p.id] ?? {};
  const markers = p.timeline_markers ?? [];
  const timelineW = Math.max(markers.length * 120 + 80, 800);
  const baseY = 90;
  const markerPositions = markers.map((m, i) => ({ ...m, x: 60 + i * 110 }));

  function openEvidence(key) {
    setPanelKey(key);
    setPanelWidget(widgets[key] ?? null);
  }

  const availableTabs = TAB_KEYS.filter(k => widgets[k]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <TopNav actNumber={3} />

      <div style={{ flex: 1, padding: "40px 40px 60px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>

        {/* Header + toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 8 }}>ACT 3</div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Decision Replay</h1>
          </div>
          {/* Pill toggle */}
          <div style={{ display: "flex", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            {[["chrono", "Chronological"], ["impact", "Impact"]].map(([k, l]) => (
              <button key={k} onClick={() => setView(k)} style={{ padding: "8px 18px", fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", backgroundColor: view === k ? "var(--accent)" : "transparent", color: view === k ? "#fff" : "var(--text-secondary)", transition: "all 0.15s ease" }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Summary strip */}
        <div style={{ backgroundColor: "var(--surface-muted)", borderRadius: "var(--radius)", padding: "14px 24px", marginBottom: 24, display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[
            ["Net Invested", fmt(s.netInvested), null],
            ["Actual Value", fmt(s.currentValue), null],
            ["Xylar Value", fmt(s.xylarValue), "var(--accent)"],
            ["Δ Policy", fmtSigned(s.xylarValue - s.currentValue), "var(--positive)"],
            ["Benchmark", fmt(s.benchmarkValue), null],
            ["STCG", fmt(s.stcg_exposure), s.stcg_exposure > 0 ? "var(--warning)" : null],
            ["LTCG", fmt(s.ltcg_exposure), null],
          ].map(([label, val, color]) => (
            <div key={label}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: color ?? "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{val}</div>
            </div>
          ))}
        </div>

        {view === "chrono" ? (
          <>
            {/* Timeline */}
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px 28px 20px", marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 16 }}>Decision Timeline</div>
              <div style={{ position: "relative", width: timelineW, minWidth: "100%" }}>
                <svg width={timelineW} height={baseY + 30} style={{ overflow: "visible" }}>
                  <line x1="20" y1={baseY} x2={timelineW - 20} y2={baseY} stroke="var(--border)" strokeWidth="1" />
                  {markerPositions.map((m) => {
                    const color = MARKER_COLORS[m.type] ?? "var(--accent)";
                    const r = m.type === "lumpsum" || m.type === "action" ? 8 : 5;
                    return (
                      <g key={m.date + m.label} style={{ cursor: "pointer" }}
                        onMouseEnter={() => setHoveredMarker(m)}
                        onMouseLeave={() => setHoveredMarker(null)}
                        onClick={() => { if (m.widget && widgets[m.widget]) openEvidence(m.widget); }}
                      >
                        <line x1={m.x} y1={baseY} x2={m.x} y2={baseY - 34} stroke={color} strokeWidth={1.5} />
                        {m.type === "missed" ? (
                          <circle cx={m.x} cy={baseY - 34} r={r} fill="var(--surface)" stroke={color} strokeWidth={2} />
                        ) : m.type === "drift" ? (
                          <polygon points={`${m.x},${baseY - 42} ${m.x - 7},${baseY - 28} ${m.x + 7},${baseY - 28}`} fill={color} />
                        ) : (
                          <circle cx={m.x} cy={baseY - 34} r={r} fill={color} stroke="var(--surface)" strokeWidth={1.5} />
                        )}
                        {m.impact_rupees !== 0 && (
                          <text x={m.x} y={baseY + 18} textAnchor="middle" fontSize={9} fontFamily='"Inter", sans-serif' fill={m.impact_rupees < 0 ? "var(--negative)" : "var(--positive)"} fontVariantNumeric="tabular-nums">
                            {m.impact_rupees < 0 ? "−" : "+"}₹{Math.abs(m.impact_rupees / 1000)}K
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Labels */}
                <div style={{ position: "relative", height: 40 }}>
                  {markerPositions.map((m) => (
                    <div key={m.date} style={{ position: "absolute", left: m.x - 50, width: 100, textAlign: "center" }}>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: "var(--text-muted)" }}>{m.date}</div>
                    </div>
                  ))}
                </div>

                {hoveredMarker && (
                  <div style={{ position: "absolute", left: hoveredMarker.x, top: baseY - 120, transform: "translateX(-50%)", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "10px 14px", fontFamily: '"Inter", sans-serif', fontSize: 12, zIndex: 20, minWidth: 200, pointerEvents: "none" }}>
                    <div style={{ color: "var(--text-secondary)", fontWeight: 500, marginBottom: 3 }}>{hoveredMarker.label}</div>
                    <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>{hoveredMarker.date}</div>
                    {hoveredMarker.amount !== 0 && <div style={{ fontVariantNumeric: "tabular-nums", color: "var(--text-primary)", fontWeight: 500 }}>{hoveredMarker.amount > 0 ? fmt(hoveredMarker.amount) : fmt(Math.abs(hoveredMarker.amount)) + " withdrawn"}</div>}
                    {hoveredMarker.widget && widgets[hoveredMarker.widget] && <div style={{ color: "var(--accent)", fontSize: 11, marginTop: 4 }}>Click to view evidence →</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Insight stack */}
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px 28px", marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 16 }}>Insights from this Journey</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {p.leakage_drivers.slice(0, 4).map((d, i) => (
                  <div key={d.rank} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", minWidth: 20, paddingTop: 2 }}>0{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{d.label}</div>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>{d.why_mattered}</div>
                      {widgets[d.widget] && (
                        <button onClick={() => openEvidence(d.widget)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", padding: 0 }}>Show evidence →</button>
                      )}
                    </div>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--negative)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>−{fmt(d.impact_rupees)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence widget tabs */}
            {availableTabs.length > 0 && (
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {/* Tab bar */}
                <div style={{ display: "flex", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
                  {availableTabs.map((k) => (
                    <button key={k} onClick={() => setActiveTab(k)} style={{ padding: "14px 20px", fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, border: "none", background: "none", cursor: "pointer", color: activeTab === k ? "var(--accent)" : "var(--text-muted)", borderBottom: activeTab === k ? "2px solid var(--accent)" : "2px solid transparent", whiteSpace: "nowrap", transition: "color 0.15s ease" }}>
                      {TAB_LABELS[k]}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {widgets[activeTab] && (
                  <div style={{ padding: "24px 28px" }}>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{widgets[activeTab].finding}</div>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 12 }}>{widgets[activeTab].why_matters}</div>
                    <DataBadge timestamp={widgets[activeTab].data_as_of} source={widgets[activeTab].source} />
                    <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
                      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>Confidence: {widgets[activeTab].confidence}</span>
                      {widgets[activeTab].disclosure && (
                        <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>{widgets[activeTab].disclosure}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* IMPACT VIEW */
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 20px" }}>What Mattered Most</h2>

            {/* Delta strip */}
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "18px 24px", marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Total policy delta (Xylar vs actual)</div>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--positive)", fontVariantNumeric: "tabular-nums", marginBottom: 14 }}>
                +{fmt(s.xylarValue - s.currentValue)}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Selection", "Drift/Exit", "Overlap", "Timing", "Tax"].map((tag) => (
                  <span key={tag} style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, backgroundColor: "var(--accent-light)", color: "var(--accent)", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(44,74,110,0.2)" }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Two columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[["Value Leakage", p.leakage_drivers, false]].map(([title, items, isAdded]) => (
                <div key={title} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--negative)", marginBottom: 16 }}>{title}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {items?.slice(0, 3).map((d) => (
                      <div key={d.rank} style={{ borderLeft: "3px solid var(--negative)", paddingLeft: 14, cursor: "pointer" }} onClick={() => { if (d.widget && widgets[d.widget]) openEvidence(d.widget); }}>
                        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{d.label}</div>
                        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{d.date_start} → {d.date_end}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 600, color: "var(--negative)", fontVariantNumeric: "tabular-nums" }}>−{fmt(d.impact_rupees)} ({d.impact_bps} bps)</span>
                          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: "var(--text-muted)" }}>{d.confidence}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Watchlist as "what's good" */}
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--positive)", marginBottom: 16 }}>What's Working</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {p.funds.filter(f => f.xirr >= (p.summary.xirr_actual + 1)).slice(0, 3).map((f) => (
                    <div key={f.id} style={{ borderLeft: "3px solid var(--positive)", paddingLeft: 14 }}>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{f.name}</div>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>{f.category} · {f.allocation_pct}% allocation</div>
                      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 600, color: "var(--positive)", fontVariantNumeric: "tabular-nums" }}>XIRR {f.xirr}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", marginTop: 16 }}>
              Policy-based estimates. Assumptions visible in each event panel.
            </p>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
          <button onClick={() => navigate("/portfolio")} className="btn-primary">View Current Portfolio →</button>
        </div>
      </div>

      <EvidencePanel widgetKey={panelKey} widget={panelWidget} onClose={() => { setPanelWidget(null); setPanelKey(null); }} />
    </div>
  );
}

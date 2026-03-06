import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import DataBadge from "./DataBadge";

const TOOLTIP_STYLE = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  fontFamily: '"Inter", sans-serif',
  fontSize: 12,
  boxShadow: "none",
  padding: "8px 12px",
};

const TICK = { fontFamily: '"Inter", sans-serif', fontSize: 11, fill: "var(--text-muted)" };

function fmt(n) {
  if (!n) return "₹0";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
}

function DriftChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" stroke="transparent" />
        <XAxis dataKey="period" tick={TICK} axisLine={{ stroke: "var(--border)" }} tickLine={false} interval={2} />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
        <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
          <div style={TOOLTIP_STYLE}>
            <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
            {payload.map(e => (
              <div key={e.name} style={{ color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                {e.name}: <strong style={{ color: "var(--text-primary)" }}>{e.value}%</strong>
              </div>
            ))}
          </div>
        ) : null} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
        <Line type="monotone" dataKey="equity_pct" stroke="var(--accent)" strokeWidth={2} dot={false} name="Equity" activeDot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }} />
        <Line type="monotone" dataKey="debt_pct" stroke="var(--accent-mid)" strokeWidth={1.5} dot={false} name="Debt" strokeDasharray="4 2" activeDot={{ r: 3, fill: "var(--accent-mid)", strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function OverlapBar({ data }) {
  const chartData = data.top_shared_holdings?.map(h => ({ stock: h.stock, count: h.funds_count })) ?? [];
  return (
    <div>
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
        Shared holdings across funds in cluster
      </div>
      {chartData.map(d => (
        <div key={d.stock} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
            <span>{d.stock}</span>
            <span style={{ color: "var(--negative)", fontWeight: 500 }}>{d.count} of {data.funds?.length ?? 3} funds</span>
          </div>
          <div style={{ height: 4, backgroundColor: "var(--accent-light)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${(d.count / (data.funds?.length ?? 3)) * 100}%`, backgroundColor: "var(--negative)", borderRadius: 2 }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: "10px 14px", backgroundColor: "var(--negative-light)", borderRadius: "var(--radius)", fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--negative)" }}>
        {data.avg_overlap_pct}% average overlap · {data.cluster_weight_pct}% of portfolio weight
      </div>
    </div>
  );
}

function SelectionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" stroke="transparent" />
        <XAxis dataKey="period" tick={TICK} axisLine={{ stroke: "var(--border)" }} tickLine={false} interval={2} />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={36} domain={[0, 100]} tickFormatter={v => `${v}`} />
        <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
          <div style={TOOLTIP_STYLE}>
            <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
            {payload.map(e => (
              <div key={e.name} style={{ color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                {e.name}: <strong style={{ color: "var(--text-primary)" }}>{e.value}th pct</strong>
              </div>
            ))}
          </div>
        ) : null} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
        <Line type="monotone" dataKey="client_avg_percentile" stroke="var(--accent-mid)" strokeWidth={2} dot={false} name="Client" activeDot={{ r: 4, strokeWidth: 0 }} />
        <Line type="monotone" dataKey="xylar_avg_percentile" stroke="var(--accent)" strokeWidth={2} dot={false} name="Xylar" strokeDasharray="4 2" activeDot={{ r: 4, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function BadAppleChart({ funds }) {
  const fund = funds?.[0];
  if (!fund) return null;
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>{fund.name}</div>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>{fund.category}</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[{ label: "6M vs benchmark", value: fund.benchmark_gap_6m }, { label: "12M vs benchmark", value: fund.benchmark_gap_12m }].map(m => (
          <div key={m.label} style={{ flex: 1, backgroundColor: "var(--negative-light)", borderRadius: "var(--radius)", padding: "10px 14px" }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 600, color: "var(--negative)", fontVariantNumeric: "tabular-nums" }}>{m.value}%</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={fund.rank_timeline} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="transparent" />
          <XAxis dataKey="period" tick={TICK} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} width={36} domain={[0, 100]} />
          <Tooltip content={({ active, payload }) => active && payload?.length ? (
            <div style={TOOLTIP_STYLE}><span style={{ fontVariantNumeric: "tabular-nums", color: "var(--text-primary)", fontWeight: 500 }}>{payload[0].value}th pct</span></div>
          ) : null} cursor={{ fill: "var(--accent-light)" }} />
          <Bar dataKey="percentile" fill="var(--negative)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Percentile rank — lower is worse</div>
    </div>
  );
}

function TaxChart({ data }) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="transparent" />
          <XAxis dataKey="period" tick={TICK} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} width={52} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
          <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
            <div style={TOOLTIP_STYLE}>
              <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
              {payload.map(e => (
                <div key={e.name} style={{ color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                  {e.name}: <strong style={{ color: "var(--text-primary)" }}>{fmt(e.value)}</strong>
                </div>
              ))}
            </div>
          ) : null} cursor={{ fill: "var(--accent-light)" }} />
          <Bar dataKey="stcg" name="STCG" fill="var(--negative)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="ltcg" name="LTCG" fill="var(--accent)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
        STCG taxed at 20% · LTCG taxed at 12.5%
      </div>
    </div>
  );
}

function renderChart(widgetKey, widget) {
  switch (widgetKey) {
    case "allocation_drift":
      return widget.drift_timeline ? <DriftChart data={widget.drift_timeline} /> : null;
    case "overlap":
      return widget.clusters?.[0] ? <OverlapBar data={widget.clusters[0]} /> : null;
    case "selection_quality":
      return widget.drift_dual_line ? <SelectionChart data={widget.drift_dual_line} /> : null;
    case "bad_apples":
      return widget.funds ? <BadAppleChart funds={widget.funds} /> : null;
    case "tax":
      return widget.quarterly_breakdown ? <TaxChart data={widget.quarterly_breakdown} /> : null;
    default:
      return null;
  }
}

export default function EvidencePanel({ widgetKey, widget, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const isHigh = widget?.priority === "high" || widget?.confidence === "High";
  const signalColor = widget?.priority === "high" ? "var(--negative)" : "var(--warning)";
  const impactRupees = widget?.impact_rupees ?? 0;

  return (
    <AnimatePresence>
      {widget && (
        <>
          <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <motion.div
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: 480 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: 480,
              backgroundColor: "var(--surface)",
              borderLeft: "1px solid var(--border)",
              zIndex: 50,
              overflowY: "auto",
              padding: 36,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Close */}
            <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", fontFamily: '"Inter", sans-serif', fontSize: 14, color: "var(--text-muted)", padding: 4 }}>
              ✕
            </button>

            {/* 1. Signal label */}
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: signalColor, marginBottom: 10 }}>
              {widget.label ?? widgetKey?.replace(/_/g, " ")}
            </div>

            {/* 2. Headline */}
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.3, paddingRight: 24 }}>
              {widget.finding}
            </h2>

            {/* 3. Impact line */}
            {impactRupees > 0 && (
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 600, color: "var(--negative)", marginBottom: 14, fontVariantNumeric: "tabular-nums" }}>
                {fmt(impactRupees)} opportunity cost ({widget.impact_bps} bps)
              </div>
            )}

            {/* 4. Explanation */}
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 20px" }}>
              {widget.why_matters}
            </p>

            {/* 5. Chart */}
            <div style={{ marginBottom: 20 }}>
              {renderChart(widgetKey, widget)}
            </div>

            {/* 6. Data lineage badge */}
            <DataBadge timestamp={widget.data_as_of} source={widget.source} />

            {/* 7. Counterfactual / policy */}
            {widget.counterfactual && (
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--accent)", marginTop: 16, marginBottom: 20, paddingLeft: 14, borderLeft: "2px solid var(--accent)", lineHeight: 1.5 }}>
                → {widget.counterfactual}
              </div>
            )}

            {/* 8. Review button */}
            <button style={{ width: "100%", height: 44, backgroundColor: "transparent", border: "1px solid var(--accent)", borderRadius: "var(--radius)", fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, color: "var(--accent)", cursor: "pointer", transition: "background-color 0.15s ease", marginBottom: 12 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              Review
            </button>

            {/* 9. Confidence tag */}
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: "var(--text-muted)", textAlign: "center" }}>
              Confidence: {widget.confidence ?? "High"}
            </div>

            {/* 10. Disclosure */}
            {widget.disclosure && (
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: "var(--text-muted)", fontStyle: "italic", marginTop: 8, textAlign: "center" }}>
                {widget.disclosure}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

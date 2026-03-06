import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";
import DataBadge from "../components/DataBadge";
import marketInsights from "../data/marketInsights.json";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend, ReferenceDot, ResponsiveContainer,
} from "recharts";

const TICK = { fontFamily: '"Inter", sans-serif', fontSize: 11, fill: "var(--text-muted)" };
const TT = { backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontFamily: '"Inter", sans-serif', fontSize: 12, boxShadow: "none", padding: "8px 12px" };

function Panel({ index, heading, body, soWhat, confidence, dataDate, chart }) {
  return (
    <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: 36, display: "grid", gridTemplateColumns: "38% 62%", gap: 40, alignItems: "center" }}>
      <div>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 12 }}>{index}</div>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.3 }}>{heading}</h2>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 14px" }}>{body}</p>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--accent)", marginBottom: 8 }}>→ {soWhat}</div>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>{confidence} confidence</div>
        <DataBadge timestamp="2026-03-05T09:30:00" source="AMFI / SEBI" />
      </div>
      <div>{chart}</div>
    </div>
  );
}

export default function Insights() {
  const navigate = useNavigate();
  const { selectedPortfolio } = useApp();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <TopNav actNumber={1} />
      <div style={{ flex: 1, padding: "48px 40px 60px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>

        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)", marginBottom: 10 }}>ACT 1</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 30, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 12px" }}>What the Machine Sees</h1>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: "var(--text-muted)", margin: 0, maxWidth: 560, lineHeight: 1.7 }}>
            Before we look at your portfolio, here is what a decade of Mutual Fund data reveals about how the industry actually works.
          </p>
        </div>

        {/* Panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Panel
            index="01"
            heading="The fund universe grew 140% in a decade. Outcomes did not."
            body="The Indian MF market expanded from 1,624 to 3,892 schemes across the same 36 SEBI categories. Most growth is duplication. Navigating this requires a system, not a shortlist."
            soWhat="More choice has structurally increased the cost of bad selection."
            confidence="High"
            chart={
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={marketInsights.schemeProlif} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="0" stroke="transparent" />
                  <XAxis dataKey="year" tick={TICK} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                  <YAxis tick={TICK} axisLine={false} tickLine={false} width={60} label={{ value: "Number of Schemes", angle: -90, position: "insideLeft", offset: 14, style: { fontFamily: '"Inter", sans-serif', fontSize: 11, fill: "var(--text-muted)" } }} />
                  <Tooltip contentStyle={TT} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} formatter={(v) => [v.toLocaleString("en-IN") + " schemes", ""]} />
                  <Line type="monotone" dataKey="funds" stroke="var(--accent)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            }
          />

          <Panel
            index="02"
            heading="Diversification benefits peaked at 4 funds. After that, only complexity grew."
            body="Across covered categories, effective stock-level diversification reaches ~90% of its maximum at 4 funds. A 7th or 8th fund adds fewer than 5 additional effective exposures — while adding overlap and monitoring overhead."
            soWhat="Fund count is not diversification. Effective exposure is."
            confidence="High"
            chart={
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={marketInsights.diversificationCurve} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="0" stroke="transparent" />
                  <XAxis dataKey="funds" tick={TICK} axisLine={{ stroke: "var(--border)" }} tickLine={false} label={{ value: "Number of Funds", position: "insideBottom", offset: -2, style: { fontFamily: '"Inter", sans-serif', fontSize: 11, fill: "var(--text-muted)" } }} />
                  <YAxis tick={TICK} axisLine={false} tickLine={false} width={52} label={{ value: "Effective Stocks", angle: -90, position: "insideLeft", offset: 14, style: { fontFamily: '"Inter", sans-serif', fontSize: 11, fill: "var(--text-muted)" } }} />
                  <Tooltip contentStyle={TT} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} formatter={(v) => [v + " effective stocks", ""]} />
                  <Line type="monotone" dataKey="eff_stocks" stroke="var(--accent)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }} />
                  <ReferenceDot x={4} y={162} r={6} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2} label={{ value: "90% benefit", position: "top", style: { fontFamily: '"Inter", sans-serif', fontSize: 11, fill: "var(--accent)" } }} />
                </LineChart>
              </ResponsiveContainer>
            }
          />

          <Panel
            index="03"
            heading="Discipline in entry timing consistently outperformed market timing."
            body="Across every equity category, systematic SIP flows have delivered meaningfully better XIRR than large lumpsum deployments over rolling 10-year windows. The gap widens during volatile periods."
            soWhat="The entry policy matters more than the entry timing."
            confidence="High"
            chart={
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={marketInsights.sipVsLumpsum} margin={{ top: 8, right: 8, left: 0, bottom: 8 }} barCategoryGap="30%" barGap={4}>
                  <CartesianGrid strokeDasharray="0" stroke="transparent" />
                  <XAxis dataKey="category" tick={TICK} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                  <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={40} />
                  <Tooltip contentStyle={TT} cursor={{ fill: "var(--accent-light)" }} formatter={(v, n) => [`${v}%`, n]} />
                  <Legend wrapperStyle={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", paddingTop: 12 }} />
                  <Bar dataKey="sip_xirr" name="SIP XIRR" fill="var(--accent)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="lumpsum_xirr" name="Lumpsum XIRR" fill="var(--accent-mid)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            }
          />
        </div>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: 40, gap: 6 }}>
          <button onClick={() => navigate("/analysis")} className="btn-primary">
            View Portfolio Analysis →
          </button>
          {selectedPortfolio && (
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>
              Using: {selectedPortfolio.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

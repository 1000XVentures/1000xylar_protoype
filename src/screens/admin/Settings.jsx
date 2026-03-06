import appSettings from "../../data/appSettings.json";

export default function AdminSettings() {
  const dataAsOf = "2 Mar 2026, 9:30 AM";
  const lastRefreshed = "5 Mar 2026, 6:00 AM";

  return (
    <div>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--text-primary)", marginBottom: 32 }}>
        Settings
      </h1>

      {/* Section 1 — Demo configuration */}
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 20 }}>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Demo Configuration</div>
        <div style={{ display: "flex", gap: 32 }}>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>Sessions Allowed</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: "var(--text-primary)" }}>{appSettings.total_demo_sessions_allowed}</div>
          </div>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>Sessions Used</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: "var(--text-primary)" }}>{appSettings.sessions_used}</div>
          </div>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>Remaining</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: "var(--positive)" }}>
              {appSettings.total_demo_sessions_allowed - appSettings.sessions_used}
            </div>
          </div>
        </div>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 12, fontStyle: "italic" }}>
          Read-only in this prototype. Contact admin to adjust limits.
        </div>
      </div>

      {/* Section 2 — Coverage settings */}
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 20 }}>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Coverage Settings</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Covered Categories</div>
            {appSettings.covered_categories.map((cat) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--positive)", display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)" }}>{cat}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Not Covered in v1</div>
            {appSettings.uncovered_categories.map((cat) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--warning)", display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)" }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3 — Product version */}
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 20 }}>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Product Version</div>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-primary)" }}>
          {appSettings.product_version} · MMP · Launch target: 1 Apr 2026
        </div>
      </div>

      {/* Section 4 — Data sources */}
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24 }}>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Data Sources</div>
        {[
          { name: "CAMS RTA", status: "Active", detail: `Data as of: ${dataAsOf}` },
          { name: "MFapi.in", status: "Active", detail: `Last refreshed: ${lastRefreshed}` },
        ].map((src, i, arr) => (
          <div
            key={src.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500 }}>{src.name}</div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{src.detail}</div>
            </div>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--positive)", backgroundColor: "var(--positive-light)", padding: "3px 8px", borderRadius: 3 }}>
              {src.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useApp } from "../../context/AppContext";
import portfoliosData from "../../data/portfolios.json";

function fmt(n) {
  if (!n) return "—";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function AdminPortfolios() {
  const { sessions } = useApp();

  function usageCount(portfolioId) {
    return sessions.filter((s) => s.portfolio_used === portfolioId).length;
  }

  return (
    <div>
      <div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: "var(--text-primary)" }}>
          Demo Portfolios
        </h1>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
          Manage the sample portfolios used in demo sessions
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
        {portfoliosData.map((p) => (
          <div
            key={p.id}
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 600, color: "var(--text-primary)", textTransform: "capitalize" }}>
                {p.label ?? p.id}
              </div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                {p.description}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {[
                  `${p.funds?.length ?? 0} funds`,
                  p.riskProfile,
                  fmt(p.summary?.totalInvested),
                ].filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: "var(--surface-muted)",
                      fontFamily: '"Inter", sans-serif',
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      padding: "4px 10px",
                      borderRadius: 3,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: "var(--text-muted)" }}>
                Used {usageCount(p.id)}×
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn-outline"
                  style={{ height: 34, padding: "0 16px", fontSize: 12 }}
                >
                  View
                </button>
                <button
                  style={{
                    height: 34,
                    padding: "0 16px",
                    fontSize: 12,
                    fontFamily: '"Inter", sans-serif',
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", marginTop: 24 }}>
        Portfolio content is managed in /src/data/portfolios.json. Changes require a rebuild.
      </p>
    </div>
  );
}

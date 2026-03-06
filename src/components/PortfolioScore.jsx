export default function PortfolioScore({ score }) {
  const clamp = Math.max(0, Math.min(100, score ?? 0));
  const arcColor =
    clamp >= 71 ? "var(--positive)" : clamp >= 41 ? "var(--warning)" : "var(--negative)";

  // SVG arc: 180° semicircle
  const r = 44;
  const cx = 56;
  const cy = 56;
  const startAngle = -180;
  const endAngle = startAngle + (clamp / 100) * 180;

  function polarToCart(angleDeg, radius) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  const start = polarToCart(startAngle, r);
  const end = polarToCart(endAngle, r);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  const bgEnd = polarToCart(0, r);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 112, height: 62 }}>
        <svg width="112" height="62" viewBox="0 0 112 62" style={{ overflow: "visible" }}>
          {/* Background track */}
          <path
            d={`M ${polarToCart(-180, r).x} ${polarToCart(-180, r).y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Score arc */}
          {clamp > 0 && (
            <path
              d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
              fill="none"
              stroke={arcColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
          )}
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 32,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {clamp}
          </div>
        </div>
      </div>
      <div
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 10,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          marginTop: 8,
          textAlign: "center",
        }}
      >
        Portfolio Health Score
      </div>
    </div>
  );
}

function fmt(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
}

export default function GapHighlight({ actual, xylar }) {
  const delta = xylar - actual;
  if (delta <= 0) return null;

  return (
    <div>
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 24,
          fontWeight: 600,
          color: "var(--positive)",
          lineHeight: 1.2,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {fmt(delta)} more with Xylar intelligence
      </div>
      <div
        style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 11,
          color: "var(--text-muted)",
          marginTop: 4,
        }}
      >
        Policy-based, no leverage, human-approved actions
      </div>
    </div>
  );
}

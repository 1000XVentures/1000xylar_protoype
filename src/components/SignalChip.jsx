const DOT_COLORS = {
  high: "var(--negative)",
  medium: "var(--warning)",
  low: "var(--text-muted)",
};

export default function SignalChip({ signal, onClick }) {
  const dotColor = DOT_COLORS[signal?.priority] ?? "var(--warning)";

  return (
    <button
      onClick={() => onClick?.(signal)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        backgroundColor: "var(--warning-light)",
        border: "1px solid rgba(146,98,42,0.3)",
        borderRadius: 20,
        padding: "6px 14px",
        fontFamily: '"Inter", sans-serif',
        fontSize: 11,
        fontWeight: 500,
        color: "var(--warning)",
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5e8d5")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--warning-light)")}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: dotColor,
          flexShrink: 0,
        }}
      />
      {signal?.label}
    </button>
  );
}

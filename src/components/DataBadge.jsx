export default function DataBadge({ timestamp, source }) {
  const formatted = timestamp
    ? new Date(timestamp).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      style={{
        fontFamily: '"Inter", sans-serif',
        fontSize: 10,
        color: "var(--text-muted)",
        marginTop: 4,
        lineHeight: 1.4,
      }}
    >
      {formatted ? `As of ${formatted}` : ""}
      {formatted && source ? " · " : ""}
      {source || ""}
    </div>
  );
}

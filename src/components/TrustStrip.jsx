function IconShield() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 1L1.5 3v3c0 2.485 1.955 4.81 4.5 5.5C8.545 10.81 10.5 8.485 10.5 6V3L6 1z"
        stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <ellipse cx="6" cy="3" rx="4.5" ry="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M1.5 3v2.5c0 .828 2.015 1.5 4.5 1.5s4.5-.672 4.5-1.5V3" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M1.5 5.5V8c0 .828 2.015 1.5 4.5 1.5S10.5 8.828 10.5 8V5.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="5.5" width="8" height="5.5" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="6" cy="8.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

const ITEMS = [
  { icon: <IconShield />, label: "SEBI Registered" },
  { icon: <IconDatabase />, label: "Data via CAMS" },
  { icon: <IconLock />, label: "256-bit Encrypted" },
];

export default function TrustStrip() {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
      {ITEMS.map(({ icon, label }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)" }}>
          {icon}
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: "var(--text-muted)" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

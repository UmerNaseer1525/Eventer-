function InsightSectionHeader({
  icon,
  title,
  subtitle,
  accentColor = "#1677ff",
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: accentColor, fontSize: 16 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
          {title}
        </span>
      </div>
      {subtitle ? (
        <div
          style={{ fontSize: 12, color: "#aaa", marginTop: 3, marginLeft: 26 }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

export default InsightSectionHeader;

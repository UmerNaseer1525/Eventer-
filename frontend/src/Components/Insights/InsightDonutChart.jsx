function InsightDonutChart({ segments }) {
  const total = segments.reduce(
    (sum, segment) => sum + Number(segment.value || 0),
    0,
  );
  const safeTotal = total || 1;
  let current = 0;

  const gradientParts = segments.map((segment) => {
    const pct = (Number(segment.value || 0) / safeTotal) * 100;
    const start = current;
    current += pct;
    return `${segment.color} ${start.toFixed(1)}% ${current.toFixed(1)}%`;
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: `conic-gradient(${gradientParts.join(", ")})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 74,
            height: 74,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e" }}>
            {total}
          </div>
          <div style={{ fontSize: 10, color: "#aaa" }}>Total</div>
        </div>
      </div>
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
      >
        {segments.map((segment) => (
          <div
            key={segment.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: segment.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: "#555" }}>
                {segment.name}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>
                {segment.value}
              </span>
              <span style={{ fontSize: 11, color: "#aaa" }}>
                {((Number(segment.value || 0) / safeTotal) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsightDonutChart;

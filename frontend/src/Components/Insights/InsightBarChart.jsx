function InsightBarChart({ data, dataKey, color, maxValue }) {
  const max =
    maxValue || Math.max(1, ...data.map((item) => Number(item[dataKey]) || 0));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height: 160,
        paddingBottom: 24,
        position: "relative",
      }}
    >
      {data.map((item, index) => {
        const value = Number(item[dataKey]) || 0;
        const pct = Math.round((value / max) * 100);

        return (
          <div
            key={`${item.month}-${index}`}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>
              {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
            </div>
            <div
              style={{
                width: "100%",
                borderRadius: "4px 4px 0 0",
                height: `${pct}%`,
                minHeight: 4,
                background: `linear-gradient(to top, ${color}, ${color}99)`,
              }}
              title={`${item.month}: ${value}`}
            />
            <div
              style={{
                fontSize: 10,
                color: "#aaa",
                position: "absolute",
                bottom: 0,
              }}
            >
              {item.month}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InsightBarChart;

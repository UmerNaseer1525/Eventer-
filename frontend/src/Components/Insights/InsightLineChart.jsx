function InsightLineChart({ data, dataKey, color }) {
  const values = data.map((item) => Number(item[dataKey]) || 0);
  const max = Math.max(1, ...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const height = 130;
  const step = data.length > 1 ? 100 / (data.length - 1) : 100;

  const points = data.map((item, index) => ({
    x: index * step,
    y: height - (((Number(item[dataKey]) || 0) - min) / range) * height,
  }));

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const area = `${path} L ${points[points.length - 1]?.x ?? 0} ${height} L 0 ${height} Z`;

  return (
    <div
      style={{ position: "relative", height: height + 30, overflow: "hidden" }}
    >
      <svg
        width="100%"
        height={height + 4}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#grad-${dataKey})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="0.8" />
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="1.2" fill={color} />
        ))}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        {data.map((item, index) => (
          <span
            key={`${item.month}-${index}`}
            style={{
              fontSize: 10,
              color: "#aaa",
              flex: 1,
              textAlign: "center",
            }}
          >
            {item.month}
          </span>
        ))}
      </div>
    </div>
  );
}

export default InsightLineChart;

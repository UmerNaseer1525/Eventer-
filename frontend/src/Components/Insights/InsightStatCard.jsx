import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic, Typography } from "antd";

const { Text } = Typography;

function InsightStatCard({
  title,
  value,
  prefix,
  suffix,
  icon,
  color,
  change,
}) {
  const isUp = Number(change) >= 0;

  return (
    <Card
      style={{
        borderRadius: 14,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        borderTop: `4px solid ${color}`,
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: "#888",
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            {title}
          </div>
          <Statistic
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ fontSize: 26, fontWeight: 900, color: "#1a1a2e" }}
          />
          {change !== undefined && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {isUp ? (
                <ArrowUpOutlined style={{ color: "#52c41a", fontSize: 12 }} />
              ) : (
                <ArrowDownOutlined style={{ color: "#f5222d", fontSize: 12 }} />
              )}
              <Text
                style={{
                  fontSize: 12,
                  color: isUp ? "#52c41a" : "#f5222d",
                  fontWeight: 600,
                }}
              >
                {Math.abs(Number(change))}%
              </Text>
              <Text style={{ fontSize: 12, color: "#aaa" }}>trend</Text>
            </div>
          )}
        </div>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default InsightStatCard;

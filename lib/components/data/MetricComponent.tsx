import React from "react";
import { SQLPageProps } from "../../types/unified";

interface MetricsProps {
  items?: SQLPageProps[]; // Multiple metrics
}

// Single metric component
const MetricItem: React.FC<SQLPageProps> = (props) => {
  const { label, value, icon, prefix, suffix, trend } = props;

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        {icon && <span className="metric-icon">{icon}</span>}
      </div>
      <div className="metric-value">
        {prefix}
        {value}
        {suffix}
      </div>
      {trend !== undefined && (
        <div className={`metric-trend ${trend >= 0 ? "positive" : "negative"}`}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </div>
      )}
      <style jsx>{`
        .metric-card {
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin: 10px 0;
          min-width: 200px;
        }
        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .metric-label {
          color: #666;
          font-size: 14px;
        }
        .metric-icon {
          color: #999;
        }
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .metric-trend {
          font-size: 14px;
          display: flex;
          align-items: center;
        }
        .positive {
          color: #4caf50;
        }
        .negative {
          color: #f44336;
        }
      `}</style>
    </div>
  );
};

// Main component that handles both single and multiple metrics
const MetricComponent: React.FC<SQLPageProps | MetricsProps> = (props) => {
  // If items array is provided, render multiple metrics
  if ("items" in props && props.items) {
    return (
      <div className="metrics-grid">
        {props.items.map((metric, index) => (
          <MetricItem key={index} {...metric} />
        ))}
        <style jsx>{`
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
            margin: 20px 0;
          }
        `}</style>
      </div>
    );
  }

  // Single metric case
  return <MetricItem {...(props as SQLPageProps)} />;
};

export default MetricComponent;

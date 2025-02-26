import React from 'react';

interface ChartProps {
  type: 'bar' | 'line' | 'pie';
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

const ChartComponent: React.FC<ChartProps> = ({ type, title, labels, datasets }) => {
  // In a real implementation, you would use a charting library like Chart.js
  // This is a simplified representation
  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart">
        <div className="chart-placeholder">
          <p>Chart: {type}</p>
          <p>Labels: {labels.join(', ')}</p>
          <p>Datasets: {datasets.map(d => d.label).join(', ')}</p>
          <p className="note">Note: In a real implementation, this would render an actual {type} chart</p>
        </div>
      </div>
      <style jsx>{`
        .chart-container {
          margin: 20px 0;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
        }
        .chart-title {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 18px;
        }
        .chart {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chart-placeholder {
          text-align: center;
          color: #666;
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 4px;
          width: 100%;
        }
        .note {
          font-style: italic;
          font-size: 0.9em;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ChartComponent;

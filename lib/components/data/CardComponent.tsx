import React from 'react';

interface CardProps {
  title: string;
  content: string;
}

const CardComponent: React.FC<CardProps> = ({ title, content }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-content">{content}</div>
      <style jsx>{`
        .card {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 16px;
          margin: 16px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .card-title {
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 18px;
        }
        .card-content {
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default CardComponent;

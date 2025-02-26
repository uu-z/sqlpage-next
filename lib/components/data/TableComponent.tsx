import React from 'react';

interface Column {
  column_name: string;
  data_type: string;
}

interface TableProps {
  schema: Column[];
  data: Record<string, any>[];
}

const TableComponent: React.FC<TableProps> = ({ schema, data }) => {
  if (!schema || !data || !Array.isArray(data)) {
    return <div>Invalid table data</div>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {schema.map((col, idx) => (
              <th key={idx}>{col.column_name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {schema.map((col, colIdx) => (
                <td key={colIdx}>{row[col.column_name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .table-container {
          margin: 20px 0;
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table th, .data-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .data-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .data-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
};

export default TableComponent;

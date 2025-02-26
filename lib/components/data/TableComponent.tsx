import React from "react";

// Convention over configuration:
// - Column names are used directly from SQL
// - Special prefixes in SQL column names indicate behavior:
//   $: currency (e.g. $price)
//   #: number (e.g. #count)
//   @: link (e.g. @profile_url)
//   !: trend (e.g. !change)
//   ?: tooltip (e.g. ?description)
//   &: icon (e.g. &status = "✅")

const TableComponent: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data?.length) return null;

  // Get column names from first row
  const columns = Object.keys(data[0]);

  const formatCell = (value: any, column: string) => {
    if (value === null || value === undefined) return "";

    // Handle special column prefixes
    if (column.startsWith("$")) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(value));
    }

    if (column.startsWith("#")) {
      return new Intl.NumberFormat().format(Number(value));
    }

    if (column.startsWith("@") && value) {
      return (
        <a href={value} className="cell-link">
          {value}
        </a>
      );
    }

    if (column.startsWith("!") && value !== null) {
      const trend = Number(value);
      return (
        <span
          className={`trend ${trend >= 0 ? "positive" : "negative"}`}
          title={`${trend >= 0 ? "+" : ""}${trend}%`}
        >
          {trend >= 0 ? "↑" : "↓"}
          {Math.abs(trend)}%
        </span>
      );
    }

    if (column.startsWith("&")) {
      return <span className="icon">{value}</span>;
    }

    return value;
  };

  const formatHeader = (column: string) => {
    // Remove special prefixes and convert to title case
    const name = column
      .replace(/^[$#@!?&]/, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return name;
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{formatHeader(col)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col) => (
                <td key={col}>{formatCell(row[col], col)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .table-container {
          margin: 20px 0;
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table th,
        .data-table td {
          border: 1px solid #edf2f7;
          padding: 12px;
          text-align: left;
        }
        .data-table th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #4a5568;
        }
        .data-table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .data-table tr:hover {
          background-color: #f3f4f6;
        }
        .icon {
          font-size: 1.2em;
        }
        .trend {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .trend.positive {
          background-color: #e6ffed;
          color: #0a7d33;
        }
        .trend.negative {
          background-color: #ffe6e6;
          color: #d73a49;
        }
        .cell-link {
          color: #2563eb;
          text-decoration: none;
        }
        .cell-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default TableComponent;

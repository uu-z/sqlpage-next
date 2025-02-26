// SQLPage-compatible unified interface (max 10 fields)
export interface SQLPageProps {
  type?: string;        // Component type (bar/line/pie for charts, string/number for data)
  label?: string;       // Display text (column name, title, header)
  value?: any;         // Primary value
  description?: string; // Secondary text
  icon?: string;       // Visual indicator (emoji)
  href?: string;       // Link URL
  prefix?: string;     // Value prefix ($)
  suffix?: string;     // Value suffix (%)
  trend?: number;      // Trend indicator
}

/*
SQL Examples:

1. Metric:
SELECT 
  'Total Sales' as label,
  SUM(amount) as value,
  '💰' as icon,
  '$' as prefix,
  5 as trend;

2. Chart:
SELECT 
  'bar' as type,
  'Monthly Sales' as label;

SELECT 
  date as label,
  amount as value,
  '$' as prefix
FROM sales;

3. Table:
SELECT 
  name as label,
  'string' as type,
  price as value,
  '$' as prefix
FROM products;
*/

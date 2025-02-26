-- @component navbar
SELECT 'SQL-Driven UI' as title, NULL as logo;

SELECT 'Home' as label, '/' as href, 0 as active
UNION ALL
SELECT 'Dashboard' as label, '/dashboard' as href, 1 as active
UNION ALL
SELECT 'Users' as label, '/users' as href, 0 as active
UNION ALL
SELECT 'Products' as label, '/products' as href, 0 as active;

-- @component hero
SELECT 
  'Dashboard Overview' as headline,
  'Monitor your key metrics and performance indicators' as subheadline,
  NULL as background_image,
  NULL as cta_text,
  NULL as cta_link;

-- @component metrics
SELECT 
  'Total Users' as label, 
  COUNT(*) as value,
  '👤' as icon
FROM users;

SELECT 
  'Active Users' as label,
  COUNT(*) as value,
  '✓' as icon,
  '%' as suffix,
  (SELECT CAST(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM users), 0) as INTEGER) FROM users WHERE is_active = 1) as trend
FROM users
WHERE is_active = 1;

SELECT 
  'Total Products' as label,
  COUNT(*) as value,
  '📦' as icon
FROM products;

SELECT 
  'Total Revenue' as label,
  SUM(revenue) as value,
  '💰' as icon,
  '$' as prefix
FROM sales;

-- @component chart
SELECT 
  'bar' as type,
  'Monthly Sales' as label;

SELECT 
  strftime('%Y-%m', sale_date) as label,
  SUM(revenue) as value,
  '$' as prefix
FROM sales
GROUP BY strftime('%Y-%m', sale_date)
ORDER BY label;

-- @component table
WITH top_products AS (
  SELECT 
    p.id,
    p.name as product_name,
    p.category,
    p.stock as "#stock",
    p.price as "$price",
    COALESCE(SUM(s.revenue), 0) as "$revenue",
    COALESCE(
      CAST(
        ((SUM(s.revenue) - LAG(SUM(s.revenue)) OVER (ORDER BY SUM(s.revenue))) * 100.0 / 
        NULLIF(LAG(SUM(s.revenue)) OVER (ORDER BY SUM(s.revenue)), 0)
      ) as INTEGER
      ), 0
    ) as "!revenue_change",
    '📦' as "&icon"
  FROM products p
  LEFT JOIN sales s ON p.id = s.product_id
  GROUP BY p.id
  ORDER BY SUM(s.revenue) DESC NULLS LAST
  LIMIT 5
)
SELECT * FROM top_products;

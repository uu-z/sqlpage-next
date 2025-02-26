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
SELECT 'Total Users' as label, COUNT(*) as value, NULL as trend, NULL as prefix, NULL as suffix, '👤' as icon
FROM users;

SELECT 'Active Users' as label, COUNT(*) as value, 
  (SELECT CAST(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM users), 0) as INTEGER) FROM users WHERE is_active = 1) as trend,
  NULL as prefix, '%' as suffix, '✓' as icon
FROM users
WHERE is_active = 1;

SELECT 'Total Products' as label, COUNT(*) as value, NULL as trend, NULL as prefix, NULL as suffix, '📦' as icon
FROM products;

SELECT 'Total Revenue' as label, SUM(revenue) as value, NULL as trend, '$' as prefix, NULL as suffix, '💰' as icon
FROM sales;

-- @component chart
SELECT 
  'bar' as type,
  'Monthly Sales' as title,
  'Revenue' as dataset_label;

SELECT 
  strftime('%Y-%m', sale_date) as label,
  SUM(revenue) as value
FROM sales
GROUP BY strftime('%Y-%m', sale_date)
ORDER BY label;

-- @component table
SELECT 
  'Product' as column_name,
  'string' as data_type
UNION ALL
SELECT 'Category', 'string'
UNION ALL
SELECT 'Stock', 'number'
UNION ALL
SELECT 'Price', 'currency'
UNION ALL
SELECT 'Revenue', 'currency';

SELECT 
  p.name as Product,
  p.category as Category,
  p.stock as Stock,
  '$' || printf('%.2f', p.price) as Price,
  '$' || printf('%.2f', COALESCE(SUM(s.revenue), 0)) as Revenue
FROM products p
LEFT JOIN sales s ON p.id = s.product_id
GROUP BY p.id
ORDER BY SUM(s.revenue) DESC NULLS LAST
LIMIT 5;

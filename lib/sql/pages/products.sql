-- @component navbar
SELECT 'SQL-Driven UI' as title, NULL as logo;

SELECT 'Home' as label, '/' as href, 0 as active
UNION ALL
SELECT 'Dashboard' as label, '/dashboard' as href, 0 as active
UNION ALL
SELECT 'Users' as label, '/users' as href, 0 as active
UNION ALL
SELECT 'Products' as label, '/products' as href, 1 as active;

-- @component hero
SELECT 
  'Product Catalog' as headline,
  'Browse and manage your product inventory' as subheadline,
  NULL as background_image,
  'Add New Product' as cta_text,
  '#new-product-form' as cta_link;

-- @component list
SELECT 'Product Catalog' as title;

SELECT 
  name as title,
  description as description,
  image as image,
  '/product/' || id as link,
  category || ', $' || price as tags
FROM products
ORDER BY name;

-- @component form
SELECT 
  'Add New Product' as title,
  'Create Product' as submit_label,
  '/api/products' as action,
  'POST' as method;

SELECT 
  'name' as name,
  'Product Name' as label,
  'text' as type,
  'Enter product name' as placeholder,
  1 as required,
  NULL as options,
  NULL as default_value
UNION ALL
SELECT 
  'description',
  'Description',
  'textarea',
  'Enter product description',
  0,
  NULL,
  NULL
UNION ALL
SELECT 
  'price',
  'Price ($)',
  'number',
  'Enter price',
  1,
  NULL,
  NULL
UNION ALL
SELECT 
  'category',
  'Category',
  'select',
  NULL,
  1,
  '[{"value":"Electronics","label":"Electronics"},{"value":"Audio","label":"Audio"},{"value":"Accessories","label":"Accessories"}]',
  'Electronics'
UNION ALL
SELECT 
  'stock',
  'Stock Quantity',
  'number',
  'Enter quantity',
  1,
  NULL,
  '1';

-- @component chart
SELECT 
  'pie' as type,
  'Products by Category' as title,
  'Products' as dataset_label;

SELECT 
  category as label,
  COUNT(*) as value
FROM products
GROUP BY category;

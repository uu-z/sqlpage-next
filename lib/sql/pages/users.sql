-- @component navbar
SELECT 'SQL-Driven UI' as title, NULL as logo;

SELECT 'Home' as label, '/' as href, 0 as active
UNION ALL
SELECT 'Dashboard' as label, '/dashboard' as href, 0 as active
UNION ALL
SELECT 'Users' as label, '/users' as href, 1 as active
UNION ALL
SELECT 'Products' as label, '/products' as href, 0 as active;

-- @component hero
SELECT 
  'User Management' as headline,
  'View and manage user accounts' as subheadline,
  NULL as background_image,
  NULL as cta_text,
  NULL as cta_link;

-- @component table
SELECT 
  'Avatar' as column_name,
  'image' as data_type
UNION ALL
SELECT 'ID', 'number'
UNION ALL
SELECT 'Username', 'string'
UNION ALL
SELECT 'Email', 'string'
UNION ALL
SELECT 'Created', 'date'
UNION ALL
SELECT 'Status', 'boolean';

SELECT 
  avatar as Avatar,
  id as ID,
  username as Username,
  email as Email,
  created_at as Created,
  is_active as Status
FROM users
ORDER BY id;

-- @component form
SELECT 
  'Add New User' as title,
  'Create User' as submit_label,
  '/api/users' as action,
  'POST' as method;

SELECT 
  'username' as name,
  'Username' as label,
  'text' as type,
  'Enter username' as placeholder,
  1 as required,
  '[]' as options,
  NULL as default_value
UNION ALL
SELECT 
  'email',
  'Email Address',
  'email',
  'Enter email address',
  1,
  '[]' as options,
  NULL
UNION ALL
SELECT 
  'is_active',
  'Active User',
  'checkbox',
  NULL,
  0,
  '[]' as options,
  '1';

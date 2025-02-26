import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Promisify SQLite methods
const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

// Initialize database with sample data
export async function initializeDb() {
  // Users table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_active INTEGER NOT NULL,
      avatar TEXT
    )
  `);
  
  // Products table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      stock INTEGER NOT NULL
    )
  `);
  
  // Sales table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      sale_date TEXT NOT NULL,
      revenue REAL NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);
  
  // Insert sample data if tables are empty
  const users = await dbAll("SELECT COUNT(*) as count FROM users");
  if (users[0].count === 0) {
    await dbRun(`
      INSERT INTO users (username, email, created_at, is_active, avatar)
      VALUES 
        ('user1', 'user1@example.com', '2023-01-01', 1, 'https://ui-avatars.com/api/?name=User+1'),
        ('user2', 'user2@example.com', '2023-01-02', 1, 'https://ui-avatars.com/api/?name=User+2'),
        ('user3', 'user3@example.com', '2023-01-03', 0, 'https://ui-avatars.com/api/?name=User+3'),
        ('user4', 'user4@example.com', '2023-01-04', 1, 'https://ui-avatars.com/api/?name=User+4')
    `);
  }
  
  const products = await dbAll("SELECT COUNT(*) as count FROM products");
  if (products[0].count === 0) {
    await dbRun(`
      INSERT INTO products (name, description, price, category, image, stock)
      VALUES 
        ('Laptop', 'High-performance laptop', 999.99, 'Electronics', 'https://via.placeholder.com/150', 10),
        ('Smartphone', 'Latest smartphone model', 699.99, 'Electronics', 'https://via.placeholder.com/150', 15),
        ('Headphones', 'Noise-cancelling headphones', 199.99, 'Audio', 'https://via.placeholder.com/150', 20),
        ('Monitor', '4K Ultra HD Monitor', 349.99, 'Electronics', 'https://via.placeholder.com/150', 8),
        ('Keyboard', 'Mechanical gaming keyboard', 89.99, 'Accessories', 'https://via.placeholder.com/150', 25)
    `);
  }
  
  const sales = await dbAll("SELECT COUNT(*) as count FROM sales");
  if (sales[0].count === 0) {
    await dbRun(`
      INSERT INTO sales (product_id, quantity, sale_date, revenue)
      VALUES 
        (1, 2, '2023-01-10', 1999.98),
        (2, 3, '2023-01-15', 2099.97),
        (3, 5, '2023-01-20', 999.95),
        (4, 1, '2023-01-25', 349.99),
        (5, 4, '2023-01-30', 359.96),
        (1, 1, '2023-02-05', 999.99),
        (2, 2, '2023-02-10', 1399.98),
        (3, 3, '2023-02-15', 599.97)
    `);
  }
}

// Execute SQL from file
export async function executeSQL(sqlFilePath: string) {
  const fullPath = path.join(process.cwd(), 'lib/sql/pages', `${sqlFilePath}.sql`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`SQL file not found: ${fullPath}`);
    }
    
    const sqlContent = fs.readFileSync(fullPath, 'utf8');
    
    // Split SQL by component markers
    const componentSections = sqlContent.split(/--\s*@component\s+/i);
    
    // If no component markers, treat as a single query
    if (componentSections.length === 1) {
      const sqlStatements = sqlContent.split(';').filter(stmt => stmt.trim());
      
      const results = [];
      
      // Execute each SQL statement
      for (const stmt of sqlStatements) {
        if (stmt.trim()) {
          const result = await dbAll(stmt);
          if (result.length > 0) {
            results.push(result);
          }
        }
      }
      
      // Return schema and data
      if (results.length >= 2) {
        return {
          schema: results[0],
          data: results[1]
        };
      }
      
      return { data: results[0] || [] };
    } 
    // Process multiple components
    else {
      const results = [];
      
      // First section is empty (before first @component)
      for (let i = 1; i < componentSections.length; i++) {
        const section = componentSections[i];
        const firstLineBreak = section.indexOf('\n');
        
        // Extract component type from first line
        const componentType = section.substring(0, firstLineBreak).trim();
        const componentSQL = section.substring(firstLineBreak).trim();
        
        // Split into statements
        const statements = componentSQL.split(';').filter(stmt => stmt.trim());
        
        // Execute statements for this component
        const componentResults = [];
        for (const stmt of statements) {
          if (stmt.trim()) {
            try {
              const result = await dbAll(stmt);
              if (result.length > 0) {
                componentResults.push(result);
              }
            } catch (error) {
              console.error(`Error executing SQL for ${componentType}:`, error);
            }
          }
        }
        
        // Process results based on component type
        if (componentResults.length > 0) {
          // Add component type to the result
          const componentData: any = { component: componentType };
          
          // Different components might need different data structures
          if (componentType === 'table' && componentResults.length >= 2) {
            Object.assign(componentData, {
              schema: componentResults[0],
              data: componentResults[1]
            });
          } else if (componentType === 'chart' && componentResults.length >= 2) {
            // First result has chart config
            const config = componentResults[0][0];
            // Second result has data points
            const dataPoints = componentResults[1];
            
            Object.assign(componentData, {
              type: config.type || 'bar',
              title: config.title,
              labels: dataPoints.map((p: any) => p.label),
              datasets: [{
                label: config.dataset_label || '',
                data: dataPoints.map((p: any) => p.value)
              }]
            });
          } else if (componentType === 'metrics' && componentResults.length > 0) {
            // Each row is a separate metric
            Object.assign(componentData, {
              items: componentResults[0].map((metric: any) => ({
                label: metric.label,
                value: metric.value,
                trend: metric.trend,
                prefix: metric.prefix,
                suffix: metric.suffix,
                icon: metric.icon
              }))
            });
          } else if (componentType === 'list' && componentResults.length > 0) {
            // First result might have list config
            const config = componentResults[0].length === 1 && 
                          (componentResults[0][0].title || componentResults[0][0].list_title) ? 
                          componentResults[0][0] : null;
            
            // Items are in the last result set
            const items = config ? componentResults[1] : componentResults[0];
            
            Object.assign(componentData, {
              title: config?.title || config?.list_title,
              items: items.map((item: any) => ({
                title: item.title,
                description: item.description,
                image: item.image,
                link: item.link,
                tags: item.tags ? item.tags.split(',').map((t: string) => t.trim()) : undefined
              }))
            });
          } else if (componentType === 'form' && componentResults.length > 0) {
            // First result has form config
            const config = componentResults[0][0];
            // Second result has field definitions
            const fields = componentResults.length > 1 ? componentResults[1] : [];
            
            Object.assign(componentData, {
              title: config.title,
              submitLabel: config.submit_label || 'Submit',
              action: config.action || '#',
              method: config.method || 'POST',
              fields: fields.map((field: any) => ({
                name: field.name,
                label: field.label,
                type: field.type || 'text',
                placeholder: field.placeholder,
                required: field.required === 1,
                options: field.options ? JSON.parse(field.options) : undefined,
                defaultValue: field.default_value
              }))
            });
          } else if (componentType === 'navbar' && componentResults.length > 0) {
            // First result has navbar config
            const config = componentResults[0][0];
            // Second result has links
            const links = componentResults.length > 1 ? componentResults[1] : [];
            
            Object.assign(componentData, {
              title: config.title,
              logo: config.logo,
              links: links.map((link: any) => ({
                label: link.label,
                href: link.href,
                active: link.active === 1
              }))
            });
          } else if (componentType === 'hero' && componentResults.length > 0) {
            // Hero config is in the first result
            const config = componentResults[0][0];
            
            Object.assign(componentData, {
              headline: config.headline,
              subheadline: config.subheadline,
              backgroundImage: config.background_image,
              ctaText: config.cta_text,
              ctaLink: config.cta_link
            });
          } else if (componentType === 'card' && componentResults.length > 0) {
            // Card data is in the first result
            const cardData = componentResults[0][0];
            
            Object.assign(componentData, {
              title: cardData.title,
              content: cardData.content || cardData.description
            });
          } else if (componentType === 'metric' && componentResults.length > 0) {
            // Metric data is in the first result
            const metricData = componentResults[0][0];
            
            Object.assign(componentData, {
              label: metricData.label,
              value: metricData.value,
              trend: metricData.trend,
              prefix: metricData.prefix,
              suffix: metricData.suffix,
              icon: metricData.icon
            });
          } else {
            // For other components, just pass the raw data
            Object.assign(componentData, {
              data: componentResults[0]
            });
          }
          
          results.push(componentData);
        }
      }
      
      return results;
    }
  } catch (error) {
    console.error('SQL execution error:', error);
    return { error: (error as Error).message };
  }
}

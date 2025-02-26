import { dbRun, dbAll } from './connection';

// Initialize database with sample data
export async function initializeDb() {
  await createTables();
  await insertSampleData();
}

async function createTables() {
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
}

async function insertSampleData() {
  // Insert sample users
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
  
  // Insert sample products
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
  
  // Insert sample sales
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

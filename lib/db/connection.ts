import sqlite3 from 'sqlite3';
import { promisify } from 'util';

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Promisify SQLite methods
export const dbRun = promisify(db.run.bind(db));
export const dbAll = promisify(db.all.bind(db));

export default db;

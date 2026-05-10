import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('contacts.db');

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT UNIQUE
    );
  `);
};
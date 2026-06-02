const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

async function getDB() {
  return getPool();
}

async function run(db, sql, params = []) {
  const [result] = await db.execute(sql, params);
  return result;
}

async function get(db, sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows[0] || null;
}

async function all(db, sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows;
}

function saveDB() {}

async function initDB() {
  const db = getPool();

  await db.execute(`CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT NOT NULL,
    video_url TEXT,
    website_url TEXT,
    github_url TEXT,
    thumbnail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const [rows] = await db.execute('SELECT id FROM admins WHERE email = ?', ['aaachchak@gmail.com']);
  if (rows.length === 0) {
    const hashed = await bcrypt.hash('Achrafreali06', 12);
    await db.execute('INSERT INTO admins (email, password) VALUES (?, ?)', ['aaachchak@gmail.com', hashed]);
    console.log('✅ Admin account created');
  }

  console.log('✅ Database initialized');
}

module.exports = { getDB, initDB, run, get, all, saveDB };

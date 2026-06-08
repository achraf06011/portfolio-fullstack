const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

function toPostgres(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

async function getDB() {
  return getPool();
}

async function run(db, sql, params = []) {
  let pgSql = toPostgres(sql);
  if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
    pgSql += ' RETURNING id';
  }
  const { rows } = await db.query(pgSql, params);
  return { insertId: rows[0]?.id, rows };
}

async function get(db, sql, params = []) {
  const { rows } = await db.query(toPostgres(sql), params);
  return rows[0] || null;
}

async function all(db, sql, params = []) {
  const { rows } = await db.query(toPostgres(sql), params);
  return rows;
}

function saveDB() {}

async function initDB() {
  const db = getPool();

  await db.query(`CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT NOT NULL,
    video_url TEXT,
    website_url TEXT,
    github_url TEXT,
    thumbnail TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  const { rows } = await db.query('SELECT id FROM admins WHERE email = $1', ['aaachchak@gmail.com']);
  if (rows.length === 0) {
    const hashed = await bcrypt.hash('Achrafreali06', 12);
    await db.query('INSERT INTO admins (email, password) VALUES ($1, $2)', ['aaachchak@gmail.com', hashed]);
    console.log('✅ Admin account created');
  }

  console.log('✅ Database initialized');
}

module.exports = { getDB, initDB, run, get, all, saveDB };

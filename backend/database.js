const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'portfolio.db.json');
let db = null;
let SQL = null;

async function getSqlJs() {
  if (!SQL) SQL = await initSqlJs();
  return SQL;
}

async function getDB() {
  if (db) return db;
  const Sql = await getSqlJs();
  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      const buf = Buffer.from(raw, 'base64');
      db = new Sql.Database(buf);
    } catch (e) {
      console.warn('⚠️  Database file corrupted, creating a fresh one...');
      fs.unlinkSync(DB_PATH);
      db = new Sql.Database();
    }
  } else {
    db = new Sql.Database();
  }
  return db;
}

function saveDB(db) {
  const data = db.export();
  const buf = Buffer.from(data);
  fs.writeFileSync(DB_PATH, JSON.stringify(buf.toString('base64')));
}

function run(db, sql, params = []) {
  db.run(sql, params);
  saveDB(db);
}

function get(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function all(db, sql, params = []) {
  const results = [];
  const stmt = db.prepare(sql);
  stmt.bind(params);
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

async function initDB() {
  const db = await getDB();

  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT NOT NULL,
    video_url TEXT,
    website_url TEXT,
    github_url TEXT,
    thumbnail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);

  saveDB(db);

  const existing = get(db, 'SELECT id FROM admins WHERE email = ?', ['aaachchak@gmail.com']);
  if (!existing) {
    const hashed = await bcrypt.hash('Achrafreali06', 12);
    run(db, 'INSERT INTO admins (email, password) VALUES (?, ?)', ['aaachchak@gmail.com', hashed]);
    console.log('✅ Admin account created');
  }

  const countRes = get(db, 'SELECT COUNT(*) as count FROM projects');
  if (!countRes || countRes.count === 0) {
    const samples = [
      ['E-Commerce Platform', "Plateforme e-commerce complète avec gestion des produits, panier d'achat, paiement en ligne et tableau de bord admin.", 'React,Node.js,Express,MySQL,Stripe,JWT', null, 'https://example.com', 'https://github.com/achraf', null],
      ['Application de Gestion RH', 'Système complet de gestion des ressources humaines avec suivi des employés, congés, paie et rapports analytiques.', 'Vue.js,Laravel,MySQL,Chart.js,Docker', null, null, 'https://github.com/achraf', null],
      ['Portfolio Interactif', 'Portfolio professionnel avec animations 3D, espace admin pour gérer les projets et upload de vidéos de démonstration.', 'React,Node.js,SQLite,Framer Motion', null, null, 'https://github.com/achraf', null],
    ];
    for (const s of samples) {
      run(db, 'INSERT INTO projects (title,description,technologies,video_url,website_url,github_url,thumbnail) VALUES (?,?,?,?,?,?,?)', s);
    }
    console.log('✅ Sample projects seeded');
  }

  console.log('✅ Database initialized');
}

module.exports = { getDB, initDB, run, get, all, saveDB };
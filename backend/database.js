const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Configuration de la connexion (les infos te seront données par Aiven)
// En attendant, ça se connectera à ton WAMP local si tu mets les infos classiques
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db', // Pense à créer cette base dans phpMyAdmin en local
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getDB() {
  return pool;
}

// Adaptation de tes fonctions pour qu'elles utilisent MySQL
async function run(db, sql, params = []) {
  await db.execute(sql, params);
}

async function get(db, sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

async function all(db, sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows;
}

async function initDB() {
  const db = await getDB();

  // Création des tables
  await db.execute(`CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(255) NOT NULL,
    video_url VARCHAR(255),
    website_url VARCHAR(255),
    github_url VARCHAR(255),
    thumbnail VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Vérification de l'admin
  const existing = await get(db, 'SELECT id FROM admins WHERE email = ?', ['aaachchak@gmail.com']);
  if (!existing) {
    const hashed = await bcrypt.hash('Achrafreali06', 12);
    await run(db, 'INSERT INTO admins (email, password) VALUES (?, ?)', ['aaachchak@gmail.com', hashed]);
    console.log('✅ Admin account created');
  }

  // Vérification des projets de base
  const countRes = await get(db, 'SELECT COUNT(*) as count FROM projects');
  if (!countRes || countRes.count === 0) {
    const samples = [
      ['E-Commerce Platform', "Plateforme e-commerce complète avec gestion des produits, panier d'achat, paiement en ligne et tableau de bord admin.", 'React,Node.js,Express,MySQL,Stripe,JWT', null, 'https://example.com', 'https://github.com/achraf', null],
      ['Application de Gestion RH', 'Système complet de gestion des ressources humaines avec suivi des employés, congés, paie et rapports analytiques.', 'Vue.js,Laravel,MySQL,Chart.js,Docker', null, null, 'https://github.com/achraf', null],
      ['Portfolio Interactif', 'Portfolio professionnel avec animations 3D, espace admin pour gérer les projets et upload de vidéos de démonstration.', 'React,Node.js,SQLite,Framer Motion', null, null, 'https://github.com/achraf', null],
    ];
    for (const s of samples) {
      await run(db, 'INSERT INTO projects (title,description,technologies,video_url,website_url,github_url,thumbnail) VALUES (?,?,?,?,?,?,?)', s);
    }
    console.log('✅ Sample projects seeded');
  }

  console.log('✅ Database initialized');
}

module.exports = { getDB, initDB, run, get, all };
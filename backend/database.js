const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pool = null;
let useMemoryStore = !process.env.DATABASE_URL || (process.env.VERCEL && process.env.USE_POSTGRES !== 'true');
let nextProjectId = 5;
let nextMessageId = 2;

const memoryStore = {
  admins: [
    {
      id: 1,
      email: 'aaachchak@gmail.com',
      password: '$2a$12$noYIW4hYPlZoArfG41yz7uLqyVwnu.E4r6lO4i5WYhLuaDhoq0fmy',
      created_at: '2026-06-01 16:59:25'
    }
  ],
  projects: [
    {
      id: 1,
      title: 'Gestion de Cabinet Medical',
      description: "Application de bureau concue pour centraliser et automatiser la gestion d'un cabinet medical. Elle integre un systeme d'authentification securise base sur les roles, la gestion des dossiers medicaux, rendez-vous, facturation, ordonnances, stock de medicaments et un chat interne en temps reel.",
      technologies: 'C#, .NET, MySQL',
      video_url: '/uploads/1780349215641-449938375.mp4',
      website_url: null,
      github_url: null,
      thumbnail: '/uploads/1780349216166-113261605.png',
      created_at: '2026-06-01 21:26:56'
    },
    {
      id: 2,
      title: 'Fluxo Web',
      description: 'Fluxo Web est une plateforme e-commerce de vente entre particuliers developpee en PHP, MySQL et Bootstrap. Elle permet de publier des annonces, rechercher des produits, echanger via une messagerie integree, gerer les commandes et effectuer des paiements securises avec Stripe.',
      technologies: 'MySQL, PHP, Bootstrap, Stripe',
      video_url: '/uploads/1780344866090-56184460.mp4',
      website_url: null,
      github_url: 'https://github.com/achraf06011/site_fluxo.git',
      thumbnail: '/uploads/1780344866600-473770370.png',
      created_at: '2026-06-01 20:14:26'
    },
    {
      id: 3,
      title: 'Portfolio Interactif',
      description: 'Portfolio professionnel avec animations, espace administrateur et gestion dynamique des projets.',
      technologies: 'React, Node.js, Express, PostgreSQL',
      video_url: null,
      website_url: null,
      github_url: null,
      thumbnail: null,
      created_at: '2026-06-01 20:00:00'
    },
    {
      id: 4,
      title: 'Fluxo Mobile',
      description: "Application mobile developpee avec React Native permettant aux utilisateurs d'acheter et de vendre des produits directement depuis leur smartphone. Elle integre les notifications en temps reel, une messagerie instantanee, la geolocalisation via Google Maps, le suivi des commandes et les paiements securises.",
      technologies: 'React Native',
      video_url: '/uploads/1780348597099-559692022.mp4',
      website_url: null,
      github_url: 'https://github.com/achraf06011/site_fluxo.git',
      thumbnail: '/uploads/1780348597641-353906712.jpeg',
      created_at: '2026-06-01 21:16:37'
    }
  ],
  messages: [
    {
      id: 1,
      name: 'deric',
      email: 'fredericakoari@gmail.com',
      message: 'veuillez vous presentez le lundi hhhhhhhhhhhhhhhhhh',
      created_at: '2026-06-02 03:26:09'
    }
  ]
};

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not configured');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 1500,
      idleTimeoutMillis: 1500
    });
  }
  return pool;
}

function toPostgres(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

async function getDB() {
  if (useMemoryStore) return { type: 'memory' };
  return getPool();
}

async function run(db, sql, params = []) {
  if (db.type === 'memory') return memoryRun(sql, params);

  let pgSql = toPostgres(sql);
  if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
    pgSql += ' RETURNING id';
  }
  const { rows } = await db.query(pgSql, params);
  return { insertId: rows[0]?.id, rows };
}

async function get(db, sql, params = []) {
  if (db.type === 'memory') return memoryGet(sql, params);

  const { rows } = await db.query(toPostgres(sql), params);
  return rows[0] || null;
}

async function all(db, sql, params = []) {
  if (db.type === 'memory') return memoryAll(sql);

  const { rows } = await db.query(toPostgres(sql), params);
  return rows;
}

function saveDB() {}

async function initDB() {
  if (useMemoryStore) {
    console.warn('DATABASE_URL is not configured; using in-memory portfolio data.');
    return;
  }

  const db = getPool();

  try {
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
      console.log('Admin account created');
    }

    console.log('Database initialized');
  } catch (err) {
    useMemoryStore = true;
    console.error('Database initialization failed; using in-memory portfolio data.', err);
  }
}

function memoryRun(sql, params = []) {
  const normalized = normalize(sql);

  if (normalized.startsWith('INSERT INTO PROJECTS')) {
    const [title, description, technologies, video_url, website_url, github_url, thumbnail] = params;
    const project = {
      id: nextProjectId++,
      title,
      description,
      technologies,
      video_url,
      website_url,
      github_url,
      thumbnail,
      created_at: new Date().toISOString()
    };
    memoryStore.projects.unshift(project);
    return { insertId: project.id, rows: [{ id: project.id }] };
  }

  if (normalized.startsWith('UPDATE PROJECTS SET')) {
    const id = Number(params[7]);
    const project = memoryStore.projects.find(item => item.id === id);
    if (project) {
      [
        project.title,
        project.description,
        project.technologies,
        project.video_url,
        project.website_url,
        project.github_url,
        project.thumbnail
      ] = params.slice(0, 7);
    }
    return { insertId: undefined, rows: [] };
  }

  if (normalized.startsWith('DELETE FROM PROJECTS')) {
    const id = Number(params[0]);
    memoryStore.projects = memoryStore.projects.filter(project => project.id !== id);
    return { insertId: undefined, rows: [] };
  }

  if (normalized.startsWith('INSERT INTO MESSAGES')) {
    const [name, email, message] = params;
    const entry = {
      id: nextMessageId++,
      name,
      email,
      message,
      created_at: new Date().toISOString()
    };
    memoryStore.messages.unshift(entry);
    return { insertId: entry.id, rows: [{ id: entry.id }] };
  }

  return { insertId: undefined, rows: [] };
}

function memoryGet(sql, params = []) {
  const normalized = normalize(sql);

  if (normalized.includes('FROM ADMINS WHERE EMAIL')) {
    return memoryStore.admins.find(admin => admin.email === params[0]) || null;
  }

  if (normalized.includes('FROM PROJECTS WHERE ID')) {
    const id = Number(params[0]);
    return memoryStore.projects.find(project => project.id === id) || null;
  }

  return null;
}

function memoryAll(sql) {
  const normalized = normalize(sql);

  if (normalized.includes('FROM PROJECTS')) {
    return [...memoryStore.projects].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (normalized.includes('FROM MESSAGES')) {
    return [...memoryStore.messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return [];
}

function normalize(sql) {
  return sql.trim().replace(/\s+/g, ' ').toUpperCase();
}

module.exports = { getDB, initDB, run, get, all, saveDB };

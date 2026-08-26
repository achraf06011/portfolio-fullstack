let pool = null;
let useMemoryStore = !process.env.DATABASE_URL;
let nextProjectId = 9;
let nextMessageId = 2;
let lastInitError = null;

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
      id: 8,
      title: 'SOMAFIAM S.A',
      description: "Site web vitrine et catalogue produits pour SOMAFIAM S.A, présentant les gammes d'équipements industriels, agricoles, métallurgiques, BTP, mines, manutention, robotique et transformation alimentaire.",
      technologies: 'PHP, Laravel, Blade, HTML, CSS, JavaScript, MySQL, SQL, Bootstrap, Vite',
      video_url: 'https://drive.google.com/file/d/1Z_q7eqOcGlhB_95sAK85OGYJ5k7rdTXc/view?usp=sharing',
      website_url: 'https://somafiam.com/',
      github_url: 'https://github.com/achraf06011/somafiam.git',
      thumbnail: 'https://drive.google.com/file/d/16_0hKDFPi7TijYZq0IQTAXo_27-Nr-hh/view?usp=sharing',
      created_at: '2026-08-10T18:12:16.080Z'
    },
    {
      id: 7,
      title: 'Rose Élégance — Site vitrine fleuriste premium',
      description: "Site vitrine premium pour une fleuriste parisienne, avec un design éditorial haut de gamme inspiré des maisons de mode et un panneau d'administration complet pour gérer catégories, produits, photos et prix.",
      technologies: 'React, Vite, Tailwind CSS, Framer Motion, Supabase, PostgreSQL, Vercel, React Leaflet',
      video_url: 'https://drive.google.com/file/d/1_zA4eCYVKfPH1q3Qr8B0CdUl3BfPozn-/view?usp=sharing',
      website_url: 'https://rose-elegance.vercel.app/',
      github_url: 'https://github.com/achraf06011/rose-elegance.git',
      thumbnail: 'https://drive.google.com/file/d/1phqlO3mX90SYtv90C-k6EyNiXrO1G63I/view?usp=sharing',
      created_at: '2026-06-25T11:44:36.715Z'
    },
    {
      id: 6,
      title: 'ACHRAF INDUSTRIELLE — Site web industriel',
      description: "Site web premium pour une entreprise industrielle marocaine, trilingue FR/EN/AR avec RTL, panel admin complet, formulaire de devis, base Supabase, animations et déploiement Vercel.",
      technologies: 'Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Supabase, next-intl, EmailJS',
      video_url: 'https://drive.google.com/file/d/1c2kPtDlmDSXG-5rj77Hx1-ZNpxsLF_oy/view?usp=sharing',
      website_url: 'https://achraf-industrielle-k9e5tjg2h-achraf06011s-projects.vercel.app/',
      github_url: 'https://github.com/achraf06011/achraf-industrielle.git',
      thumbnail: 'https://drive.google.com/file/d/14FTsIg33Dlt475VYsUCFa_Bx9LwbLYph/view?usp=sharing',
      created_at: '2026-06-24T20:56:48.003Z'
    },
    {
      id: 5,
      title: "Hôtel Al Kabir - Site Web gestion d'hôtel",
      description: "Site web complet pour l'Hôtel Al Kabir à Marrakech, avec site vitrine, galerie, présentation des chambres, réservation en ligne, espace client et panneau d'administration.",
      technologies: 'Next.js 15, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, Supabase, NextAuth.js, Vercel',
      video_url: 'https://drive.google.com/file/d/10zjr8FNuqtR38rPOe5jqLXSRJfbY1Fmw/view?usp=sharing',
      website_url: 'https://hotel-alkabir.vercel.app/',
      github_url: 'https://github.com/achraf06011/hotel-alkabir.git',
      thumbnail: 'https://drive.google.com/file/d/1Nh1cC6WBU2maHR01YTk01JQoOVFSk8fO/view?usp=sharing',
      created_at: '2026-06-21T15:10:07.318Z'
    },
    {
      id: 4,
      title: 'Achraf Automotive — Showroom de véhicules premium',
      description: "Plateforme web premium dédiée à la vente de véhicules d'exception avec catalogue filtrable, fiches immersives, visualisation 3D, réservation d'essai, contact et espace administrateur.",
      technologies: 'React, Node.js, Express, MySQL, Three.js, Tailwind CSS, GSAP, Framer Motion, Vite',
      video_url: 'https://drive.google.com/file/d/1g9YqekAONKDCGWTes9U-UEYr0I2fIxB5/view?usp=sharing',
      website_url: null,
      github_url: 'https://github.com/achraf06011/showroom-achraf-automative.git',
      thumbnail: 'https://drive.google.com/file/d/1FnHorm7RF_2QRtP-hqlM6iaUw9tOnaWa/view?usp=sharing',
      created_at: '2026-06-21T12:00:59.523Z'
    },
    {
      id: 3,
      title: 'Fluxo Mobile - Marketplace de Vente Entre Particuliers',
      description: "Application mobile de la plateforme Fluxo permettant d'acheter et vendre entre particuliers, gérer les annonces, rechercher des produits, échanger par messagerie et suivre les commandes.",
      technologies: 'React Native, Expo, JavaScript, Node.js, Express.js, MySQL, REST API, Pusher, Git, GitHub',
      video_url: 'https://drive.google.com/file/d/1Va9d1cjLoHavQN7o58Usu2bTR4LX52z0/view?usp=sharing',
      website_url: null,
      github_url: 'https://github.com/achraf06011/Fluxo.git',
      thumbnail: 'https://drive.google.com/file/d/1GQbPUt3wpgKJrwlxCx3I9PkiO5eCAlj8/view?usp=sharing',
      created_at: '2026-06-08T18:12:38.234Z'
    },
    {
      id: 2,
      title: 'Fluxo - Marketplace Web de Vente Entre Particuliers',
      description: "Marketplace web moderne permettant aux utilisateurs d'acheter et vendre des produits entre particuliers avec annonces, messagerie instantanée, panier, commandes et administration.",
      technologies: 'PHP, MySQL, JavaScript, HTML5, CSS3, Bootstrap, AJAX, Pusher, PHPMailer, Git, GitHub',
      video_url: 'https://drive.google.com/file/d/1gQ5ccbT3YJyAa9g7mmuMCoB0w8fLmJib/view?usp=sharing',
      website_url: null,
      github_url: 'https://github.com/achraf06011/Fluxo.git',
      thumbnail: 'https://drive.google.com/file/d/1-aDN-HqD_VzWGkQOx1cVADismIFV3Vw-/view?usp=sharing',
      created_at: '2026-06-08T18:11:34.006Z'
    },
    {
      id: 1,
      title: 'Gestion de Cabinet Médical',
      description: "Application de bureau complète destinée à l'administration d'un cabinet médical avec gestion des accès par rôles, dossiers médicaux, rendez-vous, factures, stock, impressions, statistiques et chat interne.",
      technologies: 'C#, MySQL',
      video_url: 'https://drive.google.com/file/d/15-s4O-e04aPq_dHrrKIACKRG63cADN9a/view?usp=sharing',
      website_url: null,
      github_url: null,
      thumbnail: 'https://drive.google.com/file/d/1rzFCjtzN3-Rm6tJjtZ5u6SN_G5Za4SVw/view?usp=sharing',
      created_at: '2026-06-08T17:20:48.112Z'
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
    const { Pool } = require('pg');
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
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash('Achrafreali06', 12);
      await db.query('INSERT INTO admins (email, password) VALUES ($1, $2)', ['aaachchak@gmail.com', hashed]);
      console.log('Admin account created');
    }

    console.log('Database initialized');
  } catch (err) {
    useMemoryStore = true;
    lastInitError = {
      code: err.code || null,
      message: err.message || 'Database initialization failed'
    };
    console.error('Database initialization failed; using in-memory portfolio data.', err);
  }
}

function getDBStatus() {
  return {
    databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
    mode: useMemoryStore ? 'memory' : 'postgres',
    lastInitError
  };
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

module.exports = { getDB, initDB, run, get, all, saveDB, getDBStatus };

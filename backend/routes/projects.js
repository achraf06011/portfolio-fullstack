const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDB, run, get, all, saveDB } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4','video/webm','video/ogg','image/jpeg','image/png','image/webp','image/gif'];
    cb(null, allowed.includes(file.mimetype));
  },
   limits: { fileSize: 1024 * 1024 * 1024 }
}).fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]);

// GET all projects - public
router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const projects = all(db, 'SELECT * FROM projects ORDER BY created_at DESC');
    res.json(projects);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET single project - public
router.get('/:id', async (req, res) => {
  try {
    const db = await getDB();
    const project = get(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// POST create - admin
router.post('/', authMiddleware, (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    const { title, description, technologies, website_url, github_url } = req.body;
    if (!title || !description || !technologies) return res.status(400).json({ error: 'Required fields missing' });

    const video_url = req.files?.video ? `/uploads/${req.files.video[0].filename}` : null;
    const thumbnail = req.files?.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : null;

    try {
      const db = await getDB();
      run(db, 'INSERT INTO projects (title,description,technologies,video_url,website_url,github_url,thumbnail) VALUES (?,?,?,?,?,?,?)',
        [title, description, technologies, video_url, website_url || null, github_url || null, thumbnail]);
      const projects = all(db, 'SELECT * FROM projects ORDER BY id DESC LIMIT 1');
      res.status(201).json(projects[0]);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
  });
});

// PUT update - admin
router.put('/:id', authMiddleware, (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    try {
      const db = await getDB();
      const existing = get(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id]);
      if (!existing) return res.status(404).json({ error: 'Not found' });

      const { title, description, technologies, website_url, github_url } = req.body;
      let video_url = existing.video_url;
      let thumbnail = existing.thumbnail;

      if (req.files?.video) {
        if (existing.video_url) { const p = path.join(__dirname, '..', existing.video_url); if(fs.existsSync(p)) fs.unlinkSync(p); }
        video_url = `/uploads/${req.files.video[0].filename}`;
      }
      if (req.files?.thumbnail) {
        if (existing.thumbnail) { const p = path.join(__dirname, '..', existing.thumbnail); if(fs.existsSync(p)) fs.unlinkSync(p); }
        thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }

      run(db, 'UPDATE projects SET title=?,description=?,technologies=?,video_url=?,website_url=?,github_url=?,thumbnail=? WHERE id=?',
        [title||existing.title, description||existing.description, technologies||existing.technologies,
         video_url, website_url!==undefined?website_url||null:existing.website_url,
         github_url!==undefined?github_url||null:existing.github_url, thumbnail, req.params.id]);

      const updated = get(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id]);
      res.json(updated);
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
  });
});

// DELETE - admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const project = get(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Not found' });
    if (project.video_url) { const p = path.join(__dirname, '..', project.video_url); if(fs.existsSync(p)) fs.unlinkSync(p); }
    if (project.thumbnail) { const p = path.join(__dirname, '..', project.thumbnail); if(fs.existsSync(p)) fs.unlinkSync(p); }
    run(db, 'DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;

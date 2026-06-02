const express = require('express');
const { getDB, run, get, all } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const projects = await all(db, 'SELECT * FROM projects ORDER BY created_at DESC');
    res.json(projects);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await getDB();
    const project = await get(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, technologies, website_url, github_url, video_url, thumbnail } = req.body;
  if (!title || !description || !technologies) return res.status(400).json({ error: 'Required fields missing' });
  try {
    const db = await getDB();
    const result = await run(db,
      'INSERT INTO projects (title,description,technologies,video_url,website_url,github_url,thumbnail) VALUES (?,?,?,?,?,?,?)',
      [title, description, technologies, video_url || null, website_url || null, github_url || null, thumbnail || null]
    );
    const project = await get(db, 'SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(project);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const existing = await get(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    const { title, description, technologies, website_url, github_url, video_url, thumbnail } = req.body;
    await run(db,
      'UPDATE projects SET title=?,description=?,technologies=?,video_url=?,website_url=?,github_url=?,thumbnail=? WHERE id=?',
      [
        title || existing.title,
        description || existing.description,
        technologies || existing.technologies,
        video_url !== undefined ? video_url || null : existing.video_url,
        website_url !== undefined ? website_url || null : existing.website_url,
        github_url !== undefined ? github_url || null : existing.github_url,
        thumbnail !== undefined ? thumbnail || null : existing.thumbnail,
        req.params.id
      ]
    );
    const updated = await get(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const project = await get(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Not found' });
    await run(db, 'DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;

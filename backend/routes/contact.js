const express = require('express');
const { getDB, run, all } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields required' });
  try {
    const db = await getDB();
    run(db, 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    res.json({ message: 'Message sent successfully!' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const messages = all(db, 'SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;

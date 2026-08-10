const express = require('express');
const { getDB, run, all } = require('../database');
const authMiddleware = require('../middleware/auth');
const { sendContactNotification } = require('../utils/mailer');

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields required' });
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email' });

  try {
    const db = await getDB();
    await run(db, 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name, email, message]);

    try {
      const emailResult = await sendContactNotification({ name, email, message });
      res.json({
        message: emailResult.skipped
          ? 'Message enregistré. La notification email n’est pas encore configurée.'
          : 'Message envoyé avec succès !',
        emailSent: !emailResult.skipped
      });
    } catch (mailErr) {
      console.error('Contact email error:', mailErr);
      res.status(500).json({ error: "Message enregistré, mais l'email n'a pas pu être envoyé" });
    }
  } catch (err) {
    console.error('Contact save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const messages = await all(db, 'SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;

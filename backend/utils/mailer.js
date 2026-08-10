const nodemailer = require('nodemailer');

const CONTACT_TO = process.env.CONTACT_TO || 'aaachchak@gmail.com';

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendContactNotification({ name, email, message }) {
  if (!hasSmtpConfig()) {
    console.warn('Contact email skipped: SMTP_HOST, SMTP_USER or SMTP_PASS is missing');
    return { skipped: true };
  }

  const transporter = createTransporter();
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: CONTACT_TO,
    replyTo: email,
    subject: `Nouveau message portfolio - ${name}`,
    text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h2>Nouveau message depuis le portfolio</h2>
      <p><strong>Nom:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `
  });

  return { skipped: false };
}

module.exports = { sendContactNotification };

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors({
    origin: 'http://localhost:5500'
  }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const PORT = 3000;
const photos = [
  { url: '/public/images/cake1.jpg' },
  { url: '/public/images/muffin1.jpg' },
  { url: '/public/images/cookie1.jpg' }
];

app.get('/api/portfolio', (req, res) => {
  res.json(photos);
});

app.post('/api/contact', (req, res) => {
  const message = req.body;

  // Validace dat
  if (!message.name || !message.email || !message.style || !message.message ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(message.email)) {
    return res.status(400).json({ success: false, error: 'Neplatná data.' });
  }

  fs.appendFile('messages.txt', JSON.stringify(message) + '\n', err => {
    if (err) return res.status(500).json({ success: false });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'process.env.MAIL_USER', 
        pass: 'process.env.MAIL_PASS'  
      }
    });

    const mailOptions = {
      from: 'lenatolmaceva20@gmail.com',
      to: 'lenatolmaceva20@gmail.com',
      subject: 'Nová objednávka sladkosti',
      text: `Jméno: ${message.name}\nEmail: ${message.email}\nTyp sladkosti: ${message.style}\nZpráva: ${message.message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ success: false });
      res.json({ success: true, message: 'Objednávka byla úspěšně odeslána.' });
    });
  });
});

app.get('/api/statistics', (req, res) => {
  fs.readFile('messages.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).json({});
    const styles = {};
    data.trim().split('\n').forEach(line => {
      try {
        const msg = JSON.parse(line);
        if (msg.style) {
          styles[msg.style] = (styles[msg.style] || 0) + 1;
        }
      } catch {}
    });
    res.json(styles);
  });
});

app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));

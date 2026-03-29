const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  balance INTEGER DEFAULT 0,
  energy INTEGER DEFAULT 100,
  last_update INTEGER
)
`);

app.get('/user/:id', (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM users WHERE id=?`, [id], (err, user) => {
    if (!user) {
      db.run(`INSERT INTO users(id) VALUES (?)`, [id]);
      return res.json({ balance: 0, energy: 100 });
    }

    res.json(user);
  });
});

app.get('/mine/:id', (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM users WHERE id=?`, [id], (err, user) => {
    if (!user) return res.send("User tidak ada");

    if (user.energy < 10) {
      return res.json({ error: "Energy habis" });
    }

    let balance = user.balance + 5;
    let energy = user.energy - 10;

    db.run(`UPDATE users SET balance=?, energy=? WHERE id=?`,
      [balance, energy, id]);

    res.json({ balance, energy });
  });
});

setInterval(() => {
  db.all(`SELECT * FROM users`, (err, users) => {
    users.forEach(user => {
      if (user.energy < 100) {
        let energy = user.energy + 2;
        if (energy > 100) energy = 100;

        db.run(`UPDATE users SET energy=? WHERE id=?`,
          [energy, user.id]);
      }
    });
  });
}, 5000);

const token = "8259270356:AAHPtDIZO8lwRjjVRXLmDVQfQLQ8TmFgzD4";
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(express.static('public'));

// Command /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Selamat datang di Mining App 🚀", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "⛏️ Mulai Mining",
            web_app: { url: "https://mthic-production.up.railway.app/" }
          }
        ]
      ]
    }
  });
});

// Server
app.listen(3000, () => {
  console.log("Server jalan...");
});

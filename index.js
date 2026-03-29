const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

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
            web_app: { url: "https://mining-bot-production.up.railway.app" }
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
// api/webhook.js
// Telegram webhook endpoint. Handles incoming updates from BotFather's bot.
// Sends a welcome message with an inline "join" button that points at
// /api/go (our own tracking redirect), not directly at Telegram.

const BOT_TOKEN = process.env.BOT_TOKEN;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL; // e.g. https://fx-gold-bot.vercel.app
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET; // optional but recommended

const WELCOME_TEXT = `🏆 *FX GOLD TRADERS* 🏆

✔️ Account Management Services Available
💰 Minimum Equity: $300 – $100,000
📊 Scalping & Swing Trading on *XAUUSD*
🧠 Solid Fundamental & Technical Analysis
💵 Managed With Full Responsibility

Tap below to get started 👇`;

async function sendMessage(chatId, text, replyMarkup) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: replyMarkup,
    }),
  });
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Optional but recommended: verify Telegram's secret token header
  if (WEBHOOK_SECRET) {
    const incomingSecret = req.headers["x-telegram-bot-api-secret-token"];
    if (incomingSecret !== WEBHOOK_SECRET) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
  }

  try {
    const update = req.body;
    const message = update?.message;

    if (message?.text) {
      const chatId = message.chat.id;
      const text = message.text.trim();

      if (text === "/start" || text === "/join") {
        await sendMessage(chatId, WELCOME_TEXT, {
          inline_keyboard: [
            [
              {
                text: "📲 Join FX Gold Traders",
                url: `${PUBLIC_BASE_URL}/api/go`,
              },
            ],
          ],
        });
      } else {
        await sendMessage(
          chatId,
          "Send /start to get access to FX Gold Traders."
        );
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(200).json({ ok: true }); // ack anyway so Telegram doesn't retry-storm
  }
}

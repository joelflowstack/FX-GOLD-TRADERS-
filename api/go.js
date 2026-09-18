// api/go.js
// This is the URL the inline button actually points to. Telegram never tells
// a bot when someone taps a "url" button directly, so we route the click
// through this endpoint first: count it, then 302 the user on to the real
// destination. This is what makes click tracking possible at all.

const TARGET_URL = process.env.TARGET_URL || "https://t.me/FX_GOLD_TRADERS_BOT";
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL; // optional
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN; // optional
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID; // optional

async function incrementClickCount() {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_REDIS_REST_URL}/incr/fx_gold_clicks`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
    });
    const data = await res.json();
    return data.result; // new total count
  } catch (err) {
    console.error("Click counter error:", err);
    return null;
  }
}

async function notifyAdmin(count) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: `🔔 FX Gold Traders click${count ? ` — total: ${count}` : ""}`,
      }),
    });
  } catch (err) {
    console.error("Admin notify error:", err);
  }
}

export default async function handler(req, res) {
  const count = await incrementClickCount();
  await notifyAdmin(count);

  res.writeHead(302, { Location: TARGET_URL });
  res.end();
}

// api/stats.js
// GET /api/stats?key=YOUR_STATS_KEY  -> { clicks: <number> }
// A quick way to check the click count without digging through logs.

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const STATS_KEY = process.env.STATS_KEY; // set this to any password you choose

export default async function handler(req, res) {
  if (!STATS_KEY || req.query.key !== STATS_KEY) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    return res.status(200).json({ ok: true, clicks: null, note: "No KV store configured yet." });
  }

  try {
    const r = await fetch(`${UPSTASH_REDIS_REST_URL}/get/fx_gold_clicks`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
    });
    const data = await r.json();
    return res.status(200).json({ ok: true, clicks: Number(data.result) || 0 });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Failed to fetch stats" });
  }
}

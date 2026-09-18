# FX Gold Traders — Telegram Ad Bot

Same pattern as your other referral bots: a webhook-driven bot that sends a
welcome message with one button, and every tap is counted before the user
lands on the real destination.

- Welcome trigger: `/start`
- Button destination (final): `https://t.me/FX_GOLD_TRADERS_BOT`
- Tracking hop: `/api/go` (increments a counter, then redirects)
- Stats check: `/api/stats?key=...`

## 1. Create the bot

Talk to **@BotFather** on Telegram → `/newbot` → grab the bot token.

## 2. Push these files to GitHub, then import to Vercel

Upload this folder to a new GitHub repo via the GitHub web UI, then
**Add New Project** in the Vercel dashboard and import that repo. No CLI
needed — same flow as your other projects.

## 3. Set environment variables (Vercel dashboard → Settings → Environment Variables)

| Variable | Required | Value |
|---|---|---|
| `BOT_TOKEN` | Yes | Token from BotFather |
| `PUBLIC_BASE_URL` | Yes | Your deployed URL, e.g. `https://fx-gold-bot.vercel.app` |
| `TARGET_URL` | No | Defaults to `https://t.me/FX_GOLD_TRADERS_BOT` |
| `WEBHOOK_SECRET` | Recommended | Any random string — locks the webhook to Telegram only |
| `ADMIN_CHAT_ID` | Optional | Your Telegram numeric chat ID, to get a ping on every click |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Optional | For a persistent click counter (see below) |
| `STATS_KEY` | Optional | Password for the `/api/stats` endpoint |

Redeploy after adding variables.

## 4. Add click tracking (optional but recommended)

Vercel's dashboard has a **Storage** tab → **Marketplace** → add an
**Upstash Redis** database (free tier). Connecting it to your project
auto-fills `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for you —
no CLI, no code changes needed. Without this, the bot still works and still
redirects, it just won't keep a persistent count.

## 5. Point Telegram at your webhook

Once deployed, open this URL once in your browser (fill in your values):

```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<your-vercel-domain>/api/webhook&secret_token=<WEBHOOK_SECRET>
```

You should get back `{"ok":true,"result":true,...}`.

## 6. Test it

Message your bot `/start` on Telegram. You should get the welcome message
with a "Join FX Gold Traders" button. Tapping it should land you on
`https://t.me/FX_GOLD_TRADERS_BOT`.

Check the count any time at:

```
https://<your-vercel-domain>/api/stats?key=<STATS_KEY>
```

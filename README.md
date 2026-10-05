# complybuddy

AI compliance checker for social media posts, ads, and website content

**Live:** https://complybuddy.vercel.app

## Tech stack
Next.js, React, TypeScript, Tailwind CSS, Stripe

## Run locally
```bash
git clone https://github.com/infosiva/complybuddy.git && cd complybuddy
npm install
cp .env.example .env.local   # names only, fill in your own values
npm run dev                    # http://localhost:3000
```

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Environment variables
Names only; never commit real values. Everything is optional unless the feature needs it.

**AI providers (free-first chain; any one is enough):** `GEMINI_API_KEY`, `GROQ_API_KEY`

- `ANTHROPIC_API_KEY`
- `EDGE_CONFIG_TOKEN`
- `GNEWS_API_KEY`
- `PROMO_CODES`
- `STRIPE_PRICE_ID`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `VERCEL_ACCESS_TOKEN`

## Deploy
Vercel (`vercel --prod`). Set the variables above in the project settings.

## Status & open items
See `HANDOFF.md` if present; otherwise open an issue.

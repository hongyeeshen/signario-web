# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview build locally
```

## Architecture

Astro marketing site in `hybrid` output mode with the Vercel serverless adapter. Most pages are statically prerendered; only `src/pages/api/` runs as a serverless function.

**Request flow for waitlist signup:**
User submits form → `POST /api/waitlist` (Vercel serverless) → Brevo SMTP API → `hongyeeshen@gmail.com`

**Key files:**
- `src/layouts/Layout.astro` — root layout; PostHog is loaded here, consent-gated via `localStorage`
- `src/pages/api/waitlist.ts` — the only server-side endpoint; requires `BREVO_API_KEY` env var
- `src/components/Hero.astro` and `src/components/Waitlist.astro` — both have independent waitlist forms that POST to `/api/waitlist`
- `src/components/CookieBanner.astro` — sets `localStorage('cookie_consent')`, which gates PostHog init

## Environment Variables

| Variable | Where used |
|---|---|
| `BREVO_API_KEY` | `src/pages/api/waitlist.ts` — server only |
| `PUBLIC_POSTHOG_KEY` | `src/layouts/Layout.astro` — client |
| `PUBLIC_POSTHOG_HOST` | `src/layouts/Layout.astro` — client (`https://eu.i.posthog.com`) |
| `SITE_URL` | `astro.config.mjs` — canonical URL (`https://signario.io`) |

## Deployment

- **Production:** `main` branch → `signario.io`
- **Staging:** `staging` branch → `staging-web.signario.io`
- Vercel auto-deploys on push. Node.js runtime is pinned to 20.x via `engines` in `package.json`.

## GDPR

- PostHog only initialises after cookie consent (`cookie_consent === 'accepted'` in localStorage)
- `ip: false` is set on PostHog init
- PostHog data stored in EU (Frankfurt)
- Privacy policy is at `/privacy` and linked from both forms

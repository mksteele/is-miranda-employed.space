# is-miranda-employed.space — Project Handoff

## What this is
A personal landing page for `is-miranda-employed.space`. The purpose: friends and family texting to ask if the owner got laid off in the Meta layoffs can be directed here to get a quick, definitive answer (yes, still employed) with context.

## Current state
The frontend (`index.html`) is complete and approved. It is a single-file static HTML page with embedded CSS and JS. No framework, no build step. The design is intentional — do not restyle it without being asked.

**Design system (do not change):**
- Fonts: Instrument Serif (serif) + DM Mono (mono) via Google Fonts
- Colors: cream `#FAF6EF`, ink `#1A1208`, green `#2D6A4F`, green-light `#52B788`, green-pale `#D8F3DC`, amber `#E9A800`
- Subtle CSS grid texture on body via `::before` pseudo-element
- All sections animate in on load (fadeUp / fadeDown / emojiPop keyframes)

**Approved copy (do not rewrite unless asked):**
- Headline: *Yes, still employed.*
- Subhead: `is-miranda-employed.space — last verified: right now`
- Card body: casual/neutral tone — acknowledges the Meta layoffs context, explains the owner was moved to the Applied AI (AAI) Engineering unit, links to Reuters. Ends with a joke about not sleeping because of a baby.
- Reuters article link: `https://www.reuters.com/technology/meta-transfers-top-engineers-into-new-ai-tooling-team-2026-04-09/`
- Footer: `made with love (and mild exasperation)`

## The one thing left to build: real visitor counter

The current counter uses `localStorage` only — it works per-browser but is not shared across visitors. **The main task is to replace this with a real shared unique visitor counter.**

### Requirements
- Count must be **shared/global** — all visitors see the same number
- Must track **unique visitors** (not total pageviews) — one increment per browser, ever
- The existing UI must be preserved exactly: 5-digit segmented display, comma separator, "you just incremented this 🙈" note for new visitors, "you've been here before (visitor #N)" for returning visitors, amber "← you are visitor #N" banner that fades in after 1.2s

### Recommended backend options (pick one)
**Option A — Cloudflare Workers + KV** *(recommended: free tier, zero cold starts, globally distributed)*
- Worker handles two endpoints: `GET /count` (returns current count + whether this visitor ID is new) and `POST /visit` (increments if new, returns updated count + visitor number)
- Visitor identity: set a UUID in a cookie or return one from the POST for the client to store in localStorage
- KV keys: `total_count` (integer) and `visitor:{uuid}` (boolean flag)

**Option B — Supabase** *(good if you want a dashboard to watch the number tick up)*
- Single table: `visitors (id uuid primary key, visited_at timestamptz)`
- Row = one unique visitor; count = `SELECT COUNT(*) FROM visitors`
- Use the Supabase JS client directly from the frontend (no separate backend needed)
- Enable Row Level Security: allow INSERT for anon, allow SELECT COUNT for anon

**Option C — Val Town** *(easiest to deploy, good for a small personal project)*
- Single val that handles GET (return count) and POST (increment if UUID not seen)
- Persistent state via Val Town's built-in SQLite

### Frontend integration
Once the backend is in place, replace the `init()` function in the `<script>` block. The new flow should be:
1. Check localStorage for existing `miranda_visitor_id`
2. If none: POST to backend → get back `{ count, visitorNumber, id }` → store id in localStorage → render counter + show "you are visitor #N" banner
3. If exists: GET from backend → get back `{ count }` → render counter + show "you've been here before (visitor #N)" note (visitor number is in localStorage)

Keep the `renderCounter(n, animate)` function and all digit/animation logic — only replace the data-fetching part.

## Deployment
- Domain: `is-miranda-employed.space`
- Hosting: owner's choice, but Cloudflare Pages pairs naturally with Option A above
- The site is a single `index.html` — any static host works (Netlify, Vercel, GitHub Pages, CF Pages)

## What NOT to change
- Visual design, colors, fonts, animations
- Copy/tone (neutral, not enthusiastic about the team transfer)
- The Reuters article URL
- The baby joke in the footer

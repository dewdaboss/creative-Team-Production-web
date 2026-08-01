# 🎬 Creative Team Production — Website

A cinematic, high-converting agency website for **Cinematography, Photography and Digital Marketing** — dark mode with black, white and dark-neon-green, an interactive 3D film-gear background, dynamic pricing, and a full booking automation pipeline.

![Stack](https://img.shields.io/badge/Next.js-15-black) ![Stack](https://img.shields.io/badge/React-19-black) ![Stack](https://img.shields.io/badge/Three.js-R3F-black) ![Stack](https://img.shields.io/badge/Tailwind-3.4-black)

## ✨ Feature map

| Area | Highlights |
| --- | --- |
| **Hero** | Vector logo in a premium circular frame (orbiting brand text + aperture iris), floating stat chips, neon marquee |
| **3D background** | Live Three.js/R3F scene — cinema camera, lens, spotlight, clapperboard and film reels drifting through fog with neon edges, reacting to the pointer. Respects `prefers-reduced-motion` |
| **Services** | 6 services with live `from ₹` pricing — click a card to pre-load the booking wizard |
| **Booking wizard** | Service → Package → Details with **dynamic pricing** (per-photo, per-hour, flat, monthly and custom-quote modes), quantity steppers, live estimate panel, draft autosave, validation, honeypot + rate limiting |
| **Automation** | Every lead is saved locally, POSTed to a Google Apps Script webhook (**Google Sheet row + instant owner email**), or sent as a pre-filled **WhatsApp** message. See [AUTOMATION.md](./AUTOMATION.md) |
| **Portfolio** | Filterable photo/reel gallery with animated layout, branded reel cards (views/duration) and a lightbox that **embeds Instagram reels** when a URL is attached |
| **Admin panel** | `/admin` — secure owner login; manage gallery (upload files or paste URLs, show/hide, feature, delete), curate reviews, watch the **leads inbox**, and edit the animated counters |
| **Reviews** | Google-style rating summary, distribution bars and an auto-advancing review carousel |
| **Social proof** | Animated Instagram follower **LIVE** counter, visitor counter (tracked server-side), projects/reels stats |
| **Footer** | Contact info, social links (Instagram, YouTube, Facebook, WhatsApp) and a dark-styled **Google Maps** embed |
| **Responsive** | Tailored layouts for desktop, tablet and mobile; reduced 3D load on small screens |

## 🚀 Quick start

```bash
npm install
cp .env.example .env.local   # edit values (optional — sane defaults included)
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start`.

**Owner login** — go to `/admin` and sign in with `ADMIN_USER` / `ADMIN_PASS`
(defaults: `admin` / `ctp-admin-2024` — **change before going live**).

## 💰 Pricing catalog

All services and packages live in [`lib/pricing.ts`](./lib/pricing.ts) — edit prices,
features or add packages in one place; the services grid, booking wizard and footer
update automatically.

| Service | Packages |
| --- | --- |
| Photography Shoot | Normal ₹25/photo · Edited ₹50/photo · ₹1,200/hour |
| Reels Shoot | Basic ₹1,500 · Medium ₹2,000 · Premium ₹2,500 |
| Monthly Growth | Starter ₹15,000/mo · Standard ₹20,000/mo · Premium ₹25,000/mo |
| Product Photography | Custom-quote inquiry |
| Events & Occasions | ₹5,000 flat — unlimited photos + 1 edited reel |
| Long-Form Video | Project-based / time-based inquiry |

## 📡 Automation

Full guide: **[AUTOMATION.md](./AUTOMATION.md)** — includes the ready-to-paste Google
Apps Script ([`docs/google-apps-script.gs`](./docs/google-apps-script.gs)) that appends
leads to a Sheet and emails the owner instantly.

## 🗂 Project structure

```
app/                 Next.js App Router (pages + API routes)
  api/booking/       lead intake: validate → price → webhook → persist
  api/admin/         gallery / reviews / stats / leads / upload (session-guarded)
  admin/             owner dashboard
components/          UI: hero, marquee, services, booking wizard, gallery,
                     reviews, stats, footer, admin app
components/three/    R3F 3D film-gear background
lib/                 pricing catalog, JSON store, auth, rate-limit, notify, seeds
data/                JSON persistence (gallery, reviews, stats, leads)
docs/                google-apps-script.gs automation bridge
public/images/       generated brand imagery & portfolio seeds
```

## 🔐 Notes for production

- Set `SESSION_SECRET`, `ADMIN_USER`, `ADMIN_PASS` and `NOTIFY_WEBHOOK_URL` in your host's env settings.
- The JSON-file store is perfect for a VPS / Node server. On serverless platforms with a
  read-only filesystem (e.g. Vercel without a volume), point `lib/store.ts` at a database
  (Supabase/Neon/Mongo) — the accessors (`getGallery`, `getLeads`, …) are the only touchpoints.
- Image uploads write to `public/uploads/` — same serverless caveat applies; swap the
  `/api/admin/upload` handler for object storage (S3/R2) if needed.

# 🎬 Creative Team Production — Website Package

Ye folder poora project hai — **saari keys `.env.local` me pehle se bhari hui hain**.
Supabase dashboard se kuch copy karne ki zaroorat nahi.

---

## 1. Isi computer par chalana (2 minute)

```bash
npm install
npm run dev
```
→ http://localhost:3000

- Website: `http://localhost:3000`
- Admin: `http://localhost:3000/admin` → **admin / CTPstudio@2026**
- Photos/videos upload, rows, leads, reviews — sab chalega (Supabase already connected)

Production build:
```bash
npm run build
npm start
```

---

## 2. Online deploy (Vercel — free)

1. Code GitHub par push karein (ya pehle se repo `dewdaboss/creative-Team-Production-web` hai)
2. [vercel.com](https://vercel.com) → **Add New → Project** → apna repo import karein
3. Framework: **Next.js** · Project name: **`creative-team-production-web`**
4. **Environment Variables** me `.env.local` ka content copy-paste karein
   (Vercel → Settings → Environment Variables → "Bulk import" me poora file paste kar sakte hain)
5. **Deploy** (2–3 min)

Deploy ke baad:
- Site: `https://creative-team-production-web.vercel.app`
- Admin: `<site>/admin` → **admin / CTPstudio@2026**

> Agar domain alag ho, to `NEXT_PUBLIC_SITE_URL` ko us URL se badal dein aur redeploy karein.

---

## 3. Kya-kya pehle se ready hai

| Cheez | Kahan | Status |
|---|---|---|
| Photos + videos (gallery) | Supabase table `gallery_items` + bucket `gallery` | ✅ 25 items seeded |
| Booking leads | Supabase table `leads` | ✅ ready |
| Client reviews | Supabase table `reviews` | ✅ 6 seeded |
| Animated counters | Supabase `site_stats` | ✅ seeded |
| Visitor counter | Supabase `visitor_counters` + `increment_visitor()` | ✅ ready |
| Privacy Policy (11 sections) | `/privacy-policy` | ✅ |
| Terms & Conditions (17 sections) | `/terms-and-conditions` | ✅ |
| Admin dashboard (upload + row picker) | `/admin` | ✅ |

Admin me upload karte waqt **"Where should it appear?"** se row chunein:
`Hero` · `Row A` (poster wall top) · `Row B` (poster wall bottom) · `Portfolio` (main grid)

---

## 4. Optional (baad me kar sakte hain)

- **Booking par email + Google Sheet alert:** `NOTIFY_WEBHOOK_URL` bhar dein — guide: `AUTOMATION.md`
  (ready script: `docs/google-apps-script.gs`)
- **Booking par WhatsApp alert:** `WHATSAPP_CALLMEBOT_KEY` + `WHATSAPP_ADMIN`
- **Database dobara banana ho (naya Supabase project):** `docs/supabase-setup.sql` SQL Editor me run karein

---

## 5. ⚠️ Security

- `.env.local` me **service-role key** aur **admin password** hai — ise kisi ke saath share na karein,
  public repo par commit na karein, aur kisi public zip/Drive link par na daalein.
- Admin password badalna ho: `.env.local` me `ADMIN_PASS` badlein
  (Vercel par: Settings → Environment Variables → `ADMIN_PASS` → Redeploy).
- Password bhool jaayein? `.env.local` khol kar dekh lein.

---

## 6. Zaroori commands

```bash
npm run dev        # development server
npm run build      # production build
npm start          # production server
npm run typecheck  # TypeScript check
```

---

## 7. Real shoot photos (café portrait series)

- 10 asli photos `public/images/gallery/shoot-01.jpg` … `shoot-10.jpg` me hain
  (web ke liye optimise ki hui: max 900px, progressive JPEG, 50–115 KB).
- Ye photos hero poster wall, poster wall, portfolio grid, About aur CTA band me
  lag chuki hain (`lib/shoot-photos.ts` ek hi jagah se sab jagah use hota hai).
- Agar aap purane Supabase database par hain jisme placeholder artwork rows hain,
  to deploy ke baad `docs/shoot-photos.sql` ek baar SQL Editor me run karein —
  isse database rows bhi inhi photos par shift ho jayengi.

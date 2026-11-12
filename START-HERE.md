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

---

## 8. Pre-Wedding section

- 15 pre-wedding photos: `public/images/gallery/prewed-01.jpg` … `prewed-15.jpg`
  (760px wide, progressive JPEG).
- Home page par apna alag "Pre-Wedding" section hai (nav me bhi link) — swipe/scroll
  rail, tap par full-screen lightbox, aur seedha "Book a pre-wedding shoot" CTA.
- Naye pre-wedding photos add karne ke liye `/admin` → Gallery → Row: **Portfolio**,
  Category: **Pre-Wedding** chunein. Wo photos automatic is section me chali jayengi
  (normal portfolio grid me duplicate nahi hongi).

---

## 9. Product Shoots section

- 12 product photos (skincare + jewellery): `public/images/gallery/product-01.jpg` … `product-12.jpg`.
- Home page par alag "Product Shoots" grid section — 2/3/4 column responsive,
  tap par full-screen lightbox, "Book a product shoot" + WhatsApp CTA.
- Naye product photos: `/admin` → Row: **Portfolio**, Category: **Product Shoots**
  chunein → wo photos automatic is section me aayengi (portfolio grid me duplicate nahi).

---

## 10. Men's Photo Shoot section (professional male portfolio)

- 13 male portfolio photos: `public/images/gallery/men-01.jpg` … `men-13.jpg`
  (max 820×1100, progressive JPEG, ~35–125 KB each).
- Home page par alag **"Men's Photo Shoot"** section (`#men-shoots`) — ek hi
  carousel rail me saari 13 photos, swipe/arrows, tap par full-screen lightbox,
  aur "Book a portfolio shoot" + WhatsApp CTA.
- Har section ki photos alag hain — ye male-portfolio photos hero, café,
  pre-wedding ya product sections me repeat nahi hoti.
- Naye male-portfolio photos add karne ke liye `/admin` → Row: **Portfolio**,
  Category: **Men's Photo Shoot** chunein. Wo photos automatic is section me
  jayengi (normal portfolio grid me duplicate nahi hongi).

---

## 11. Women's Photo Shoot section (professional female portfolio)

- 12 female portfolio photos: `public/images/gallery/women-01.jpg` … `women-12.jpg`
  (max 820×1100, progressive JPEG, ~70–180 KB each).
- Home page par alag **"Women's Photo Shoot"** section (`#women-shoots`) — ek hi
  carousel rail me saari 12 photos, swipe/arrows, tap par full-screen lightbox,
  "Book a portfolio shoot" + WhatsApp CTA.
- Naye photos: `/admin` → Row: **Portfolio**, Category: **Women's Photo Shoot**.
- Sabhi showcase sections (Pre-Wedding, Men's, Women's) ek hi shared component
  `components/ShootRail.tsx` se bante hain — design same rehta hai, photos alag.

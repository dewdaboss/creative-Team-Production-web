# 🌐 FREE Hosting Guide — No Domain Needed (Vercel)

Website **100% free** live karo — koi domain kharidne ki zaroorat nahi.
Aapko milega: `https://creative-team-production.vercel.app` — HTTPS ke saath.

**Total time: ~15 minutes · Total cost: ₹0**

---

## Step 1 — Vercel par site deploy karo (5 min)

1. [vercel.com](https://vercel.com) → **Sign up with GitHub** (free Hobby plan)
2. **Add New → Project** → `creative-Team-Production-web` repo select karo → **Import**
3. Framework auto-detect hoga (**Next.js**) → kuch badalne ki zaroorat nahi
4. **Environment Variables** me ye add karo (baaki step 2–4 se milenge):

   | Key | Value |
   |---|---|
   | `ADMIN_USER` | aapka username |
   | `ADMIN_PASS` | aapka password |
   | `SESSION_SECRET` | koi bhi lamba random string (32+ chars) |
   | `NOTIFY_WEBHOOK_URL` | Google Apps Script URL (AUTOMATION.md) |

5. **Deploy** dabao → 2 minute me site live ✅

> Abhi site chalegi, par admin edits/leads persist nahin honge (Vercel ka
> filesystem temporary hota hai). Step 2 & 3 wo free me fix karte hain.

---

## Step 2 — FREE database (Upstash Redis) — leads/gallery save rahe (5 min)

1. [upstash.com](https://upstash.com) → Sign up with GitHub (free)
2. **Create Database** → name: `ctp` → region: closest to India (ap-south-1 Singapore) → Create
3. Database page par **REST API** section me milega:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Vercel → your project → **Settings → Environment Variables** me add karo:

   | Key | Value |
   |---|---|
   | `KV_REST_API_URL` | Uptrash se mila URL |
   | `KV_REST_API_TOKEN` | Upstash se mila token |

5. **Deployments** tab → latest deployment → ⋯ → **Redeploy**

✅ Ab `/admin` ke saare edits, leads aur counters **permanently save** honge (site is auto-configured — koi code change nahi chahiye).

---

## Step 3 — FREE photo/video uploads (Cloudinary) —optional but recommended

Serverless par file upload disk me save nahi hota — Cloudinary free tier use karo:

1. [cloudinary.com](https://cloudinary.com) → free sign up
2. Dashboard upar **Cloud Name** dikhega — copy karo
3. Settings ⚙️ → **Upload** tab → **Upload presets** → **Add upload preset**
   - Signing Mode: **Unsigned** zaroor select karo
   - Save karke preset ka **name** copy karo
4. Vercel env me add:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | cloud name |
   | `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | preset name |

5. Redeploy.

✅ Ab `/admin → Gallery` se upload ki gayi photos seedha Cloudinary CDN par jaati hain — fast, free, permanent. (Local development me bina iske bhi uploads kaam karte hain — `public/uploads/`.)

---

## Step 4 — Booking automation ON karo

`AUTOMATION.md` ki guide se Google Apps Script deploy karke URL ko
`NOTIFY_WEBHOOK_URL` me daalo (Step 1 me nahi kiya to ab) → har booking
**Google Sheet + Gmail** par aayegi.

---

## Step 5 — Apna free subdomain set karo (optional)

Vercel → **Settings → Domains** → edit karo:
`creative-team-production.vercel.app` (ya jo available mile) — **free, no domain purchase.**

---

### Zaroori notes

- **Har git push = auto-redeploy.** Arena me jo bhi change push hota hai, Vercel khud live karta hai.
- Free tier limits (bohot hain aapke liye): Vercel 100GB bandwidth/mo, Upstash 10k requests/day, Cloudinary 25GB storage.
- Local development ke liye kuch change nahi karna — bina env ke bhi `npm run dev` perfectly chalta hai (file-based storage).
- Agar baad me custom domain lo (optional, ~₹800/saal), wahi Settings → Domains se 2 min me jod dena.

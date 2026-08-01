# ⚡ Booking Automation Setup

Every booking submitted on the site goes through **three channels at once**:

| Channel | What happens | Setup needed |
| --- | --- | --- |
| **Local leads inbox** | Saved to `data/leads.json`, visible in `/admin → Leads` | ✅ Works out of the box |
| **Google Sheet** | Lead appended as a new row in your spreadsheet | 5-minute Apps Script setup (below) |
| **Instant email** | Owner receives the full lead by email | Same setup as the Sheet |
| **WhatsApp** | Visitor's browser opens WhatsApp with everything pre-filled | ✅ Works out of the box — `NEXT_PUBLIC_WHATSAPP_NUMBER` defaults to `919755550380` |

---

## Google Sheet + Email (one-time, ~5 minutes)

Google Apps Script gives free, instant **Sheet-append + owner's-email** in a single endpoint —
no SMTP passwords, no third-party SaaS.

1. **Create the Sheet** — New Google Sheet → rename the first tab to `Leads` (the script creates it + headers automatically if missing).
2. **Open Apps Script** — in the Sheet: `Extensions → Apps Script`.
3. **Paste the script** — replace the editor contents with [`docs/google-apps-script.gs`](./docs/google-apps-script.gs). Save.
4. **Set your email** — edit `OWNER_EMAIL` at the top of the script.
5. **Deploy** — `Deploy → New deployment → Web app`:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone** (required so the website can POST to it; the payload only ever appends a row + sends you email)
6. **Connect it to the site** — copy the `/exec` URL into `.env.local`:
   ```bash
   NOTIFY_WEBHOOK_URL=https://script.google.com/macros/s/AKfy.../exec
   NOTIFY_EMAIL=creative.team.production.official@gmail.com
   ```
7. **Restart the dev server** (`npm run dev`) and submit a test booking — you should see
   a row in the Sheet and an email in your inbox within seconds.

> Editing the script later? Save, then **Deploy → Manage deployments → ✎ → New version** so the live endpoint picks up the change.

### Verify with curl

```bash
curl -X POST "$NOTIFY_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+919876543210","serviceName":"Photography Shoot","packageName":"Edited Photos","estimate":5000,"location":"Test City"}'
```

`{ "ok": true }` = Sheet + email both fired.

---

## WhatsApp booking (already wired)

The **Book via WhatsApp** buttons generate a `wa.me` deep-link containing the visitor's
service, package, quantity, live estimate, contact details, location and reference link —
they tap *send* and the lead lands in your WhatsApp chat. Set the number in digit-only
international format (no `+`):

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=919755550380
```

## Security notes

- Form submissions are server-validated (zod), rate-limited per IP, and honeypot-protected.
- Admin routes require a signed, HttpOnly session cookie. Change `ADMIN_PASS` and
  `SESSION_SECRET` before going live.
- File uploads are restricted to image/video MIME types ≤ 15 MB and stored under `public/uploads/`.

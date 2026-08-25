import { serverEnv } from "./env";

/**
 * Lead automation.
 *
 * If NOTIFY_WEBHOOK_URL is configured (e.g. a Google Apps Script Web App —
 * see docs/google-apps-script.gs) the lead is POSTed there. The Apps Script
 * both appends a row to the connected Google Sheet AND emails the owner,
 * giving instant email notification + sheet logging in one hop.
 *
 * The lead is always persisted locally (data/leads.json) regardless.
 */
export async function dispatchLead(lead: Record<string, unknown>): Promise<"sent" | "skipped" | "failed"> {
  const url = serverEnv.notifyWebhook;
  if (!url) return "skipped";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _email: serverEnv.notifyEmail,
        _subject: `🎬 New Booking Lead — ${lead.serviceName ?? ""}`,
        ...lead,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

/** Free WhatsApp alert to owner via CallMeBot (personal-use free API). */
export async function notifyWhatsApp(lead: Record<string, unknown>): Promise<void> {
  const key = process.env.WHATSAPP_CALLMEBOT_KEY;
  const phone = process.env.WHATSAPP_ADMIN;
  if (!key || !phone) return;
  const text = [
    "🎬 *New Booking — Creative Team*",
    `👤 ${lead.name} • ${lead.phone}`,
    `📦 ${lead.serviceName} / ${lead.packageName}`,
    lead.estimate ? `💰 ~₹${lead.estimate}` : "💰 Custom quote",
    `📍 ${lead.location}`,
    lead.preferredDate ? `🕒 ${lead.preferredDate}` : "",
    lead.notes ? `📝 ${lead.notes}` : "",
  ].filter(Boolean).join("\n");
  try {
    await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent("+" + String(phone))}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(key)}`,
      { signal: AbortSignal.timeout(10_000) }
    );
  } catch { /* alert fail ho to booking ko fail mat karo */ }
}



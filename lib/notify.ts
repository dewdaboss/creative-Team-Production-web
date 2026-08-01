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



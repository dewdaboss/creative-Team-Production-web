/**
 * Creative Team Production — Lead Automation Bridge
 * --------------------------------------------------
 * One Web App endpoint that does BOTH:
 *   1. Appends the booking lead as a row in the bound Google Sheet
 *   2. Instantly emails the owner with the full lead details
 *
 * SETUP (5 minutes):
 *   1. Create a Google Sheet → rename tab 1 to "Leads"
 *   2. Extensions → Apps Script → paste this entire file → Save
 *   3. Set OWNER_EMAIL below
 *   4. Deploy → New deployment → type "Web app"
 *        Execute as:        Me
 *        Who has access:    Anyone
 *   5. Copy the /exec URL → set it as NOTIFY_WEBHOOK_URL in .env.local
 *   6. (Optional) Redeploy → "Manage deployments" after every edit.
 *
 * Test it:  curl -X POST <WEB_APP_URL> -H "Content-Type: application/json" \
 *             -d '{"name":"Test Lead","phone":"+919876543210","serviceName":"Reels Shoot","packageName":"Premium","estimate":2500,"location":"Noida"}'
 */

const OWNER_EMAIL = "creative.team.production.official@gmail.com"; // ← where lead emails are sent (NOTIFY_EMAIL is also passed per request)
const SHEET_NAME = "Leads";

const HEADERS = [
  "Timestamp", "Lead ID", "Name", "Phone", "Email",
  "Service", "Package", "Quantity", "Unit", "Unit Price",
  "Estimate (INR)", "Location", "Reference Link", "Notes",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const lead = JSON.parse(e.postData.contents);

    // 1) — Google Sheet ------------------------------------------------------
    const sheet = getSheet_();
    sheet.appendRow([
      lead.createdAt ? new Date(lead.createdAt) : new Date(),
      lead.id || "",
      lead.name || "",
      lead.phone || "",
      lead.email || "",
      lead.serviceName || "",
      lead.packageName || "",
      lead.quantity || "",
      lead.unit || "",
      lead.unitPrice || "",
      lead.estimate || 0,
      lead.location || "",
      lead.referenceUrl || "",
      lead.notes || "",
    ]);

    // 2) — Instant email -----------------------------------------------------
    const to = lead._email && String(lead._email).indexOf("@") > 0 ? lead._email : OWNER_EMAIL;
    const subject = lead._subject || ("🎬 New Booking Lead — " + (lead.serviceName || "Website"));
    const money = lead.estimate > 0
      ? "₹" + Number(lead.estimate).toLocaleString("en-IN")
      : "Custom quote requested";
    const qtyLine = lead.quantity ? ("\nQuantity:      " + lead.quantity + " " + (lead.unit || "")) : "";

    const body =
      "A new booking just landed on the website.\n" +
      "--------------------------------------------\n" +
      "Name:          " + (lead.name || "-") + "\n" +
      "Phone:         " + (lead.phone || "-") + "\n" +
      "Email:         " + (lead.email || "-") + "\n" +
      "Service:       " + (lead.serviceName || "-") + "\n" +
      "Package:       " + (lead.packageName || "-") + qtyLine + "\n" +
      "Estimate:      " + money + "\n" +
      "Location:      " + (lead.location || "-") + "\n" +
      "Reference:     " + (lead.referenceUrl || "-") + "\n" +
      "Notes:         " + (lead.notes || "-") + "\n" +
      "--------------------------------------------\n" +
      "Submitted:     " + (lead.createdAt || new Date().toISOString()) + "\n\n" +
      "⚡ Call back within 15 minutes for the highest close rate.";

    MailApp.sendEmail(to, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold")
      .setBackground("#0ea654")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Optional: run once manually to email yourself a test lead. */
function sendMeATest() {
  MailApp.sendEmail(OWNER_EMAIL, "Test — CTP Lead Automation", "If you can read this, email works. ✅");
}

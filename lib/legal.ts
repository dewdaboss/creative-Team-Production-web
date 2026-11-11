import { site } from "./site";

/**
 * Legal pages configuration — SINGLE SOURCE OF TRUTH for /privacy-policy
 * and /terms-and-conditions.
 *
 * Everything that depends on owner / legal confirmation lives here so it
 * can be updated in one place without touching page copy.
 *
 * Fields marked `null` are intentionally NOT invented — the pages render
 * them as clearly-marked "To be confirmed" items. Fill them in after
 * owner / legal review and the pages update automatically.
 */
export const legalConfig = {
  /** Display dates — update together whenever the policy text changes. */
  lastUpdated: "11 November 2026",
  effectiveDate: "11 November 2026",

  /** Canonical site URL (override via NEXT_PUBLIC_SITE_URL when a custom domain is live). */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://creative-team-production-web.vercel.app",

  /** Contact details are pulled from lib/site.ts (env-driven). */
  contact: {
    name: site.name,
    email: site.email,
    phone: site.phone,
    whatsapp: site.whatsapp,
    address: site.address,
    instagram: site.instagram,
    youtube: site.youtube,
    facebook: site.facebook,
  },

  /**
   * Configurable policy values. `null` = not yet confirmed by owner/legal.
   * Do NOT guess these — confirm, then set the string value here.
   */
  configurable: {
    /** How long booking leads / personal data are kept before deletion. */
    dataRetentionPeriod: null as string | null,
    /** Notice period for cancellation / rescheduling (e.g. "48 hours"). */
    cancellationNoticePeriod: null as string | null,
    /** Advance payment required to confirm a booking (e.g. "30%"). */
    advancePayment: null as string | null,
    /** Whether quoted prices include or exclude taxes (e.g. "exclusive of GST"). */
    taxTreatment: null as string | null,
    /** How long download links / project files are kept after delivery. */
    fileRetentionAfterDelivery: null as string | null,
    /** Governing law (e.g. "Laws of India"). */
    governingLaw: null as string | null,
    /** Dispute jurisdiction (e.g. "courts at Indore, Madhya Pradesh"). */
    jurisdiction: null as string | null,
    /** Named grievance / privacy contact, if any. */
    grievanceContact: null as string | null,
  },
} as const;

/** True when a configurable value has been confirmed by the owner. */
export function isConfigured(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

"use client";

import { site } from "./site";

export interface WhatsAppLeadParts {
  name: string;
  serviceName: string;
  packageName: string;
  quantity?: number;
  unit?: string;
  estimate: number;
  location: string;
  phone: string;
  email?: string;
  referenceUrl?: string;
  notes?: string;
}

/** Builds a wa.me deep-link with every booking detail pre-filled. */
export function buildWhatsAppLink(parts: WhatsAppLeadParts): string {
  const lines = [
    `Hi ${site.name}! I'd like to book a shoot. 🎬`,
    ``,
    `• Service: ${parts.serviceName}`,
    `• Package: ${parts.packageName}`,
    ...(parts.quantity ? [`• Quantity: ${parts.quantity} ${parts.unit ?? ""}`] : []),
    parts.estimate > 0 ? [`• Estimate: ₹${parts.estimate.toLocaleString("en-IN")}`] : [`• Pricing: Please share a custom quote`],
    ``,
    `• Name: ${parts.name}`,
    `• Phone: ${parts.phone}`,
    ...(parts.email ? [`• Email: ${parts.email}`] : []),
    `• Location: ${parts.location}`,
    ...(parts.referenceUrl ? [`• Reference: ${parts.referenceUrl}`] : []),
    ...(parts.notes ? [`• Notes: ${parts.notes}`] : []),
  ];
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

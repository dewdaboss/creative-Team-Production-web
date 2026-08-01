/**
 * Public site configuration — SAFE for client bundles.
 * Only NEXT_PUBLIC_* variables may live here.
 */
export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Creative Team Production",
  tagline: "Create • Shoot • Grow",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 97555 50380",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919755550380").replace(/\D/g, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "creative.team.production.official@gmail.com",
  address:
    process.env.NEXT_PUBLIC_ADDRESS ?? "Indore, Madhya Pradesh, India",
  mapsQuery: process.env.NEXT_PUBLIC_MAPS_QUERY ?? "Indore, Madhya Pradesh, India",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/creative_team_production_",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "https://youtube.com/@creativeteamproduction",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/profile.php?id=61588991206692",
  googleReview:
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ??
    "https://www.google.com/search?q=creative+team+production+reviews",
} as const;

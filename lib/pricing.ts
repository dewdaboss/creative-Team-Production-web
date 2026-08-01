import type { PackageOption, Service } from "./types";

export const SERVICES: Service[] = [
  {
    id: "photography",
    name: "Photography Shoot",
    short: "Photography",
    tagline: "Portraits, lifestyle & on-location shoots — raw or professionally edited frames.",
    icon: "Camera",
    startingAt: "₹25 / photo",
    pricingNote: "Priced per photo or per hour — you pick what fits the shoot.",
    packages: [
      {
        id: "photo-raw",
        name: "Normal Photos",
        price: 25,
        unit: "photo",
        unitLabel: "photo",
        minQty: 20,
        defaultQty: 100,
        description: "Clean, unedited shots straight from the camera. Minimum 20 photos.",
        features: [
          "Unedited high-resolution files",
          "Delivered within 24 hours",
          "WeTransfer / Drive delivery",
        ],
      },
      {
        id: "photo-edited",
        name: "Edited Photos",
        price: 50,
        unit: "photo",
        unitLabel: "photo",
        minQty: 20,
        defaultQty: 50,
        description: "Colour graded & retouched frames, ready to publish. Minimum 20 photos.",
        badge: "Most Popular",
        features: [
          "Professional colour grade",
          "Skin & detail retouching",
          "Web + print ready exports",
          "48-hour turnaround",
        ],
      },
      {
        id: "photo-hourly",
        name: "Hourly Coverage",
        price: 1200,
        unit: "hour",
        unitLabel: "hour",
        minQty: 1,
        defaultQty: 2,
        description: "Full coverage billed by the hour — ideal for flexible shoot days.",
        features: [
          "Dedicated photographer",
          "All usable frames included",
          "Lighting setup included",
        ],
      },
    ],
  },
  {
    id: "reels",
    name: "Reels Shoot (Individual)",
    short: "Reels Shoot",
    tagline: "Scroll-stopping Instagram reels — scripted, shot and cut to trend.",
    icon: "Clapperboard",
    startingAt: "₹1,500 / reel",
    pricingNote: "Per-reel pricing with three production tiers.",
    packages: [
      {
        id: "reel-basic",
        name: "Basic Reel",
        price: 1500,
        unit: "flat",
        description: "A crisp single-concept reel with clean cuts.",
        features: ["1 concept / location", "Clean cuts + captions", "Trending audio sync"],
      },
      {
        id: "reel-medium",
        name: "Medium Reel",
        price: 2000,
        unit: "flat",
        badge: "Most Popular",
        description: "Multi-angle coverage with transitions and grade.",
        features: [
          "Multi-angle coverage",
          "Transitions + motion text",
          "Colour grade included",
        ],
      },
      {
        id: "reel-premium",
        name: "Premium Reel",
        price: 2500,
        unit: "flat",
        description: "Fully produced reel — script, direction and cinematic finish.",
        features: [
          "Scripting & direction",
          "Cinematic grade + SFX",
          "Hook & CTA optimisation",
          "2 revision rounds",
        ],
      },
    ],
  },
  {
    id: "videoedit",
    name: "Video & Reel Editing",
    short: "Video Editing",
    tagline: "Raw footage se scroll-stopping content — cuts, captions, grade aur sound design.",
    icon: "Scissors",
    startingAt: "₹500 / reel edit",
    pricingNote: "Editing starts at ₹500 per reel. Bade projects ka price project par depend karta hai.",
    packages: [
      {
        id: "edit-basic",
        name: "Basic Edit",
        price: 500,
        unit: "flat",
        description: "Clean reel edit — sharp cuts, captions aur music sync.",
        features: ["Clean cuts + trim", "Captions / subtitles", "Trending audio sync", "1 revision round"],
      },
      {
        id: "edit-standard",
        name: "Standard Edit",
        price: 1000,
        unit: "flat",
        badge: "Most Popular",
        description: "Transitions, motion text aur colour grade ke saath polished edit.",
        features: ["Smooth transitions", "Motion text + hooks", "Colour grade", "2 revision rounds"],
      },
      {
        id: "edit-premium",
        name: "Premium Edit",
        price: 1500,
        unit: "flat",
        description: "Full cinematic edit — SFX, sound design aur premium motion graphics.",
        features: ["Cinematic grade", "SFX + sound design", "Motion graphics", "Hook & CTA optimisation"],
      },
      {
        id: "edit-project",
        name: "Project-Based Edit",
        price: 0,
        unit: "inquiry",
        description:
          "Long-form videos, wedding films ya bulk reel batches — price project par depend karta hai. Details share karo, hum turant quote bhej denge.",
        features: ["Long-form & wedding films", "Bulk reel batches", "Custom timelines", "Quote within hours"],
      },
    ],
  },
  {
    id: "monthly",
    name: "Monthly Reels & Growth",
    short: "Monthly Growth",
    tagline: "Done-for-you monthly content engine that turns views into clients.",
    icon: "TrendingUp",
    startingAt: "₹15,000 / mo",
    pricingNote: "Monthly retainers — cancel anytime after the first month.",
    packages: [
      {
        id: "growth-starter",
        name: "Starter Package",
        price: 15000,
        unit: "month",
        description: "Consistent content cadence designed for client acquisition.",
        features: [
          "8–10 reels (8+ guaranteed)",
          "Client-acquisition focused scripts",
          "Planned monthly shoot days",
          "Hashtag & posting plan",
        ],
      },
      {
        id: "growth-standard",
        name: "Standard Package",
        price: 20000,
        unit: "month",
        badge: "Best Value",
        description: "Higher volume mix of reels and statics — shooting & editing included.",
        features: [
          "14–15 reels per month",
          "6–7 static posts",
          "Shooting & editing included",
          "Caption + trend research",
        ],
      },
      {
        id: "growth-premium",
        name: "Premium Growth Package",
        price: 25000,
        unit: "month",
        badge: "Full Management",
        description: "Complete social media management with strategy and analytics.",
        features: [
          "18–20 premium reels",
          "8–9 static posts",
          "Full social media management",
          "Content strategy & calendar",
          "Monthly performance analytics",
          "Growth review meetings",
        ],
      },
    ],
  },
  {
    id: "product",
    name: "Product Photography",
    short: "Product Shoots",
    tagline: "E-commerce, catalogue & campaign-grade product visuals that sell.",
    icon: "Package",
    pricingNote: "Every product line is different — tell us about yours for a tailored quote.",
    packages: [
      {
        id: "product-inquiry",
        name: "Product Shoot — Custom Quote",
        price: 0,
        unit: "inquiry",
        description:
          "Catalogue shoots, styled campaigns, white-background e-commerce sets and more. Share your product details and we quote within hours.",
        features: [
          "E-commerce / catalogue sets",
          "Styled & lifestyle campaign shots",
          "White background + creative sets",
          "Bulk pricing for large SKUs",
        ],
      },
    ],
  },
  {
    id: "events",
    name: "Events & Occasions",
    short: "Events",
    tagline: "Birthdays, anniversaries & kitty parties — every moment covered.",
    icon: "PartyPopper",
    startingAt: "₹5,000 flat",
    pricingNote: "One flat package for intimate celebrations.",
    packages: [
      {
        id: "event-signature",
        name: "Celebration Package",
        price: 5000,
        unit: "flat",
        badge: "All-Inclusive",
        description:
          "Birthday parties, anniversaries and kitty parties — one flat rate, zero limits.",
        features: [
          "Unlimited photos",
          "1 professionally edited reel",
          "Covers birthdays, anniversaries & kitty parties",
          "Candid + group coverage",
        ],
      },
    ],
  },
  {
    id: "longform",
    name: "Long-Form Video",
    short: "Long-Form Video",
    tagline: "Brand films, documentaries, music videos & full-scale productions.",
    icon: "Film",
    pricingNote: "Scoped per project — choose how you'd like to engage.",
    packages: [
      {
        id: "lf-project",
        name: "Project-Based Production",
        price: 0,
        unit: "inquiry",
        description:
          "Fixed-scope productions — ads, brand films, music videos. Milestone-based billing.",
        features: [
          "Concept to final-master delivery",
          "Crew, gear & locations managed",
          "Milestone-based billing",
        ],
      },
      {
        id: "lf-time",
        name: "Time-Based Engagement",
        price: 0,
        unit: "inquiry",
        description:
          "Book our crew by the day or half-day for coverage, B-rolls and event films.",
        features: [
          "Half-day / full-day crew booking",
          "Ideal for coverage & B-roll",
          "Flexible rescheduling",
        ],
      },
    ],
  },
];

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function getPackage(serviceId: string, packageId: string): PackageOption | undefined {
  return getService(serviceId)?.packages.find((p) => p.id === packageId);
}

export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export const TRAVEL_NOTE = "Free travel within 10 km. Travel charges apply beyond 10 km.";

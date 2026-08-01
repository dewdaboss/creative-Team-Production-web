export type PackageUnit = "photo" | "hour" | "flat" | "month" | "inquiry";

export interface PackageOption {
  id: string;
  name: string;
  /** price in INR — 0 when pricing is quoted after inquiry */
  price: number;
  unit: PackageUnit;
  unitLabel?: string;
  description: string;
  features: string[];
  badge?: string;
  /** minimum quantity for per-unit packages */
  minQty?: number;
  /** default quantity shown in the stepper */
  defaultQty?: number;
}

export interface Service {
  id: string;
  name: string;
  short: string;
  tagline: string;
  icon: string;
  startingAt?: string;
  pricingNote?: string;
  packages: PackageOption[];
}

export interface GalleryItem {
  id: string;
  type: "photo" | "reel";
  title: string;
  category: string;
  src: string;
  /** optional Instagram reel embed URL (https://www.instagram.com/reel/<id>) */
  embedUrl?: string;
  views?: string;
  duration?: string;
  visible: boolean;
  featured?: boolean;
  order: number;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  service?: string;
  date: string;
  visible: boolean;
}

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  serviceId: string;
  serviceName: string;
  packageId: string;
  packageName: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  estimate: number;
  location: string;
  referenceUrl?: string;
  notes?: string;
  automation: {
    local: boolean;
    webhook: "sent" | "skipped" | "failed";
  };
}

export interface SiteStats {
  instagramFollowers: number;
  followersToday: number;
  projectsDelivered: number;
  happyClients: number;
  reelsProduced: number;
  updatedAt: string;
}

export interface VisitorStats {
  total: number;
  today: number;
  day: string;
}

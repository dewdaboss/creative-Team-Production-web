import type { GalleryRowKey } from "./types";

/**
 * Placement rows shown on the home page.
 * Shared by the admin panel (where the owner picks a row) and the public
 * components (which render the matching items) — keep them in sync.
 */
export interface GalleryRowConfig {
  key: GalleryRowKey;
  label: string;
  short: string;
  hint: string;
  /** maximum sensible slots (admin shows a soft warning past this) */
  slots?: number;
  gridClass?: string;
}

export const GALLERY_ROWS: GalleryRowConfig[] = [
  {
    key: "hero",
    label: "Hero — Fanned Poster Wall",
    short: "Hero",
    hint: "Top of the home page: the three fanned posters beside the headline.",
    slots: 3,
  },
  {
    key: "wall-a",
    label: "Poster Wall — Row A (top)",
    short: "Row A",
    hint: "First horizontal row of the tilted poster wall below the hero.",
  },
  {
    key: "wall-b",
    label: "Poster Wall — Row B (bottom)",
    short: "Row B",
    hint: "Second row of the tilted poster wall. Great for reels & video loops.",
  },
  {
    key: "gallery",
    label: "Portfolio Grid",
    short: "Portfolio",
    hint: "The main portfolio grid with Photos / Reels filters and the lightbox player.",
  },
];

export const DEFAULT_ROW: GalleryRowKey = "gallery";

export const ROW_KEYS = GALLERY_ROWS.map((r) => r.key);

export function rowLabel(key: string | undefined): string {
  return GALLERY_ROWS.find((r) => r.key === key)?.short ?? "Portfolio";
}

/** Deterministic tilt presets so the poster wall keeps its design with any media. */
export const POSTER_TILTS = ["-2.5deg", "1.8deg", "-1.2deg", "2.2deg", "-0.8deg", "1.4deg"];
export const POSTER_ROTATES = ["-8deg", "6deg", "-5deg", "8deg", "-4deg", "5deg"];

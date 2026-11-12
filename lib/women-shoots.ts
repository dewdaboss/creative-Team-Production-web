/**
 * Women's professional photo shoot showcase.
 *
 * Built-in set: public/images/gallery/women-01.jpg … women-12.jpg
 * (max 820×1100, progressive JPEG, ~70–180 KB each)
 *
 * Media uploaded from /admin with the category **"Women's Photo Shoot"** is shown
 * in this section instead of the normal portfolio grid (see app/page.tsx).
 *
 * These frames are used ONLY here — never repeated in the hero, café,
 * pre-wedding, men's or product sections.
 */
export interface WomenShootFrame {
  src: string;
  title: string;
  tag: string;
}

export const WOMEN_SHOOTS: WomenShootFrame[] = [
  { src: "/images/gallery/women-01.jpg", title: "Train Window", tag: "Cinematic" },
  { src: "/images/gallery/women-02.jpg", title: "Auto Ride", tag: "Candid" },
  { src: "/images/gallery/women-03.jpg", title: "Heritage Steps", tag: "Editorial" },
  { src: "/images/gallery/women-04.jpg", title: "Dome & Sunlight", tag: "Travel" },
  { src: "/images/gallery/women-05.jpg", title: "Soft Smile", tag: "Portrait" },
  { src: "/images/gallery/women-06.jpg", title: "Palace Arch", tag: "Travel" },
  { src: "/images/gallery/women-07.jpg", title: "Golden Field", tag: "Traditional" },
  { src: "/images/gallery/women-08.jpg", title: "Bus Ride", tag: "Lifestyle" },
  { src: "/images/gallery/women-09.jpg", title: "Morning Commute", tag: "Lifestyle" },
  { src: "/images/gallery/women-10.jpg", title: "Sunflower Stop", tag: "Street" },
  { src: "/images/gallery/women-11.jpg", title: "Blue Saree Story", tag: "Traditional" },
  { src: "/images/gallery/women-12.jpg", title: "Bokeh Hour", tag: "Portrait" },
];

export const WOMEN_CATEGORY = "Women's Photo Shoot";

/** Matches "Women's Photo Shoot", "girls shoot", "WomenShoot", "Ladies Photo Shoot" … */
export const isWomenShoot = (category?: string) => {
  const key = (category ?? "").toLowerCase().replace(/[\s'’-]/g, "");
  return (
    key.includes("womenshoot") ||
    key.includes("womenphotoshoot") ||
    key.includes("girlsshoot") ||
    key.includes("girlphotoshoot") ||
    key.includes("ladiesshoot")
  );
};

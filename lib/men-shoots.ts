/**
 * Men's professional photo shoot (boys portfolio) showcase.
 *
 * Built-in set: public/images/gallery/men-01.jpg … men-13.jpg
 * (max 820×1100, progressive JPEG, ~35–125 KB each)
 *
 * Media uploaded from /admin with the category **"Men's Photo Shoot"** is shown
 * in this section instead of the normal portfolio grid (see app/page.tsx).
 *
 * These frames are used ONLY here — the same photos are never repeated in the
 * hero, about block, café set, pre-wedding set or product set.
 */
export interface MenShootFrame {
  src: string;
  title: string;
  /** short label shown on the card chip */
  tag: string;
}

export const MEN_SHOOTS: MenShootFrame[] = [
  { src: "/images/gallery/men-01.jpg", title: "Palace Columns", tag: "Semi-Formal" },
  { src: "/images/gallery/men-02.jpg", title: "Classic & Chrome", tag: "Lifestyle" },
  { src: "/images/gallery/men-03.jpg", title: "Open Road", tag: "Street" },
  { src: "/images/gallery/men-04.jpg", title: "Golden Hour", tag: "Fashion" },
  { src: "/images/gallery/men-05.jpg", title: "Green Room", tag: "Candid" },
  { src: "/images/gallery/men-06.jpg", title: "Park Bench", tag: "Editorial" },
  { src: "/images/gallery/men-07.jpg", title: "Café Window", tag: "Corporate" },
  { src: "/images/gallery/men-08.jpg", title: "Striped Impression", tag: "Editorial" },
  { src: "/images/gallery/men-09.jpg", title: "City Drive", tag: "Lifestyle" },
  { src: "/images/gallery/men-10.jpg", title: "Table For One", tag: "Corporate" },
  { src: "/images/gallery/men-11.jpg", title: "Quiet Confidence", tag: "Portrait" },
  { src: "/images/gallery/men-12.jpg", title: "Steps To Success", tag: "Portfolio" },
  { src: "/images/gallery/men-13.jpg", title: "Garden Formal", tag: "Portrait" },
];

export const MEN_CATEGORY = "Men's Photo Shoot";

/** Matches "Men's Photo Shoot", "mens shoot", "MenShoot", "Boys Photo Shoot" … */
export const isMenShoot = (category?: string) => {
  const key = (category ?? "").toLowerCase().replace(/[\s'’-]/g, "");
  return key.includes("menshoot") || key.includes("mensphotoshoot") || key.includes("boysshoot") || key.includes("boysphotoshoot");
};

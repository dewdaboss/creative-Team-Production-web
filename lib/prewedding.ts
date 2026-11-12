/**
 * Pre-wedding shoot gallery.
 *
 * These 15 frames are the built-in "Pre-Wedding" showcase. The section also
 * accepts items from the admin panel: upload any media to the Portfolio row
 * with the category **Pre-Wedding** and it is moved out of the normal grid and
 * shown here instead (see app/page.tsx).
 *
 * Files: public/images/gallery/prewed-01.jpg … prewed-15.jpg
 * (760px wide, progressive JPEG, ~60–140 KB each)
 */
export interface PreWeddingFrame {
  src: string;
  title: string;
  /** short label shown on the card chip */
  tag: string;
}

export const PREWEDDING_PHOTOS: PreWeddingFrame[] = [
  { src: "/images/gallery/prewed-01.jpg", title: "Palace Lake", tag: "Royal" },
  { src: "/images/gallery/prewed-02.jpg", title: "Jaipur Yellow", tag: "Heritage" },
  { src: "/images/gallery/prewed-03.jpg", title: "Stone & Silence", tag: "Candid" },
  { src: "/images/gallery/prewed-04.jpg", title: "Reflections", tag: "Cinematic" },
  { src: "/images/gallery/prewed-05.jpg", title: "Old City Walk", tag: "Street" },
  { src: "/images/gallery/prewed-06.jpg", title: "The Rose", tag: "Close-up" },
  { src: "/images/gallery/prewed-07.jpg", title: "Petal Rain", tag: "Romantic" },
  { src: "/images/gallery/prewed-08.jpg", title: "The Orange Door", tag: "Colour" },
  { src: "/images/gallery/prewed-09.jpg", title: "Archway Smiles", tag: "Candid" },
  { src: "/images/gallery/prewed-10.jpg", title: "Lavender Hour", tag: "Golden" },
  { src: "/images/gallery/prewed-11.jpg", title: "City of Stories", tag: "Heritage" },
  { src: "/images/gallery/prewed-12.jpg", title: "Stairway Story", tag: "Lifestyle" },
  { src: "/images/gallery/prewed-13.jpg", title: "Framed In Love", tag: "Creative" },
  { src: "/images/gallery/prewed-14.jpg", title: "Red Door Vows", tag: "Traditional" },
  { src: "/images/gallery/prewed-15.jpg", title: "Temple Walk", tag: "Cinematic" },
];

export const PREWEDDING_CATEGORY = "Pre-Wedding";

/** Matches "Pre-Wedding", "pre wedding", "PreWedding" … */
export const isPreWedding = (category?: string) =>
  (category ?? "").toLowerCase().replace(/[\s-]/g, "").includes("prewedding");

/** Matches "Couple Shoot", "couple", "Pre-Wedding Couple" … */
export const isCoupleShoot = (category?: string) => {
  const key = (category ?? "").toLowerCase().replace(/[\s'’-]/g, "");
  return key.includes("couple");
};

/**
 * Real CTP shoot frames (café / lifestyle portrait series).
 *
 * These replaced the placeholder artwork that used to fill the posters,
 * the portfolio grid and the about/CTA imagery. Everything here is optimised
 * for the web (max 900px wide, progressive JPEG, ~60–115 KB each) and lives in
 * `public/images/gallery/shoot-*.jpg`.
 *
 * The same catalogue is used by:
 *   - components/HeroPosterWall.tsx   (hero fanned posters, fallback)
 *   - components/PosterStrip.tsx      (poster wall rows, fallback)
 *   - lib/seed.ts                     (local JSON fallback / first boot)
 *   - the Supabase `gallery_items` rows (via docs/shoot-photos.sql)
 */
export interface ShootPhoto {
  src: string;
  title: string;
  category: string;
}

export const SHOOT_PHOTOS: ShootPhoto[] = [
  { src: "/images/gallery/shoot-01.jpg", title: "Café Corner Portrait", category: "Portraits" },
  { src: "/images/gallery/shoot-02.jpg", title: "Low-Light Reading", category: "Lifestyle" },
  { src: "/images/gallery/shoot-03.jpg", title: "Window Light Portrait", category: "Portraits" },
  { src: "/images/gallery/shoot-04.jpg", title: "Candid Laugh", category: "Lifestyle" },
  { src: "/images/gallery/shoot-05.jpg", title: "Pages & Coffee", category: "Lifestyle" },
  { src: "/images/gallery/shoot-06.jpg", title: "Golden Bokeh Portrait", category: "Portraits" },
  { src: "/images/gallery/shoot-07.jpg", title: "Quiet Mornings", category: "Lifestyle" },
  { src: "/images/gallery/shoot-08.jpg", title: "Table For One", category: "Portraits" },
  { src: "/images/gallery/shoot-09.jpg", title: "Moody Café Frames", category: "Portraits" },
  { src: "/images/gallery/shoot-10.jpg", title: "Warm Smile Editorial", category: "Portraits" },
];

/** Handy subsets used by the static fallbacks. */
export const HERO_SHOOT = [SHOOT_PHOTOS[2], SHOOT_PHOTOS[3], SHOOT_PHOTOS[8]];
export const WALL_A_SHOOT = SHOOT_PHOTOS.slice(0, 5);
export const WALL_B_SHOOT = [SHOOT_PHOTOS[7], SHOOT_PHOTOS[5], SHOOT_PHOTOS[9]];

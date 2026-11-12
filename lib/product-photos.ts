/**
 * Product / jewellery photography showcase.
 *
 * Built-in set: public/images/gallery/product-01.jpg … product-12.jpg
 * (max 820×1100, progressive JPEG, ~8–120 KB each)
 *
 * The section also accepts media uploaded from /admin with the category
 * **"Product Shoots"** — those items are shown here instead of the normal
 * portfolio grid (see app/page.tsx).
 */
export interface ProductShot {
  src: string;
  title: string;
  tag: string;
}

export const PRODUCT_SHOTS: ProductShot[] = [
  { src: "/images/gallery/product-01.jpg", title: "Botanical Serum", tag: "Skincare" },
  { src: "/images/gallery/product-02.jpg", title: "Rosehip Face Cream", tag: "Skincare" },
  { src: "/images/gallery/product-03.jpg", title: "Cream Duo", tag: "Skincare" },
  { src: "/images/gallery/product-04.jpg", title: "Cleansing Balm", tag: "Skincare" },
  { src: "/images/gallery/product-05.jpg", title: "Derma Roller Kit", tag: "Skincare" },
  { src: "/images/gallery/product-06.jpg", title: "Toner Essence", tag: "Skincare" },
  { src: "/images/gallery/product-07.jpg", title: "Amber Dropper", tag: "Skincare" },
  { src: "/images/gallery/product-08.jpg", title: "Roll-On Oil", tag: "Skincare" },
  { src: "/images/gallery/product-09.jpg", title: "Velvet Bust Necklace", tag: "Jewellery" },
  { src: "/images/gallery/product-10.jpg", title: "Diamond Vine Set", tag: "Jewellery" },
  { src: "/images/gallery/product-11.jpg", title: "Emerald Drop Earrings", tag: "Jewellery" },
  { src: "/images/gallery/product-12.jpg", title: "Filigree Earring Trio", tag: "Jewellery" },
];

export const PRODUCT_CATEGORY = "Product Shoots";

/** Matches "Product Shoots", "product shoot", "ProductShoots" … */
export const isProductShoot = (category?: string) =>
  (category ?? "").toLowerCase().replace(/[\s-]/g, "").includes("productshoot");

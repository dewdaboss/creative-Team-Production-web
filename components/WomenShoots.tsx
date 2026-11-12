import ShootRail from "./ShootRail";
import { WOMEN_SHOOTS } from "@/lib/women-shoots";
import type { GalleryItem } from "@/lib/types";

/**
 * Women's professional photo shoot showcase — 12 built-in frames.
 * Admin media with the category "Women's Photo Shoot" replaces the built-in set.
 */
export default function WomenShoots({ items = [] }: { items?: GalleryItem[] }) {
  return (
    <ShootRail
      id="women-shoots"
      eyebrow="Women's Photo Shoot"
      title={
        <>
          Elegance, <span className="text-gradient-brand">shot on location.</span>
        </>
      }
      description="Professional female portfolio shoots — saree, ethnic and western looks with hair, makeup and styling support. Perfect for models, brides-to-be, creators and personal branding."
      photos={WOMEN_SHOOTS}
      items={items}
      metaLabel="Women's Shoot"
      icon="sparkles"
      noun="women's professional photo shoot"
      scrollLabel="Scroll women's portfolio photos"
      ctaLabel="Book a portfolio shoot"
      whatsappLabel="Get a quote"
      whatsappText="Hi Creative Team Production, I want to book a women's professional photo shoot."
      note="Hair, makeup and outfit changes can be added to any package."
    />
  );
}

import ShootRail from "./ShootRail";
import { MEN_SHOOTS } from "@/lib/men-shoots";
import type { GalleryItem } from "@/lib/types";

/**
 * Men's professional photo shoot showcase — 13 built-in frames.
 * Admin media with the category "Men's Photo Shoot" replaces the built-in set.
 */
export default function MenShoots({ items = [] }: { items?: GalleryItem[] }) {
  return (
    <ShootRail
      id="men-shoots"
      eyebrow="Men's Photo Shoot"
      title={
        <>
          Portraits with <span className="text-gradient-brand">screen presence.</span>
        </>
      }
      description="Professional male portfolio shoots — grooming, styling and lighting guidance included. Built for actors, models, founders and creators who need a clean, premium profile set."
      photos={MEN_SHOOTS}
      items={items}
      metaLabel="Men's Shoot"
      icon="camera"
      noun="men's professional photo shoot"
      scrollLabel="Scroll men's portfolio photos"
      ctaLabel="Book a portfolio shoot"
      whatsappLabel="Get a quote"
      whatsappText="Hi Creative Team Production, I want to book a men's professional photo shoot."
      note="Outfit changes, grooming and retouched social crops available on every package."
    />
  );
}

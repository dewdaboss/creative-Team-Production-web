import ShootRail from "./ShootRail";
import { PREWEDDING_PHOTOS } from "@/lib/prewedding";
import type { GalleryItem } from "@/lib/types";

/**
 * Pre-Wedding showcase — 15 built-in frames in a swipeable rail + lightbox.
 * Admin media uploaded with the category "Pre-Wedding" replaces the built-in set.
 */
export default function PreWedding({ items = [] }: { items?: GalleryItem[] }) {
  return (
    <ShootRail
      id="pre-wedding"
      eyebrow="Pre-Wedding"
      title={
        <>
          Love stories, <span className="text-gradient-brand">framed like cinema.</span>
        </>
      }
      description="Candid moments, heritage locations, styling guidance and a colour grade that feels like a film — the complete pre-wedding shoot in one crew."
      photos={PREWEDDING_PHOTOS}
      items={items}
      metaLabel="Pre-Wedding"
      icon="heart"
      ratio="4/5"
      noun="pre-wedding shoot"
      scrollLabel="Scroll pre-wedding photos"
      ctaLabel="Book a pre-wedding shoot"
      whatsappLabel="Ask on WhatsApp"
      whatsappText="Hi Creative Team Production, I want to book a pre-wedding shoot."
      note="Locations, styling and a highlight reel can be added to any package."
    />
  );
}

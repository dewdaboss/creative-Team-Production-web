import Navbar from "@/components/Navbar";
import QuickNav from "@/components/QuickNav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PosterStrip from "@/components/PosterStrip";
import Services from "@/components/Services";
import AboutTeaser from "@/components/AboutTeaser";
import BookingSection from "@/components/BookingSection";
import CtaBand from "@/components/CtaBand";
import Portfolio from "@/components/Portfolio";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import Backdrop from "@/components/Backdrop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getGalleryRowsSafe } from "@/lib/gallery";
import { isCoupleShoot, isPreWedding } from "@/lib/prewedding";
import { isProductShoot } from "@/lib/product-photos";
import { isMenShoot } from "@/lib/men-shoots";
import { isWomenShoot } from "@/lib/women-shoots";
import { getReviews } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Gallery media (photos + videos) and row placement are managed from /admin
  // and stored in Supabase. If the backend is briefly unreachable we still
  // render the page with the built-in poster defaults.
  const [rows, reviews] = await Promise.all([
    getGalleryRowsSafe(),
    getReviews().catch(() => []),
  ]);

  const visibleReviews = reviews.filter((r) => r.visible);

  // Media uploaded to the Portfolio row is grouped by category so the single
  // Portfolio section (tabs) can show each shoot type in the right tab.
  const isCouple = (category?: string) => isPreWedding(category) || isCoupleShoot(category);

  const coupleItems = rows.gallery.filter((item) => isCouple(item.category));
  const productShootItems = rows.gallery.filter(
    (item) => isProductShoot(item.category) && !isCouple(item.category)
  );
  const menShootItems = rows.gallery.filter(
    (item) => isMenShoot(item.category) && !isCouple(item.category) && !isProductShoot(item.category)
  );
  const womenShootItems = rows.gallery.filter(
    (item) =>
      isWomenShoot(item.category) &&
      !isCouple(item.category) &&
      !isProductShoot(item.category) &&
      !isMenShoot(item.category)
  );
  const portfolioItems = rows.gallery.filter(
    (item) =>
      !isCouple(item.category) &&
      !isProductShoot(item.category) &&
      !isMenShoot(item.category) &&
      !isWomenShoot(item.category)
  );

  return (
    <main className="relative">
      <Backdrop />
      <Navbar />
      <Hero heroItems={rows.hero} />
      {/* section shortcuts, right under the hero heading */}
      <QuickNav />
      <Marquee />
      {/* work first, then pricing/booking — the order a client actually shops in */}
      <Portfolio
        coupleItems={coupleItems}
        girlsItems={womenShootItems}
        boysItems={menShootItems}
        productItems={productShootItems}
        portraitItems={portfolioItems}
      />
      <BookingSection />
      <CtaBand />
      <Services />
      <PosterStrip rowA={rows["wall-a"]} rowB={rows["wall-b"]} />
      {/* long story / mission / vision / why-us live on /about */}
      <AboutTeaser />
      <Marquee reverse />
      <Reviews reviews={visibleReviews} />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

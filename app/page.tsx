import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PosterStrip from "@/components/PosterStrip";
import Services from "@/components/Services";
import About from "@/components/About";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import BookingSection from "@/components/BookingSection";
import CtaBand from "@/components/CtaBand";
import Gallery from "@/components/Gallery";
import PreWedding from "@/components/PreWedding";
import ProductShoots from "@/components/ProductShoots";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import Backdrop from "@/components/Backdrop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getGalleryRowsSafe } from "@/lib/gallery";
import { isPreWedding } from "@/lib/prewedding";
import { isProductShoot } from "@/lib/product-photos";
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

  // Media uploaded to the Portfolio row with the "Pre-Wedding" category is
  // shown in its own showcase section instead of the generic grid.
  const preWeddingItems = rows.gallery.filter((item) => isPreWedding(item.category));
  const productShootItems = rows.gallery.filter(
    (item) => isProductShoot(item.category) && !isPreWedding(item.category)
  );
  const portfolioItems = rows.gallery.filter(
    (item) => !isPreWedding(item.category) && !isProductShoot(item.category)
  );

  return (
    <main className="relative">
      <Backdrop />
      <Navbar />
      <Hero heroItems={rows.hero} />
      <Marquee />
      <PosterStrip rowA={rows["wall-a"]} rowB={rows["wall-b"]} />
      <Services />
      <About />
      <BookingSection />
      <CtaBand />
      <Process />
      <WhyUs />
      <Gallery items={portfolioItems} />
      <PreWedding items={preWeddingItems} />
      <ProductShoots items={productShootItems} />
      <Marquee reverse />
      <Reviews reviews={visibleReviews} />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

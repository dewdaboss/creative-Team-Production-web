import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import BookingSection from "@/components/BookingSection";
import CtaBand from "@/components/CtaBand";
import Gallery from "@/components/Gallery";
import Stats from "@/components/Stats";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import CinemaBackground from "@/components/three/CinemaBackground";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getGallery, getReviews } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [galleryItems, reviews] = await Promise.all([getGallery(), getReviews()]);

  const visibleGallery = galleryItems
    .filter((i) => i.visible)
    .sort((a, b) => a.order - b.order);
  const visibleReviews = reviews.filter((r) => r.visible);

  return (
    <main className="relative">
      <CinemaBackground />
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <BookingSection />
      <CtaBand />
      <Stats />
      <Gallery items={visibleGallery} />
      <Marquee reverse />
      <Reviews reviews={visibleReviews} />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

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
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import Backdrop from "@/components/Backdrop";
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
      <Backdrop />
      <Navbar />
      <Hero />
      <Marquee />
      <PosterStrip />
      <Services />
      <About />
      <BookingSection />
      <CtaBand />
      <Process />
      <WhyUs />
      <Gallery items={visibleGallery} />
      <Marquee reverse />
      <Reviews reviews={visibleReviews} />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

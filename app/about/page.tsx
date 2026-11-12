import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Backdrop from "@/components/Backdrop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Reveal from "@/components/Reveal";
import About from "@/components/About";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import CtaBand from "@/components/CtaBand";
import { legalConfig } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Creative Team Production is a premium creative agency in Indore, Madhya Pradesh — our story, mission, vision, how we work and the eight reasons brands stay with us.",
  alternates: { canonical: `${legalConfig.siteUrl}/about` },
  openGraph: {
    title: `About · ${site.name}`,
    description: "Our story, mission, vision, process and what makes our crew different.",
    type: "article",
  },
};

/**
 * /about — the long-form story, mission, vision, workflow and reasons-to-choose.
 * These blocks used to sit in the home-page scroll; they live here now so only
 * visitors who actually want the details see them.
 */
export default function AboutPage() {
  return (
    <main className="relative min-h-screen">
      <Backdrop />
      <Navbar />

      <section className="relative overflow-hidden pt-[72px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_-10%,rgba(180,248,50,0.12),transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-4 pt-12 sm:px-8 sm:pt-16">
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint"
            >
              <Link href="/" className="transition-colors hover:text-neon">
                Home
              </Link>
              <span aria-hidden="true" className="text-neon/60">
                /
              </span>
              <span className="text-neon-soft">About us</span>
            </nav>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl lg:text-6xl">
              The crew behind <span className="text-gradient-brand">the frames.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
              Our story, mission, vision, the way we work — and the eight reasons brands keep
              coming back. Nothing hidden, just a closer look before you book.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/#booking" className="btn-neon inline-flex items-center gap-2">
                Book a shoot
                <ArrowRight size={16} />
              </Link>
              <Link href="/#portfolio" className="btn-ghost inline-flex items-center gap-2">
                See the portfolio
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* story + mission + vision */}
      <About />

      {/* workflow */}
      <Process />

      {/* eight reasons */}
      <WhyUs />

      <CtaBand />

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

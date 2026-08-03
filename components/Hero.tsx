"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, ChevronDown } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const POSTERS = [
  { src: "/images/gallery/wedding.jpg", title: "Wedding Film" },
  { src: "/images/gallery/portrait.jpg", title: "Neon Editorial" },
  { src: "/images/gallery/product-perfume.jpg", title: "Aura Campaign" },
  { src: "/images/gallery/reel-fashion.jpg", title: "Fashion Reel" },
  { src: "/images/gallery/food.jpg", title: "The Salt Room" },
  { src: "/images/gallery/product-sneaker.jpg", title: "Velocity Drop" },
  { src: "/images/gallery/event.jpg", title: "Birthday Bash" },
  { src: "/images/gallery/reel-dance.jpg", title: "Motion Reel" },
  { src: "/images/gallery/brand.jpg", title: "CityPulse Audio" },
  { src: "/images/gallery/bts.jpg", title: "On Set" },
  { src: "/images/gallery/reel-cooking.jpg", title: "Kitchen Fire" },
  { src: "/images/gallery/portrait.jpg", title: "Studio Light" },
];

export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Cinematic poster wall background */}
      <div className="hero-poster-wall pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="hero-poster-grid">
          {POSTERS.map((p, i) => (
            <div key={i} className="hero-poster-cell">
              <div className="relative h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  className="object-cover opacity-40 transition-transform duration-[3s] ease-out hover:scale-105"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/30 to-transparent" />
              </div>
            </div>
          ))}
        </div>
        {/* heavy gradient overlay to keep text readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_30%_50%,rgba(3,5,3,0.92)_0%,rgba(3,5,3,0.7)_50%,rgba(3,5,3,0.88)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-16 pt-32 sm:px-8 lg:pt-24">
        {/* -------- copy -------- */}
        <div className="relative text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-panel/70 px-4 py-2 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neon-soft">
              Booking open · This month
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.12, ease: EASE }}
            className="mt-7 font-display text-[13vw] font-bold leading-[0.98] tracking-tight text-paper sm:text-6xl lg:text-7xl xl:text-[5.2rem]"
          >
            We don&apos;t just shoot content.
            <span className="mt-2 block text-gradient-neon text-glow">We craft attention.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.26, ease: EASE }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg lg:mx-0"
          >
            Cinematography, photography and digital marketing under one roof — reels that stop
            the scroll, photos that sell, and monthly growth engines that turn views into clients.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center"
          >
            <a href="#booking" className="btn-neon w-full sm:w-auto">
              Book a Shoot
              <ArrowRight size={17} />
            </a>
            <a href="#portfolio" className="btn-ghost w-full sm:w-auto">
              <Play size={16} className="fill-current" />
              Watch the Work
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-left lg:justify-start"
          >
            {[
              ["320+", "projects delivered"],
              ["12.8K+", "IG community"],
              ["48h", "avg. delivery"],
            ].map(([num, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-neon text-glow">{num}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-faint">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* -------- scroll cue -------- */}
      <motion.a
        href="#services"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-1 text-faint transition-colors hover:text-neon"
      >
        <span className="text-[10px] uppercase tracking-[0.34em]">Scroll</span>
        <motion.span animate={reduce ? undefined : { y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  );
}

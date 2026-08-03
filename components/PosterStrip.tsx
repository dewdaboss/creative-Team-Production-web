"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

type Poster = {
  src: string;
  title: string;
  cat: string;
  tilt: string;
  ry: string;
};

const ROW_A: Poster[] = [
  { src: "/images/gallery/wedding.jpg", title: "Sharma × Kapoor", cat: "Weddings", tilt: "-2.5deg", ry: "-8deg" },
  { src: "/images/gallery/portrait.jpg", title: "Neon Editorial", cat: "Portraits", tilt: "1.8deg", ry: "6deg" },
  { src: "/images/gallery/product-perfume.jpg", title: "Aura Campaign", cat: "Product", tilt: "-1.2deg", ry: "-5deg" },
  { src: "/images/gallery/product-sneaker.jpg", title: "Velocity Drop", cat: "Sneaker", tilt: "2.2deg", ry: "8deg" },
  { src: "/images/gallery/event.jpg", title: "Birthday Bash", cat: "Events", tilt: "-0.8deg", ry: "-4deg" },
];

const ROW_B: Poster[] = [
  { src: "/images/gallery/reel-dance.jpg", title: "Motion Reel", cat: "Reels", tilt: "2deg", ry: "-7deg" },
  { src: "/images/gallery/reel-fashion.jpg", title: "Fashion Reel", cat: "Reels", tilt: "-1.5deg", ry: "5deg" },
  { src: "/images/gallery/reel-cooking.jpg", title: "Kitchen Fire", cat: "Reels", tilt: "1.2deg", ry: "-6deg" },
  { src: "/images/gallery/food.jpg", title: "The Salt Room", cat: "Food", tilt: "-2deg", ry: "7deg" },
  { src: "/images/gallery/brand.jpg", title: "CityPulse Audio", cat: "Brand", tilt: "0.8deg", ry: "-3deg" },
  { src: "/images/gallery/bts.jpg", title: "On Set", cat: "BTS", tilt: "-1.8deg", ry: "6deg" },
];

export default function PosterStrip() {
  return (
    <section className="relative overflow-hidden border-y border-line/60 bg-[#060806] py-16 sm:py-24">
      {/* decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/2 h-[1px] w-[60%] bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
        <div className="sunburst-lines absolute left-0 top-0 h-[36rem] w-[36rem] opacity-60" />
        <div className="arc-lines absolute bottom-0 right-0 h-80 w-[28rem] opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-faint">Poster Wall — Live from Studio</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl">
              A wall of <span className="text-gradient-brand">real shoots</span>, not mockups.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Every frame here is from an actual CTP shoot — weddings, products, fashion, food. Hover to flatten the wall, watch the Ken Burns drift.
          </p>
        </Reveal>

        <div className="poster-stage relative">
          {/* Row A */}
          <div className="poster-plane-a flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none">
            {ROW_A.map((p, i) => (
              <PosterCard key={p.src} poster={p} index={i} />
            ))}
          </div>

          {/* Row B */}
          <div className="poster-plane-b mt-6 flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none">
            {ROW_B.map((p, i) => (
              <PosterCard key={p.src} poster={p} index={i + 5} />
            ))}
          </div>

          {/* center glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/10 blur-[90px]" />
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-faint">
          <span className="h-px w-12 bg-line" />
          Scroll sideways · Hover to focus · Real CTP work
          <span className="h-px w-12 bg-line" />
        </div>
      </div>
    </section>
  );
}

function PosterCard({ poster, index }: { poster: Poster; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="poster-tilt group relative shrink-0"
      style={{ "--tilt": poster.tilt, "--ry": poster.ry } as React.CSSProperties}
    >
      <div className="relative h-[280px] w-[190px] overflow-hidden rounded-2xl border border-line bg-panel shadow-card transition-all duration-500 group-hover:border-neon/40 group-hover:shadow-glow sm:h-[340px] sm:w-[230px]">
        <div className="animate-kenburns absolute inset-0">
          <Image src={poster.src} alt={poster.title} fill className="object-cover" sizes="230px" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-display text-sm font-bold leading-tight text-white">{poster.title}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neon-soft">{poster.cat}</p>
        </div>
        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white/80 backdrop-blur">
          CTP Original
        </div>
      </div>
    </motion.div>
  );
}

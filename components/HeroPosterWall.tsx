"use client";

import { Clapperboard, Star, FolderCheck } from "lucide-react";

/**
 * HeroPosterWall — lightweight hero visual: fanned cinematic posters
 * (BTS / photoshoot / product ad) with a gentle GPU-only float.
 * No WebGL, self-contained styles, reduced-motion safe.
 */

type Poster = {
  src: string;
  label: string;
  rotate: string;
  lift: string;
  dur: string;
  del: string;
  z: number;
  eager: boolean;
  rec?: boolean;
};

const POSTERS: Poster[] = [
  {
    src: "/images/gallery/bts.jpg",
    label: "BTS · Cinema",
    rotate: "-7deg",
    lift: "14px",
    dur: "7.2s",
    del: "0.5s",
    z: 1,
    eager: false,
  },
  {
    src: "/images/gallery/portrait.jpg",
    label: "Photoshoot",
    rotate: "0deg",
    lift: "-8px",
    dur: "8.4s",
    del: "0s",
    z: 3,
    eager: true,
    rec: true,
  },
  {
    src: "/images/gallery/product-perfume.jpg",
    label: "Product Ad",
    rotate: "7deg",
    lift: "16px",
    dur: "7.8s",
    del: "0.9s",
    z: 2,
    eager: false,
  },
];

const CHIPS = [
  { icon: Clapperboard, label: "60+ Reels Cut", pos: "-left-2 top-3 sm:-left-8" },
  { icon: Star, label: "4.9 Rated", pos: "-right-2 top-[38%] sm:-right-8" },
  { icon: FolderCheck, label: "40+ Projects", pos: "left-0 -bottom-3 sm:left-4" },
] as const;

export default function HeroPosterWall() {
  return (
    <div
      className="relative mx-auto w-full max-w-[26rem] select-none sm:max-w-md"
      role="img"
      aria-label="Creative Team poster wall — cinematic BTS, photoshoot and product ad posters"
    >
      <style>{`
        @keyframes hpwFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .hpw-float { animation: hpwFloat var(--dur, 8s) ease-in-out infinite; animation-delay: var(--del, 0s); will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .hpw-float { animation: none !important; } }
      `}</style>

      <div
        aria-hidden
        className="absolute -inset-4 rounded-[2.5rem] bg-neon/10 blur-2xl"
      />

      <div className="relative flex items-end justify-center gap-3 sm:gap-4" style={{ perspective: "1000px" }}>
        {POSTERS.map((p) => (
          <div
            key={p.src}
            className="relative w-[31%]"
            style={{ transform: `rotate(${p.rotate}) translateY(${p.lift})`, zIndex: p.z }}
          >
            <div
              className="hpw-float relative overflow-hidden rounded-2xl border border-neon/25 bg-panel shadow-card"
              style={{ "--dur": p.dur, "--del": p.del } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={`${p.label} poster — Creative Team Production`}
                width={300}
                height={400}
                loading={p.eager ? "eager" : "lazy"}
                className="aspect-[3/4] w-full object-cover"
              />
              <span
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent"
                aria-hidden
              />
              <span className="absolute bottom-2 left-2 rounded-full border border-neon/30 bg-black/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-neon-soft backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[10px]">
                {p.label}
              </span>
              {p.rec && (
                <span className="absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 text-[9px] font-bold tracking-[0.18em] text-paper">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  REC
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {CHIPS.map((chip) => (
        <div
          key={chip.label}
          className={`absolute ${chip.pos} flex items-center gap-2 rounded-2xl border border-white/10 bg-black/55 px-3.5 py-2.5 shadow-card backdrop-blur-md`}
        >
          <chip.icon size={15} className="text-neon" />
          <span className="whitespace-nowrap text-xs font-semibold tracking-wide text-paper">
            {chip.label}
          </span>
        </div>
      ))}
    </div>
  );
}

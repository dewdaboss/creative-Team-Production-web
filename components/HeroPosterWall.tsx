"use client";

import { Clapperboard, Star, FolderCheck } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { HERO_SHOOT } from "@/lib/shoot-photos";

/**
 * HeroPosterWall — lightweight hero visual: fanned cinematic posters
 * (BTS / photoshoot / product ad) with a gentle GPU-only float.
 * No WebGL, self-contained styles, reduced-motion safe.
 *
 * Posters come from the Supabase-driven "Hero" row when the owner has added
 * media in /admin; otherwise the built-in defaults are used.
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
  video?: boolean;
};

const POSTERS: Poster[] = [
  {
    src: HERO_SHOOT[0].src,
    label: HERO_SHOOT[0].category,
    rotate: "-7deg",
    lift: "14px",
    dur: "7.2s",
    del: "0.5s",
    z: 1,
    eager: false,
  },
  {
    src: HERO_SHOOT[1].src,
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
    src: HERO_SHOOT[2].src,
    label: HERO_SHOOT[2].category,
    rotate: "7deg",
    lift: "16px",
    dur: "7.8s",
    del: "0.9s",
    z: 2,
    eager: false,
  },
];

const SLOTS = [
  { rotate: "-7deg", lift: "14px", dur: "7.2s", del: "0.5s", z: 1 },
  { rotate: "0deg", lift: "-8px", dur: "8.4s", del: "0s", z: 3 },
  { rotate: "7deg", lift: "16px", dur: "7.8s", del: "0.9s", z: 2 },
];

const CHIPS = [
  { icon: Clapperboard, label: "60+ Reels Cut", pos: "-left-2 top-3 sm:-left-8" },
  { icon: Star, label: "4.9 Rated", pos: "-right-2 top-[38%] sm:-right-8" },
  { icon: FolderCheck, label: "40+ Projects", pos: "left-0 -bottom-3 sm:left-4" },
] as const;

function postersFrom(items: GalleryItem[]): Poster[] {
  const picked = items.slice(0, 3);
  if (picked.length === 0) return POSTERS;
  return picked.map((item, i) => {
    const slot = SLOTS[i] ?? SLOTS[0];
    return {
      src: item.src,
      label: item.category || item.title,
      rotate: slot.rotate,
      lift: slot.lift,
      dur: slot.dur,
      del: slot.del,
      z: slot.z,
      eager: i === 1,
      rec: i === 1,
      video: item.mediaType === "video",
    };
  });
}

export default function HeroPosterWall({ items = [] }: { items?: GalleryItem[] }) {
  const posters = postersFrom(items);
  return (
    <div
      className="relative mx-auto w-full max-w-[26rem] select-none sm:max-w-md"
      role="img"
      aria-label="Creative Team poster wall — real photoshoot and lifestyle posters from our Indore studio"
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
        {posters.map((p) => (
          <div
            key={p.src}
            className="relative w-[31%]"
            style={{ transform: `rotate(${p.rotate}) translateY(${p.lift})`, zIndex: p.z }}
          >
            <div
              className="hpw-float relative overflow-hidden rounded-2xl border border-neon/25 bg-panel shadow-card"
              style={{ "--dur": p.dur, "--del": p.del } as React.CSSProperties}
            >
              {p.video ? (
                <video
                  src={p.src}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  aria-label={`${p.label} — Creative Team Production`}
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.src}
                  alt={`${p.label} poster — Creative Team Production`}
                  width={300}
                  height={400}
                  loading={p.eager ? "eager" : "lazy"}
                  className="aspect-[3/4] w-full object-cover"
                />
              )}
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

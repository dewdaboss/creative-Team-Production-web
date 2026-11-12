"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { selectService } from "@/lib/client-events";
import { PREWEDDING_PHOTOS } from "@/lib/prewedding";
import { site } from "@/lib/site";
import type { GalleryItem } from "@/lib/types";

type Frame = {
  src: string;
  title: string;
  tag: string;
  video?: boolean;
};

/** Admin-uploaded "Pre-Wedding" media when present, otherwise the built-in set. */
function framesFrom(items: GalleryItem[]): Frame[] {
  if (items.length === 0) return PREWEDDING_PHOTOS;
  return items.map((item, i) => ({
    src: item.src,
    title: item.title,
    tag: item.mediaType === "video" ? "Reel" : PREWEDDING_PHOTOS[i % PREWEDDING_PHOTOS.length].tag,
    video: item.mediaType === "video",
  }));
}

export default function PreWedding({ items = [] }: { items?: GalleryItem[] }) {
  const frames = framesFrom(items);
  const reduce = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const step = useCallback((dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 240), behavior: "smooth" });
  }, []);

  const move = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + frames.length) % frames.length)),
    [frames.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, move]);

  const current = active === null ? null : frames[active];

  return (
    <section id="pre-wedding" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      {/* soft brand glow — keeps the black/neon system intact */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-neon/10 blur-[110px]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-neon/[0.06] blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Pre-Wedding"
            align="left"
            title={
              <>
                Love stories, <span className="text-gradient-brand">framed like cinema.</span>
              </>
            }
            description="Candid moments, heritage locations, styling guidance and a colour grade that feels like a film — the complete pre-wedding shoot in one crew."
          />

          {/* desktop arrows */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Scroll pre-wedding photos left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-neon/25 bg-panel/70 text-paper transition-colors hover:border-neon/60 hover:text-neon"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Scroll pre-wedding photos right"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-neon/25 bg-panel/70 text-paper transition-colors hover:border-neon/60 hover:text-neon"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* horizontal rail — swipe on mobile, arrows / trackpad on desktop */}
        <div
          ref={rail}
          className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5"
        >
          {frames.map((frame, i) => (
            <motion.button
              key={`${frame.src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : (i % 5) * 0.05 }}
              className="group relative w-[68%] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-panel text-left shadow-card transition-colors duration-300 hover:border-neon/45 sm:w-[44%] lg:w-[31%] xl:w-[23.5%]"
              aria-label={`Open ${frame.title}`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                {frame.video ? (
                  <video
                    src={frame.src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <Image
                    src={frame.src}
                    alt={`${frame.title} — pre-wedding shoot by ${site.name}`}
                    fill
                    sizes="(max-width: 640px) 68vw, (max-width: 1024px) 44vw, 24vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-neon/30 bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-neon-soft backdrop-blur-sm">
                  <Heart size={10} /> {frame.tag}
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block font-display text-sm font-bold text-white sm:text-base">
                    {frame.title}
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-soft">
                    Pre-Wedding · {site.name.split(" ")[0]}
                  </span>
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-faint lg:hidden">
          <span className="h-px w-10 bg-line" />
          Swipe to explore · Tap to zoom
          <span className="h-px w-10 bg-line" />
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#booking"
            onClick={() => selectService("photography")}
            className="btn-neon inline-flex items-center gap-2"
          >
            <Camera size={16} />
            Book a pre-wedding shoot
          </a>
          <a
            href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
              "Hi Creative Team Production, I want to book a pre-wedding shoot."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex items-center gap-2"
          >
            Ask on WhatsApp
            <ArrowRight size={15} />
          </a>
          <p className="text-xs leading-relaxed text-faint">
            Locations, styling and a highlight reel can be added to any package.
          </p>
        </Reveal>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${current.title} — pre-wedding photo`}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-paper transition-colors hover:border-neon/50 hover:text-neon"
            >
              <X size={20} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                move(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-paper transition-colors hover:border-neon/50 hover:text-neon sm:left-6"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                move(1);
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-paper transition-colors hover:border-neon/50 hover:text-neon sm:right-6"
            >
              <ChevronRight size={20} />
            </button>

            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[86vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {current.video ? (
                <video
                  src={current.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[86vh] w-full bg-black object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.src}
                  alt={`${current.title} — pre-wedding shoot by ${site.name}`}
                  className="max-h-[86vh] w-full object-contain"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                <p className="font-display text-sm font-bold text-white sm:text-base">{current.title}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-soft">
                  Pre-Wedding · {site.name}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

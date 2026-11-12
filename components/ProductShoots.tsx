"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Package, Sparkles, X } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { selectService } from "@/lib/client-events";
import { PRODUCT_SHOTS } from "@/lib/product-photos";
import { site } from "@/lib/site";
import type { GalleryItem } from "@/lib/types";

type Shot = {
  src: string;
  title: string;
  tag: string;
  video?: boolean;
};

function shotsFrom(items: GalleryItem[]): Shot[] {
  if (items.length === 0) return PRODUCT_SHOTS;
  return items.map((item, i) => ({
    src: item.src,
    title: item.title,
    tag: item.mediaType === "video" ? "Reel" : PRODUCT_SHOTS[i % PRODUCT_SHOTS.length].tag,
    video: item.mediaType === "video",
  }));
}

export default function ProductShoots({ items = [] }: { items?: GalleryItem[] }) {
  const shots = shotsFrom(items);
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const move = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + shots.length) % shots.length)),
    [shots.length]
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

  const current = active === null ? null : shots[active];

  return (
    <section id="product-shoots" className="relative scroll-mt-16 py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-neon/[0.07] blur-[100px]" />
        <div className="absolute -left-20 top-10 h-px w-[55%] bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Product Shoots"
          title={
            <>
              Products shot like <span className="text-gradient-brand">campaign heroes.</span>
            </>
          }
          description="Studio-lit skincare, jewellery and e-commerce sets — clean shadows, true colour and frames built for ads, listings and reels."
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {shots.map((shot, i) => (
            <motion.button
              key={`${shot.src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : (i % 4) * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-panel text-left shadow-card transition-colors duration-300 hover:border-neon/45"
              aria-label={`Open ${shot.title}`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                {shot.video ? (
                  <video
                    src={shot.src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                ) : (
                  <Image
                    src={shot.src}
                    alt={`${shot.title} — product photography by ${site.name}`}
                    fill
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 23vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent opacity-90" />
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-neon/30 bg-black/60 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-neon-soft backdrop-blur-sm sm:text-[9px]">
                  <Sparkles size={9} /> {shot.tag}
                </span>
                <span className="absolute inset-x-0 bottom-0 p-3">
                  <span className="block font-display text-xs font-bold leading-tight text-white sm:text-sm">
                    {shot.title}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.16em] text-neon-soft">
                    Studio · {shot.tag}
                  </span>
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#booking"
            onClick={() => selectService("product")}
            className="btn-neon inline-flex items-center gap-2"
          >
            <Package size={16} />
            Book a product shoot
          </a>
          <a
            href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
              "Hi Creative Team Production, I want product photos for my brand."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex items-center gap-2"
          >
            Get a quote
            <ArrowRight size={15} />
          </a>
          <p className="text-xs leading-relaxed text-faint">
            Per-product and monthly catalogue packages available on request.
          </p>
        </Reveal>
      </div>

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
            aria-label={`${current.title} — product photo`}
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
              aria-label="Previous product"
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
              aria-label="Next product"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-paper transition-colors hover:border-neon/50 hover:text-neon sm:right-6"
            >
              <ChevronRight size={20} />
            </button>

            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[86vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {current.video ? (
                <video src={current.src} controls autoPlay playsInline className="max-h-[86vh] w-full object-contain" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.src}
                  alt={`${current.title} — product photography by ${site.name}`}
                  className="max-h-[86vh] w-full object-contain"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                <p className="font-display text-sm font-bold text-white sm:text-base">{current.title}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-soft">
                  {current.tag} · {site.name}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { selectService } from "@/lib/client-events";
import { site } from "@/lib/site";
import { MEN_SHOOTS } from "@/lib/men-shoots";
import { PREWEDDING_PHOTOS } from "@/lib/prewedding";
import { PRODUCT_SHOTS } from "@/lib/product-photos";
import { SHOOT_PHOTOS } from "@/lib/shoot-photos";
import { WOMEN_SHOOTS } from "@/lib/women-shoots";
import type { GalleryItem } from "@/lib/types";

type Tab = "all" | "couple" | "girls" | "boys" | "products" | "portraits";

type Shot = {
  key: string;
  src: string;
  title: string;
  category: string;
  video?: boolean;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "couple", label: "Couple" },
  { id: "girls", label: "Girls" },
  { id: "boys", label: "Boys" },
  { id: "products", label: "Products" },
  { id: "portraits", label: "Portraits" },
];

/** Photos visible before "Show all" — keeps the page short. */
const PAGE = 8;

export interface PortfolioProps {
  /** admin media, already filtered per category on the server */
  coupleItems?: GalleryItem[];
  girlsItems?: GalleryItem[];
  boysItems?: GalleryItem[];
  productItems?: GalleryItem[];
  portraitItems?: GalleryItem[];
}

const fromItems = (items: GalleryItem[] | undefined, category: string): Shot[] =>
  (items ?? []).map((item) => ({
    key: item.id,
    src: item.src,
    title: item.title,
    category,
    video: item.mediaType === "video" || item.type === "reel",
  }));

const fromBuiltIn = (
  photos: { src: string; title: string }[],
  category: string
): Shot[] => photos.map((p, i) => ({ key: `${category}-${i}`, src: p.src, title: p.title, category }));

/** Admin media wins when present, otherwise the built-in set is used. */
const set = (items: GalleryItem[] | undefined, builtIn: { src: string; title: string }[], category: string) =>
  items && items.length > 0 ? fromItems(items, category) : fromBuiltIn(builtIn, category);

/**
 * Portfolio — single showcase section with category tabs.
 * Every shoot type (couple / girls / boys / products / café portraits) lives
 * here instead of in its own long section, so the home page stays short and
 * the visitor picks what they want to see.
 */
export default function Portfolio({
  coupleItems,
  girlsItems,
  boysItems,
  productItems,
  portraitItems,
}: PortfolioProps) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("all");
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const groups = useMemo(
    () => ({
      couple: set(coupleItems, PREWEDDING_PHOTOS, "Couple / Pre-Wedding"),
      girls: set(girlsItems, WOMEN_SHOOTS, "Girls Shoot"),
      boys: set(boysItems, MEN_SHOOTS, "Boys Shoot"),
      products: set(productItems, PRODUCT_SHOTS, "Product Shoot"),
      portraits: set(
        portraitItems,
        SHOOT_PHOTOS.map((p) => ({ src: p.src, title: p.title })),
        "Portrait"
      ),
    }),
    [coupleItems, girlsItems, boysItems, productItems, portraitItems]
  );

  const shots = useMemo<Shot[]>(() => {
    if (tab !== "all") return groups[tab];
    // curated mix so "All Work" never becomes an endless wall of images
    const pick = (list: Shot[], n: number) => list.slice(0, n);
    return [
      ...pick(groups.couple, 2),
      ...pick(groups.girls, 2),
      ...pick(groups.boys, 2),
      ...pick(groups.products, 2),
    ];
  }, [tab, groups]);

  const visible = expanded ? shots : shots.slice(0, PAGE);
  // "All Work" stays a fixed 8-frame teaser — each category tab has the full set.
  const canExpand = tab !== "all" && shots.length > PAGE;

  const counts = {
    couple: groups.couple.length,
    girls: groups.girls.length,
    boys: groups.boys.length,
    products: groups.products.length,
    portraits: groups.portraits.length,
  };

  const move = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + visible.length) % visible.length)),
    [visible.length]
  );

  useEffect(() => {
    setExpanded(false);
    setActive(null);
  }, [tab]);

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

  const current = active === null ? null : visible[active];

  return (
    <section id="portfolio" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-neon/10 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-neon/[0.06] blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Portfolio"
          title={
            <>
              One crew, <span className="text-gradient-brand">every kind of shoot.</span>
            </>
          }
          description="Couple, girls, boys, product and portrait shoots — pick a category to see the work instead of scrolling the whole archive."
        />

        {/* category tabs */}
        <Reveal className="mt-8">
          <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
            {TABS.map((t) => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-pressed={isActive}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:px-5 sm:text-xs ${
                    isActive ? "text-[#03130a]" : "border border-line text-mute hover:border-neon/40 hover:text-paper"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="portfolio-tab-pill"
                      className="absolute inset-0 rounded-full bg-neon shadow-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">
                    {t.label}
                    {t.id !== "all" && (
                      <span className={isActive ? "ml-1.5 opacity-70" : "ml-1.5 text-faint"}>
                        {counts[t.id as keyof typeof counts]}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((shot, i) => (
              <motion.button
                key={`${tab}-${shot.key}`}
                type="button"
                layout
                onClick={() => setActive(i)}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: reduce ? 0 : 0.28, delay: reduce ? 0 : (i % 4) * 0.03 }}
                className="group relative overflow-hidden rounded-xl border border-line bg-panel text-left shadow-card transition-colors duration-300 hover:border-neon/45 sm:rounded-2xl"
                aria-label={`Open ${shot.title}`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
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
                      alt={`${shot.title} — ${shot.category} by ${site.name}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />
                  {shot.video && (
                    <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-neon backdrop-blur-sm">
                      <Play size={12} />
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <span className="line-clamp-1 block font-display text-[13px] font-bold text-white sm:text-sm">
                      {shot.title}
                    </span>
                    <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.18em] text-neon-soft">
                      {shot.category}
                    </span>
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* expand / CTA row */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {canExpand && !expanded ? (
              <button type="button" onClick={() => setExpanded(true)} className="btn-ghost inline-flex items-center gap-2">
                Show all {shots.length} photos
                <ArrowRight size={15} />
              </button>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-faint">
                {shots.length} {shots.length === 1 ? "frame" : "frames"}
              </span>
            )}
            {expanded && canExpand && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute transition-colors hover:text-neon"
              >
                Show less
              </button>
            )}
          </div>

          <a
            href="#booking"
            onClick={() => selectService("photography")}
            className="btn-neon inline-flex items-center gap-2"
          >
            <Camera size={16} />
            Book a shoot
          </a>
        </div>
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
            aria-label={`${current.title} — ${current.category}`}
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
              key={current.key}
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
                  alt={`${current.title} — ${current.category} by ${site.name}`}
                  className="max-h-[86vh] w-full object-contain"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                <p className="font-display text-sm font-bold text-white sm:text-base">{current.title}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-soft">
                  {current.category} · {site.name}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

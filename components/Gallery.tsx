"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Clapperboard, Play, X, ExternalLink, Eye, Clock3 } from "lucide-react";
import { InstagramIcon } from "./BrandIcons";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import type { GalleryItem } from "@/lib/types";

type Filter = "all" | "photo" | "reel";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "photo", label: "Photos" },
  { id: "reel", label: "Reels" },
];

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () => items.filter((i) => filter === "all" || i.type === filter),
    [items, filter]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="portfolio" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Portfolio"
          title={
            <>
              Work that <span className="text-gradient-neon">stops the scroll.</span>
            </>
          }
          description="A living gallery — new shoots, reels and campaigns are published straight from our studio dashboard."
        />

        {/* filters */}
        <Reveal className="mb-10 flex justify-center">
          <div className="glass inline-flex rounded-full p-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`relative rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:px-6 ${
                  filter === f.id ? "text-[#03130a]" : "text-mute hover:text-paper"
                }`}
              >
                {filter === f.id && (
                  <motion.span
                    layoutId="gallery-filter-pill"
                    className="absolute inset-0 rounded-full bg-neon shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* grid */}
        <motion.div layout className="grid grid-flow-dense grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const isReel = item.type === "reel";
              const feature = item.featured;
              return (
                <motion.button
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActive(item)}
                  className={`group relative overflow-hidden rounded-2xl border border-line bg-panel text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neon ${
                    isReel
                      ? "row-span-2 aspect-[9/16]"
                      : feature
                        ? "col-span-2 aspect-[16/9] sm:aspect-[16/10]"
                        : "aspect-square"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes={isReel ? "(max-width:1024px) 50vw, 25vw" : feature ? "(max-width:1024px) 100vw, 50vw" : "(max-width:1024px) 50vw, 25vw"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                  {/* type badge */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 backdrop-blur">
                    {isReel ? <Clapperboard size={11} className="text-neon" /> : <Camera size={11} className="text-neon" />}
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/90">
                      {isReel ? "Reel" : "Photo"}
                    </span>
                  </div>

                  {isReel && (
                    <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full border border-neon/50 bg-black/50 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-neon group-hover:shadow-glow">
                      <Play size={20} className="ml-0.5 fill-neon text-neon transition-colors group-hover:fill-[#03130a] group-hover:text-[#03130a]" />
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-display text-sm font-bold leading-tight text-white sm:text-base">
                      {item.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
                      <span>{item.category}</span>
                      {item.views && (
                        <span className="flex items-center gap-1">
                          <Eye size={11} /> {item.views}
                        </span>
                      )}
                      {item.duration && (
                        <span className="flex items-center gap-1">
                          <Clock3 size={11} /> {item.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ---------------- lightbox ---------------- */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-void/90 p-4 backdrop-blur-xl sm:p-8"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong relative max-h-full w-full max-w-3xl overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 p-2.5 text-white backdrop-blur transition-colors hover:border-neon hover:text-neon"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>

              {active.type === "photo" || !active.embedUrl ? (
                <div className={`relative w-full ${active.type === "reel" ? "aspect-[9/16] max-h-[72vh]" : "aspect-video"}`}>
                  <Image src={active.src} alt={active.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 768px" />
                </div>
              ) : (
                <div className="aspect-[9/16] max-h-[72vh] w-full bg-black">
                  <iframe
                    src={toEmbedUrl(active.embedUrl)}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title={active.title}
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-display text-lg font-bold text-paper">{active.title}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-faint">{active.category}</p>
                </div>
                {active.type === "reel" && (
                  <a
                    href={active.embedUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost !px-5 !py-2.5 text-xs"
                  >
                    <InstagramIcon size={15} /> Watch on Instagram <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function toEmbedUrl(url: string): string {
  try {
    if (url.includes("/embed")) return url;
    const u = new URL(url);
    if (!u.hostname.includes("instagram.com")) return url;
    const path = u.pathname.replace(/\/$/, "");
    return `https://www.instagram.com${path}/embed`;
  } catch {
    return url;
  }
}

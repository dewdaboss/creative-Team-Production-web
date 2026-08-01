"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import type { Review } from "@/lib/types";
import { site } from "@/lib/site";

function Stars({ n, size = 15 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= n ? "fill-neon text-neon" : "fill-transparent text-faint"}
        />
      ))}
    </span>
  );
}

const AVATAR_TONES = [
  "from-neon/70 to-neon-dark",
  "from-emerald-400/70 to-teal-700",
  "from-lime-400/70 to-green-700",
  "from-teal-300/70 to-emerald-800",
];

export default function Reviews({ reviews }: { reviews: Review[] }) {
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(3);
  const timer = useRef<NodeJS.Timeout>(null);

  const { average, count } = useMemo(() => {
    const avg = reviews.length
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;
    return { average: avg, count: reviews.length };
  }, [reviews]);

  useEffect(() => {
    const update = () => setPerView(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = Math.max(1, Math.ceil(reviews.length / perView));
  const go = (dir: number) => setPage((p) => (p + dir + pages) % pages);

  useEffect(() => {
    timer.current = setInterval(() => go(1), 6000);
    return () => clearInterval(timer.current as never);
  }, [pages, perView]);

  const visible = reviews.slice(page * perView, page * perView + perView);
  const shown = visible.length === perView || page === 0 ? visible : reviews.slice(0, perView);

  return (
    <section id="reviews" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Client love"
          title={
            <>
              Rated <span className="text-gradient-neon">4.9 on Google.</span>
            </>
          }
          description="Real feedback from brands, creators and families we've shot for."
        />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* summary card */}
          <Reveal>
            <div className="glass relative h-full overflow-hidden rounded-3xl p-7">
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-neon/15 blur-3xl" />
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 font-display text-lg font-black text-[#03130a]">
                  G
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-paper">Google Reviews</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-faint">Verified ratings</p>
                </div>
              </div>
              <div className="mt-7 flex items-end gap-3">
                <span className="font-display text-6xl font-bold leading-none text-gradient-neon text-glow">
                  {average.toFixed(1)}
                </span>
                <div className="pb-1.5">
                  <Stars n={Math.round(average)} size={17} />
                  <p className="mt-1.5 text-xs text-mute">{count}+ client reviews</p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                {[5, 4, 3].map((star) => {
                  const pct =
                    star === 5 ? 86 : star === 4 ? 11 : 3;
                  return (
                    <div key={star} className="flex items-center gap-2.5 text-xs text-mute">
                      <span className="w-3 font-semibold">{star}</span>
                      <Star size={11} className="fill-faint text-faint" />
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-raise">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-neon"
                        />
                      </div>
                      <span className="w-9 text-right text-faint">{pct}%</span>
                    </div>
                  );
                })}
              </div>
              <a
                href={site.googleReview}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon mt-7 w-full !py-3 text-xs"
              >
                <Star size={14} /> Rate us on Google
              </a>
            </div>
          </Reveal>

          {/* carousel */}
          <Reveal delay={0.1}>
            <div className="relative flex h-full flex-col">
              <div className="relative flex-1 overflow-hidden">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="grid h-full gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {shown.map((r, i) => (
                    <article
                      key={r.id}
                      className="glass group relative flex flex-col rounded-3xl p-6 transition-colors duration-300 hover:border-neon/40"
                    >
                      <Quote size={26} className="absolute right-5 top-5 text-neon/20 transition-colors group-hover:text-neon/50" />
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-[#03130a] ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
                        >
                          {r.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-display text-sm font-bold text-paper">{r.name}</p>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-faint">
                            {new Date(r.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                            {r.service ? ` · ${r.service}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Stars n={r.rating} />
                      </div>
                      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-mute">“{r.text}”</p>
                      <p className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
                        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white/90 text-[9px] font-black text-[#03130a]">G</span>
                        Posted on Google
                      </p>
                    </article>
                  ))}
                </motion.div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to reviews page ${i + 1}`}
                      onClick={() => setPage(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === page ? "w-7 bg-neon shadow-glow" : "w-3 bg-raise hover:bg-neon-dim"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous reviews"
                    className="rounded-full border border-line p-2.5 text-mute transition-all hover:border-neon/60 hover:text-neon"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next reviews"
                    className="rounded-full border border-line p-2.5 text-mute transition-all hover:border-neon/60 hover:text-neon"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

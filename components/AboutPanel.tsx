"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Compass,
  Feather,
  Fingerprint,
  Gem,
  Layers,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  X,
} from "lucide-react";
import Link from "next/link";
import { ABOUT, PROCESS, WHY_US } from "@/lib/brand";
import { ABOUT_PANEL_EVENT } from "@/lib/about-panel";
import { selectService } from "@/lib/client-events";
import { site } from "@/lib/site";

const WHY_ICONS: Record<string, typeof Award> = {
  Award,
  Feather,
  Gem,
  Zap,
  Target,
  TrendingUp,
  Fingerprint,
  Layers,
};

type Tab = "story" | "mission" | "why" | "process";

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "story", label: "Our story", icon: BookOpen },
  { id: "mission", label: "Mission & Vision", icon: Compass },
  { id: "why", label: "Why us", icon: Sparkles },
  { id: "process", label: "How we work", icon: Layers },
];

/**
 * In-page About panel.
 * Opens over the current page (no navigation) from the navbar "About" link and
 * the About teaser. `/about` still exists as a page for direct links & SEO.
 */
export default function AboutPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("story");
  const reduce = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => {
      setTab("story");
      setOpen(true);
    };
    window.addEventListener(ABOUT_PANEL_EVENT, onOpen);
    return () => window.removeEventListener(ABOUT_PANEL_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const bookNow = () => {
    setOpen(false);
    selectService("photography");
    // let the panel close before scrolling
    window.setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-panel-title"
        >
          <motion.div
            initial={reduce ? { opacity: 1 } : { y: 40, opacity: 0, scale: 0.99 }}
            animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 30, opacity: 0, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-ink shadow-[0_-20px_80px_rgba(0,0,0,0.6)] sm:max-h-[86vh] sm:max-w-3xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="relative shrink-0 border-b border-line/80 px-5 pb-4 pt-5 sm:px-7">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(420px_120px_at_30%_0%,rgba(180,248,50,0.16),transparent_70%)]"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neon">
                    About Creative Team Production
                  </p>
                  <h2
                    id="about-panel-title"
                    className="mt-2 font-display text-xl font-bold leading-tight text-paper sm:text-2xl"
                  >
                    The crew behind <span className="text-gradient-brand">the frames.</span>
                  </h2>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                    <MapPin size={11} className="text-neon" /> Indore · Madhya Pradesh
                  </p>
                </div>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={close}
                  aria-label="Close about panel"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-panel/80 text-paper transition-colors hover:border-neon/50 hover:text-neon"
                >
                  <X size={18} />
                </button>
              </div>

              {/* tabs */}
              <div className="scrollbar-none -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                {TABS.map(({ id, label, icon: Icon }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTab(id)}
                      aria-pressed={active}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                        active
                          ? "bg-neon text-[#03130a]"
                          : "border border-line text-mute hover:border-neon/40 hover:text-paper"
                      }`}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* body */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reduce ? 0 : 0.22 }}
                  className="space-y-4"
                >
                  {tab === "story" && (
                    <>
                      <p className="text-[15px] leading-relaxed text-paper/90">{ABOUT.lead}</p>
                      <p className="text-sm leading-relaxed text-mute">{ABOUT.body}</p>
                      <p className="rounded-2xl border border-neon/20 bg-panel/70 p-4 text-sm leading-relaxed text-mute">
                        {ABOUT.promise}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Photo + Film", "Branding", "Social Media", "Digital Marketing"].map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-line bg-raise/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mute"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {tab === "mission" && (
                    <>
                      {[
                        { icon: Target, title: "Mission", text: ABOUT.mission },
                        { icon: Compass, title: "Vision", text: ABOUT.vision },
                      ].map(({ icon: Icon, title, text }) => (
                        <div
                          key={title}
                          className="rounded-2xl border border-neon/20 bg-panel/70 p-4 sm:p-5"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon/10 text-neon">
                            <Icon size={17} />
                          </span>
                          <h3 className="mt-3 font-display text-xs font-bold uppercase tracking-[0.18em] text-paper">
                            {title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-mute">{text}</p>
                        </div>
                      ))}
                    </>
                  )}

                  {tab === "why" && (
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {WHY_US.map((item) => {
                        const Icon = WHY_ICONS[item.icon] ?? Award;
                        return (
                          <div
                            key={item.title}
                            className="rounded-xl border border-line bg-panel/60 p-3.5"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon/25 bg-neon/10 text-neon">
                              <Icon size={15} strokeWidth={1.9} />
                            </span>
                            <h3 className="mt-2.5 font-display text-[13px] font-bold text-paper">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-[12px] leading-relaxed text-mute">{item.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {tab === "process" && (
                    <ol className="space-y-2.5">
                      {PROCESS.map((step) => (
                        <li
                          key={step.step}
                          className="flex gap-3 rounded-xl border border-line bg-panel/60 p-3.5"
                        >
                          <span className="font-display text-sm font-bold text-neon/70">{step.step}</span>
                          <div>
                            <h3 className="font-display text-[13px] font-bold text-paper">{step.title}</h3>
                            <p className="mt-0.5 text-[12px] leading-relaxed text-mute">{step.text}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* footer CTA */}
            <div className="shrink-0 border-t border-line/80 bg-void/60 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <button type="button" onClick={bookNow} className="btn-neon !px-5 !py-2.5 text-xs">
                  Book a shoot
                  <ArrowRight size={14} />
                </button>
                <a
                  href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                    "Hi Creative Team Production, I have a question about your studio."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost !px-5 !py-2.5 text-xs"
                >
                  WhatsApp us
                </a>
                <Link
                  href="/about"
                  className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-faint transition-colors hover:text-neon"
                >
                  Open as page
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

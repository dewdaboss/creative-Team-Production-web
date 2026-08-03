"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, ChevronDown, Clapperboard, FolderCheck } from "lucide-react";
import { InstagramIcon } from "./BrandIcons";
import CameraHero from "./three/CameraHero";

const EASE = [0.16, 1, 0.3, 1] as const;

const floatChips = [
  { icon: Clapperboard, label: "60+ Reels Cut", pos: "-left-6 top-16 lg:-left-14", delay: 0 },
  { icon: InstagramIcon, label: "90+ IG Family", pos: "-right-4 top-36 lg:-right-12", delay: 1.2 },
  { icon: FolderCheck, label: "40+ Projects", pos: "-left-4 bottom-16 lg:-left-10", delay: 2.1 },
];

export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:pt-24">
        {/* -------- copy -------- */}
        <div className="relative z-10 text-center lg:text-left">
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
              ["40+", "projects delivered"],
              ["90+", "IG family"],
              ["60+", "reels cut"],
            ].map(([num, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-neon text-glow">{num}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-faint">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* -------- 3D camera stage -------- */}
        <div className="relative z-10 mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
            className="relative"
          >
            <CameraHero className="h-[min(76vw,440px)] w-[min(76vw,440px)]" />

            {floatChips.map((chip, i) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, y: 20 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -10, 0] }}
                transition={
                  reduce
                    ? { duration: 0.6, delay: 0.6 + i * 0.15 }
                    : {
                        opacity: { duration: 0.6, delay: 0.6 + i * 0.15 },
                        y: { duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: chip.delay },
                      }
                }
                className={`glass absolute ${chip.pos} flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-card`}
              >
                <chip.icon size={16} className="text-neon" />
                <span className="whitespace-nowrap text-xs font-semibold tracking-wide text-paper">
                  {chip.label}
                </span>
              </motion.div>
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

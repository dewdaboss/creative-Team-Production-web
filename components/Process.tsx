"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  MessagesSquare,
  PenLine,
  CalendarClock,
  Clapperboard,
  MonitorPlay,
  SearchCheck,
  PackageCheck,
  TrendingUp,
  MousePointerClick,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { PROCESS, BOOKING_FLOW } from "@/lib/brand";

const ICONS: Record<string, typeof Clapperboard> = {
  MessagesSquare,
  PenLine,
  CalendarClock,
  Clapperboard,
  MonitorPlay,
  SearchCheck,
  PackageCheck,
  TrendingUp,
};

export default function Process() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const step = PROCESS[active];
  const Icon = ICONS[step.icon] ?? Clapperboard;

  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              From first call to <span className="text-gradient-neon">final cut.</span>
            </>
          }
          description="A battle-tested 8-step pipeline — tap any step to see what happens."
        />

        {/* ===== compact horizontal timeline / tabs ===== */}
        <div className="glass relative overflow-hidden rounded-3xl p-5 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-neon/12 blur-3xl" />

          {/* step tabs — horizontal scroll on small screens */}
          <div
            role="tablist"
            aria-label="Production process steps"
            className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
          >
            {PROCESS.map((p, i) => {
              const IconI = ICONS[p.icon] ?? Clapperboard;
              const isActive = i === active;
              const done = i < active;
              return (
                <button
                  key={p.step}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "border-neon bg-neon/15 text-paper shadow-glow"
                      : done
                        ? "border-neon/30 bg-neon/5 text-neon-soft hover:border-neon/50"
                        : "border-line bg-raise/40 text-mute hover:border-neon/40 hover:text-paper"
                  }`}
                >
                  <span className={`font-display text-[11px] font-bold ${isActive ? "text-neon" : ""}`}>
                    {p.step}
                  </span>
                  <span className="hidden items-center gap-1.5 md:flex">
                    <IconI size={14} strokeWidth={2} />
                    {p.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* progress track */}
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-neon shadow-glow"
              initial={false}
              animate={{ width: `${((active + 1) / PROCESS.length) * 100}%` }}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* detail panel for the active step */}
          <div className="mt-6 min-h-[8.5rem] sm:min-h-[7.5rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.step}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -18 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-neon/25 bg-neon/10 text-neon shadow-glow">
                  <Icon size={24} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-neon-soft">
                    Step {step.step} of {PROCESS.length}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-paper sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* booking flow mini-track */}
        <Reveal className="mt-14">
          <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-neon/12 blur-3xl" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2.5 font-display text-base font-bold text-paper sm:text-lg">
                <MousePointerClick size={18} className="text-neon" />
                Booking takes 60 seconds — here&apos;s the whole journey
              </p>
              <a href="#booking" className="text-xs font-bold uppercase tracking-[0.16em] text-neon transition-colors hover:text-neon-soft">
                Start now →
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3">
              {BOOKING_FLOW.map((stepName, i) => (
                <span key={stepName} className="flex items-center gap-2">
                  <span className="rounded-full border border-line bg-raise/50 px-4 py-2 text-xs font-semibold text-mute transition-colors hover:border-neon/40 hover:text-paper">
                    <span className="mr-1.5 font-display font-bold text-neon">{i + 1}</span>
                    {stepName}
                  </span>
                  {i < BOOKING_FLOW.length - 1 && <span className="hidden text-faint sm:inline">→</span>}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

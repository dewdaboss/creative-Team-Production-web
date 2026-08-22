"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarClock,
  Clapperboard,
  MessagesSquare,
  MonitorPlay,
  PackageCheck,
  PenLine,
  SearchCheck,
  TrendingUp,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { PROCESS } from "@/lib/brand";

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
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();
  const step = PROCESS[active];
  const Icon = ICONS[step.icon] ?? Clapperboard;

  const moveTo = (index: number) => {
    const next = (index + PROCESS.length) % PROCESS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="process" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              From first call to <span className="text-gradient-neon">final cut.</span>
            </>
          }
          description="An efficient eight-step workflow with a clear owner and outcome at every stage."
        />

        <div className="rounded-2xl border border-neon/20 bg-panel/70 p-4 backdrop-blur-xl sm:p-6">
          <div className="no-scrollbar overflow-x-auto pb-2">
            <div
              role="tablist"
              aria-label="Production process steps"
              className="relative flex min-w-[34rem] items-center justify-between px-1 sm:min-w-0"
            >
              <div aria-hidden="true" className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-neon/20" />
              {PROCESS.map((item, index) => {
                const selected = index === active;

                return (
                  <button
                    key={item.step}
                    ref={(node) => {
                      tabs.current[index] = node;
                    }}
                    id={`process-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="process-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        moveTo(active + 1);
                      } else if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        moveTo(active - 1);
                      } else if (event.key === "Home") {
                        event.preventDefault();
                        moveTo(0);
                      } else if (event.key === "End") {
                        event.preventDefault();
                        moveTo(PROCESS.length - 1);
                      }
                    }}
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-sm font-bold transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 sm:h-11 sm:w-11 ${
                      selected
                        ? "border-neon bg-neon text-[#03130a] shadow-glow"
                        : "border-neon/25 bg-raise text-mute hover:border-neon/60 hover:text-paper"
                    }`}
                  >
                    {index + 1}
                    <span className="sr-only">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 min-h-44 sm:min-h-40">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.step}
                id="process-panel"
                role="tabpanel"
                aria-labelledby={`process-tab-${active}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-h-44 flex-col justify-center gap-4 rounded-2xl border border-neon/20 bg-raise/55 p-5 sm:min-h-40 sm:flex-row sm:items-center sm:justify-start sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neon">
                    Step {active + 1} of {PROCESS.length}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-paper sm:text-2xl">
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
      </div>
    </section>
  );
}

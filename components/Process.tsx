"use client";

import { useRef } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
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
  const lineRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 70%", "end 60%"] });

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
          description="A battle-tested 8-step pipeline — you always know what's happening next."
        />

        <div className="relative" ref={lineRef}>
          {/* progress spine (desktop) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-line lg:block" />
          {!reduce && (
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute left-1/2 top-0 hidden h-full w-px origin-top -translate-x-1/2 bg-neon shadow-glow lg:block"
            />
          )}
          {/* mobile spine */}
          <div className="absolute left-[27px] top-0 h-full w-px bg-line lg:hidden" />

          <div className="space-y-5 lg:space-y-0">
            {PROCESS.map((p, i) => {
              const Icon = ICONS[p.icon] ?? Clapperboard;
              const left = i % 2 === 0;
              return (
                <div key={p.step} className="relative lg:grid lg:grid-cols-2 lg:gap-16 lg:py-5">
                  {/* node */}
                  <div className="absolute left-[27px] top-6 z-10 -translate-x-1/2 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-neon/40 bg-void font-display text-[13px] font-bold text-neon shadow-glow">
                      {p.step}
                    </span>
                  </div>

                  <Reveal
                    delay={0.05}
                    className={`pl-16 lg:pl-0 ${left ? "lg:col-start-1 lg:pr-10 lg:text-right" : "lg:col-start-2 lg:pl-10"}`}
                  >
                    <div
                      className={`group glass inline-block rounded-2xl p-5 transition-all duration-300 hover:border-neon/45 hover:bg-raise/70 sm:p-6 ${
                        left ? "lg:float-right" : ""
                      } w-full max-w-xl`}
                    >
                      <div className={`flex items-center gap-3 ${left ? "lg:flex-row-reverse" : ""}`}>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon transition-transform duration-300 group-hover:scale-110">
                          <Icon size={17} strokeWidth={1.9} />
                        </span>
                        <h3 className="font-display text-base font-bold text-paper sm:text-lg">{p.title}</h3>
                      </div>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-mute">{p.text}</p>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>

        {/* booking flow mini-track */}
        <Reveal className="mt-20">
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
              {BOOKING_FLOW.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-full border border-line bg-raise/50 px-4 py-2 text-xs font-semibold text-mute transition-colors hover:border-neon/40 hover:text-paper">
                    <span className="mr-1.5 font-display font-bold text-neon">{i + 1}</span>
                    {step}
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

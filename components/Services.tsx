"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  Clapperboard,
  TrendingUp,
  Package,
  PartyPopper,
  Film,
  Scissors,
  ArrowUpRight,
  Check,
  ChevronDown,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { SERVICES, formatINR } from "@/lib/pricing";
import { selectService } from "@/lib/client-events";
import type { PackageOption } from "@/lib/types";

const ICONS: Record<string, typeof Camera> = {
  Camera,
  Clapperboard,
  TrendingUp,
  Package,
  PartyPopper,
  Film,
  Scissors,
};

function packagePrice(p: PackageOption): string {
  if (p.unit === "inquiry") return "Custom quote";
  const base = formatINR(p.price);
  switch (p.unit) {
    case "photo":
      return `${base} / photo`;
    case "hour":
      return `${base} / hour`;
    case "month":
      return `${base} / month`;
    default:
      return base;
  }
}

export default function Services() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              One crew. <span className="text-gradient-neon">Every frame.</span>
            </>
          }
          description="Pick a service to see live package pricing — the booking wizard below updates instantly."
        />

        {/* ===== mobile: collapsible accordion with live rates ===== */}
        <div className="space-y-3 sm:hidden">
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon] ?? Camera;
            const open = openId === service.id;
            return (
              <div
                key={service.id}
                className={`overflow-hidden rounded-2xl border bg-panel/60 backdrop-blur transition-colors duration-300 ${
                  open ? "border-neon/50" : "border-line"
                }`}
              >
                <button
                  onClick={() => setOpenId(open ? null : service.id)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3.5 p-4 text-left"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[15px] font-bold text-paper">
                      {service.name}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold tracking-wide text-neon-soft">
                      {service.startingAt ?? "Custom quote"}
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-faint transition-transform duration-300 ${
                      open ? "rotate-180 text-neon" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="border-t border-line px-4 pb-4 pt-3">
                        <p className="text-xs leading-relaxed text-mute">{service.tagline}</p>
                        <ul className="mt-3 divide-y divide-line">
                          {service.packages.map((p) => (
                            <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                              <span className="min-w-0">
                                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-paper">
                                  {p.name}
                                  {p.badge && (
                                    <span className="rounded-full bg-neon/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-neon">
                                      {p.badge}
                                    </span>
                                  )}
                                </span>
                                <span className="mt-0.5 block text-[11px] leading-snug text-faint">
                                  {p.description}
                                </span>
                              </span>
                              <span className="shrink-0 font-display text-sm font-bold text-neon">
                                {packagePrice(p)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => selectService(service.id)}
                          className="btn-neon mt-3 w-full !py-3 text-xs"
                        >
                          Choose {service.short}
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ===== desktop: 2 → 3 column grid ===== */}
        <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Camera;
            const hero = service.packages.find((p) => p.badge) ?? service.packages[0];
            return (
              <Reveal key={service.id} delay={i * 0.07} className="h-full">
                <motion.button
                  onClick={() => selectService(service.id)}
                  whileHover={reduce ? undefined : { y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-panel/60 p-7 text-left backdrop-blur transition-colors duration-300 hover:border-neon/50 hover:bg-raise/70"
                >
                  {/* hover glow */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-neon/0 blur-3xl transition-all duration-500 group-hover:bg-neon/15" />

                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neon/25 bg-neon/10 text-neon shadow-glow">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="text-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-neon"
                    />
                  </div>

                  <h3 className="mt-6 font-display text-xl font-bold text-paper sm:text-2xl">
                    {service.name}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-mute">{service.tagline}</p>

                  <ul className="mt-5 space-y-1.5">
                    {(hero?.features ?? []).slice(0, 2).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-faint">
                        <Check size={13} className="text-neon" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                    <span className="font-display text-sm font-bold tracking-wide text-neon">
                      {service.startingAt ?? "Custom quote"}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint transition-colors group-hover:text-neon-soft">
                      View packages →
                    </span>
                  </div>
                </motion.button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

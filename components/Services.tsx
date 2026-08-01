"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  Clapperboard,
  TrendingUp,
  Package,
  PartyPopper,
  Film,
  ArrowUpRight,
  Check,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { SERVICES } from "@/lib/pricing";
import { selectService } from "@/lib/client-events";

const ICONS: Record<string, typeof Camera> = {
  Camera,
  Clapperboard,
  TrendingUp,
  Package,
  PartyPopper,
  Film,
};

export default function Services() {
  const reduce = useReducedMotion();
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Camera;
            const hero = service.packages.find((p) => p.badge) ?? service.packages[0];
            return (
              <Reveal key={service.id} delay={i * 0.07}>
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

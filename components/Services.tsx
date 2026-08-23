"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  Clapperboard,
  Film,
  Package,
  PartyPopper,
  Scissors,
  TrendingUp,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { SERVICES } from "@/lib/pricing";
import { selectService } from "@/lib/client-events";

const ICONS: Record<string, typeof Camera> = {
  Camera,
  Clapperboard,
  TrendingUp,
  Package,
  PartyPopper,
  Film,
  Scissors,
};

const SERVICE_COPY: Record<string, string> = {
  photography: "Portraits, lifestyle and location-ready frames.",
  reels: "Scripted, shot and edited reels built to stop scrolls.",
  videoedit: "Sharp cuts, captions, colour and sound for raw footage.",
  monthly: "A monthly content engine designed to turn views into leads.",
  product: "E-commerce and campaign visuals made to sell.",
  events: "Candid photo and reel coverage for every celebration.",
  longform: "Brand films, documentaries and full-scale productions.",
};

export default function Services() {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="services" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              One crew. <span className="text-gradient-neon">Every frame.</span>
            </>
          }
          description="Seven focused services, clear starting prices and one team from brief to delivery."
        />

        {/* Mobile and tablet: compact single-open accordion. */}
        <div className="space-y-3 lg:hidden">
          {SERVICES.map((service) => {
            const open = openId === service.id;
            const featured = service.packages.find((item) => item.badge) ?? service.packages[0];
            const panelId = `service-panel-${service.id}`;

            return (
              <motion.div
                layout={reduce ? false : "position"}
                key={service.id}
                className={`overflow-hidden rounded-2xl border bg-panel/70 backdrop-blur-xl transition-colors duration-300 ${
                  open ? "border-neon/40" : "border-neon/20"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : service.id)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left"
                >
                  <span className="min-w-0 flex-1 font-display text-sm font-bold text-paper sm:text-base">
                    {service.name}
                  </span>
                  <span className="shrink-0 text-xs font-bold text-neon sm:text-sm">
                    {service.startingAt ?? "Custom quote"}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    size={17}
                    className={`shrink-0 text-mute transition-transform duration-300 ${
                      open ? "rotate-180 text-neon" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="border-t border-neon/15 px-4 pb-4 pt-3"
                    >
                      <p className="text-sm leading-relaxed text-mute">
                        {SERVICE_COPY[service.id] ?? service.tagline}
                      </p>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {(featured?.features ?? []).slice(0, 3).map((highlight) => (
                          <li key={highlight} className="flex items-start gap-2 text-xs leading-relaxed text-faint">
                            <Check size={13} className="mt-0.5 shrink-0 text-neon" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#booking"
                        onClick={() => selectService(service.id)}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-neon transition-opacity hover:opacity-75"
                      >
                        View packages <ArrowUpRight size={14} />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop: deliberately compact three-column service grid. */}
        <div className="hidden grid-cols-3 gap-4 lg:grid">
          {SERVICES.map((service, index) => {
            const Icon = ICONS[service.icon] ?? Camera;

            return (
              <article
                key={service.id}
                className={`group flex min-h-52 flex-col rounded-2xl border border-neon/20 bg-panel/70 p-5 backdrop-blur-xl transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-neon/45 ${
                  index === SERVICES.length - 1 ? "lg:col-start-2" : ""
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon">
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-paper">{service.name}</h3>
                <p className="mt-1.5 truncate text-sm text-mute">
                  {SERVICE_COPY[service.id] ?? service.tagline}
                </p>
                <div className="mt-auto flex items-end justify-between gap-4 border-t border-neon/15 pt-4">
                  <span className="font-display text-sm font-bold text-neon">
                    {service.startingAt ?? "Custom quote"}
                  </span>
                  <a
                    href="#booking"
                    onClick={() => selectService(service.id)}
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-neon transition-opacity hover:opacity-75"
                  >
                    View packages <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

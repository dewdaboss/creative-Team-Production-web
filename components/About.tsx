"use client";

import Image from "next/image";
import {
  Telescope,
  Clapperboard,
  PenTool,
  Rocket,
  Target,
  Quote,
  Dumbbell,
  Coffee,
  UtensilsCrossed,
  Shirt,
  Gem,
  CarFront,
  Building2,
  User,
  Megaphone,
  Rocket as RocketIcon,
  Store,
  Briefcase,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Logo from "./Logo";
import { ABOUT, INDUSTRIES, CAPABILITIES } from "@/lib/brand";
import { site } from "@/lib/site";

const INDUSTRY_ICONS: Record<string, typeof Dumbbell> = {
  Dumbbell, Coffee, UtensilsCrossed, Shirt, Gem, CarFront, Building2, User, Megaphone, Rocket: RocketIcon, Store, Briefcase,
};

const CAPABILITY_ICONS: Record<string, typeof Clapperboard> = {
  Clapperboard, PenTool, Rocket,
};

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={`About us · ${site.address}`}
          title={
            <>
              We don&apos;t just create content.
              <span className="block text-gradient-brand">We build brands.</span>
            </>
          }
        />

        {/* intro grid */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-line">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/gallery/bts.jpg"
                  alt="Creative Team Production crew on a film set in Indore"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <Logo size={44} />
                  <div>
                    <p className="font-display text-sm font-bold text-white">{ABOUT.heading}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neon">Indore · India</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-line bg-panel/70">
                {[
                  ["10+", "industries"],
                  ["20+", "capabilities"],
                  ["1", "dedicated crew"],
                ].map(([n, l]) => (
                  <div key={l} className="p-4 text-center">
                    <p className="font-display text-xl font-bold text-neon sm:text-2xl">{n}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.08}>
              <p className="text-base leading-relaxed text-mute sm:text-lg">
                <span className="font-display font-bold text-paper">Creative Team Production</span>{" "}
                {ABOUT.lead.replace("A premium creative agency", "is a premium creative agency")}
              </p>
              <p className="mt-4 text-base leading-relaxed text-mute sm:text-lg">{ABOUT.body}</p>
            </Reveal>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.14} className="h-full">
                <div className="glass group h-full rounded-2xl p-5 transition-colors hover:border-neon/40">
                  <Target size={19} className="text-neon" />
                  <p className="mt-3 font-display text-sm font-bold uppercase tracking-[0.16em] text-paper">Mission</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-mute">{ABOUT.mission}</p>
                </div>
              </Reveal>
              <Reveal delay={0.2} className="h-full">
                <div className="glass group h-full rounded-2xl p-5 transition-colors hover:border-neon/40">
                  <Telescope size={19} className="text-neon" />
                  <p className="mt-3 font-display text-sm font-bold uppercase tracking-[0.16em] text-paper">Vision</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-mute">{ABOUT.vision}</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.26}>
              <div className="mt-5 flex items-start gap-3.5 rounded-2xl border border-neon/25 bg-neon/5 p-5">
                <Quote size={18} className="mt-0.5 shrink-0 text-neon" />
                <p className="font-display text-[15px] font-semibold leading-relaxed text-neon-soft">
                  {ABOUT.promise}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* industries */}
        <Reveal className="mt-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-faint">
            Industries we work with
          </p>
        </Reveal>
        <div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {INDUSTRIES.map((ind, i) => {
            const Icon = INDUSTRY_ICONS[ind.icon] ?? Briefcase;
            return (
              <Reveal key={ind.name} delay={i * 0.04}>
                <div className="group flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-panel/50 px-3 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-neon/45 hover:bg-neon/5 hover:shadow-glow">
                  <Icon size={20} className="text-neon transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
                  <span className="text-xs font-semibold tracking-wide text-mute transition-colors group-hover:text-paper">{ind.name}</span>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* services overview — 3 category cards, no repeated bullet lists */}
        <Reveal className="mt-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-faint">
            Services overview
          </p>
        </Reveal>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {CAPABILITIES.map((cap, ci) => {
            const Icon = CAPABILITY_ICONS[cap.icon] ?? Clapperboard;
            return (
              <Reveal key={cap.group} delay={ci * 0.08} className="h-full">
                <div className="glass group h-full rounded-3xl p-6 transition-colors hover:border-neon/40">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon transition-transform duration-300 group-hover:scale-110">
                    <Icon size={18} />
                  </span>
                  <p className="mt-4 font-display text-base font-bold text-paper">{cap.group}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-mute">{cap.blurb}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

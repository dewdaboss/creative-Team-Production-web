"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, Camera } from "lucide-react";
import { openAboutPanel } from "@/lib/about-panel";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Logo from "./Logo";
import { ABOUT } from "@/lib/brand";

/**
 * Compact "About" block for the home page.
 * The long story, mission, vision and the eight reasons live on /about, so the
 * home page stays short — visitors who want the details click through.
 */
export default function AboutTeaser() {
  return (
    <section id="about" className="relative scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="About us"
          align="left"
          title={
            <>
              We build brands, <span className="text-gradient-neon">not just content.</span>
            </>
          }
        />

        <div className="mt-8 grid items-stretch gap-5 sm:gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="h-full">
            <div className="relative h-full min-h-[14rem] overflow-hidden rounded-2xl border border-neon/20 sm:min-h-[17rem]">
              <Image
                src="/images/gallery/shoot-02.jpg"
                alt="Lifestyle portrait shot by Creative Team Production in Indore"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                <Logo size={36} />
                <div>
                  <p className="font-display text-[13px] font-bold text-paper">Creative Team Production</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-neon">
                    Indore · India
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="h-full">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-neon/20 bg-panel/70 p-5 backdrop-blur-xl sm:p-6">
              <div>
                <p className="text-[15px] leading-relaxed text-mute sm:text-base">
                  {ABOUT.lead}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-paper/90 sm:text-base">
                  {ABOUT.body}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {[
                    { icon: MapPin, label: "Indore · MP" },
                    { icon: Camera, label: "Photo + Film crew" },
                    { icon: Sparkles, label: "Create • Shoot • Grow" },
                  ].map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raise/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mute"
                    >
                      <Icon size={12} className="text-neon" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                <button
                  type="button"
                  onClick={openAboutPanel}
                  className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-neon transition-colors hover:text-neon-soft"
                >
                  Full story, mission &amp; why brands choose us
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <Link
                  href="/about"
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-neon"
                >
                  Open as page
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

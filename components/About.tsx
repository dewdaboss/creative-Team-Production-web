import Image from "next/image";
import { Target, Telescope } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Logo from "./Logo";
import { ABOUT } from "@/lib/brand";

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="About us"
          title={
            <>
              We build brands, <span className="text-gradient-neon">not just content.</span>
            </>
          }
        />

        <div className="grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="h-full">
            <div className="relative h-full min-h-[19rem] overflow-hidden rounded-2xl border border-neon/20 sm:min-h-[24rem]">
              <Image
                src="/images/gallery/bts.jpg"
                alt="Creative Team Production crew working on a film set in Indore"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/15 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                <Logo size={42} />
                <div>
                  <p className="font-display text-sm font-bold text-paper">Creative Team Production</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-neon">
                    Indore · India
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col">
            <Reveal>
              <div className="rounded-2xl border border-neon/20 bg-panel/70 p-5 backdrop-blur-xl sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neon">Our story</p>
                <p className="mt-3 text-base leading-relaxed text-mute sm:text-lg">
                  {ABOUT.lead.replace(
                    "A premium creative agency",
                    "Creative Team Production is a premium creative agency",
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mute sm:text-base">{ABOUT.body}</p>
              </div>
            </Reveal>

            <div className="mt-4 grid flex-1 gap-4 sm:grid-cols-2">
              <Reveal delay={0.08} className="h-full">
                <article className="h-full rounded-2xl border border-neon/20 bg-panel/70 p-5 backdrop-blur-xl transition-colors hover:border-neon/40">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon/10 text-neon">
                    <Target size={18} />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-[0.16em] text-paper">
                    Mission
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{ABOUT.mission}</p>
                </article>
              </Reveal>

              <Reveal delay={0.14} className="h-full">
                <article className="h-full rounded-2xl border border-neon/20 bg-panel/70 p-5 backdrop-blur-xl transition-colors hover:border-neon/40">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon/10 text-neon">
                    <Telescope size={18} />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-bold uppercase tracking-[0.16em] text-paper">
                    Vision
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{ABOUT.vision}</p>
                </article>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

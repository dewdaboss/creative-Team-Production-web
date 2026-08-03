"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function CtaBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative my-10 overflow-hidden">
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-0 -inset-y-16">
        <Image
          src="/images/hero-camera.jpg"
          alt="Cinematographer with a cinema camera rig on set"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/82 to-void/40" />
      <div className="absolute inset-0 bg-[radial-gradient(700px_300px_at_25%_50%,rgba(180,248,50,0.14),transparent_65%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 py-28 sm:px-8 sm:py-36">
        <Reveal>
          <div className="filmstrip w-24" />
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-3xl font-display text-4xl font-bold leading-[1.04] tracking-tight text-paper sm:text-6xl">
            Your story deserves
            <span className="block text-gradient-brand text-glow">a proper film crew.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            From a single reel to a full-scale brand film — bring the idea, we bring the light,
            the lenses and nine hundred reels worth of experience.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <a href="#booking" className="btn-neon">
            Start your booking
            <ArrowRight size={17} />
          </a>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="filmstrip w-24" />
        </Reveal>
      </div>
    </section>
  );
}

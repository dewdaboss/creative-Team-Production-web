"use client";

import { motion } from "framer-motion";
import {
  Award,
  Feather,
  Gem,
  Zap,
  Target,
  TrendingUp,
  Fingerprint,
  Layers,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { WHY_US } from "@/lib/brand";

const ICONS: Record<string, typeof Award> = {
  Award,
  Feather,
  Gem,
  Zap,
  Target,
  TrendingUp,
  Fingerprint,
  Layers,
};

export default function WhyUs() {
  return (
    <section id="why-us" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Why Creative Team Production"
          title={
            <>
              Eight reasons brands <span className="text-gradient-neon">stick with us.</span>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Award;
            return (
              <Reveal key={item.title} delay={(i % 4) * 0.07}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group glass relative h-full overflow-hidden rounded-2xl p-6"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-neon/0 blur-2xl transition-all duration-500 group-hover:bg-neon/15" />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon size={19} strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-4 font-display text-[15px] font-bold text-paper">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-mute">{item.text}</p>
                  <span className="mt-4 block h-px w-8 bg-neon/40 transition-all duration-500 group-hover:w-full group-hover:bg-neon/70" />
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

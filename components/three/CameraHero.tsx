"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Orbit } from "lucide-react";
import CameraVideo from "./CameraVideo";

type CameraHeroProps = {
  className?: string;
};

/**
 * CameraHero — hero-stage for the 360° camera: neon halo, the NeonX arcs
 * from globals.css, a slow dashed orbit ring, and the floating viewfinder
 * (CameraVideo) at the centre.
 */
export default function CameraHero({ className = "" }: CameraHeroProps) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {/* neon halo */}
      <div
        aria-hidden
        className="absolute inset-[14%] rounded-full bg-neon/15 blur-3xl animate-pulse-glow"
      />

      {/* NeonX arcs (defined in globals.css) */}
      <div aria-hidden className="hero-arc absolute -inset-3 sm:-inset-5" />
      <div
        aria-hidden
        className="hero-arc absolute -inset-3 rotate-[162deg] opacity-50 sm:-inset-5"
      />

      {/* slow dashed orbit ring */}
      <div
        aria-hidden
        className="absolute inset-[3%] rounded-full border border-dashed border-neon/20 animate-spin-slower"
      />

      {/* floating viewfinder with the 360° camera inside */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[10%] z-10"
      >
        <CameraVideo className="h-full w-full" />
      </motion.div>

      {/* interaction hint */}
      <div className="glass absolute -bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5">
        <Orbit size={12} className="text-neon" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-soft/90">
          Drag to rotate · 360°
        </span>
      </div>
    </div>
  );
}

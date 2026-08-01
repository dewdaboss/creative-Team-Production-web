"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CinemaScene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Fixed, full-viewport 3D backdrop: floating filmmaking gear drifting
 * through fog, neon accents, grid + vignette overlays. Pointer-reactive.
 */
export default function CinemaBackground() {
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // slight defer so first paint of the hero is instant
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* base atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(1100px_620px_at_50%_-10%,rgba(20,80,48,0.32),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_85%_110%,rgba(14,166,84,0.12),transparent_60%)]" />
      <div className="absolute inset-0 grid-lines opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      {/* 3D gear */}
      {!reduced && ready && (
        <div className="absolute inset-0 opacity-90 transition-opacity duration-1000">
          <CinemaScene />
        </div>
      )}

      {/* floating glow orbs (always present — cheap ambience) */}
      <div className="absolute -left-32 top-1/4 h-80 w-80 animate-pulse-glow rounded-full bg-neon/10" />
      <div className="absolute -right-24 bottom-1/4 h-72 w-72 animate-pulse-glow rounded-full bg-neon-dark/15 [animation-delay:1.4s]" />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(3,5,3,0.85)_100%)]" />
    </div>
  );
}

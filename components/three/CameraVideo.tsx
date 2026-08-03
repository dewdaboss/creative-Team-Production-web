"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BatteryCharging } from "lucide-react";
import SceneCamera from "./SceneCamera";

type CameraVideoProps = {
  /** label shown next to the REC dot */
  label?: string;
  className?: string;
  /** show the viewfinder HUD (bars, brackets, timecode) */
  hud?: boolean;
  interactive?: boolean;
  autoRotateSpeed?: number;
};

const HUD_CHIPS = ["4K", "24 FPS", "ISO 800", "f/1.8"] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/** Running SMPTE-style timecode (24 fps display). Frozen under reduced motion. */
function useTimecode(active: boolean) {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const el = (now - t0) / 1000;
      const hh = Math.floor(el / 3600) % 24;
      const mm = Math.floor(el / 60) % 60;
      const ss = Math.floor(el) % 60;
      const ff = Math.floor(el * 24) % 24;
      setTc(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return tc;
}

/**
 * CameraVideo — the 360° camera seen through a camera: viewfinder chrome
 * (REC dot, running timecode, exposure chips, corner brackets) around the
 * interactive SceneCamera sprite.
 */
export default function CameraVideo({
  label = "A-CAM",
  className = "",
  hud = true,
  interactive = true,
  autoRotateSpeed = 3.5,
}: CameraVideoProps) {
  const reduce = useReducedMotion();
  const tc = useTimecode(hud && !reduce);

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] glass-strong shadow-card ${className}`}
    >
      {/* the rotating camera itself */}
      <div className="absolute inset-0">
        <SceneCamera
          className="h-full w-full"
          interactive={interactive}
          autoRotateSpeed={autoRotateSpeed}
          ariaLabel="Cinema camera, 360 degree product view — drag to rotate"
        />
      </div>

      {/* subtle scanlines + inner vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-50 [background-image:repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(180,248,50,0.05)_3px,rgba(180,248,50,0.05)_4px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(0,0,0,0.5)_100%)]"
      />

      {hud && (
        <>
          {/* corner brackets */}
          <span aria-hidden className="pointer-events-none absolute left-3 top-3 z-20 h-5 w-5 rounded-tl-md border-l-2 border-t-2 border-neon/60" />
          <span aria-hidden className="pointer-events-none absolute right-3 top-3 z-20 h-5 w-5 rounded-tr-md border-r-2 border-t-2 border-neon/60" />
          <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 z-20 h-5 w-5 rounded-bl-md border-b-2 border-l-2 border-neon/60" />
          <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 z-20 h-5 w-5 rounded-br-md border-b-2 border-r-2 border-neon/60" />

          {/* top bar — REC + label + timecode */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-4 pt-3">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-400">
                Rec
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                {label}
              </span>
            </span>
            <span className="font-display text-[11px] font-semibold tabular-nums tracking-[0.18em] text-neon-soft/90">
              {tc}
            </span>
          </div>

          {/* bottom bar — exposure chips + battery */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-4">
            <span className="flex items-center gap-2">
              {HUD_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-md border border-line bg-black/35 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-neon-soft/80"
                >
                  {chip}
                </span>
              ))}
            </span>
            <BatteryCharging size={15} className="text-neon" aria-hidden />
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Eye, Clapperboard, BadgeCheck, TrendingUp } from "lucide-react";
import { InstagramIcon } from "./BrandIcons";
import Reveal from "./Reveal";
import { site } from "@/lib/site";

interface StatsPayload {
  instagramFollowers: number;
  followersToday: number;
  projectsDelivered: number;
  happyClients: number;
  reelsProduced: number;
  visitors: number;
}

export function CountUp({ value, duration = 2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("en-IN")}
    </span>
  );
}

export default function Stats() {
  const [stats, setStats] = useState<StatsPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await fetch("/api/track", { method: "POST" }).catch(() => {});
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (res.ok && !cancelled) setStats(await res.json());
      } catch {
        /* non-fatal */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    {
      icon: InstagramIcon,
      value: stats?.instagramFollowers ?? 12840,
      suffix: "+",
      label: "Instagram community",
      live: true,
      sub: stats ? `+${stats.followersToday} today` : "growing daily",
      href: site.instagram,
    },
    {
      icon: Clapperboard,
      value: stats?.reelsProduced ?? 900,
      suffix: "+",
      label: "Reels produced",
      sub: "and counting",
    },
    {
      icon: BadgeCheck,
      value: stats?.projectsDelivered ?? 320,
      suffix: "+",
      label: "Projects delivered",
      sub: `${stats?.happyClients ?? 145}+ happy clients`,
    },
    {
      icon: Eye,
      value: stats?.visitors ?? 0,
      suffix: "",
      label: "Site visitors",
      sub: "you just became one 👋",
      live: false,
    },
  ];

  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px shimmer-line animate-shimmer" />
            <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
              {items.map((item) => (
                <div
                  key={item.label}
                  className="group relative bg-panel/80 p-6 transition-colors duration-300 hover:bg-raise/90 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <item.icon size={20} className="text-neon" />
                    {item.live && (
                      <span className="flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-neon">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute h-full w-full animate-ping rounded-full bg-neon opacity-70" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-neon" />
                        </span>
                        Live
                      </span>
                    )}
                  </div>
                  <p className="mt-5 font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                    <CountUp value={item.value} />
                    <span className="text-neon">{item.suffix}</span>
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
                    {item.label}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-faint">
                    <TrendingUp size={12} className="text-neon/70" />
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-neon-soft">
                        {item.sub}
                      </a>
                    ) : (
                      item.sub
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

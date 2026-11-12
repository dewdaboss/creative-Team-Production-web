"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Clapperboard,
  Images,
  MessageSquareQuote,
  Star,
  UserRound,
} from "lucide-react";

const LINKS = [
  { id: "portfolio", label: "Portfolio", href: "#portfolio", icon: Images },
  { id: "booking", label: "Booking", href: "#booking", icon: CalendarCheck },
  { id: "services", label: "Services", href: "#services", icon: Clapperboard },
  { id: "about", label: "About", href: "#about", icon: UserRound },
  { id: "reviews", label: "Reviews", href: "#reviews", icon: Star },
  { id: "contact", label: "Contact", href: "#contact", icon: MessageSquareQuote },
];

/**
 * Quick section links directly under the hero heading.
 * Horizontally swipeable on phones, centred on desktop, and the chip of the
 * section you're currently looking at lights up as you scroll.
 */
export default function QuickNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.15, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Jump to section" className="relative z-20 pb-2">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {LINKS.map(({ id, label, href, icon: Icon }) => {
            const isActive = active === id;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "true" : undefined}
                className={`group inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur transition-all duration-300 active:scale-[0.97] sm:px-5 ${
                  isActive
                    ? "border-neon/60 bg-neon/10 text-paper shadow-glow"
                    : "border-line bg-panel/60 text-mute hover:border-neon/45 hover:bg-panel hover:text-paper"
                }`}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-neon" : "text-neon/80 transition-colors group-hover:text-neon"}
                />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";
import { CalendarCheck, Clapperboard, Images, MessageSquareQuote, Star, UserRound } from "lucide-react";

const LINKS = [
  { label: "Portfolio", href: "#portfolio", icon: Images },
  { label: "Booking", href: "#booking", icon: CalendarCheck },
  { label: "Services", href: "#services", icon: Clapperboard },
  { label: "About", href: "#about", icon: UserRound },
  { label: "Reviews", href: "#reviews", icon: Star },
  { label: "Contact", href: "#contact", icon: MessageSquareQuote },
];

/**
 * Quick section links that sit directly under the hero heading.
 * Horizontally swipeable on phones, centred on desktop.
 */
export default function QuickNav() {
  return (
    <nav aria-label="Jump to section" className="relative z-20 pb-2">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group inline-flex shrink-0 snap-start items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-mute backdrop-blur transition-all duration-300 hover:border-neon/45 hover:bg-panel hover:text-paper active:scale-[0.97] sm:px-5"
            >
              <Icon size={14} className="text-neon/80 transition-colors group-hover:text-neon" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import AboutPanel from "./AboutPanel";
import { openAboutPanel } from "@/lib/about-panel";
import Logo from "./Logo";
import { site } from "@/lib/site";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing & Booking", href: "#booking" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /** Anchor sections live on the home page — prefix them when on sub-pages. */
  const homeHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong shadow-card" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href={homeHref("#top")} className="group flex items-center gap-3">
            <Logo size={44} className="transition-transform duration-500 group-hover:rotate-12" />
            <span className="font-display leading-none">
              <span className="block text-[15px] font-bold tracking-[0.14em] text-paper">CREATIVE TEAM</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.34em] text-neon">
                Production
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex xl:gap-8">
            {LINKS.map((l) =>
              l.href === "#about" ? (
                <button
                  key={l.href}
                  type="button"
                  onClick={openAboutPanel}
                  className="group relative text-[13px] font-medium uppercase tracking-[0.14em] text-mute transition-colors duration-300 hover:text-paper"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-neon shadow-glow transition-all duration-300 group-hover:w-full" />
                </button>
              ) : (
                <a
                  key={l.href}
                  href={homeHref(l.href)}
                  className="group relative text-[13px] font-medium uppercase tracking-[0.14em] text-mute transition-colors duration-300 hover:text-paper"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-neon shadow-glow transition-all duration-300 group-hover:w-full" />
                </a>
              )
            )}
          </nav>

          <div className="hidden lg:block">
            <a href={homeHref("#booking")} className="btn-neon !px-6 !py-2.5 text-xs">
              <Sparkles size={15} />
              Book Now
            </a>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-line p-2.5 text-paper transition-colors hover:border-neon/50 hover:text-neon lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-void/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <Logo size={40} />
                <span className="font-display text-sm font-bold tracking-[0.14em]">CREATIVE TEAM</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-line p-2.5 text-paper hover:text-neon"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-center justify-center gap-2 px-8">
              {LINKS.map((l, i) =>
                l.href === "#about" ? (
                  <motion.button
                    key={l.href}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      window.setTimeout(openAboutPanel, 260);
                    }}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-2xl border border-transparent px-6 py-4 text-center font-display text-2xl font-bold text-paper transition-all hover:border-line hover:bg-panel hover:text-neon"
                  >
                    {l.label}
                  </motion.button>
                ) : (
                  <motion.a
                    key={l.href}
                    href={homeHref(l.href)}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-2xl border border-transparent px-6 py-4 text-center font-display text-2xl font-bold text-paper transition-all hover:border-line hover:bg-panel hover:text-neon"
                  >
                    {l.label}
                  </motion.a>
                )
              )}
              <motion.a
                href={homeHref("#booking")}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.5 }}
                className="btn-neon mt-6 w-full max-w-xs"
              >
                <Sparkles size={16} />
                Book a Shoot
              </motion.a>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint"
              >
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="transition-colors hover:text-neon"
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-6 text-xs uppercase tracking-[0.3em] text-faint"
              >
                {site.tagline}
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* in-page About panel (opens over the current page) */}
      <AboutPanel />
    </>
  );
}

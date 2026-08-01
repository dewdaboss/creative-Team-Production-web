"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import Logo from "./Logo";
import { site } from "@/lib/site";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Pricing & Booking", href: "#booking" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          <Link href="#top" className="group flex items-center gap-3">
            <Logo size={44} className="transition-transform duration-500 group-hover:rotate-12" />
            <span className="font-display leading-none">
              <span className="block text-[15px] font-bold tracking-[0.14em] text-paper">CREATIVE TEAM</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.34em] text-neon">
                Production
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-[13px] font-medium uppercase tracking-[0.14em] text-mute transition-colors duration-300 hover:text-paper"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-neon shadow-glow transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <a href="#booking" className="btn-neon !px-6 !py-2.5 text-xs">
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
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full rounded-2xl border border-transparent px-6 py-4 text-center font-display text-2xl font-bold text-paper transition-all hover:border-line hover:bg-panel hover:text-neon"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#booking"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.5 }}
                className="btn-neon mt-6 w-full max-w-xs"
              >
                <Sparkles size={16} />
                Book a Shoot
              </motion.a>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-8 text-xs uppercase tracking-[0.3em] text-faint"
              >
                {site.tagline}
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

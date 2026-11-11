"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YoutubeIcon } from "./BrandIcons";
import Logo from "./Logo";
import { site } from "@/lib/site";
import { SERVICES } from "@/lib/pricing";

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="inline-flex items-center justify-center font-display text-sm font-black leading-none"
    >
      G
    </span>
  );
}

const SOCIALS = [
  { icon: InstagramIcon, label: "Instagram", href: site.instagram },
  { icon: FacebookIcon, label: "Facebook", href: site.facebook },
  { icon: YoutubeIcon, label: "YouTube", href: site.youtube },
  { icon: GoogleIcon, label: "Google Reviews", href: site.googleReview },
];

const EXPLORE_LINKS = [
  ["Home", "#top"],
  ["Services", "#services"],
  ["Gallery", "#portfolio"],
  ["Book", "#booking"],
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;
  /** Anchor links live on the home page — prefix them when on sub-pages. */
  const homeHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  return (
    <footer id="contact" className="relative scroll-mt-16 border-t border-neon/20 bg-panel/45">
      <div className="mx-auto max-w-7xl px-5 pb-7 pt-14 sm:px-8 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.6fr_0.9fr_0.7fr_1.2fr] lg:gap-8 xl:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={48} />
              <div>
                <p className="font-display text-base font-bold tracking-[0.1em] text-paper">CREATIVE TEAM</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neon">Production</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
              Cinematic content and smart creative strategy for brands ready to grow.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-neon/20 bg-neon/5 text-mute transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-neon/50 hover:text-neon"
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-paper">Explore</h2>
            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={homeHref(href)}
                    className="group inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-neon"
                  >
                    {label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-paper">Services</h2>
            <ul className="mt-5 space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <a href={homeHref("#booking")} className="text-[13px] text-mute transition-colors hover:text-neon">
                    {service.short}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Legal">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-paper">Legal</h2>
            <ul className="mt-5 space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-neon"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-paper">Contact</h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-start gap-3 break-all text-mute transition-colors hover:text-neon"
                >
                  <Mail size={16} className="mt-0.5 shrink-0 text-neon" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-mute transition-colors hover:text-neon"
                >
                  <Phone size={16} className="shrink-0 text-neon" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-mute transition-colors hover:text-neon"
                >
                  <WhatsAppIcon size={16} className="shrink-0 text-neon" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-mute transition-colors hover:text-neon"
                >
                  <MapPin size={16} className="mt-0.5 shrink-0 text-neon" />
                  Bengali Square, Indore
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-neon/20 pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}</p>
          <nav aria-label="Legal quick links" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {LEGAL_LINKS.map((link, i) => (
              <span key={link.href} className="inline-flex items-center gap-4">
                {i > 0 && <span aria-hidden="true" className="text-neon/40">•</span>}
                <Link href={link.href} className="font-semibold uppercase tracking-[0.16em] transition-colors hover:text-neon">
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="font-semibold uppercase tracking-[0.2em] text-neon">Create • Shoot • Grow</p>
        </div>
      </div>
    </footer>
  );
}

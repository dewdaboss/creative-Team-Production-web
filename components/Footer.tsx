import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight, Aperture, LockKeyhole } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YoutubeIcon } from "./BrandIcons";
import Logo from "./Logo";
import { site } from "@/lib/site";
import { SERVICES } from "@/lib/pricing";

const SOCIALS = [
  { icon: InstagramIcon, label: "Instagram", href: site.instagram },
  { icon: YoutubeIcon, label: "YouTube", href: site.youtube },
  { icon: FacebookIcon, label: "Facebook", href: site.facebook },
  { icon: WhatsAppIcon, label: "WhatsApp", href: `https://wa.me/${site.whatsapp}` },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed&z=13`;

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line bg-gradient-to-b from-transparent to-[#04100a]">
      <div aria-hidden className="arc-lines pointer-events-none absolute bottom-0 left-0 h-72 w-[32rem]" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.9fr_1.1fr] lg:gap-12">
          {/* brand */}
          <div>
            <div className="flex items-center gap-3.5">
              <Logo size={52} />
              <div>
                <p className="font-display text-lg font-bold tracking-[0.12em] text-paper">CREATIVE TEAM</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-neon">Production</p>
              </div>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.26em] text-neon">
              {site.tagline}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
              Premium creative agency in Indore — cinematic content, photography, branding and
              digital marketing. We don&apos;t just create content, we help businesses build their brand.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel/60 text-mute transition-all duration-300 hover:-translate-y-1 hover:border-neon hover:text-neon hover:shadow-glow"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* explore */}
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-paper">Explore</p>
            <ul className="mt-5 space-y-3">
              {[
                ["Services", "#services"],
                ["Pricing & Booking", "#booking"],
                ["Portfolio", "#portfolio"],
                ["Reviews", "#reviews"],
                ["Book via WhatsApp", `https://wa.me/${site.whatsapp}`],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-neon"
                  >
                    {label}
                    <ArrowUpRight size={13} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* services */}
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-paper">Services</p>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href="#booking"
                    className="group inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-neon"
                  >
                    {s.short}
                    <span className="text-xs text-faint transition-colors group-hover:text-neon-soft">
                      {s.startingAt ?? "Quote"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact + map */}
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-paper">Reach the studio</p>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-mute transition-colors hover:text-neon">
                  <Phone size={16} className="shrink-0 text-neon" /> {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-mute transition-colors hover:text-neon">
                  <Mail size={16} className="shrink-0 text-neon" /> {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-mute">
                <MapPin size={16} className="mt-0.5 shrink-0 text-neon" />
                <span>{site.address}</span>
              </li>
            </ul>
            <div className="mt-5 overflow-hidden rounded-2xl border border-line">
              <iframe
                src={mapsSrc}
                title="Studio location map"
                className="map-dark h-44 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-line pt-7 sm:flex-row">
          <p className="flex items-center gap-2 text-xs text-faint">
            © {year} {site.name}. Crafted with
            <Aperture size={13} className="animate-spin-slower text-neon" />
            in the darkroom.
          </p>
          <div className="flex items-center gap-6">
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold uppercase tracking-[0.16em] text-mute transition-colors hover:text-neon">
              WhatsApp us
            </a>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-faint transition-colors hover:text-neon"
            >
              <LockKeyhole size={12} /> Owner login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

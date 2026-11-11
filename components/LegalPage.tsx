import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Mail, ShieldCheck } from "lucide-react";
import Backdrop from "./Backdrop";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import Reveal from "./Reveal";
import { legalConfig } from "@/lib/legal";

export interface LegalTocItem {
  id: string;
  number: string;
  title: string;
}

interface LegalPageProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  toc: LegalTocItem[];
  related: { href: string; label: string; description: string };
  children: ReactNode;
}

/**
 * Shared premium layout for legal pages (/privacy-policy, /terms-and-conditions).
 * Matches the home-page design system: void black base, neon-green accents,
 * Space Grotesk display type, glass panels, filmstrip motifs.
 */
export default function LegalPage({ eyebrow, title, intro, toc, related, children }: LegalPageProps) {
  return (
    <main className="relative min-h-screen">
      <Backdrop />
      <Navbar />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-[72px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_-10%,rgba(180,248,50,0.12),transparent_65%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16 lg:pb-14">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              <Link href="/" className="transition-colors hover:text-neon">Home</Link>
              <span aria-hidden="true" className="text-neon/60">/</span>
              <span className="text-neon-soft">{eyebrow}</span>
            </nav>
          </Reveal>

          <Reveal delay={0.06}>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neon-soft">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon shadow-glow" />
              {legalConfig.contact.name}
            </span>
          </Reveal>

          <Reveal delay={0.12}>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-mute sm:text-lg">{intro}</p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-line bg-panel/60 px-5 py-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-faint">
                  <CalendarDays size={13} className="text-neon" /> Last updated
                </p>
                <p className="mt-1.5 font-display text-sm font-semibold text-paper">{legalConfig.lastUpdated}</p>
              </div>
              <div className="rounded-2xl border border-line bg-panel/60 px-5 py-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-faint">
                  <CalendarDays size={13} className="text-neon" /> Effective from
                </p>
                <p className="mt-1.5 font-display text-sm font-semibold text-paper">{legalConfig.effectiveDate}</p>
              </div>
              <div className="rounded-2xl border border-line bg-panel/60 px-5 py-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-faint">
                  <Mail size={13} className="text-neon" /> Questions
                </p>
                <a href={`mailto:${legalConfig.contact.email}`} className="mt-1.5 block break-all font-display text-sm font-semibold text-paper transition-colors hover:text-neon">
                  {legalConfig.contact.email}
                </a>
              </div>
              <Link
                href={related.href}
                className="group rounded-2xl border border-neon/25 bg-neon/[0.06] px-5 py-4 transition-all duration-300 hover:border-neon/50 hover:bg-neon/10"
              >
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neon-soft">
                  <FileText size={13} className="text-neon" /> Related
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 font-display text-sm font-semibold text-paper">
                  {related.label}
                  <ArrowRight size={14} className="text-neon transition-transform duration-300 group-hover:translate-x-1" />
                </p>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-6 flex gap-3 rounded-2xl border border-dashed border-neon/30 bg-neon/[0.04] px-5 py-4">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-neon" />
              <p className="text-[13px] leading-relaxed text-mute">
                <span className="font-semibold text-paper">Please read this page carefully.</span> It describes how this
                website currently works. Items marked{" "}
                <span className="font-semibold uppercase tracking-wider text-neon-soft">Configurable</span> are left for
                the owner to confirm in <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code> —
                they are not assumed or guaranteed here. If anything on this page conflicts with your written
                quote or confirmation, the written agreement prevails. This page is not legal advice.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Body: TOC + sections ---------- */}
      <div className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="On this page" className="rounded-3xl border border-line bg-panel/60 p-5 backdrop-blur-xl sm:p-6">
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-paper">On this page</h2>
              <div className="filmstrip mt-4 w-full opacity-40" aria-hidden="true" />
              <ol className="mt-4 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#section-${item.id}`}
                      className="group flex items-baseline gap-3 rounded-xl px-3 py-2 text-[13px] leading-snug text-mute transition-all duration-300 hover:bg-neon/[0.06] hover:text-paper"
                    >
                      <span className="font-display text-[11px] font-bold tracking-widest text-neon/70 transition-colors group-hover:text-neon">
                        {item.number}
                      </span>
                      <span>{item.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="min-w-0 space-y-6 sm:space-y-8">{children}</div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

/** One numbered policy section — premium glass card with neon index. */
export function LegalSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section id={`section-${id}`} className="scroll-mt-28 rounded-3xl border border-line bg-panel/50 p-6 sm:p-8 lg:p-10">
        <div className="flex items-start gap-4 sm:gap-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-neon/30 bg-neon/[0.08] font-display text-sm font-bold tracking-widest text-neon shadow-glow">
            {number}
          </span>
          <h2 className="pt-2 font-display text-xl font-bold leading-tight tracking-tight text-paper sm:text-2xl">{title}</h2>
        </div>
        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-mute [&_a]:font-medium [&_a]:text-neon-soft [&_a]:underline [&_a]:decoration-neon/40 [&_a]:underline-offset-4 [&_a:hover]:decoration-neon [&_strong]:font-semibold [&_strong]:text-paper">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

/** Clearly-marked placeholder for a policy value the owner still needs to confirm. */
export function ConfigNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-neon/40 bg-neon/[0.05] px-5 py-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neon">{label} · Configurable</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-mute">{children}</p>
    </div>
  );
}

/** Shared bullet list styling for policy copy. */
export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="space-y-2.5 [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.55em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:rounded-full [&>li]:before:bg-neon [&>li]:before:shadow-glow">{children}</ul>;
}

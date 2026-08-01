"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Clapperboard,
  TrendingUp,
  Package,
  PartyPopper,
  Film,
  Scissors,
  Minus,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  MapPin,
  CalendarDays,
  Clock,
  Truck,
  Loader2,
  ShieldCheck,
  Link2,
  User,
  Phone,
  Mail,
  StickyNote,
  BadgeCheck,
  RefreshCcw,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { WhatsAppIcon } from "./BrandIcons";
import { SERVICES, formatINR, TRAVEL_NOTE, getService } from "@/lib/pricing";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { onSelectService } from "@/lib/client-events";
import type { PackageOption } from "@/lib/types";

const ICONS: Record<string, typeof Camera> = {
  Camera,
  Clapperboard,
  TrendingUp,
  Package,
  PartyPopper,
  Film,
  Scissors,
};

const STEPS = ["Service", "Package", "Details"] as const;

interface FormState {
  name: string;
  phone: string;
  email: string;
  location: string;
  date: string;
  slot: string;
  referenceUrl: string;
  notes: string;
  company: string; // honeypot
}

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  location: "",
  date: "",
  slot: "",
  referenceUrl: "",
  notes: "",
  company: "",
};

const TIME_SLOTS = ["Morning · 9 AM – 12 PM", "Afternoon · 12 – 4 PM", "Evening · 4 – 8 PM"];

const DRAFT_KEY = "ctp-booking-draft-v1";

export default function BookingSection() {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [qty, setQty] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [touched, setTouched] = useState(false);

  const service = serviceId ? getService(serviceId) : undefined;
  const pkg = useMemo(
    () => service?.packages.find((p) => p.id === packageId) ?? null,
    [service, packageId]
  );

  /* ---- pricing ---- */
  const isPerUnit = pkg?.unit === "photo" || pkg?.unit === "hour";
  const isInquiry = pkg?.unit === "inquiry";
  const effectiveQty = isPerUnit ? Math.max(qty || (pkg?.defaultQty ?? 1), pkg?.minQty ?? 1) : 0;
  const estimate = pkg ? (isPerUnit ? pkg.price * effectiveQty : pkg.price) : 0;

  const preferredDate = form.date
    ? `${new Date(`${form.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}${form.slot ? ` · ${form.slot.split("·")[0].trim()}` : ""}`
    : "";

  /* ---- draft persistence ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Partial<FormState & { serviceId: string; packageId: string }>;
        setForm({ ...EMPTY_FORM, name: d.name ?? "", phone: d.phone ?? "", email: d.email ?? "", location: d.location ?? "", referenceUrl: d.referenceUrl ?? "", notes: d.notes ?? "" });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ name: form.name, phone: form.phone, email: form.email, location: form.location, referenceUrl: form.referenceUrl, notes: form.notes }));
    } catch {
      /* ignore */
    }
  }, [form]);

  /* ---- external service preselection (services section) ---- */
  useEffect(
    () =>
      onSelectService((id) => {
        setServiceId(id);
        setPackageId(null);
        setQty(0);
        setStep(1);
      }),
    []
  );

  const pickPackage = useCallback((p: PackageOption) => {
    setPackageId(p.id);
    if (p.unit === "photo" || p.unit === "hour") setQty(p.defaultQty ?? p.minQty ?? 1);
  }, []);

  /* ---- validation ---- */
  const phoneOk = /^[+\d][\d\s-]{7,15}$/.test(form.phone.trim());
  const nameOk = form.name.trim().length >= 2;
  const locationOk = form.location.trim().length >= 3;
  const emailOk = form.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const urlOk = form.referenceUrl.trim() === "" || /^https?:\/\/.+\..+/.test(form.referenceUrl.trim());
  const formOk = nameOk && phoneOk && locationOk && emailOk && urlOk;

  const field = (k: keyof FormState) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  async function submit() {
    if (!service || !pkg || !formOk || status === "submitting") return;
    setStatus("submitting");
    setServerMsg("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          serviceId: service.id,
          packageId: pkg.id,
          quantity: isPerUnit ? effectiveQty : undefined,
          location: form.location.trim(),
          referenceUrl: form.referenceUrl.trim(),
          preferredDate: preferredDate || undefined,
          notes: form.notes.trim(),
          company: form.company,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? "Submission failed.");
      setStatus("success");
      setServerMsg(
        "We received your booking — our team will call you within a few hours to lock the schedule."
      );
    } catch (e) {
      setStatus("error");
      setServerMsg((e as Error).message);
    }
  }

  function reset() {
    setStatus("idle");
    setStep(0);
    setServiceId(null);
    setPackageId(null);
    setQty(0);
    setForm(EMPTY_FORM);
    setTouched(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }

  const whatsappHref =
    service && pkg
      ? buildWhatsAppLink({
          name: form.name.trim() || "—",
          serviceName: service.name,
          packageName: pkg.name,
          quantity: isPerUnit ? effectiveQty : undefined,
          unit: pkg.unitLabel,
          estimate,
          location: form.location.trim() || "—",
          phone: form.phone.trim() || "—",
          email: form.email.trim() || undefined,
          referenceUrl: form.referenceUrl.trim() || undefined,
          preferredDate: preferredDate || undefined,
          notes: form.notes.trim() || undefined,
        })
      : "#";

  return (
    <section id="booking" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Book your shoot"
          title={
            <>
              Transparent pricing. <span className="text-gradient-neon">Zero back-and-forth.</span>
            </>
          }
          description="Select a service, pick a package, drop your details — the estimate updates live. Confirm on the form or straight through WhatsApp."
        />

        {/* travel policy */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto -mt-6 mb-12 flex w-fit max-w-full items-center gap-2.5 rounded-full border border-neon/30 bg-neon/10 px-5 py-2.5 text-center"
        >
          <Truck size={15} className="shrink-0 text-neon" />
          <p className="text-xs font-semibold tracking-wide text-neon-soft sm:text-sm">{TRAVEL_NOTE}</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* ============ wizard ============ */}
          <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-9">
            <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-neon/10 blur-3xl" />

            {status === "success" ? (
              <SuccessState message={serverMsg} onReset={reset} whatsappHref={whatsappHref} />
            ) : (
              <>
                {/* stepper */}
                <div className="mb-9 flex items-center gap-3 sm:gap-4">
                  {STEPS.map((label, i) => {
                    const active = i === step;
                    const done = i < step;
                    return (
                      <div key={label} className="flex flex-1 items-center gap-3 sm:gap-4 last:flex-none">
                        <button
                          onClick={() => i < step && setStep(i)}
                          className={`flex items-center gap-2.5 ${i < step ? "cursor-pointer" : "cursor-default"}`}
                          aria-label={`Step ${i + 1}: ${label}`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-sm font-bold transition-all duration-300 ${
                              done
                                ? "border-neon bg-neon text-[#03130a]"
                                : active
                                  ? "border-neon bg-neon/15 text-neon shadow-glow"
                                  : "border-line bg-raise text-faint"
                            }`}
                          >
                            {done ? <Check size={16} /> : i + 1}
                          </span>
                          <span
                            className={`hidden text-xs font-semibold uppercase tracking-[0.16em] sm:block ${
                              active ? "text-paper" : done ? "text-neon-soft" : "text-faint"
                            }`}
                          >
                            {label}
                          </span>
                        </button>
                        {i < STEPS.length - 1 && (
                          <span className={`h-px flex-1 transition-colors duration-500 ${done ? "bg-neon/70" : "bg-line"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {/* ---------------- STEP 1: service ---------------- */}
                  {step === 0 && (
                    <motion.div
                      key="s0"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <h3 className="font-display text-lg font-bold text-paper">What are we shooting?</h3>
                      <p className="mt-1 text-sm text-mute">Choose a service to reveal its live packages.</p>
                      <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
                        {SERVICES.map((s) => {
                          const Icon = ICONS[s.icon] ?? Camera;
                          const active = serviceId === s.id;
                          return (
                            <button
                              key={s.id}
                              onClick={() => {
                                setServiceId(s.id);
                                setPackageId(null);
                                setQty(0);
                                setStep(1);
                              }}
                              className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                                active
                                  ? "border-neon bg-neon/10 shadow-glow"
                                  : "border-line bg-raise/40 hover:border-neon/40 hover:bg-neon/5"
                              }`}
                            >
                              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${active ? "border-neon bg-neon text-[#03130a]" : "border-neon/25 bg-neon/10 text-neon"}`}>
                                <Icon size={19} strokeWidth={1.9} />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate font-display text-[15px] font-bold text-paper">{s.short}</span>
                                <span className="mt-0.5 block text-xs font-semibold tracking-wide text-neon-soft">
                                  {s.startingAt ?? "Custom quote"}
                                </span>
                              </span>
                              <ChevronRight size={17} className="ml-auto shrink-0 text-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-neon" />
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ---------------- STEP 2: package ---------------- */}
                  {step === 1 && service && (
                    <motion.div
                      key="s1"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-bold text-paper">{service.name} packages</h3>
                          {service.pricingNote && <p className="mt-1 text-sm text-mute">{service.pricingNote}</p>}
                        </div>
                        <button
                          onClick={() => setStep(0)}
                          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider text-mute transition-colors hover:border-neon/50 hover:text-neon"
                        >
                          <ChevronLeft size={14} /> Service
                        </button>
                      </div>

                      <div className={`mt-6 grid gap-4 ${service.packages.length > 1 ? "md:grid-cols-2" : ""} ${service.packages.length === 3 && service.id === "monthly" ? "lg:grid-cols-3" : ""}`}>
                        {service.packages.map((p) => {
                          const active = packageId === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => pickPackage(p)}
                              className={`relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-300 ${
                                active
                                  ? "border-neon bg-neon/10 shadow-glow"
                                  : "border-line bg-raise/40 hover:border-neon/40 hover:bg-neon/5"
                              }`}
                            >
                              {p.badge && (
                                <span className="absolute -top-2.5 left-4 rounded-full bg-neon px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#03130a]">
                                  {p.badge}
                                </span>
                              )}
                              <span className="flex items-start justify-between gap-2">
                                <span className="font-display text-[15px] font-bold text-paper">{p.name}</span>
                                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${active ? "border-neon bg-neon text-[#03130a]" : "border-faint"}`}>
                                  {active && <Check size={12} />}
                                </span>
                              </span>
                              <span className="mt-2 font-display text-2xl font-bold text-neon">
                                {p.unit === "inquiry" ? "Custom quote" : formatINR(p.price)}
                                {p.unit === "photo" && <span className="text-sm font-semibold text-mute"> / photo</span>}
                                {p.unit === "hour" && <span className="text-sm font-semibold text-mute"> / hour</span>}
                                {p.unit === "month" && <span className="text-sm font-semibold text-mute"> / month</span>}
                              </span>
                              <span className="mt-2 text-xs leading-relaxed text-mute">{p.description}</span>
                              <ul className="mt-4 space-y-1.5">
                                {p.features.slice(0, 4).map((f) => (
                                  <li key={f} className="flex items-start gap-2 text-xs text-mute">
                                    <Check size={13} className="mt-0.5 shrink-0 text-neon" />
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </button>
                          );
                        })}
                      </div>

                      {/* quantity stepper */}
                      {pkg && isPerUnit && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neon/25 bg-neon/5 p-5"
                        >
                          <div>
                            <p className="font-display text-sm font-bold text-paper">
                              How many {pkg.unitLabel}s?
                            </p>
                            <p className="mt-0.5 text-xs text-mute">
                              {formatINR(pkg.price)} per {pkg.unitLabel}
                              {pkg.minQty ? ` · minimum ${pkg.minQty}` : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center overflow-hidden rounded-full border border-line bg-raise">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => setQty((q) => Math.max((pkg.minQty ?? 1), (q || (pkg.defaultQty ?? 1)) - stepAmount(pkg)))}
                                className="px-4 py-2.5 text-paper transition-colors hover:bg-neon/10 hover:text-neon"
                              >
                                <Minus size={15} />
                              </button>
                              <span className="min-w-16 border-x border-line px-3 py-2.5 text-center font-display text-sm font-bold text-neon">
                                {effectiveQty}
                              </span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() => setQty((q) => Math.min(100000, (q || (pkg.defaultQty ?? 1)) + stepAmount(pkg)))}
                                className="px-4 py-2.5 text-paper transition-colors hover:bg-neon/10 hover:text-neon"
                              >
                                <Plus size={15} />
                              </button>
                            </div>
                            <span className="font-display text-xl font-bold text-paper">
                              = <span className="text-neon">{formatINR(estimate)}</span>
                            </span>
                          </div>
                        </motion.div>
                      )}

                      <div className="mt-7 flex justify-end">
                        <button
                          disabled={!pkg}
                          onClick={() => setStep(2)}
                          className="btn-neon disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Continue
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ---------------- STEP 3: details ---------------- */}
                  {step === 2 && service && pkg && (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-bold text-paper">Almost done — your details</h3>
                          <p className="mt-1 text-sm text-mute">
                            {service.short} · {pkg.name}
                            {isPerUnit ? ` · ${effectiveQty} ${pkg.unitLabel}s` : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider text-mute transition-colors hover:border-neon/50 hover:text-neon"
                        >
                          <ChevronLeft size={14} /> Package
                        </button>
                      </div>

                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="bk-name">
                            <User size={12} /> Your name *
                          </label>
                          <input id="bk-name" className="input" placeholder="Aarav Kapoor" {...field("name")} />
                          {touched && !nameOk && <p className="mt-1.5 text-xs text-red-400">Please enter your name.</p>}
                        </div>
                        <div>
                          <label className="label" htmlFor="bk-phone">
                            <Phone size={12} /> Phone number *
                          </label>
                          <input id="bk-phone" className="input" inputMode="tel" placeholder="+91 98XXX XXXXX" {...field("phone")} />
                          {touched && !phoneOk && <p className="mt-1.5 text-xs text-red-400">Enter a valid contact number.</p>}
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label" htmlFor="bk-location">
                            <MapPin size={12} /> Shoot location / address *
                          </label>
                          <input id="bk-location" className="input" placeholder="Sector 62, Noida — studio, home, venue…" {...field("location")} />
                          {touched && !locationOk ? (
                            <p className="mt-1.5 text-xs text-red-400">Where should we show up?</p>
                          ) : (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neon-soft/80">
                              <Truck size={12} /> Free travel within 10 km · beyond that, charges apply.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="label" htmlFor="bk-email">
                            <Mail size={12} /> Email <span className="text-faint normal-case">(optional)</span>
                          </label>
                          <input id="bk-email" className="input" inputMode="email" placeholder="you@brand.com" {...field("email")} />
                          {touched && !emailOk && <p className="mt-1.5 text-xs text-red-400">That email doesn&apos;t look right.</p>}
                        </div>
                        <div>
                          <label className="label" htmlFor="bk-date">
                            <CalendarDays size={12} /> Preferred date <span className="text-faint normal-case">(optional)</span>
                          </label>
                          <input id="bk-date" type="date" min={new Date().toISOString().split("T")[0]} className="input [color-scheme:dark]" {...field("date")} />
                        </div>
                        <div>
                          <label className="label" htmlFor="bk-slot">
                            <Clock size={12} /> Preferred time <span className="text-faint normal-case">(optional)</span>
                          </label>
                          <select id="bk-slot" className="input appearance-none bg-raise/60" {...field("slot")}>
                            <option value="">Any time works</option>
                            {TIME_SLOTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label" htmlFor="bk-ref">
                            <Link2 size={12} /> Reference link <span className="text-faint normal-case">(optional)</span>
                          </label>
                          <input id="bk-ref" className="input" inputMode="url" placeholder="https://instagram.com/reel/… style you like" {...field("referenceUrl")} />
                          {touched && !urlOk && <p className="mt-1.5 text-xs text-red-400">Paste a full URL (https://…)</p>}
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label" htmlFor="bk-notes">
                            <StickyNote size={12} />
                            {service.id === "product" ? "Tell us about your products (optional)" : "Anything else? (optional)"}
                          </label>
                          <textarea
                            id="bk-notes"
                            rows={3}
                            className="input resize-none"
                            placeholder={
                              service.id === "product"
                                ? "e.g. 12 SKUs of skincare, need white background + lifestyle shots…"
                                : "Dates, vibe, references — anything that helps us prep."
                            }
                            {...field("notes")}
                          />
                        </div>
                        {/* honeypot */}
                        <input
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                          {...field("company")}
                        />
                      </div>

                      {status === "error" && (
                        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                          {serverMsg}
                        </div>
                      )}

                      <div className="mt-7 flex flex-col gap-3.5 sm:flex-row">
                        <button
                          onClick={() => {
                            setTouched(true);
                            if (formOk) submit();
                          }}
                          disabled={status === "submitting"}
                          className="btn-neon flex-1 disabled:opacity-60"
                        >
                          {status === "submitting" ? (
                            <>
                              <Loader2 size={17} className="animate-spin" /> Locking it in…
                            </>
                          ) : (
                            <>
                              <Send size={16} /> Submit booking
                            </>
                          )}
                        </button>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost flex-1 !border-[#25D366]/40 hover:!border-[#25D366] hover:!text-[#25D366]"
                        >
                          <WhatsAppIcon size={16} /> Book via WhatsApp
                        </a>
                      </div>
                      <p className="mt-4 text-center text-[11px] leading-relaxed text-faint">
                        Submitting sends your details to our team instantly (email + CRM sheet).
                        No payment now — we confirm the slot on call first.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* ============ live summary ============ */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass relative overflow-hidden rounded-3xl p-6"
            >
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-neon/15 blur-3xl" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neon-soft">
                Live estimate
              </p>

              <div className="mt-4 font-display text-4xl font-bold tracking-tight text-paper">
                {isInquiry || !pkg ? (
                  <span className="text-gradient-neon text-3xl">{isInquiry ? "Custom quote" : "—"}</span>
                ) : (
                  <span className="text-gradient-neon">{formatINR(estimate)}</span>
                )}
              </div>
              {pkg && !isInquiry && service && (
                <p className="mt-1.5 text-xs text-mute">
                  {service.short} · {pkg.name}
                  {isPerUnit ? ` · ${effectiveQty} × ${formatINR(pkg.price)}` : ""}
                </p>
              )}
              {isInquiry && (
                <p className="mt-1.5 text-xs text-mute">We&apos;ll scope it on a quick call and quote within hours.</p>
              )}

              <div className="mt-5 space-y-2.5 border-t border-line pt-5">
                <SummaryRow label="Service" value={service?.short ?? "Pick a service"} done={!!service} />
                <SummaryRow label="Package" value={pkg?.name ?? "Pick a package"} done={!!pkg} />
                <SummaryRow
                  label="Details"
                  value={formOk ? "Ready to submit" : "Fill the form"}
                  done={formOk}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-neon/20 bg-neon/5 p-4">
                <p className="flex items-start gap-2 text-xs leading-relaxed text-neon-soft">
                  <Truck size={14} className="mt-0.5 shrink-0" />
                  {TRAVEL_NOTE}
                </p>
              </div>

              <ul className="mt-5 space-y-2 border-t border-line pt-5">
                {["No advance needed to book", "Free rescheduling up to 24h before", "GST invoice available"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-xs text-mute">
                    <ShieldCheck size={13} className="text-neon" />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function stepAmount(pkg: PackageOption): number {
  if (pkg.unit === "hour") return 1;
  return 10;
}

function SummaryRow({ label, value, done }: { label: string; value: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="uppercase tracking-[0.16em] text-faint">{label}</span>
      <span className={`flex items-center gap-1.5 font-semibold ${done ? "text-neon-soft" : "text-mute"}`}>
        {done && <Check size={12} className="text-neon" />}
        <span className="max-w-44 truncate">{value}</span>
      </span>
    </div>
  );
}

function SuccessState({ message, onReset, whatsappHref }: { message: string; onReset: () => void; whatsappHref: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-[420px] flex-col items-center justify-center py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
        className="flex h-20 w-20 items-center justify-center rounded-full border border-neon/40 bg-neon/15 shadow-glow"
      >
        <BadgeCheck size={38} className="text-neon" />
      </motion.div>
      <h3 className="mt-6 font-display text-2xl font-bold text-paper sm:text-3xl">
        Booking received. <span className="text-gradient-neon">You&apos;re on the board.</span>
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">{message}</p>
      <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neon"
        >
          <WhatsAppIcon size={16} /> Fast-track on WhatsApp
        </a>
        <button onClick={onReset} className="btn-ghost">
          <RefreshCcw size={15} /> Book another
        </button>
      </div>
    </motion.div>
  );
}

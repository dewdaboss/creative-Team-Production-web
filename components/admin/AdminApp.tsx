"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Inbox,
  Images,
  Star,
  BarChart3,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Plus,
  RefreshCw,
  Loader2,
  LockKeyhole,
  Phone,
  MapPin,
  Link2,
  Mail,
  Sparkles,
  ArrowLeft,
  Clapperboard,
  Camera,
  Check,
} from "lucide-react";
import Logo from "@/components/Logo";
import { formatINR } from "@/lib/pricing";
import type { GalleryItem, Review } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* shared helpers                                                      */
/* ------------------------------------------------------------------ */

type AuthState = "loading" | "login" | "ready";
type Tab = "leads" | "gallery" | "reviews" | "stats";

interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  serviceName: string;
  packageName: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  estimate: number;
  location: string;
  referenceUrl?: string;
  notes?: string;
  automation?: { webhook: string };
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}

function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: typeof Inbox;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-all ${
        active ? "bg-neon text-[#03130a] shadow-glow" : "border border-line text-mute hover:border-neon/40 hover:text-paper"
      }`}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${active ? "bg-[#03130a] text-neon" : "bg-neon/20 text-neon"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={26} className="animate-spin text-neon" />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line py-14 text-center text-sm text-faint">
      {text}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* main app                                                            */
/* ------------------------------------------------------------------ */

export default function AdminApp() {
  const [auth, setAuth] = useState<AuthState>("loading");
  const [tab, setTab] = useState<Tab>("leads");
  const [leadCount, setLeadCount] = useState(0);

  useEffect(() => {
    api<{ authenticated: boolean }>("/api/auth/me")
      .then((d) => setAuth(d.authenticated ? "ready" : "login"))
      .catch(() => setAuth("login"));
  }, []);

  const handle401 = useCallback((e: unknown) => {
    if (e instanceof Error && e.message === "UNAUTHORIZED") setAuth("login");
  }, []);

  if (auth === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (auth === "login") {
    return <LoginScreen onSuccess={() => setAuth("ready")} />;
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-8 sm:px-8">
      {/* header */}
      <div className="glass sticky top-4 z-40 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo size={38} spinning={false} />
          <div>
            <p className="font-display text-sm font-bold tracking-wider text-paper">Studio Dashboard</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neon">Owner access</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-line px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-mute transition-colors hover:border-neon/40 hover:text-paper"
          >
            <ArrowLeft size={14} /> Site
          </a>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              setAuth("login");
            }}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-red-300 transition-colors hover:bg-red-500/10"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <TabButton icon={Inbox} label="Leads" active={tab === "leads"} onClick={() => setTab("leads")} badge={leadCount} />
        <TabButton icon={Images} label="Gallery" active={tab === "gallery"} onClick={() => setTab("gallery")} />
        <TabButton icon={Star} label="Reviews" active={tab === "reviews"} onClick={() => setTab("reviews")} />
        <TabButton icon={BarChart3} label="Stats" active={tab === "stats"} onClick={() => setTab("stats")} />
      </div>

      <div className="mt-6">
        {tab === "leads" && <LeadsTab onUnauthorized={handle401} onCount={setLeadCount} />}
        {tab === "gallery" && <GalleryTab onUnauthorized={handle401} />}
        {tab === "reviews" && <ReviewsTab onUnauthorized={handle401} />}
        {tab === "stats" && <StatsTab onUnauthorized={handle401} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* login                                                               */
/* ------------------------------------------------------------------ */

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/login", { method: "POST", body: JSON.stringify({ user, pass }) });
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onSubmit={login}
        className="glass relative w-full max-w-md overflow-hidden rounded-3xl p-8"
      >
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-neon/15 blur-3xl" />
        <div className="flex flex-col items-center text-center">
          <Logo size={72} />
          <h1 className="mt-5 font-display text-2xl font-bold text-paper">
            Owner <span className="text-gradient-neon">Login</span>
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-faint">
            <LockKeyhole size={12} /> Secure studio dashboard
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <label className="label" htmlFor="ad-user">Username</label>
            <input id="ad-user" className="input" autoComplete="username" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ad-pass">Password</label>
            <input id="ad-pass" type="password" className="input" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>
          )}
          <button type="submit" disabled={busy} className="btn-neon w-full disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <LockKeyhole size={15} />}
            {busy ? "Verifying…" : "Unlock dashboard"}
          </button>
          <p className="text-center text-[11px] leading-relaxed text-faint">
            Credentials come from <code className="text-neon-soft/80">ADMIN_USER</code> /{" "}
            <code className="text-neon-soft/80">ADMIN_PASS</code> env vars — see .env.example.
          </p>
        </div>
      </motion.form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* leads                                                               */
/* ------------------------------------------------------------------ */

function LeadsTab({ onUnauthorized, onCount }: { onUnauthorized: (e: unknown) => void; onCount: (n: number) => void }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<{ leads: Lead[] }>("/api/admin/leads");
      setLeads(d.leads);
      onCount(d.leads.length);
    } catch (e) {
      onUnauthorized(e);
    }
  }, [onUnauthorized, onCount]);

  useEffect(() => {
    load();
  }, [load]);

  if (!leads) return <Spinner />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-mute">
          <span className="font-display font-bold text-paper">{leads.length}</span> booking lead{leads.length === 1 ? "" : "s"} captured
        </p>
        <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-line px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-mute hover:border-neon/40 hover:text-neon">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {leads.length === 0 ? (
        <Empty text="No leads yet — they'll land here the moment someone books." />
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold text-paper">{l.name}</p>
                  <p className="mt-0.5 text-xs text-faint">
                    {new Date(l.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {l.automation?.webhook === "sent" && (
                    <span className="rounded-full border border-neon/30 bg-neon/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neon">
                      Email + Sheet ✓
                    </span>
                  )}
                  <span className="rounded-full bg-neon px-3.5 py-1.5 font-display text-sm font-bold text-[#03130a]">
                    {l.estimate > 0 ? formatINR(l.estimate) : "Quote"}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-mute">
                <span className="font-semibold text-neon-soft">
                  {l.serviceName} → {l.packageName}
                </span>
                {l.quantity ? (
                  <span>
                    {l.quantity} {l.unit}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-faint">
                <a href={`tel:${l.phone}`} className="flex items-center gap-1.5 hover:text-neon"><Phone size={12} className="text-neon" />{l.phone}</a>
                {l.email && (
                  <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 hover:text-neon"><Mail size={12} className="text-neon" />{l.email}</a>
                )}
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-neon" />{l.location}</span>
                {l.referenceUrl && (
                  <a href={l.referenceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-neon"><Link2 size={12} className="text-neon" />Reference</a>
                )}
              </div>
              {l.notes && <p className="mt-3 rounded-xl bg-raise/60 px-3.5 py-2.5 text-xs leading-relaxed text-mute">📝 {l.notes}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* gallery                                                             */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["Reels", "Product", "Portraits", "Weddings & Events", "Brand Campaigns", "Food & Hospitality", "Behind The Scenes"];

function GalleryTab({ onUnauthorized }: { onUnauthorized: (e: unknown) => void }) {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [form, setForm] = useState({ type: "photo" as "photo" | "reel", title: "", category: CATEGORIES[0], src: "", embedUrl: "", views: "", duration: "" });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<{ items: GalleryItem[] }>("/api/admin/gallery");
      setItems(d.items);
    } catch (e) {
      onUnauthorized(e);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(file: File) {
    setUploading(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const d = await api<{ path: string }>("/api/admin/upload", { method: "POST", body: fd });
      setForm((f) => ({ ...f, src: d.path }));
      setMsg("Uploaded ✓ — now add a title and publish.");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!form.src) {
      setMsg("Upload or paste an image URL first.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      await api("/api/admin/gallery", {
        method: "POST",
        body: JSON.stringify({
          type: form.type,
          title: form.title,
          category: form.category,
          src: form.src,
          embedUrl: form.embedUrl || undefined,
          views: form.views || undefined,
          duration: form.duration || undefined,
        }),
      });
      setForm({ type: form.type, title: "", category: form.category, src: "", embedUrl: "", views: "", duration: "" });
      if (fileRef.current) fileRef.current.value = "";
      setMsg("Published to the live gallery ✓");
      load();
    } catch (e2) {
      setMsg((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, changes: Record<string, unknown>) {
    try {
      await api("/api/admin/gallery", { method: "PATCH", body: JSON.stringify({ id, ...changes }) });
      load();
    } catch (e) {
      onUnauthorized(e);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this item from the gallery?")) return;
    try {
      await api(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      onUnauthorized(e);
    }
  }

  if (!items) return <Spinner />;

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* add form */}
      <form onSubmit={addItem} className="glass h-fit rounded-3xl p-6 lg:sticky lg:top-24">
        <p className="flex items-center gap-2 font-display text-base font-bold text-paper">
          <Plus size={16} className="text-neon" /> Add to gallery
        </p>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(["photo", "reel"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  form.type === t ? "border-neon bg-neon/15 text-neon" : "border-line text-mute hover:border-neon/40"
                }`}
              >
                {t === "photo" ? <Camera size={14} /> : <Clapperboard size={14} />}
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="label">Title</label>
            <input className="input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Summer Drop Campaign" />
          </div>

          <div>
            <label className="label">Category</label>
            <input className="input" list="admin-cats" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
            <datalist id="admin-cats">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="label">{form.type === "reel" ? "Cover image" : "Image"}</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-raise/40 px-4 py-6 text-center transition-colors hover:border-neon/50"
            >
              {form.src ? (
                <div className="relative h-28 w-full overflow-hidden rounded-lg">
                  <Image src={form.src} alt="upload preview" fill className="object-cover" sizes="300px" />
                </div>
              ) : uploading ? (
                <Loader2 size={20} className="animate-spin text-neon" />
              ) : (
                <Upload size={20} className="text-neon" />
              )}
              <p className="text-xs text-faint">{uploading ? "Uploading…" : form.src ? "Click to replace" : "Click to upload (JPG/PNG/WebP, ≤15 MB)"}</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
            <input
              className="input mt-2.5"
              placeholder="…or paste an image URL / path"
              value={form.src}
              onChange={(e) => setForm((f) => ({ ...f, src: e.target.value }))}
            />
          </div>

          {form.type === "reel" && (
            <>
              <div>
                <label className="label">Instagram reel URL (optional)</label>
                <input className="input" placeholder="https://www.instagram.com/reel/…" value={form.embedUrl} onChange={(e) => setForm((f) => ({ ...f, embedUrl: e.target.value }))} />
                <p className="mt-1.5 text-[11px] text-faint">When set, the reel embeds and plays right inside the gallery lightbox.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Views label</label>
                  <input className="input" placeholder="12.4K" value={form.views} onChange={(e) => setForm((f) => ({ ...f, views: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Duration</label>
                  <input className="input" placeholder="0:24" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
                </div>
              </div>
            </>
          )}

          {msg && <p className="rounded-xl border border-line bg-raise/50 px-3.5 py-2.5 text-xs text-neon-soft">{msg}</p>}

          <button type="submit" disabled={busy} className="btn-neon w-full !py-3 text-xs disabled:opacity-60">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            Publish
          </button>
        </div>
      </form>

      {/* items list */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <Empty text="Gallery is empty — publish your first item." />
        ) : (
          items.map((item) => (
            <div key={item.id} className={`glass flex items-center gap-4 rounded-2xl p-3.5 transition-opacity ${item.visible ? "" : "opacity-50"}`}>
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line">
                <Image src={item.src} alt={item.title} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-paper">{item.title}</p>
                <p className="mt-0.5 flex items-center gap-2 text-[11px] uppercase tracking-wider text-faint">
                  {item.type === "reel" ? <Clapperboard size={11} className="text-neon" /> : <Camera size={11} className="text-neon" />}
                  {item.type} · {item.category}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  title={item.visible ? "Hide from site" : "Show on site"}
                  onClick={() => patch(item.id, { visible: !item.visible })}
                  className={`rounded-lg border p-2 transition-colors ${item.visible ? "border-neon/40 text-neon" : "border-line text-faint hover:text-paper"}`}
                >
                  {item.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  title="Delete"
                  onClick={() => remove(item.id)}
                  className="rounded-lg border border-red-500/30 p-2 text-red-300 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* reviews                                                             */
/* ------------------------------------------------------------------ */

function ReviewsTab({ onUnauthorized }: { onUnauthorized: (e: unknown) => void }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [form, setForm] = useState({ name: "", rating: 5, text: "", service: "" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await api<{ reviews: Review[] }>("/api/admin/reviews");
      setReviews(d.reviews);
    } catch (e) {
      onUnauthorized(e);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/admin/reviews", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", rating: 5, text: "", service: "" });
      load();
    } catch (e2) {
      onUnauthorized(e2);
    } finally {
      setBusy(false);
    }
  }

  if (!reviews) return <Spinner />;

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form onSubmit={add} className="glass h-fit rounded-3xl p-6 lg:sticky lg:top-24">
        <p className="flex items-center gap-2 font-display text-base font-bold text-paper">
          <Plus size={16} className="text-neon" /> Add a review
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="label">Client name</label>
            <input className="input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Rating</label>
              <select className="input" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Service</label>
              <input className="input" placeholder="Reels Shoot" value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Review text</label>
            <textarea className="input resize-none" rows={4} required value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
          </div>
          <button type="submit" disabled={busy} className="btn-neon w-full !py-3 text-xs disabled:opacity-60">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Publish review
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <Empty text="No reviews yet." />
        ) : (
          reviews.map((r) => (
            <div key={r.id} className={`glass rounded-2xl p-5 transition-opacity ${r.visible ? "" : "opacity-50"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-bold text-paper">{r.name}</p>
                  <p className="mt-0.5 text-[11px] text-neon">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)} <span className="text-faint">{r.service ? `· ${r.service}` : ""}</span></p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={async () => {
                      await api("/api/admin/reviews", { method: "PATCH", body: JSON.stringify({ id: r.id, visible: !r.visible }) });
                      load();
                    }}
                    className={`rounded-lg border p-2 transition-colors ${r.visible ? "border-neon/40 text-neon" : "border-line text-faint hover:text-paper"}`}
                  >
                    {r.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this review?")) return;
                      await api(`/api/admin/reviews?id=${r.id}`, { method: "DELETE" });
                      load();
                    }}
                    className="rounded-lg border border-red-500/30 p-2 text-red-300 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-mute">“{r.text}”</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* stats                                                               */
/* ------------------------------------------------------------------ */

interface StatsShape {
  instagramFollowers: number;
  followersToday: number;
  projectsDelivered: number;
  happyClients: number;
  reelsProduced: number;
  visitors?: number;
  visitorsToday?: number;
}

function StatsTab({ onUnauthorized }: { onUnauthorized: (e: unknown) => void }) {
  const [stats, setStats] = useState<StatsShape | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const d = await api<{ stats: StatsShape }>("/api/admin/stats");
        setStats(d.stats);
      } catch (e) {
        onUnauthorized(e);
      }
    })();
  }, [onUnauthorized]);

  if (!stats) return <Spinner />;

  const fields: { key: keyof StatsShape; label: string }[] = [
    { key: "instagramFollowers", label: "Instagram followers" },
    { key: "followersToday", label: "Followers gained today" },
    { key: "projectsDelivered", label: "Projects delivered" },
    { key: "happyClients", label: "Happy clients" },
    { key: "reelsProduced", label: "Reels produced" },
  ];

  return (
    <div className="mx-auto max-w-xl">
      <div className="glass rounded-3xl p-6 sm:p-8">
        <p className="font-display text-base font-bold text-paper">Live counters</p>
        <p className="mt-1 text-xs text-faint">These numbers power the animated widgets on the homepage.</p>

        <div className="mt-6 space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                type="number"
                min={0}
                className="input"
                value={stats[key] as number}
                onChange={(e) => setStats((s) => (s ? { ...s, [key]: Math.max(0, Number(e.target.value) || 0) } : s))}
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line bg-raise/40 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint">Total visitors</p>
              <p className="mt-1 font-display text-2xl font-bold text-neon">{stats.visitors ?? 0}</p>
            </div>
            <div className="rounded-xl border border-line bg-raise/40 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint">Visitors today</p>
              <p className="mt-1 font-display text-2xl font-bold text-neon">{stats.visitorsToday ?? 0}</p>
            </div>
          </div>

          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setSaved(false);
              try {
                await api("/api/admin/stats", {
                  method: "PATCH",
                  body: JSON.stringify({
                    instagramFollowers: stats.instagramFollowers,
                    followersToday: stats.followersToday,
                    projectsDelivered: stats.projectsDelivered,
                    happyClients: stats.happyClients,
                    reelsProduced: stats.reelsProduced,
                  }),
                });
                setSaved(true);
              } catch (e) {
                onUnauthorized(e);
              } finally {
                setBusy(false);
              }
            }}
            className="btn-neon w-full !py-3 text-xs disabled:opacity-60"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <BarChart3 size={15} />}
            {saved ? "Saved — live on site" : "Save counters"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

/** Cross-section service preselection (Services cards → Booking wizard). */
export function selectService(id: string) {
  window.dispatchEvent(new CustomEvent("ctp:select-service", { detail: id }));
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function onSelectService(handler: (id: string) => void): () => void {
  const fn = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener("ctp:select-service", fn);
  return () => window.removeEventListener("ctp:select-service", fn);
}

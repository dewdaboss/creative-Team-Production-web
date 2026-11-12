/**
 * Tiny event helper so any trigger (navbar, about teaser…) can open the
 * in-page About panel without a page navigation.
 */
export const ABOUT_PANEL_EVENT = "ctp:open-about";

export function openAboutPanel() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ABOUT_PANEL_EVENT));
}

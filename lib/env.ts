/**
 * SERVER-ONLY environment values.
 * Never import this file from client components — see lib/site.ts instead.
 */
export const serverEnv = {
  adminUser: process.env.ADMIN_USER ?? "admin",
  adminPass: process.env.ADMIN_PASS ?? "CTPstudio@2026",
  // Keep a stable fallback so sessions survive a missing env file.
  sessionSecret: process.env.SESSION_SECRET ?? "ctp-session-fallback-secret-2026",
  notifyWebhook: process.env.NOTIFY_WEBHOOK_URL ?? "",
  notifyEmail: process.env.NOTIFY_EMAIL ?? "creative.team.production.official@gmail.com",
};

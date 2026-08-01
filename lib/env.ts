/**
 * SERVER-ONLY environment values.
 * Never import this file from client components — see lib/site.ts instead.
 */
export const serverEnv = {
  adminUser: process.env.ADMIN_USER ?? "admin",
  adminPass: process.env.ADMIN_PASS ?? "ctp-admin-2024",
  sessionSecret: process.env.SESSION_SECRET ?? "dev-secret-change-me-in-production",
  notifyWebhook: process.env.NOTIFY_WEBHOOK_URL ?? "",
  notifyEmail: process.env.NOTIFY_EMAIL ?? "creative.team.production.official@gmail.com",
};

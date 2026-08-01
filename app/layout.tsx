import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Cinematography, Photography & Digital Marketing`,
    template: `%s · ${site.name}`,
  },
  description:
    "Creative production agency for cinematography, photography, reels & social media growth. Book shoots online — dynamic packages, instant WhatsApp booking, premium portfolio.",
  keywords: [
    "cinematography",
    "photography",
    "reels production",
    "digital marketing agency",
    "product photography",
    "event photography",
  ],
  openGraph: {
    title: site.name,
    description: "We don't just shoot content. We craft attention.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#030503",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-void font-body text-paper antialiased">{children}</body>
    </html>
  );
}

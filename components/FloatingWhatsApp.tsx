"use client";

import { motion } from "framer-motion";
import { WhatsAppIcon } from "./BrandIcons";
import { site } from "@/lib/site";

export default function FloatingWhatsApp() {
  const msg = encodeURIComponent(`Hi ${site.name}! I want to plan a shoot. 🎬`);
  return (
    <motion.a
      href={`https://wa.me/${site.whatsapp}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)]"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-25" />
      <WhatsAppIcon size={26} className="relative" />
    </motion.a>
  );
}

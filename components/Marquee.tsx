import { Aperture } from "lucide-react";

const WORDS = [
  "Cinematic Reels",
  "Photography",
  "Ad Shoots",
  "Branding",
  "Product Shoots",
  "Event Coverage",
  "YouTube Production",
  "Social Growth",
  "Podcast Shoots",
  "Digital Marketing",
];

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative border-y border-line bg-panel/40 py-5 backdrop-blur-sm">
      <div className={`filmstrip absolute inset-x-0 top-0 ${reverse ? "opacity-30" : ""}`} />
      <div className="mask-fade-x overflow-hidden">
        <div
          className={`flex w-max items-center gap-10 whitespace-nowrap pr-10 ${
            reverse ? "animate-marquee-reverse" : "animate-marquee"
          }`}
        >
          {row.map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="font-display text-xl font-bold uppercase tracking-[0.2em] text-paper/90">
                {w}
              </span>
              <Aperture size={18} className="text-neon" />
            </span>
          ))}
        </div>
      </div>
      <div className="filmstrip absolute inset-x-0 bottom-0 opacity-30" />
    </div>
  );
}

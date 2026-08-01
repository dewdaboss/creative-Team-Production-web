import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`relative mb-14 ${centered ? "text-center" : ""}`}>
      <Reveal>
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neon-soft ${
            centered ? "" : ""
          }`}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon shadow-glow" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className={`mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg ${centered ? "mx-auto" : ""}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

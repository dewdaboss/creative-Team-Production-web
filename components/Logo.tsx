"use client";

import { memo } from "react";

interface LogoProps {
  size?: number;
  /** show circular brand text around the emblem */
  withRingText?: boolean;
  spinning?: boolean;
  className?: string;
}

/**
 * Premium circular emblem — aperture iris core, orbiting brand text,
 * neon conic sweep. Fully vector, crisp at any size.
 */
function LogoBase({ size = 56, withRingText = false, spinning = true, className = "" }: LogoProps) {
  const uid = `lg-${size}`;
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label="Creative Team Production logo"
      role="img"
    >
      {/* glow */}
      <div
        className="absolute inset-0 rounded-full bg-neon/25 blur-xl"
        style={{ transform: "scale(0.9)" }}
      />
      {/* orbiting sweep */}
      {spinning && (
        <div className="absolute -inset-[3px] animate-spin-slow rounded-full border-2 border-transparent border-t-neon/90 border-r-neon/25 opacity-90" />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="relative drop-shadow-[0_0_12px_rgba(57,255,136,0.45)]"
      >
        <defs>
          <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8cffb9" />
            <stop offset="55%" stopColor="#39ff88" />
            <stop offset="100%" stopColor="#0ea654" />
          </linearGradient>
          <radialGradient id={`${uid}-core`} cx="50%" cy="42%" r="68%">
            <stop offset="0%" stopColor="#123523" />
            <stop offset="100%" stopColor="#030503" />
          </radialGradient>
          {withRingText && (
            <path id={`${uid}-circ`} d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
          )}
        </defs>

        {/* outer ring */}
        <circle cx="60" cy="60" r="57" fill="#050a07" stroke={`url(#${uid}-ring)`} strokeWidth="1.6" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="#39ff88" strokeOpacity="0.25" strokeWidth="0.6" />

        {/* orbiting text */}
        {withRingText && (
          <g className={spinning ? "origin-center animate-spin-slower" : ""} style={{ transformOrigin: "60px 60px" }}>
            <text fill="#8cffb9" fontSize="9.2" fontWeight="700" letterSpacing="2.6" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              <textPath href={`#${uid}-circ`}>CREATIVE TEAM PRODUCTION • CREATE • SHOOT • GROW •</textPath>
            </text>
          </g>
        )}

        {/* aperture iris */}
        <g style={{ transformOrigin: "60px 60px" }} className={spinning ? "animate-[spin_24s_linear_infinite_reverse]" : ""}>
          <circle cx="60" cy="60" r="30" fill={`url(#${uid}-core)`} stroke="#39ff88" strokeOpacity="0.7" strokeWidth="1.4" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <path
              key={deg}
              d="M60 60 L84 47 A28 28 0 0 1 84 73 Z"
              fill="#030503"
              stroke="#39ff88"
              strokeOpacity="0.65"
              strokeWidth="1"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
          <circle cx="60" cy="60" r="11" fill="#0a1f12" stroke="#8cffb9" strokeWidth="1.6" />
          <circle cx="56.5" cy="55.5" r="3.4" fill="#8cffb9" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

export const Logo = memo(LogoBase);
export default Logo;

"use client";

import { memo, useState } from "react";
import Image from "next/image";

interface LogoProps {
  size?: number;
  /** show circular brand text around the emblem */
  withRingText?: boolean;
  spinning?: boolean;
  className?: string;
}

const LOGO_SRC = "/images/logo.png";

/**
 * Premium circular emblem holding the agency logo.
 *
 * Renders the real brand mark from /images/logo.png (white-on-transparent
 * hand-holding-camera mark). If the file is not deployed yet, falls back to
 * the built-in vector aperture mark so nothing ever looks broken.
 * Frame: gradient ring + ambient glow + orbiting neon sweep (+ optional
 * circular "CREATE • SHOOT • GROW" text ring for the hero).
 */
function LogoBase({ size = 56, withRingText = false, spinning = true, className = "" }: LogoProps) {
  const uid = `lg-${size}`;
  const [imgFailed, setImgFailed] = useState(false);

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

      {/* frame */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="absolute inset-0 drop-shadow-[0_0_12px_rgba(57,255,136,0.45)]"
      >
        <defs>
          <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8cffb9" />
            <stop offset="55%" stopColor="#39ff88" />
            <stop offset="100%" stopColor="#0ea654" />
          </linearGradient>
          {withRingText && (
            <path id={`${uid}-circ`} d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
          )}
        </defs>
        <circle cx="60" cy="60" r="57" fill="#050a07" stroke={`url(#${uid}-ring)`} strokeWidth="1.6" />
        <circle cx="60" cy="60" r="52" fill="none" stroke="#39ff88" strokeOpacity="0.25" strokeWidth="0.6" />
        {withRingText && (
          <g className={spinning ? "origin-center animate-spin-slower" : ""} style={{ transformOrigin: "60px 60px" }}>
            <text fill="#8cffb9" fontSize="9.2" fontWeight="700" letterSpacing="2.6" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              <textPath href={`#${uid}-circ`}>CREATIVE TEAM PRODUCTION • CREATE • SHOOT • GROW •</textPath>
            </text>
          </g>
        )}
      </svg>

      {/* mark */}
      {imgFailed ? (
        <ApertureMark uid={uid} size={size} spinning={spinning} />
      ) : (
        <span className="relative z-10 flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_38%,#0d1811,transparent_75%)]" style={{ width: size * 0.74, height: size * 0.74 }}>
          <Image
            src={LOGO_SRC}
            alt=""
            width={Math.round(size * 0.74)}
            height={Math.round(size * 0.74)}
            onError={() => setImgFailed(true)}
            className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
            style={{ width: "86%", height: "86%" }}
            priority={size > 100}
          />
        </span>
      )}
    </div>
  );
}

/** Vector aperture mark — used until /images/logo.png is deployed. */
function ApertureMark({ uid, size, spinning }: { uid: string; size: number; spinning: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="absolute inset-0 z-10">
      <defs>
        <radialGradient id={`${uid}-core`} cx="50%" cy="42%" r="68%">
          <stop offset="0%" stopColor="#123523" />
          <stop offset="100%" stopColor="#030503" />
        </radialGradient>
      </defs>
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
  );
}

export const Logo = memo(LogoBase);
export default Logo;

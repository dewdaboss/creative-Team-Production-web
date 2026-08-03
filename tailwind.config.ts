import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#030503",
        ink: "#070b08",
        panel: "#0b100c",
        raise: "#101712",
        line: "rgba(180,248,50,0.14)",
        neon: {
          DEFAULT: "#B4F832",
          soft: "#DFFFA6",
          dark: "#7FBF1A",
          dim: "#3A5C16",
          deep: "#263A10",
        },
        paper: "#eef5f0",
        mute: "#8a988f",
        faint: "#5b6a60",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(180,248,50,0.35), 0 0 80px rgba(180,248,50,0.12)",
        "glow-lg": "0 0 40px rgba(180,248,50,0.45), 0 0 140px rgba(180,248,50,0.18)",
        card: "0 20px 60px rgba(0,0,0,0.6)",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 34s linear infinite",
        "spin-slow": "spin 16s linear infinite",
        "spin-slower": "spin 40s linear infinite",
        float: "float 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3.2s ease-in-out infinite",
        shimmer: "shimmer 2.6s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", filter: "blur(38px)" },
          "50%": { opacity: "0.9", filter: "blur(52px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

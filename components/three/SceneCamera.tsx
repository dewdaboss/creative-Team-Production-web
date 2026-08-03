"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SceneCameraProps = {
  /** sprite sheet url (grid of rotation frames) */
  src?: string;
  /** sheet layout */
  cols?: number;
  rows?: number;
  /** usable frames (default: cols * rows) */
  frames?: number;
  className?: string;
  /** idle spin speed, frames/second */
  autoRotateSpeed?: number;
  /** drag / arrow-keys rotation */
  interactive?: boolean;
  ariaLabel?: string;
};

/**
 * SceneCamera — lightweight "3D" camera rendered from a 360° sprite sheet.
 * Scrub frames with pointer drag (with inertial spin) and a slow idle
 * auto-rotate. No WebGL: a single <canvas> + one image asset.
 */
export default function SceneCamera({
  src = "/images/camera360/sprite.webp",
  cols = 6,
  rows = 6,
  frames,
  className = "",
  autoRotateSpeed = 3.5,
  interactive = true,
  ariaLabel = "Cinema camera, 360 degree view — drag to rotate",
}: SceneCameraProps) {
  const total = frames ?? cols * rows;

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const posRef = useRef(0); // current frame (float, 0..total)
  const velRef = useRef(autoRotateSpeed); // frames/second
  const drawnRef = useRef(-1); // last drawn frame index
  const dragRef = useRef({ active: false, lastX: 0, lastT: 0 });
  const reducedRef = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const [grabbed, setGrabbed] = useState(false);

  /* -------------------------------------------------- draw one frame */
  const draw = useCallback(
    (frameIdx: number) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const sw = img.naturalWidth / cols;
      const sh = img.naturalHeight / rows;
      const i = ((frameIdx % total) + total) % total;
      const sx = (i % cols) * sw;
      const sy = Math.floor(i / cols) * sh;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.min(cw / sw, ch / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sw, sh, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    },
    [cols, rows, total]
  );

  /* -------------------------------------------------- sprite loading */
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    const ready = () => {
      if (cancelled) return;
      imgRef.current = img;
      drawnRef.current = -1;
      setLoaded(true);
      draw(Math.floor(posRef.current));
    };
    if (img.complete && img.naturalWidth > 0) ready();
    else {
      img.onload = ready;
      img.onerror = () => {
        if (!cancelled) setLoaded(true); // leave the empty-slate fallback
      };
    }
    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src, draw]);

  /* -------------------------------------------------- reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedRef.current = mq.matches;
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* -------------------------------------------------- canvas sizing */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      drawnRef.current = -1;
      draw(Math.floor(posRef.current));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [draw]);

  /* -------------------------------------------------- animation loop */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.06, (now - last) / 1000);
      last = now;
      const drag = dragRef.current;
      if (!drag.active && !reducedRef.current) {
        // decay any fling back toward the idle spin speed
        velRef.current +=
          (autoRotateSpeed - velRef.current) * Math.min(1, dt * 2.4);
        posRef.current =
          (posRef.current + velRef.current * dt + total) % total;
      }
      const idx = Math.floor(posRef.current) % total;
      if (idx !== drawnRef.current) {
        drawnRef.current = idx;
        draw(idx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotateSpeed, draw, total]);

  /* -------------------------------------------------- pointer scrub */
  const stepFromDx = useCallback(
    (dx: number) => {
      const w = wrapRef.current?.clientWidth || 320;
      return dx * (total / (w * 1.2)); // ~one full turn per 1.2x width drag
    },
    [total]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, lastX: e.clientX, lastT: performance.now() };
    setGrabbed(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || !interactive) return;
    const now = performance.now();
    const dx = e.clientX - drag.lastX;
    const dt = Math.max(1, now - drag.lastT) / 1000;
    const step = stepFromDx(dx);
    posRef.current = (posRef.current + step + total) % total;
    velRef.current = Math.max(-42, Math.min(42, step / dt));
    drag.lastX = e.clientX;
    drag.lastT = now;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setGrabbed(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      posRef.current =
        (posRef.current + (e.key === "ArrowLeft" ? -1.5 : 1.5) + total) % total;
      velRef.current = 0;
    }
  };

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={ariaLabel}
      tabIndex={interactive ? 0 : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={`relative touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-neon/50 rounded-2xl ${
        interactive ? (grabbed ? "cursor-grabbing" : "cursor-grab") : ""
      } ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center" aria-hidden>
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-neon" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`h-full w-full transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
    </div>
  );
}

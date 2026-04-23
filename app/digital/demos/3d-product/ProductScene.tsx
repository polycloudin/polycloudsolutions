"use client";

import { useEffect, useRef } from "react";

/**
 * Pure-CSS 3D product scene. No ML model. No webcam. No WebGPU.
 *
 * The depth illusion is built from four stacked layers that translate
 * on different axes based on (a) scroll progress and (b) pointer
 * position. The result on a phone is a convincing parallax; on a laptop
 * with mouse move, it feels like the product is floating in front of
 * you.
 *
 * Works on every device Chrome/Safari/Firefox ship today. No fallback
 * needed.
 */
export default function ProductScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  // Mouse / device-orientation → tilt
  useEffect(() => {
    const tilt = tiltRef.current;
    const scene = sceneRef.current;
    if (!tilt || !scene) return;

    let rx = 0,
      ry = 0,
      tx = 0,
      ty = 0;
    let raf = 0;

    const apply = () => {
      // Smooth to target
      rx += (ty - rx) * 0.12;
      ry += (tx - ry) * 0.12;
      tilt.style.transform = `perspective(1200px) rotateX(${-rx}deg) rotateY(${ry}deg)`;
      raf = requestAnimationFrame(apply);
    };
    raf = requestAnimationFrame(apply);

    const onPointer = (e: PointerEvent) => {
      const rect = scene.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      tx = ((e.clientX - cx) / rect.width) * 16;
      ty = ((e.clientY - cy) / rect.height) * 12;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      // Mobile: gamma ≈ left/right tilt, beta ≈ fwd/back
      if (e.gamma !== null) tx = Math.max(-16, Math.min(16, e.gamma / 3));
      if (e.beta !== null) ty = Math.max(-12, Math.min(12, (e.beta - 45) / 4));
    };

    scene.addEventListener("pointermove", onPointer);
    scene.addEventListener("pointerleave", onLeave);
    window.addEventListener("deviceorientation", onOrient);

    return () => {
      cancelAnimationFrame(raf);
      scene.removeEventListener("pointermove", onPointer);
      scene.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);

  // Scroll → parallax per layer
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const layers = scene.querySelectorAll<HTMLElement>("[data-depth]");
    let raf = 0;

    const apply = () => {
      const rect = scene.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: -1 when scene is below viewport, 0 when centered, 1 when above
      const progress = Math.max(
        -1,
        Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2))
      );
      layers.forEach((el) => {
        const d = parseFloat(el.dataset.depth || "0");
        el.style.setProperty("--scroll-y", `${progress * d * -40}px`);
      });
      raf = requestAnimationFrame(apply);
    };
    raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={sceneRef}
      className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--color-line)] bg-gradient-to-b from-[#18121B] via-[#0A0A0A] to-[#1F0E11]"
      style={{ perspective: "1200px" }}
    >
      {/* Stage ambience */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 35% at 50% 60%, rgba(244, 107, 44, 0.22) 0%, transparent 60%), radial-gradient(ellipse 30% 25% at 15% 20%, rgba(26, 95, 212, 0.18) 0%, transparent 55%)",
        }}
      />

      <div
        ref={tiltRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* Layer 1 — Deepest background: text shadow of the brand */}
        <div
          data-depth="0.3"
          className="absolute inset-0 flex items-center justify-center select-none"
          style={{
            transform: "translateZ(-220px) translateY(var(--scroll-y, 0))",
          }}
        >
          <span className="text-[clamp(5rem,16vw,14rem)] font-serif text-white/[0.045] font-medium tracking-tighter italic leading-none">
            aurumweave
          </span>
        </div>

        {/* Layer 2 — Soft light halo */}
        <div
          data-depth="0.6"
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(-120px) translateY(var(--scroll-y, 0))" }}
        >
          <div
            className="w-[70%] h-[60%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(244, 180, 90, 0.22) 0%, rgba(244, 107, 44, 0.08) 50%, transparent 70%)",
            }}
          />
        </div>

        {/* Layer 3 — The "product": a gold-filament necklace rendered in CSS */}
        <div
          data-depth="0.9"
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(0px) translateY(var(--scroll-y, 0))" }}
        >
          <div className="relative" style={{ width: "62%", maxWidth: 540 }}>
            {/* Drop shadow */}
            <div
              className="absolute inset-x-[10%] bottom-[-6%] h-10 rounded-[50%] blur-2xl"
              style={{ background: "rgba(0,0,0,0.55)" }}
            />
            {/* Necklace SVG — built inline so it renders instantly */}
            <svg
              viewBox="0 0 400 280"
              className="w-full h-auto drop-shadow-2xl"
              aria-label="A pendant necklace"
              role="img"
            >
              <defs>
                <linearGradient id="goldChain" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F8D588" />
                  <stop offset="40%" stopColor="#D99C3F" />
                  <stop offset="70%" stopColor="#F0C26C" />
                  <stop offset="100%" stopColor="#A66F20" />
                </linearGradient>
                <linearGradient id="goldPendant" x1="0" y1="0" x2="0.6" y2="1">
                  <stop offset="0%" stopColor="#FFE7A8" />
                  <stop offset="50%" stopColor="#E7B152" />
                  <stop offset="100%" stopColor="#8C5B18" />
                </linearGradient>
                <radialGradient id="stone" cx="0.35" cy="0.3" r="0.9">
                  <stop offset="0%" stopColor="#A7E8FF" />
                  <stop offset="40%" stopColor="#3B9BD1" />
                  <stop offset="100%" stopColor="#0D3A60" />
                </radialGradient>
                <filter id="gleam" x="-0.1" y="-0.1" width="1.2" height="1.2">
                  <feGaussianBlur stdDeviation="1.4" />
                </filter>
              </defs>

              {/* Chain curve */}
              <path
                d="M 40 70 C 120 160, 280 160, 360 70"
                fill="none"
                stroke="url(#goldChain)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 40 70 C 120 160, 280 160, 360 70"
                fill="none"
                stroke="#FFE7A8"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.7"
                filter="url(#gleam)"
              />

              {/* Pendant drop */}
              <path
                d="M 195 160 L 205 160 L 210 175 L 200 230 L 190 175 Z"
                fill="url(#goldPendant)"
                stroke="#8C5B18"
                strokeWidth="0.6"
              />

              {/* Pendant body — hexagonal stone */}
              <polygon
                points="170,175 230,175 250,215 200,260 150,215"
                fill="url(#stone)"
                stroke="#0D3A60"
                strokeWidth="1"
              />
              {/* Stone highlight */}
              <polygon
                points="170,175 200,175 180,205"
                fill="#D2F2FF"
                opacity="0.55"
              />
              {/* Stone facets */}
              <line x1="200" y1="175" x2="200" y2="260" stroke="#0D3A60" strokeWidth="0.6" opacity="0.7" />
              <line x1="170" y1="175" x2="250" y2="215" stroke="#0D3A60" strokeWidth="0.4" opacity="0.5" />
              <line x1="230" y1="175" x2="150" y2="215" stroke="#0D3A60" strokeWidth="0.4" opacity="0.5" />

              {/* Clasp dots */}
              <circle cx="40" cy="70" r="4" fill="url(#goldPendant)" />
              <circle cx="360" cy="70" r="4" fill="url(#goldPendant)" />
            </svg>
          </div>
        </div>

        {/* Layer 4 — foreground specks for parallax */}
        <div
          data-depth="1.3"
          className="absolute inset-0 pointer-events-none"
          style={{ transform: "translateZ(80px) translateY(var(--scroll-y, 0))" }}
        >
          {FOREGROUND_SPECKS.map((s, i) => (
            <span
              key={i}
              className="absolute block rounded-full"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                background:
                  "radial-gradient(circle, rgba(255,230,180,0.9) 0%, rgba(255,200,120,0.3) 60%, transparent 75%)",
                opacity: s.o,
                filter: "blur(0.4px)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Top-left brand mark + right price */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
        <span className="mono text-[9.5px] uppercase tracking-[0.22em] text-white/50">
          Aurumweave · Kanti Collection
        </span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10 pointer-events-none">
        <span className="mono text-[10.5px] text-white/80 px-2 py-1 rounded bg-white/5 backdrop-blur border border-white/10">
          ₹ 1,48,500
        </span>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <span className="mono text-[9.5px] uppercase tracking-[0.22em] text-white/45">
          Move cursor · tilt phone · scroll
        </span>
        <span className="mono text-[9.5px] uppercase tracking-[0.22em] text-white/45">
          18kt · 4.2g · VVS blue topaz
        </span>
      </div>
    </div>
  );
}

const FOREGROUND_SPECKS = [
  { x: 12, y: 18, size: 3, o: 0.7 },
  { x: 82, y: 26, size: 2, o: 0.55 },
  { x: 35, y: 78, size: 2, o: 0.5 },
  { x: 58, y: 12, size: 3, o: 0.65 },
  { x: 90, y: 72, size: 2, o: 0.45 },
  { x: 6, y: 55, size: 2, o: 0.4 },
  { x: 45, y: 40, size: 1.5, o: 0.35 },
  { x: 72, y: 88, size: 2, o: 0.5 },
];

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type LoadState =
  | "idle"
  | "requesting-camera"
  | "loading-model"
  | "ready"
  | "running"
  | "error";

type Backend = "webgpu" | "wasm";

// Point-cloud grid dimensions. 128 × 96 = 12,288 ≈ the 12k voxels claim.
const GRID_W = 128;
const GRID_H = 96;

export default function DepthDemo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const glCanvasRef = useRef<HTMLCanvasElement | null>(null);
  // Offscreen canvas used to grab video frames as ImageData for inference.
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    points: THREE.Points;
    geometry: THREE.BufferGeometry;
    positions: Float32Array;
    colors: Float32Array;
  } | null>(null);

  const pipelineRef = useRef<any>(null);
  const loopRef = useRef<{ raf: number | null; running: boolean }>({
    raf: null,
    running: false,
  });

  const [status, setStatus] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [backend, setBackend] = useState<Backend>("wasm");
  const [modelLoadedAt, setModelLoadedAt] = useState<number | null>(null);

  // -----------------------------------------------------------------
  // Three.js scene lifecycle
  // -----------------------------------------------------------------
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 1.9);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 4;
    controls.rotateSpeed = 0.5;

    // Initial positions = flat plane. Depth overwrites z each frame.
    const positions = new Float32Array(GRID_W * GRID_H * 3);
    const colors = new Float32Array(GRID_W * GRID_H * 3);
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const i = (y * GRID_W + x) * 3;
        positions[i] = (x / (GRID_W - 1)) * 2 - 1; // x: -1 → 1
        positions[i + 1] = 1 - (y / (GRID_H - 1)) * 1.5; // y: ≈ 1 → -0.5 (aspect 4:3)
        positions[i + 2] = 0;
        colors[i] = 0.45;
        colors[i + 1] = 0.72;
        colors[i + 2] = 1.0;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.014,
      vertexColors: true,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    sceneRef.current = { renderer, scene, camera, controls, points, geometry, positions, colors };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const obs = new ResizeObserver(resize);
    obs.observe(canvas);

    // Passive render loop — runs even before inference starts so the plane is visible.
    let raf = 0;
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // -----------------------------------------------------------------
  // Start sequence
  // -----------------------------------------------------------------
  const start = useCallback(async () => {
    setError(null);
    try {
      // 1. Camera permission
      setStatus("requesting-camera");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // 2. Load model (lazy — avoids bundling ~40MB into first paint)
      setStatus("loading-model");
      const t0 = performance.now();
      const tfjs = await import("@huggingface/transformers");
      const device: Backend = "gpu" in navigator ? "webgpu" : "wasm";
      setBackend(device);
      pipelineRef.current = await tfjs.pipeline(
        "depth-estimation",
        "onnx-community/depth-anything-v2-small",
        { device, dtype: "fp32" } as Parameters<typeof tfjs.pipeline>[2]
      );
      setModelLoadedAt(Math.round(performance.now() - t0));

      // 3. Kick off inference loop
      setStatus("running");
      loopRef.current.running = true;
      runInferenceLoop();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || String(e));
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    loopRef.current.running = false;
    if (loopRef.current.raf) cancelAnimationFrame(loopRef.current.raf);
    loopRef.current.raf = null;
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setStatus("ready");
  }, []);

  // -----------------------------------------------------------------
  // Inference loop
  // -----------------------------------------------------------------
  const runInferenceLoop = useCallback(() => {
    const video = videoRef.current;
    const sceneBits = sceneRef.current;
    const pipe = pipelineRef.current;
    if (!video || !sceneBits || !pipe) return;

    const captureCanvas = (() => {
      if (captureCanvasRef.current) return captureCanvasRef.current;
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 192;
      captureCanvasRef.current = c;
      return c;
    })();
    const captureCtx = captureCanvas.getContext("2d", { willReadFrequently: true });
    if (!captureCtx) return;

    // FPS tracking over 1s sliding window
    const frameTimes: number[] = [];

    const tick = async () => {
      if (!loopRef.current.running) return;
      const frameStart = performance.now();

      // Draw video frame to capture canvas
      if (video.readyState >= 2 && video.videoWidth > 0) {
        captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);

        try {
          // Inference
          const result = await pipe(captureCanvas);
          // result.predicted_depth is a tensor; result.depth is a RawImage
          const depthTensor = result.predicted_depth;
          const depthData = depthTensor.data as Float32Array;
          const dW = depthTensor.dims[depthTensor.dims.length - 1];
          const dH = depthTensor.dims[depthTensor.dims.length - 2];

          // Normalize depth to 0..1
          let min = Infinity;
          let max = -Infinity;
          for (let i = 0; i < depthData.length; i++) {
            const v = depthData[i];
            if (v < min) min = v;
            if (v > max) max = v;
          }
          const range = max - min || 1;

          const positions = sceneBits.positions;
          const colors = sceneBits.colors;
          for (let y = 0; y < GRID_H; y++) {
            const dy = Math.floor((y / GRID_H) * dH);
            for (let x = 0; x < GRID_W; x++) {
              const dx = Math.floor((x / GRID_W) * dW);
              const d = (depthData[dy * dW + dx] - min) / range;
              const i = (y * GRID_W + x) * 3;
              // Larger depth → closer to camera in DA outputs; push toward viewer
              positions[i + 2] = d * 0.9;
              // Color ramp: far = cool blue, near = warm orange
              colors[i] = 0.25 + d * 0.75;       // R
              colors[i + 1] = 0.5 + d * 0.2;     // G
              colors[i + 2] = 0.9 - d * 0.6;     // B
            }
          }
          (sceneBits.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
          (sceneBits.geometry.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;

          // FPS
          const now = performance.now();
          frameTimes.push(now);
          while (frameTimes.length > 0 && now - frameTimes[0] > 1000) frameTimes.shift();
          setFps(frameTimes.length);
        } catch (err) {
          console.error("inference error", err);
        }
      }

      // Next frame
      const elapsed = performance.now() - frameStart;
      const minFrameMs = 16; // don't hog the main thread harder than 60fps
      const wait = Math.max(0, minFrameMs - elapsed);
      setTimeout(() => {
        loopRef.current.raf = requestAnimationFrame(tick);
      }, wait);
    };

    tick();
  }, []);

  useEffect(() => () => stop(), [stop]);

  return (
    <div className="relative w-full rounded-2xl border border-[var(--color-line)] bg-[#0A0A0A] overflow-hidden">
      {/* 3D scene canvas */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10]">
        <canvas ref={glCanvasRef} className="absolute inset-0 w-full h-full" />
        {/* Hidden video — drawn onto capture canvas each frame */}
        <video ref={videoRef} playsInline muted className="hidden" />

        {/* Overlay: status/FPS */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <StatusPill status={status} />
          {status === "running" && (
            <span className="mono text-[10.5px] px-2 py-1 rounded bg-white/10 text-white/90 backdrop-blur">
              {fps} fps
            </span>
          )}
          {status === "running" && (
            <span className="mono text-[10.5px] px-2 py-1 rounded bg-white/10 text-white/90 backdrop-blur">
              {backend}
            </span>
          )}
          {status === "running" && (
            <span className="mono text-[10.5px] px-2 py-1 rounded bg-white/10 text-white/90 backdrop-blur">
              {GRID_W * GRID_H} pts
            </span>
          )}
        </div>

        {/* Overlay: control */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {status === "running" ? (
            <button
              onClick={stop}
              className="mono text-[11px] uppercase tracking-wider px-3 py-2 rounded bg-white text-black font-medium hover:bg-[var(--color-primary-orange)] hover:text-white transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={start}
              disabled={status === "loading-model" || status === "requesting-camera"}
              className="mono text-[11px] uppercase tracking-wider px-3 py-2 rounded bg-[var(--color-primary-orange)] text-white font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {status === "idle" || status === "error" || status === "ready"
                ? "Start camera"
                : status === "requesting-camera"
                ? "Requesting…"
                : "Loading model…"}
            </button>
          )}
        </div>

        {/* Overlay: idle instructions */}
        {status === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
            <div className="text-center max-w-md">
              <p className="mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">
                Depth Anything V2 · in your browser
              </p>
              <h3 className="text-white text-[clamp(1.25rem,2.5vw,1.75rem)] font-medium tracking-tight mb-3 leading-[1.2]">
                Turn your webcam into a 3D point cloud.
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                No backend. No upload. The ML model loads once (~80 MB),
                runs locally, and re-projects each camera frame as a {GRID_W * GRID_H}-point
                depth field you can orbit.
              </p>
            </div>
          </div>
        )}

        {/* Overlay: error */}
        {status === "error" && error && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="max-w-md bg-red-500/10 border border-red-500/30 rounded-lg p-5 backdrop-blur">
              <p className="mono text-[10px] uppercase tracking-wider text-red-300 mb-2">Error</p>
              <p className="text-white text-sm leading-relaxed mb-3">{error}</p>
              <button
                onClick={start}
                className="mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded bg-white text-black font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info strip */}
      <div className="px-5 md:px-6 py-4 border-t border-white/10 bg-black/40 flex flex-wrap items-center gap-x-6 gap-y-2">
        <InfoChip label="Model">Depth-Anything-V2-Small · 24.8M params</InfoChip>
        <InfoChip label="Runtime">Transformers.js · ONNX · WebGPU/WASM</InfoChip>
        <InfoChip label="Points">{(GRID_W * GRID_H).toLocaleString()} ({GRID_W}×{GRID_H})</InfoChip>
        {modelLoadedAt !== null && (
          <InfoChip label="Model load">{(modelLoadedAt / 1000).toFixed(1)}s</InfoChip>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: LoadState }) {
  const cfg: Record<LoadState, { label: string; color: string; dot: string }> = {
    idle: { label: "Idle", color: "text-white/60", dot: "bg-white/40" },
    "requesting-camera": { label: "Camera", color: "text-amber-200", dot: "bg-amber-400" },
    "loading-model": { label: "Loading model", color: "text-blue-200", dot: "bg-blue-400" },
    ready: { label: "Ready", color: "text-white/80", dot: "bg-white/60" },
    running: { label: "Live", color: "text-emerald-300", dot: "bg-emerald-400" },
    error: { label: "Error", color: "text-red-300", dot: "bg-red-400" },
  };
  const c = cfg[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded mono text-[10.5px] uppercase tracking-wider bg-white/10 backdrop-blur ${c.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === "running" ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}

function InfoChip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="mono text-[9.5px] uppercase tracking-[0.16em] text-white/40">{label}</span>
      <span className="mono text-[11px] text-white/80">{children}</span>
    </div>
  );
}

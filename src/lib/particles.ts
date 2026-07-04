// FABLE — Particle Field (Canvas 2D)
//
// A single persistent engine. It reads its state each frame from the
// atmosphere CSS variables on documentElement (density, hue, camera, etc.)
// so the World feels continuous while route changes shift its mood.
//
// Architected so a WebGL/Three.js implementation can replace this later
// without touching consumers: the public API is start/stop/setCursor/dispose.

import { CITIZENS } from "@/data/citizens";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;      // base alpha
  phase: number;  // for shimmer
  hue: number;
};

type Presence = {
  id: string;
  hue: number;
  intensity: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  ties: string[];
  next: number; // when to pick a new target
};

type FieldOptions = {
  reducedMotion: boolean;
};

export class ParticleField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private presences: Presence[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf = 0;
  private running = false;
  private cursor = { x: -9999, y: -9999, active: false };
  private t0 = 0;
  private lastT = 0;
  private reducedMotion = false;
  private baseCount = 220;
  private root: HTMLElement;

  constructor(canvas: HTMLCanvasElement, opts: FieldOptions) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.reducedMotion = opts.reducedMotion;
    this.root = document.documentElement;
    this.resize();
    this.seed();
  }

  private seed() {
    // Cap on small screens for perf. Base count is scaled each frame by
    // --field-density (which can climb above 1). We seed to the maximum ever
    // needed so tick can safely slice a subset.
    const area = Math.max(1, this.w * this.h);
    this.baseCount = Math.min(200, Math.max(70, Math.round(area / 10000)));
    const maxCount = Math.ceil(this.baseCount * 1.5);
    this.particles = new Array(maxCount).fill(0).map(() => this.newParticle());

    // Citizen presences — the brighter, deliberate movers.
    this.presences = CITIZENS.map((c) => ({
      id: c.id,
      hue: c.hue,
      intensity: c.intensity,
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      tx: Math.random() * this.w,
      ty: Math.random() * this.h,
      ties: c.ties,
      next: 0,
    }));
  }

  private newParticle(): Particle {
    return {
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      r: 0.4 + Math.random() * 1.6,
      a: 0.15 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      hue: 30 + Math.random() * 40,
    };
  }

  resize = () => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.particles.length === 0) this.seed();
  };

  setCursor(x: number, y: number, active: boolean) {
    this.cursor.x = x;
    this.cursor.y = y;
    this.cursor.active = active;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.t0 = performance.now();
    this.lastT = this.t0;
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.stop();
  }

  private readAtmosphere() {
    const cs = getComputedStyle(this.root);
    return {
      density: parseFloat(cs.getPropertyValue("--field-density")) || 1,
      hueShift: parseFloat(cs.getPropertyValue("--field-hue-shift")) || 0,
      brightness: parseFloat(cs.getPropertyValue("--field-brightness")) || 1,
      cameraScale: parseFloat(cs.getPropertyValue("--camera-scale")) || 1,
      shiftX: parseFloat(cs.getPropertyValue("--camera-shift-x")) || 0,
      shiftY: parseFloat(cs.getPropertyValue("--camera-shift-y")) || 0,
      bloom: parseFloat(cs.getPropertyValue("--dream-bloom")) || 0,
    };
  }

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(48, now - this.lastT); // clamp for tab-hidden bursts
    this.lastT = now;
    const T = (now - this.t0) / 1000;

    const atm = this.readAtmosphere();
    const rm = this.reducedMotion;
    const speedScale = rm ? 0.05 : 1;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // Camera transform (a subtle push/pull, not a real 3D camera)
    const cx = this.w / 2;
    const cy = this.h / 2;
    const s = atm.cameraScale;
    const ox = atm.shiftX * this.w;
    const oy = atm.shiftY * this.h;

    ctx.save();
    ctx.translate(cx + ox, cy + oy);
    ctx.scale(s, s);
    ctx.translate(-cx, -cy);

    // Ambient particles
    const density = Math.max(0, Math.min(1.5, atm.density));
    const visibleCount = Math.min(
      this.particles.length,
      Math.floor(this.baseCount * density),
    );
    for (let i = 0; i < visibleCount; i++) {
      const p = this.particles[i];
      // organic drift via layered sines
      const nx = Math.sin(T * 0.13 + p.phase) * 0.05;
      const ny = Math.cos(T * 0.11 + p.phase * 1.3) * 0.05;
      p.vx += nx * 0.02;
      p.vy += ny * 0.02;

      // gentle cursor attraction
      if (this.cursor.active) {
        const dx = this.cursor.x - p.x;
        const dy = this.cursor.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 40000) {
          const f = 0.00002 * (1 - d2 / 40000);
          p.vx += dx * f;
          p.vy += dy * f;
        }
      }

      // damping
      p.vx *= 0.985;
      p.vy *= 0.985;

      p.x += p.vx * dt * speedScale;
      p.y += p.vy * dt * speedScale;

      // wrap
      if (p.x < -10) p.x = this.w + 10;
      else if (p.x > this.w + 10) p.x = -10;
      if (p.y < -10) p.y = this.h + 10;
      else if (p.y > this.h + 10) p.y = -10;

      const shimmer = 0.7 + 0.3 * Math.sin(T * 1.3 + p.phase);
      const alpha = p.a * shimmer * atm.brightness;
      const hue = (p.hue + atm.hueShift + 360) % 360;
      const light = 62 + atm.bloom * 12;
      ctx.fillStyle = `oklch(${(light / 100).toFixed(2)} 0.09 ${hue.toFixed(1)} / ${alpha.toFixed(3)})`;
      const r = p.r * (1 + atm.bloom * 0.8);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Presences (citizens)
    const presenceScale = Math.max(0.3, Math.min(1.2, atm.density));
    for (let i = 0; i < this.presences.length; i++) {
      const pr = this.presences[i];
      if (i / this.presences.length > presenceScale) continue;

      // pick a new target periodically
      if (T > pr.next) {
        pr.tx = 0.1 * this.w + Math.random() * 0.8 * this.w;
        pr.ty = 0.1 * this.h + Math.random() * 0.8 * this.h;
        pr.next = T + 6 + Math.random() * 10;
      }

      const dx = pr.tx - pr.x;
      const dy = pr.ty - pr.y;
      pr.x += dx * 0.0008 * dt * speedScale;
      pr.y += dy * 0.0008 * dt * speedScale;

      const hue = (pr.hue + atm.hueShift + 360) % 360;
      const alpha = pr.intensity * atm.brightness * 0.85;

      // glow halo
      const rGlow = 22 + atm.bloom * 30;
      const grad = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, rGlow);
      grad.addColorStop(0, `oklch(0.82 0.15 ${hue.toFixed(1)} / ${(alpha * 0.55).toFixed(3)})`);
      grad.addColorStop(1, `oklch(0.82 0.15 ${hue.toFixed(1)} / 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, rGlow, 0, Math.PI * 2);
      ctx.fill();

      // core
      ctx.fillStyle = `oklch(0.9 0.14 ${hue.toFixed(1)} / ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, 1.6 + atm.bloom * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Connection lines between tied presences (very faint)
    ctx.lineWidth = 0.6;
    for (const pr of this.presences) {
      for (const tid of pr.ties) {
        const other = this.presences.find((p) => p.id === tid);
        if (!other) continue;
        const dx = other.x - pr.x;
        const dy = other.y - pr.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 320) continue;
        const a = (1 - d / 320) * 0.18 * atm.brightness;
        const hue = (pr.hue + atm.hueShift + 360) % 360;
        ctx.strokeStyle = `oklch(0.75 0.08 ${hue.toFixed(1)} / ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(pr.x, pr.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }

    ctx.restore();

    this.raf = requestAnimationFrame(this.tick);
  };
}

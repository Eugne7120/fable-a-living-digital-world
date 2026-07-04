// FABLE — Particle Field (Canvas 2D)
//
// Architecture: five depth layers rendered back-to-front.
//
//   0 Stars       — fixed positions, no camera movement, infinitely distant
//   1 Dust        — slow drift, 20% camera parallax, atmospheric haze
//   2 Ambient     — the main particle field, full camera movement
//   3 Presences   — citizen entities: breathing halos, intentional drift
//   4 Threads     — bond-strength connections that form and dissolve over time
//   5 Pulses      — spontaneous world-event ripples from citizens
//
// The engine reads its state each frame from atmosphere CSS variables so
// the world drifts continuously between district moods without any reset.

import { CITIZENS } from "@/data/citizens";

// ─── Types ───────────────────────────────────────────────────────────────────

type Star = {
  nx: number;  // normalized position 0-1 (remapped to viewport each frame)
  ny: number;
  r: number;
  a: number;
  phase: number;
  twinkleSpeed: number;
};

type Dust = {
  x: number; y: number;
  vx: number; vy: number;
  r: number; a: number;
  phase: number; hue: number;
};

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  a: number;
  phase: number;
  hue: number;
};

type Presence = {
  id: string;
  hue: number;
  intensity: number;
  x: number; y: number;
  tx: number; ty: number;
  ties: string[];
  next: number;
  breathPhase: number;  // unique breathing offset per citizen
  pulseEmit: number;    // when this citizen last emitted a pulse
};

type Bond = {
  a: string;  // citizen id
  b: string;
  strength: number;  // 0-1, grows when near, decays when far
};

type Pulse = {
  x: number; y: number;
  r: number;
  maxR: number;
  alpha: number;
  hue: number;
  born: number;
};

type FieldOptions = {
  reducedMotion: boolean;
};

// ─── Engine ──────────────────────────────────────────────────────────────────

export class ParticleField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private dust: Dust[] = [];
  private particles: Particle[] = [];
  private presences: Presence[] = [];
  private bonds: Bond[] = [];
  private pulses: Pulse[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf = 0;
  private running = false;
  private cursor = { x: -9999, y: -9999, active: false };
  private t0 = 0;
  private lastT = 0;
  private reducedMotion = false;
  private baseCount = 180;
  private root: HTMLElement;
  private nextWorldEvent = 0; // when to emit next world pulse

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
    const area = Math.max(1, this.w * this.h);
    this.baseCount = Math.min(180, Math.max(60, Math.round(area / 11000)));

    // Stars — many, tiny, barely move, drawn outside camera transform
    const starCount = Math.min(320, Math.max(120, Math.round(area / 8000)));
    this.stars = Array.from({ length: starCount }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      r: 0.15 + Math.random() * 0.45,
      a: 0.06 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.2 + Math.random() * 0.6,
    }));

    // Dust — slow haze, partial parallax
    const dustCount = Math.min(100, Math.max(30, Math.round(area / 20000)));
    this.dust = Array.from({ length: dustCount }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.025,
      vy: (Math.random() - 0.5) * 0.025,
      r: 0.8 + Math.random() * 1.4,
      a: 0.08 + Math.random() * 0.14,
      phase: Math.random() * Math.PI * 2,
      hue: 28 + Math.random() * 50,
    }));

    // Ambient particles
    const maxCount = Math.ceil(this.baseCount * 1.5);
    this.particles = Array.from({ length: maxCount }, () => this.newParticle());

    // Citizen presences
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
      breathPhase: Math.random() * Math.PI * 2,
      pulseEmit: 0,
    }));

    // Bonds — one per tie pair (deduplicated)
    const seen = new Set<string>();
    this.bonds = [];
    for (const c of CITIZENS) {
      for (const tid of c.ties) {
        const key = [c.id, tid].sort().join(":");
        if (!seen.has(key)) {
          seen.add(key);
          this.bonds.push({ a: c.id, b: tid, strength: 0 });
        }
      }
    }

    this.nextWorldEvent = 25 + Math.random() * 20;
  }

  private newParticle(): Particle {
    return {
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.07,
      vy: (Math.random() - 0.5) * 0.07,
      r: 0.4 + Math.random() * 1.5,
      a: 0.12 + Math.random() * 0.38,
      phase: Math.random() * Math.PI * 2,
      hue: 28 + Math.random() * 45,
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

  dispose() { this.stop(); }

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
    const dt = Math.min(48, now - this.lastT);
    this.lastT = now;
    const T = (now - this.t0) / 1000;

    const atm = this.readAtmosphere();
    const rm = this.reducedMotion;
    const speedScale = rm ? 0.04 : 1;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    const cx = this.w / 2;
    const cy = this.h / 2;
    const s = atm.cameraScale;
    const ox = atm.shiftX * this.w;
    const oy = atm.shiftY * this.h;

    // ── Layer 0: Stars (no camera transform — infinitely distant) ─────────
    for (const st of this.stars) {
      const x = st.nx * this.w;
      const y = st.ny * this.h;
      const twinkle = 0.65 + 0.35 * Math.sin(T * st.twinkleSpeed + st.phase);
      const alpha = st.a * twinkle * Math.min(1, atm.brightness * 0.8);
      const hue = (35 + atm.hueShift * 0.1 + 360) % 360; // stars barely shift
      ctx.fillStyle = `oklch(0.96 0.03 ${hue.toFixed(0)} / ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Layer 1: Dust (20% camera parallax — very distant) ───────────────
    ctx.save();
    const dustParallax = 0.2;
    ctx.translate(cx + ox * dustParallax, cy + oy * dustParallax);
    ctx.scale(1 + (s - 1) * dustParallax, 1 + (s - 1) * dustParallax);
    ctx.translate(-cx, -cy);

    const density = Math.max(0, Math.min(1.5, atm.density));
    for (const d of this.dust) {
      // gentle drift
      d.vx += Math.sin(T * 0.07 + d.phase) * 0.005;
      d.vy += Math.cos(T * 0.06 + d.phase * 1.2) * 0.005;
      d.vx *= 0.992;
      d.vy *= 0.992;
      d.x += d.vx * dt * speedScale;
      d.y += d.vy * dt * speedScale;
      if (d.x < -20) d.x = this.w + 20;
      else if (d.x > this.w + 20) d.x = -20;
      if (d.y < -20) d.y = this.h + 20;
      else if (d.y > this.h + 20) d.y = -20;

      const shimmer = 0.6 + 0.4 * Math.sin(T * 0.4 + d.phase);
      const alpha = d.a * shimmer * density * atm.brightness * 0.7;
      const hue = (d.hue + atm.hueShift * 0.4 + 360) % 360;
      ctx.fillStyle = `oklch(0.82 0.06 ${hue.toFixed(1)} / ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * (1 + atm.bloom * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ── Layer 2: Ambient particles (full camera transform) ────────────────
    ctx.save();
    ctx.translate(cx + ox, cy + oy);
    ctx.scale(s, s);
    ctx.translate(-cx, -cy);

    const visibleCount = Math.min(
      this.particles.length,
      Math.floor(this.baseCount * density),
    );
    for (let i = 0; i < visibleCount; i++) {
      const p = this.particles[i];
      const nx = Math.sin(T * 0.13 + p.phase) * 0.06;
      const ny = Math.cos(T * 0.11 + p.phase * 1.3) * 0.06;
      p.vx += nx * 0.018;
      p.vy += ny * 0.018;

      // Cursor turbulence — orbital rather than pure attraction
      if (this.cursor.active) {
        const dx = this.cursor.x - p.x;
        const dy = this.cursor.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 36000) {
          const d = Math.sqrt(d2);
          const f = 0.000025 * (1 - d2 / 36000);
          // Tangential component for orbital feel
          p.vx += (dx * f + dy * f * 0.4);
          p.vy += (dy * f - dx * f * 0.4);
        }
      }

      p.vx *= 0.984;
      p.vy *= 0.984;
      p.x += p.vx * dt * speedScale;
      p.y += p.vy * dt * speedScale;

      if (p.x < -10) p.x = this.w + 10;
      else if (p.x > this.w + 10) p.x = -10;
      if (p.y < -10) p.y = this.h + 10;
      else if (p.y > this.h + 10) p.y = -10;

      const shimmer = 0.68 + 0.32 * Math.sin(T * 1.1 + p.phase);
      const alpha = p.a * shimmer * atm.brightness;
      const hue = (p.hue + atm.hueShift + 360) % 360;
      const light = 60 + atm.bloom * 14;
      ctx.fillStyle = `oklch(${(light / 100).toFixed(2)} 0.09 ${hue.toFixed(1)} / ${alpha.toFixed(3)})`;
      const r = p.r * (1 + atm.bloom * 0.9);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Layer 3: Presences (citizens) ─────────────────────────────────────
    const presenceScale = Math.max(0.3, Math.min(1.2, density));

    // Spontaneous world event pulses
    if (!rm && T > this.nextWorldEvent && this.presences.length > 0) {
      const pr = this.presences[Math.floor(Math.random() * this.presences.length)];
      const maxR = 55 + Math.random() * 40;
      this.pulses.push({
        x: pr.x, y: pr.y,
        r: 0, maxR,
        alpha: 0.55,
        hue: (pr.hue + atm.hueShift + 360) % 360,
        born: T,
      });
      this.nextWorldEvent = T + 22 + Math.random() * 30;
    }

    for (let i = 0; i < this.presences.length; i++) {
      const pr = this.presences[i];
      if (i / this.presences.length > presenceScale) continue;

      // Intentional movement: 40% chance of drifting toward a tied citizen
      if (T > pr.next) {
        const tied = pr.ties.length > 0 && Math.random() < 0.40
          ? this.presences.find((p) => p.id === pr.ties[Math.floor(Math.random() * pr.ties.length)])
          : null;

        if (tied) {
          // Drift toward the tied citizen but not all the way — keep space
          const mx = tied.x + (Math.random() - 0.5) * this.w * 0.25;
          const my = tied.y + (Math.random() - 0.5) * this.h * 0.25;
          pr.tx = Math.max(this.w * 0.05, Math.min(this.w * 0.95, mx));
          pr.ty = Math.max(this.h * 0.05, Math.min(this.h * 0.95, my));
        } else {
          pr.tx = 0.08 * this.w + Math.random() * 0.84 * this.w;
          pr.ty = 0.08 * this.h + Math.random() * 0.84 * this.h;
        }
        pr.next = T + 7 + Math.random() * 12;
      }

      const dx = pr.tx - pr.x;
      const dy = pr.ty - pr.y;
      pr.x += dx * 0.00075 * dt * speedScale;
      pr.y += dy * 0.00075 * dt * speedScale;

      const hue = (pr.hue + atm.hueShift + 360) % 360;

      // Breathing: slow sine wave unique to each citizen
      const breath = 0.5 + 0.5 * Math.sin(T * 0.6 + pr.breathPhase);
      const breathSlow = 0.5 + 0.5 * Math.sin(T * 0.25 + pr.breathPhase * 1.4);

      const rGlow = (20 + atm.bloom * 28) * (0.82 + 0.18 * breath);
      const alpha = pr.intensity * atm.brightness * (0.72 + 0.13 * breathSlow);

      // Outer soft halo
      const rOuter = rGlow * 2.2;
      const gradOuter = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, rOuter);
      gradOuter.addColorStop(0, `oklch(0.78 0.12 ${hue.toFixed(1)} / ${(alpha * 0.12).toFixed(3)})`);
      gradOuter.addColorStop(1, `oklch(0.78 0.12 ${hue.toFixed(1)} / 0)`);
      ctx.fillStyle = gradOuter;
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, rOuter, 0, Math.PI * 2);
      ctx.fill();

      // Inner glow halo
      const grad = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, rGlow);
      grad.addColorStop(0, `oklch(0.84 0.16 ${hue.toFixed(1)} / ${(alpha * 0.62).toFixed(3)})`);
      grad.addColorStop(0.5, `oklch(0.80 0.13 ${hue.toFixed(1)} / ${(alpha * 0.28).toFixed(3)})`);
      grad.addColorStop(1, `oklch(0.78 0.12 ${hue.toFixed(1)} / 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, rGlow, 0, Math.PI * 2);
      ctx.fill();

      // Core point
      const rCore = 1.5 + atm.bloom * 1.4 + breath * 0.4;
      ctx.fillStyle = `oklch(0.94 0.14 ${hue.toFixed(1)} / ${(alpha * 1.15).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, rCore, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Layer 4: Bond threads (strength-based, form and dissolve) ─────────
    for (const bond of this.bonds) {
      const pa = this.presences.find((p) => p.id === bond.a);
      const pb = this.presences.find((p) => p.id === bond.b);
      if (!pa || !pb) continue;

      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const maxD = 340;

      // Bond grows when near, decays when far
      if (d < maxD) {
        bond.strength = Math.min(1, bond.strength + 0.0004 * dt);
      } else {
        bond.strength = Math.max(0, bond.strength - 0.00015 * dt);
      }

      if (bond.strength < 0.04 || d > maxD * 1.6) continue;

      const proximityFactor = d < maxD ? 1 - d / maxD : 0;
      const baseAlpha = bond.strength * proximityFactor * 0.22 * atm.brightness;
      const hue = (pa.hue + atm.hueShift + 360) % 360;

      // Animated thread — a subtle shimmer along the connection
      const threadAlpha = baseAlpha * (0.7 + 0.3 * Math.sin(T * 0.8 + bond.strength * 5));

      ctx.lineWidth = 0.5 + bond.strength * 0.4;
      ctx.strokeStyle = `oklch(0.78 0.09 ${hue.toFixed(1)} / ${threadAlpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }

    // ── Layer 5: World event pulses ───────────────────────────────────────
    if (!rm) {
      const expandSpeed = 28;
      for (let i = this.pulses.length - 1; i >= 0; i--) {
        const pulse = this.pulses[i];
        const age = T - pulse.born;
        const maxAge = pulse.maxR / expandSpeed;

        if (age > maxAge) {
          this.pulses.splice(i, 1);
          continue;
        }

        pulse.r = age * expandSpeed;
        const progress = pulse.r / pulse.maxR;
        const alpha = pulse.alpha * (1 - progress) * (1 - progress) * atm.brightness;

        ctx.lineWidth = 1 - progress * 0.7;
        ctx.strokeStyle = `oklch(0.82 0.12 ${pulse.hue.toFixed(1)} / ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();

    this.raf = requestAnimationFrame(this.tick);
  };
}

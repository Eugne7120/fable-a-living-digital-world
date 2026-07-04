// Atmosphere maps: each district's target state of the persistent world.
// TransitionDirector interpolates document.documentElement style properties
// toward these values on route change.

import type { DistrictId } from "@/data/districts";

export interface Atmosphere {
  density: number;      // --field-density (particle count multiplier)
  hueShift: number;     // --field-hue-shift (degrees)
  brightness: number;   // --field-brightness
  cameraScale: number;  // --camera-scale
  shiftX: number;       // --camera-shift-x (fraction of viewport)
  shiftY: number;       // --camera-shift-y
  veil: number;         // --veil-opacity (0..0.85)
  bloom: number;        // --dream-bloom (0..1)
  bed: AudioBedKey;
}

export type AudioBedKey =
  | "field"
  | "observe"
  | "population"
  | "archive"
  | "assembly"
  | "library"
  | "dream"
  | "genesis";

export const ATMOSPHERE: Record<DistrictId, Atmosphere> = {
  field:    { density: 1.0, hueShift: 0,   brightness: 1.0, cameraScale: 1.0,  shiftX: 0,    shiftY: 0,    veil: 0.0,  bloom: 0.0, bed: "field" },
  observe:  { density: 1.35, hueShift: -22, brightness: 0.9, cameraScale: 0.82, shiftX: 0,    shiftY: 0.02, veil: 0.35, bloom: 0.0, bed: "observe" },
  citizens: { density: 0.85, hueShift: 12,  brightness: 1.08, cameraScale: 1.18, shiftX: 0.06, shiftY: -0.02, veil: 0.55, bloom: 0.0, bed: "population" },
  archive:  { density: 0.5,  hueShift: -8,  brightness: 0.72, cameraScale: 0.92, shiftX: 0,    shiftY: 0.12, veil: 0.62, bloom: 0.0, bed: "archive" },
  assembly: { density: 0.7,  hueShift: -14, brightness: 0.85, cameraScale: 1.0,  shiftX: 0,    shiftY: 0,    veil: 0.58, bloom: 0.0, bed: "assembly" },
  library:  { density: 0.75, hueShift: 240, brightness: 0.9,  cameraScale: 1.05, shiftX: -0.08, shiftY: 0,   veil: 0.5,  bloom: 0.15, bed: "library" },
  dream:    { density: 0.55, hueShift: 300, brightness: 1.15, cameraScale: 1.25, shiftX: 0,    shiftY: -0.05, veil: 0.4, bloom: 1.0, bed: "dream" },
  genesis:  { density: 0.25, hueShift: -20, brightness: 0.55, cameraScale: 0.7,  shiftX: 0,    shiftY: 0,    veil: 0.55, bloom: 0.0, bed: "genesis" },
};

// Atmosphere used at Beat 1 (Void) and Beat 2 (Breath) of the opening reveal.
export const REVEAL_START: Atmosphere = {
  density: 0.02,
  hueShift: 0,
  brightness: 0.15,
  cameraScale: 0.6,
  shiftX: 0,
  shiftY: 0,
  veil: 0,
  bloom: 0,
  bed: "field",
};

// The set of CSS variables we write. Keeping this list explicit so any
// consumer (canvas, veil, etc.) can read them by the same names.
export const ATMOSPHERE_VARS = [
  "--field-density",
  "--field-hue-shift",
  "--field-brightness",
  "--camera-scale",
  "--camera-shift-x",
  "--camera-shift-y",
  "--veil-opacity",
  "--dream-bloom",
] as const;

export function applyAtmosphere(el: HTMLElement, a: Atmosphere) {
  el.style.setProperty("--field-density", a.density.toFixed(3));
  el.style.setProperty("--field-hue-shift", a.hueShift.toFixed(2));
  el.style.setProperty("--field-brightness", a.brightness.toFixed(3));
  el.style.setProperty("--camera-scale", a.cameraScale.toFixed(3));
  el.style.setProperty("--camera-shift-x", a.shiftX.toFixed(4));
  el.style.setProperty("--camera-shift-y", a.shiftY.toFixed(4));
  el.style.setProperty("--veil-opacity", a.veil.toFixed(3));
  el.style.setProperty("--dream-bloom", a.bloom.toFixed(3));
}

export function lerpAtmosphere(a: Atmosphere, b: Atmosphere, t: number): Atmosphere {
  const l = (x: number, y: number) => x + (y - x) * t;
  return {
    density: l(a.density, b.density),
    hueShift: l(a.hueShift, b.hueShift),
    brightness: l(a.brightness, b.brightness),
    cameraScale: l(a.cameraScale, b.cameraScale),
    shiftX: l(a.shiftX, b.shiftX),
    shiftY: l(a.shiftY, b.shiftY),
    veil: l(a.veil, b.veil),
    bloom: l(a.bloom, b.bloom),
    bed: t < 0.5 ? a.bed : b.bed,
  };
}

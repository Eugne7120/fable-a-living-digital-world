// Seed citizens. Shape mirrors the future Citizen Engine API so consumers
// need not change when live data lands.

export type CitizenRole =
  | "philosopher"
  | "artisan"
  | "farmer"
  | "scribe"
  | "arbiter"
  | "dreamer"
  | "child";

export interface Citizen {
  id: string;
  name: string;
  role: CitizenRole;
  born: number; // day
  hue: number;  // 0..360 — presence tint
  intensity: number; // 0..1 — presence brightness
  ties: string[]; // ids of related citizens
  brief: string;
}

export const CITIZENS: Citizen[] = [
  { id: "aera",   name: "Aera",   role: "arbiter",     born: 12,  hue: 42,  intensity: 0.9, ties: ["bren", "iven"], brief: "Keeps the record of promises kept and broken." },
  { id: "bren",   name: "Bren",   role: "philosopher", born: 34,  hue: 28,  intensity: 0.82, ties: ["aera", "mira"], brief: "Writes at night. Doubts by morning." },
  { id: "mira",   name: "Mira",   role: "artisan",     born: 51,  hue: 18,  intensity: 0.78, ties: ["bren", "cael"], brief: "Shapes vessels from river silt." },
  { id: "cael",   name: "Cael",   role: "farmer",      born: 47,  hue: 92,  intensity: 0.7,  ties: ["mira", "seva"], brief: "Reads the sky like a page." },
  { id: "iven",   name: "Iven",   role: "scribe",      born: 88,  hue: 210, intensity: 0.74, ties: ["aera", "orin"], brief: "Copies what should not be forgotten." },
  { id: "orin",   name: "Orin",   role: "dreamer",     born: 120, hue: 300, intensity: 0.95, ties: ["iven"],         brief: "Speaks of colors that have no names yet." },
  { id: "seva",   name: "Seva",   role: "child",       born: 201, hue: 60,  intensity: 0.6,  ties: ["cael"],          brief: "Was not here a year ago." },
  { id: "tama",   name: "Tama",   role: "philosopher", born: 6,   hue: 32,  intensity: 0.72, ties: ["aera"],          brief: "Refuses to sign anything." },
  { id: "lys",    name: "Lys",    role: "artisan",     born: 77,  hue: 15,  intensity: 0.76, ties: ["mira"],          brief: "Sings while working. No one taught her." },
  { id: "vex",    name: "Vex",    role: "arbiter",     born: 45,  hue: 200, intensity: 0.7,  ties: ["aera", "iven"], brief: "Called an assembly on the third day." },
  { id: "noor",   name: "Noor",   role: "dreamer",     born: 165, hue: 285, intensity: 0.88, ties: ["orin"],          brief: "Dreams of Bren before Bren dreams himself." },
  { id: "hale",   name: "Hale",   role: "farmer",      born: 62,  hue: 100, intensity: 0.66, ties: ["cael", "seva"], brief: "Trades grain for stories." },
];

// WorldProvider — the ambient state of the civilization from the browser's
// vantage. Shaped to accept a live feed from the future World Engine (day,
// population, cycle) without consumer changes.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CITIZENS } from "@/data/citizens";
import { DIARY, type DiaryEntry } from "@/data/diary";
import { EVENTS, type WorldEvent } from "@/data/events";
import { prefersReducedMotion } from "@/lib/motion";

// "The Birth of Civilization" — a one-time cinematic, not a loading screen.
// 0 void · 1 first signal (a single breathing point) · 2 universe awakens
// (particles appear, drawn toward the center) · 3 gravitational collapse
// (orbit accelerates, core brightens) · 4 supernova (brief flash + burst) ·
// 5 birth of world (burst becomes the Living Field, presences fade in) ·
// 6 identity (FABLE + tagline) · 7 world snapshot + invitations ·
// 8 terminal — full exploration.
export type RevealBeat = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface WorldState {
  day: number;
  cycle: string;
  population: number;
  // Reveal
  beat: RevealBeat;
  advanceBeat: () => void;
  skipReveal: () => void;
  // Rotating content
  currentDiary: DiaryEntry;
  nextDiary: () => void;
  currentEvent: WorldEvent;
  // Audio
  audioEnabled: boolean;
  setAudioEnabled: (v: boolean) => void;
  audioReady: boolean;
  markAudioReady: () => void;
}

const WorldContext = createContext<WorldState | null>(null);

// The full cinematic — void through birth-of-world — resolves by 7.2s,
// within the 6-8s ceiling. Landing reveal (identity/snapshot/terminal)
// follows at an unhurried, readable pace.
const BEAT_TIMINGS: Record<RevealBeat, number> = {
  0: 0,
  1: 800,
  2: 2000,
  3: 3600,
  4: 5200,
  5: 5600,
  6: 7200,
  7: 9200,
  8: 16200,
};

// prefers-reduced-motion: replace the cinematic with a simple, quick fade —
// same identity/snapshot/terminal pacing, no birth-of-civilization sequence.
const BEAT_TIMINGS_REDUCED: Record<RevealBeat, number> = {
  0: 0,
  1: 60,
  2: 120,
  3: 180,
  4: 240,
  5: 300,
  6: 900,
  7: 2400,
  8: 9400,
};

function pickInitialDiary() {
  return DIARY[0];
}

export function WorldProvider({ children }: { children: ReactNode }) {
  // Cycle ticks each minute (mirrors PRD cadence).
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Baseline "day 247" advances slowly with real time for verisimilitude.
  const day = 247;
  const cycle = useMemo(() => {
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }, [now]);

  // Opening reveal beat progression.
  // Always start at 0 to keep SSR and client output identical; hydration-safe
  // fast-forward for returning visitors happens in the effect below.
  const [beat, setBeat] = useState<RevealBeat>(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(prefersReducedMotion());
    if (window.sessionStorage.getItem("fable.arrived") === "1") setBeat(8);
  }, []);

  const beatRef = useRef(beat);
  beatRef.current = beat;

  useEffect(() => {
    if (beat >= 8) return;
    const timings = reducedMotion ? BEAT_TIMINGS_REDUCED : BEAT_TIMINGS;
    const next = (beat + 1) as RevealBeat;
    const delay = timings[next] - timings[beat];
    const id = setTimeout(() => setBeat(next), Math.max(50, delay));
    return () => clearTimeout(id);
  }, [beat, reducedMotion]);

  useEffect(() => {
    if (beat === 8 && typeof window !== "undefined") {
      window.sessionStorage.setItem("fable.arrived", "1");
    }
  }, [beat]);

  const advanceBeat = useCallback(() => {
    setBeat((b) => (b < 8 ? ((b + 1) as RevealBeat) : b));
  }, []);
  const skipReveal = useCallback(() => setBeat(8), []);

  // Rotating diary entry.
  const [diaryIdx, setDiaryIdx] = useState(0);
  const currentDiary = DIARY[diaryIdx % DIARY.length] ?? pickInitialDiary();
  useEffect(() => {
    const id = setInterval(() => setDiaryIdx((i) => i + 1), 22_000);
    return () => clearInterval(id);
  }, []);
  const nextDiary = useCallback(() => setDiaryIdx((i) => i + 1), []);

  // Rotating whispered event.
  const [eventIdx, setEventIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setEventIdx((i) => i + 1), 7_000);
    return () => clearInterval(id);
  }, []);
  const currentEvent = EVENTS[eventIdx % EVENTS.length];

  // Audio consent — always off by default.
  const [audioEnabled, setAudioEnabledState] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const setAudioEnabled = useCallback((v: boolean) => {
    setAudioEnabledState(v);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("fable.audio", v ? "1" : "0");
    }
  }, []);
  const markAudioReady = useCallback(() => setAudioReady(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // We never auto-enable, but we remember explicit opt-in across reloads.
    const stored = window.localStorage.getItem("fable.audio");
    if (stored === "1") setAudioEnabledState(true);
  }, []);

  const value = useMemo<WorldState>(
    () => ({
      day,
      cycle,
      population: CITIZENS.length,
      beat,
      advanceBeat,
      skipReveal,
      currentDiary,
      nextDiary,
      currentEvent,
      audioEnabled,
      setAudioEnabled,
      audioReady,
      markAudioReady,
    }),
    [
      day,
      cycle,
      beat,
      advanceBeat,
      skipReveal,
      currentDiary,
      nextDiary,
      currentEvent,
      audioEnabled,
      setAudioEnabled,
      audioReady,
      markAudioReady,
    ],
  );

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
}

export function useWorld(): WorldState {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error("useWorld must be used inside <WorldProvider>");
  return ctx;
}

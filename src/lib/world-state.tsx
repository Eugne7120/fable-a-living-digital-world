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

export type RevealBeat = 0 | 1 | 2 | 3 | 4 | 5;

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

const BEAT_TIMINGS: Record<RevealBeat, number> = {
  0: 0,
  1: 1500,
  2: 4000,
  3: 8000,
  4: 14000,
  5: 0, // terminal
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
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("fable.arrived") === "1") setBeat(5);
  }, []);

  const beatRef = useRef(beat);
  beatRef.current = beat;

  useEffect(() => {
    if (beat >= 5) return;
    const next = (beat + 1) as RevealBeat;
    const delay = BEAT_TIMINGS[next] - BEAT_TIMINGS[beat];
    const id = setTimeout(() => setBeat(next), Math.max(400, delay));
    return () => clearTimeout(id);
  }, [beat]);

  useEffect(() => {
    if (beat === 5 && typeof window !== "undefined") {
      window.sessionStorage.setItem("fable.arrived", "1");
    }
  }, [beat]);

  const advanceBeat = useCallback(() => {
    setBeat((b) => (b < 5 ? ((b + 1) as RevealBeat) : b));
  }, []);
  const skipReveal = useCallback(() => setBeat(5), []);

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

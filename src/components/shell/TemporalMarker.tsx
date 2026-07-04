import { useWorld } from "@/lib/world-state";

export function TemporalMarker() {
  const { day, cycle, beat } = useWorld();
  const visible = beat >= 4;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed left-5 top-5 z-30 font-mono-fable text-[10px] uppercase tracking-[0.28em] ceremony"
      style={{
        color: "var(--parchment-dim)",
        opacity: visible ? 0.7 : 0,
      }}
    >
      <span>day {String(day).padStart(3, "0")}</span>
      <span aria-hidden className="mx-2 opacity-40">·</span>
      <span>cycle {cycle}</span>
    </div>
  );
}

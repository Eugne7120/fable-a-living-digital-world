import { useWorld } from "@/lib/world-state";

export function TemporalMarker() {
  const { day, cycle, beat } = useWorld();
  const visible = beat >= 8;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed left-5 top-5 z-30 font-mono-fable text-[10px] uppercase tracking-[0.28em] ceremony"
      style={{
        color: "var(--parchment-dim)",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* The day marker breathes very slowly — a reminder the world is running */}
      <span
        style={{
          display: "inline-block",
          animation: visible ? "fable-shimmer 8s cubic-bezier(0.4, 0, 0.2, 1) infinite" : "none",
          opacity: 0.6,
        }}
      >
        day {String(day).padStart(3, "0")}
      </span>
      <span aria-hidden className="mx-2" style={{ opacity: 0.25 }}>
        ·
      </span>
      <span style={{ opacity: 0.5 }}>cycle {cycle}</span>
    </div>
  );
}

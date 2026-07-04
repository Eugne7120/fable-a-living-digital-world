import { useWorld } from "@/lib/world-state";

export function SoundToggle() {
  const { audioEnabled, setAudioEnabled, beat } = useWorld();
  // Appears from Beat 2 onward — ignorable, corner-tucked.
  if (beat < 2) return null;
  return (
    <button
      type="button"
      aria-label={audioEnabled ? "Silence the world" : "Listen to the world"}
      aria-pressed={audioEnabled}
      onClick={() => setAudioEnabled(!audioEnabled)}
      className="group fixed right-5 top-5 z-40 flex items-center gap-2 font-mono-fable text-[10px] uppercase tracking-[0.24em] drift"
      style={{ color: "var(--parchment-dim)" }}
    >
      <span aria-hidden className="text-base leading-none">
        {audioEnabled ? "◉" : "◐"}
      </span>
      <span className="hidden sm:inline" style={{ opacity: 0.7 }}>
        {audioEnabled ? "listening" : "sound"}
      </span>
    </button>
  );
}

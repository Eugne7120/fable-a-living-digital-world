import { useEffect, useState } from "react";

// Returns true after the component has mounted on the client. Use to gate
// browser-only UI (canvas, WebAudio, timers) so SSR output stays deterministic
// and hydration succeeds without mismatches.
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

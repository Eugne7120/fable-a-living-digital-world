
# FABLE — V1 Implementation Plan

FABLE is not a website with pages. It is **one persistent world** the visitor moves through. Routes exist for the browser's sake; the visitor experiences a single continuous atmosphere whose state, light, sound, and inhabitants shift as they travel between districts.

## Core Architectural Shift

**One world, many states — not many pages.**

A single top-level `WorldCanvas` and `WorldProvider` mount once at `__root.tsx` and **never unmount** for the duration of the session. Route changes do not remount the world; they only shift its state: camera position, particle density, ambient hue, audio bed, and which surface content is drawn over the living field.

Routes are preserved for SEO, deep-linking, `head()` metadata, and code-splitting of surface content — but the underlying world is continuous. No white flash, no scroll-to-top jolt, no route-shaped seam.

```text
┌─ __root.tsx (persistent) ─────────────────────────┐
│  WorldCanvas   ← mounts once, runs forever        │
│  AmbientAudio  ← mounts once, crossfades beds     │
│  TransitionDirector ← reads route, shifts tokens  │
│  <Outlet />    ← only the surface layer swaps     │
└───────────────────────────────────────────────────┘
```

## The Opening Reveal

No explanatory content until curiosity is earned.

- **Beat 1 — Void (0–1.5s):** pure black, no logo, cursor hidden.
- **Beat 2 — Breath (1.5–4s):** a single warm point of light, one slow biological pulse. A tiny `◐ sound` mark appears in the corner (ignorable).
- **Beat 3 — Field (4–8s):** particles bloom out of the dark, cursor returns and gently attracts nearby particles.
- **Beat 4 — Presence (8–14s):** a brighter citizen presence crosses with visible intent, a faint connection reaches for another, `day 247 · cycle 03:41` fades in.
- **Beat 5 — Voice (14s+):** a single diary line surfaces in editorial serif. Only then does the DistrictNav quietly appear at the lower edge.

The word "FABLE" appears nowhere in the first 14 seconds. Interaction can advance beats; the intended path is auto-advance. Returning visitors get a shortened reveal.

## Districts as States of One World

Not destinations — camera positions and atmospheric shifts of the same field.

| District | Route | Camera | Particles | Hue | Audio bed |
|---|---|---|---|---|---|
| Field (landing) | `/` | wide, centered | ambient drift, low density | deep ink + ember | low drone + wind |
| Observation | `/observe` | slow pull-back | denser, whole-world | cooler | + distant chorus |
| Population | `/citizens` | zoom to cluster | resolve into named orbs | warmer | + breath, footsteps |
| Archive | `/archive` | tilt down, dim | slowed, dust motes | sepia-cool | + paper, ink |
| Assembly | `/assembly` | center on mass | loose geometry | neutral gray-warm | + stone room tone |
| Culture | `/library` | drift sideways | soft glyphs | deep violet-ink | + resonant chime |
| Dream | `/dream` | blur, inverted depth | slow, glowing, sparse | bloomed violet-rose | dream chorus (replaces bed) |
| Genesis | `/genesis` | full pull-back to origin | collapse to center | near-black + single ember | silence + heartbeat |

Each shift is driven by atmosphere tokens (`--field-density`, `--field-hue-shift`, `--camera-scale`, `--veil-opacity`) interpolated over 1.4–2.4s with organic easing on the same persistent canvas.

## Transitions as Spatial Movement

Never a page transition. Always **movement through the world.**

- Selecting a district = camera drifts in a specific direction.
- Surface content rises through a **veil**: slow blur-in from below, world still faintly visible behind it.
- Back = return-drift to the Field at the same pace.
- No hard-edged modals. All overlays are translucent veils.

A single `TransitionDirector` in root subscribes to route changes and interpolates atmosphere tokens on `documentElement`. Framer Motion `AnimatePresence` handles surface content only — never the world.

## Ambient Audio

- **Off by default.** No autoplay. A small `◐ sound` mark sits in the corner from Beat 2.
- Once enabled: a low ambient bed (drone + noise wind) plays. District changes crossfade a second layer over ~2s. Cap ~-24 LUFS.
- **Persists across routes** — one WebAudio graph, never re-created. Muted state in `localStorage`.
- Procedurally synthesized (oscillators + filtered noise) — no external audio assets needed for v1; swap-in audio files trivially later.
- Honors `prefers-reduced-motion`, visible mute at all times.

## Delayed Explanation

No explanatory copy on the Field. No "About FABLE" block. In the first minute the only readable text is: one diary line, the temporal marker, one whispered event ticker line. An understanding surface exists — inside `/genesis`, reached the same way any district is reached.

## Design System

Tokens in `src/styles.css` via `@theme inline` + `:root`. Dark-only in v1.

- **Color:** ink `oklch(0.12 0.02 260)` bg, parchment `oklch(0.94 0.02 85)` fg, ember `oklch(0.72 0.14 55)` accent, muted signal set for citizen states.
- **Atmosphere tokens:** `--field-density`, `--field-hue-shift`, `--camera-scale`, `--veil-opacity`, `--audio-bed`.
- **Typography:** EB Garamond (diary/display), Inter (UI), Geist Mono (temporal/IDs) — loaded via `<link>` in root `head()`.
- **Motion:** `--dur-instant 120ms`, `--dur-calm 600ms`, `--dur-drift 1400ms`, `--dur-ceremony 2400ms`, `--ease-organic cubic-bezier(0.22, 0.61, 0.36, 1)`.

## File Structure

```text
src/
  routes/
    __root.tsx              persistent shell — WorldCanvas, AmbientAudio, TransitionDirector, DistrictNav
    index.tsx               Field — opening reveal + ambient state
    observe.tsx  citizens.tsx  archive.tsx  assembly.tsx  library.tsx  dream.tsx  genesis.tsx
  components/
    world/                  WorldCanvas, ParticleField, PresenceLayer, ConnectionLayer, CursorAura
    atmosphere/             TransitionDirector, DistrictAtmosphere, AmbientAudio, SoundToggle
    shell/                  DistrictNav, TemporalMarker, WorldStatusBar
    surface/                Veil, SurfaceReveal, RouteSurface
    reveal/                 OpeningSequence, DiaryLine, EventTicker
    type/                   DisplayText, DiaryText, Signal, Mono
  lib/
    motion.ts               shared variants + easings
    world-state.ts          WorldProvider context (day, population, current bed, muted)
    atmosphere.ts           token maps per district
    particles.ts            2D field engine
  data/
    citizens.ts  diary.ts  events.ts  genesis.ts   seed JSON shaped like future API
```

## Technical Direction

- **TanStack Start** file-based routes, unchanged.
- **World persistence:** `WorldCanvas` and `AmbientAudio` render in `__root.tsx` alongside `<Outlet />` and remain mounted across route changes. `TransitionDirector` uses `useRouterState` and animates tokens on `document.documentElement`.
- **Animation:** Canvas 2D for the field (60fps target, 30fps floor on low-power, near-static under `prefers-reduced-motion`); Framer Motion for surface content only. Architected so `ParticleField` can swap to WebGL later without changing consumers.
- **Audio:** Web Audio API, off by default, persistent graph, crossfaded beds.
- **State:** React context now, shaped to swap to Zustand + SWR when live data arrives.
- **Data:** seed JSON in `src/data/` shaped like the eventual Citizen/World/Memory Engine APIs — no consumer refactors when live data lands.
- **Perf & a11y:** mobile particle cap, offscreen throttle, font preload, chunk splitting, `prefers-reduced-motion` respected everywhere, per-route `head()` metadata (root defaults replaced).

## Scope

- **Flagship:** the Field (landing) — full opening reveal, ambient world, diary surfacing, ticker, DistrictNav, sound toggle.
- **Scaffolded with atmosphere in place:** Observe, Citizens, Archive, Assembly, Library, Dream, Genesis — each with its unique atmosphere shift wired, a Veil surface, and copy in FABLE's voice (never "coming soon").

## Non-Negotiables

No hero copy, CTAs, feature cards, pricing, testimonials, FAQ, "trusted by," or crypto sections. No hard modals. No white flashes between routes. No autoplaying audio. No branding in the first 14 seconds. No page-shaped transitions — only movement through the world.

## Execution Order

1. Tokens (color, type, motion, atmosphere) + font loading + root metadata
2. `WorldProvider` + persistent `__root.tsx` shell
3. `ParticleField` engine + `WorldCanvas` reading atmosphere tokens
4. `TransitionDirector` + per-district atmosphere maps
5. `OpeningSequence` + `DiaryLine` + `EventTicker` + `TemporalMarker`
6. `AmbientAudio` + `SoundToggle` (off by default)
7. `DistrictNav` + `SurfaceReveal` / `Veil`
8. Seven district route surfaces with voiced placeholders
9. Reduced-motion, mobile, audio-off passes
10. SEO + JSON-LD pass

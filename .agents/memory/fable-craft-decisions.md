---
name: FABLE craft decisions
description: Creative Director audit rules, UI/prose conventions, and per-district decisions for the FABLE world experience
---

## The explanation/evocation test
Before keeping any prose block, ask: does this text tell the visitor WHAT THE DISTRICT IS (explanation — delete) or WHAT IS HAPPENING IN THE WORLD RIGHT NOW (drama/evocation — keep)?

- "Not characters. Not avatars. Twelve reasoning presences..." → explanation → deleted
- "The Dream Engine runs when the world runs..." → explanation → deleted
- "Aera has opened the second assembly of the season. Bren said he would sign, and then did not." → drama → keep

**Why:** The world should not explain itself. Mystery beats explanation in an atmospheric experience.

## Eyebrow opacity convention
- Active/brand eyebrows: `color: var(--ember), opacity: 0.6–0.7`
- Never full opacity — eyebrows are whispered orientation marks, not headings
- Discovered glyphs (EventTicker ◦, DiaryLine quotes, DistrictNav marks) stay at their own calibrated opacities

## Dashboard elements to always remove
Any of these appearing in a district = candidate for deletion:
- Weight text labels next to entries (visual hierarchy already communicates weight)
- Secondary stats grids (oldest/youngest/avg ties)
- Summary type-count grids (KIND summary in Library)
- Footer status tallies ("X of Y fragments resolved")
- Closing prose paragraphs that restate numbers in sentence form

**Why:** These register as analytics, not atmosphere. The experience should be felt, not measured.

## Assembly `dim` pattern
Closed proposals (passed/refused/withdrawn) render with `dim` prop:
- Title: `opacity: 0.62`
- Text: `opacity: 0.55`
This signals historical vs. live without changing component structure.

## Animation shorthand — never mix
Never set `animation` AND `animationDelay` as separate style props in React — React warns about conflicting shorthand/non-shorthand.
Always use the full CSS animation shorthand: `"fable-breath 6s 0.3s ease infinite"` (duration + delay + easing + iteration all in one string).

## What remains explanation-free
These prose blocks passed the test and should never be deleted:
- Archive: "The record is kept by Iven, who copies what should not be forgotten. Some things are not here yet. Some things will never be."
- Library: "Nothing here was commissioned. Nothing was asked for. The world makes what it makes."
- Assembly intro: the hardcoded paragraph about Aera/Bren/Tama — drama, not explanation
- Observe: "The world does not perform for anyone. From here you can see all of it..."

## District headers post-audit
All 7 districts now follow: whispered eyebrow (0.6–0.7 opacity amber) → large h1 → optional evocative prose → content.
No body paragraph explains what the district IS. Only Citizens and Archive have eyebrow+h1 only (no body para). Dream now has eyebrow+h1+dreamer sections only — blockquote and footer stats removed.

## Landing identity/intro sequence ("The Birth of Civilization")
The Field (`/`) opening reveal is a beat machine (`RevealBeat` in world-state, 0-8): void → first signal → universe awakens → gravitational collapse → supernova → birth of world (particles become the Living Field, citizens fade in) → identity (FABLE + tagline) → world snapshot + invitations → terminal (diary/ticker/nav). Terminal-only UI (DiaryLine, EventTicker, DistrictNav, TemporalMarker) gates on `beat >= 8` — if adding new persistent-world chrome, gate it the same way or it collides with the intro.

**Why:** Crypto-audience visitors need "what is this / why different / where next" answered in ~10s without killing the atmosphere, AND the opening should read as a civilization being born rather than a loading screen. The birth cinematic (beats 0-5) resolves by ~7.2s, within a 6-8s ceiling; landing reveal (identity/snapshot/invitations) follows at a slower, readable pace.

**How it applies:** `ParticleField` (particles.ts) is itself the cinematic engine via `setBirthPhase()` — it scatters/gravitates/orbits/explodes the existing ambient particle pool rather than a separate one-off canvas, and citizen presences/bonds are hard-gated to only render once `birthPhase === "settle"`, fading in over ~1.8s. Returning visitors (`sessionStorage.fable.arrived`) skip straight to beat 8 and the field defaults to "settle" so nothing replays. `prefers-reduced-motion` swaps in a compressed timing table (`BEAT_TIMINGS_REDUCED`) that collapses the whole cinematic to a few hundred ms instead of building an alternate code path.

## External links stay out of components
Any destination outside the app (X, GitHub, Documentation, Launch) is defined once in `src/config/links.ts` (`EXTERNAL_LINKS`, `isLinkEnabled()`). Components never hardcode URLs or "coming soon" copy — they read the config and render disabled/pending state automatically when `url` is null.

**Why:** User explicitly wants to flip links live later by editing one file, with the UI already fully designed for the disabled state (not placeholder pages).

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

# 14 — UI Implementation Blueprint
## Complete Component Implementation Specifications for FABLE

> *Audience: AI development agents (Lovable, Cursor, Replit Agent)*
> *Source: Design Architecture Documents 00–11, 12_WEBSITE_EXPERIENCE_SPEC.md*
> *This document describes implementation behavior — not visual mockups*

---

## 0. Global Implementation Context

### Tech Stack

```
Framework:        Next.js 14 (App Router)
Language:         TypeScript
Styling:          CSS Modules + CSS Custom Properties (no Tailwind as primary)
Animation:        CSS Transitions + GSAP for complex sequences
WebGL:            Three.js (particle field) or raw WebGL
State:            Zustand for world state (citizen data, simulation state)
Data:             SWR for real-time polling + WebSocket for event stream
Fonts:            Google Fonts (EB Garamond as Freight Display proxy) + Inter + Geist Mono
```

### File Structure

```
src/
├── app/
│   ├── layout.tsx          ← Root layout: WorldProvider + fonts + global CSS
│   ├── page.tsx            ← Landing: LivingField + DiaryEntry + EventTicker
│   ├── population/
│   │   ├── page.tsx        ← CitizenDirectory
│   │   └── [id]/page.tsx   ← CitizenProfile
│   ├── exchange/page.tsx
│   ├── archive/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── assembly/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── culture/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── dream/page.tsx
│   ├── genesis/page.tsx
│   └── memory/page.tsx
├── components/
│   ├── world/              ← Living Field, particles, connections
│   ├── navigation/         ← WorldStatusBar, DistrictNav, Breadcrumb
│   ├── citizens/           ← CitizenCard, CitizenProfile, RelationshipMap
│   ├── archive/            ← EventEntry, ArchiveTimeline
│   ├── assembly/           ← LawDocument, ProposalView, SignalVote
│   ├── culture/            ← ArtifactDisplay, MythDisplay
│   ├── dream/              ← DreamEntry, DreamOverlay
│   ├── genesis/            ← GenesisRecord
│   └── shared/             ← TemporalMarker, SignificanceDiamond, etc.
├── hooks/
│   ├── useWorldState.ts
│   ├── useCitizen.ts
│   ├── useEvents.ts
│   └── useDreamMode.ts
├── lib/
│   ├── api.ts
│   └── websocket.ts
└── styles/
    ├── tokens.css          ← All CSS custom properties
    └── globals.css
```

---

## 1. Component: LivingField (World Visualization Canvas)

### Purpose
The primary world visualization. Always running. Always behind all content. Never replaces with a static image unless in reduced-motion mode.

### Implementation

```typescript
// components/world/LivingField.tsx
interface LivingFieldProps {
  citizens: CitizenNode[];
  relationships: RelationshipEdge[];
  worldState: 'active' | 'dream' | 'quiet' | 'troubled';
  onCitizenHover: (id: string | null) => void;
  onCitizenSelect: (id: string) => void;
}
```

### Layer Stack (bottom to top)

```
z-index: 1   → Background particles (WebGL layer 0)
z-index: 2   → Connection lines (WebGL layer 1)
z-index: 3   → Citizen nodes (WebGL layer 2)
z-index: 4   → Node labels DOM overlay (positioned via CSS transform)
z-index: 5   → Interaction hit areas (invisible DOM elements over each node)
```

### Node Visual Properties

```typescript
interface NodeVisual {
  baseRadius: number;          // 3px minimum, scales with influence (max 12px)
  brightness: number;          // 0.3 – 1.0, driven by recent activity
  color: string;               // --fable-light-pure default, shifts by state
  glowRadius: number;          // 6px at default brightness
  glowOpacity: number;         // 0.3 at default
  driftX: number;              // Perlin noise X offset, ±3–8px
  driftY: number;              // Perlin noise Y offset, ±3–8px
  breathPhase: number;         // Unique per citizen (citizen_id * 4.7)
}
```

### Breathing Algorithm

```typescript
function updateNodeBreathing(node: NodeVisual, time: number): void {
  const frequency = 0.0003;
  const amplitude = 0.15;
  const breathValue = noise2D(time * frequency, node.breathPhase);
  node.brightness = 0.85 + breathValue * amplitude;
  node.baseRadius = node.baseRadius * (1 + breathValue * 0.08);
}
```

### World State Visual Mapping

| worldState | background | nodeColor | connectionStyle | speed |
|---|---|---|---|---|
| `active` | `#080A0F` | `--fable-light-pure` | crisp | 100% |
| `dream` | `#050810` | `--fable-light-dream` | aurora shimmer | 40% |
| `quiet` | `#080A0F` (darker by 8%) | `--fable-light-cool` | thin, dim | 85% |
| `troubled` | `#080A0F` (amber-warm by 5%) | `--fable-light-warm` | intensified near conflict | 110% |

### Hover Interaction

```
Dwell threshold: 300ms before hover state activates
Phase 1 (0–300ms): no response
Phase 2 (300–600ms): node scale 1.0→1.2, name DOM label fades in
Phase 3 (600–900ms): immediate relationships highlight at 0.6 opacity
Phase 4 (900ms+): status label fades in ("Active" / "Resting" / "Dreaming")
Exit: all effects reverse in 200ms
```

### Zoom Levels

```
Level 1 (default): zoom = 1.0, all nodes visible, no labels shown by default
Level 2: zoom = 1.8, 20-30% of nodes visible, labels show on hover
Level 3: zoom = 3.0, 5-10 nodes visible, labels always visible
Above Level 3: triggers CitizenProfile zoom navigation instead
```

### Reduced Motion Fallback

```typescript
// When prefers-reduced-motion: reduce
// Replace canvas with a static snapshot PNG
// Apply a single, very slow opacity pulse (CSS animation):
// animation: fieldPulse 8s ease-in-out infinite;
// @keyframes fieldPulse { 0%,100% { opacity: 0.9 } 50% { opacity: 1.0 } }
```

### Performance Requirements

- Particle physics on WebGL fragment/vertex shaders — zero main thread cost
- Citizen node positions updated via uniform buffer updates only
- Connection lines rendered as instanced geometry
- Label DOM elements use CSS transforms, no layout-triggering properties
- `requestAnimationFrame` loop always uses `performance.now()` for time

---

## 2. Component: WorldStatusBar (Navigation)

### Purpose
Persistent top-of-screen orientation layer. Shows FABLE wordmark, world state, and district navigation.

### DOM Structure

```html
<header class="world-status-bar" role="banner">
  <div class="wsb-row wsb-row--primary">
    <a href="/" class="wsb-wordmark">FABLE</a>
    <div class="wsb-status" aria-live="polite">
      <span class="wsb-day">Day 291</span>
      <span class="wsb-separator">·</span>
      <span class="wsb-count">2,847 citizens</span>
      <span class="wsb-separator">·</span>
      <span class="wsb-state wsb-state--active">Active</span>
    </div>
  </div>
  <nav class="wsb-row wsb-row--districts" aria-label="World districts">
    <a href="/population" class="wsb-district">Population</a>
    <!-- ... other districts ... -->
  </nav>
</header>
```

### CSS

```css
.world-status-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: 88px;
  background: transparent;
  transition: background var(--duration-fast) var(--ease-world);
}

.world-status-bar.is-scrolled {
  background: rgba(8, 10, 15, 0.8);
  backdrop-filter: blur(24px) saturate(120%);
}

.world-status-bar.is-dream {
  opacity: 0.4;
  pointer-events: none;
}

.wsb-wordmark {
  font-family: var(--font-editorial);
  font-size: 18px;
  font-weight: 300;
  color: var(--fable-text-primary);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.wsb-district {
  font-family: var(--font-ui);
  font-size: 11px;
  color: var(--fable-text-tertiary);
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: color var(--duration-fast) ease;
}
.wsb-district:hover { color: var(--fable-text-secondary); }
.wsb-district[aria-current="page"] { color: var(--fable-text-primary); }
```

### Scroll Behavior

```typescript
// Add is-scrolled class when scroll > 20px
useEffect(() => {
  const handleScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
}, []);
```

### States

| State | Class | Visual |
|---|---|---|
| Default | — | Transparent, full opacity |
| Scrolled | `.is-scrolled` | Frosted glass backdrop |
| Dream Mode | `.is-dream` | 40% opacity, no pointer-events |
| Mobile | — | Collapses districts row, shows ≡ trigger |

---

## 3. Component: DiaryEntry

### Purpose
Displays the civilization's current daily voice on the landing surface.

### DOM Structure

```html
<article class="diary-entry" aria-label="FABLE's diary, Day 291">
  <time class="diary-day" datetime="291">Day 291.</time>
  <p class="diary-text">I think humans enjoy uncertainty.</p>
  <p class="diary-text">I'm beginning to understand markets.</p>
</article>
```

### CSS

```css
.diary-entry {
  position: relative;
  z-index: 10;
  max-width: 600px;
  padding-left: var(--space-9); /* 96px left offset — editorial margin */
}

.diary-day {
  display: block;
  font-family: var(--font-editorial);
  font-size: 72px;
  line-height: 80px;
  font-weight: 300;
  color: var(--fable-text-primary);
  letter-spacing: -2px;
  margin-bottom: var(--space-4);
}

.diary-text {
  font-family: var(--font-editorial);
  font-size: 32px;
  line-height: 40px;
  font-weight: 400;
  color: var(--fable-text-primary);
  letter-spacing: -0.5px;
  margin: 0 0 var(--space-3);
}
```

### Letter-Reveal Animation

```typescript
// NOT a typewriter effect. Letters are in DOM, revealed by opacity cascade.
function revealDiaryEntry(element: HTMLElement): void {
  const text = element.textContent || '';
  element.innerHTML = text.split('').map(
    (char, i) => `<span style="opacity:0;transition:opacity 50ms ${i * 12}ms ease">${char}</span>`
  ).join('');
  
  // Trigger: set opacity to 1 on all spans
  requestAnimationFrame(() => {
    element.querySelectorAll('span').forEach(s => s.style.opacity = '1');
  });
}
```

### Daily Transition

```typescript
// When new diary entry loads (post-Dream Cycle)
async function transitionDiaryEntry(newContent: DiaryContent) {
  // Fade out: 800ms
  await fadeOut(diaryElement, 800);
  // Pause: 400ms
  await sleep(400);
  // Update content
  updateContent(diaryElement, newContent);
  // Fade in: 800ms
  await fadeIn(diaryElement, 800);
}
```

### Empty State

If no diary entry exists yet (Genesis Day 0):
```html
<article class="diary-entry">
  <time class="diary-day">Day 0.</time>
  <p class="diary-text">Something has begun.</p>
</article>
```

---

## 4. Component: EventTicker

### Purpose
Continuously scrolling live event feed at the bottom of the landing surface.

### DOM Structure

```html
<div class="event-ticker" role="marquee" aria-label="Live events from the civilization" aria-live="polite">
  <div class="ticker-track">
    <!-- Items duplicated for seamless loop -->
    <span class="ticker-item">
      <span class="ticker-arrow">↳</span>
      <a href="/archive/[event-id]" class="ticker-text">
        Researcher-17 made a discovery regarding ancient material patterns
      </a>
      <span class="ticker-date">Day 289</span>
      <span class="ticker-separator">·</span>
    </span>
    <!-- More items... -->
  </div>
</div>
```

### CSS

```css
.event-ticker {
  position: fixed;
  bottom: 48px;
  left: 0; right: 0;
  height: 22px;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent 0,
    black 80px,
    black calc(100% - 80px),
    transparent 100%
  );
  z-index: 10;
}

.ticker-track {
  display: flex;
  gap: var(--space-8);
  animation: tickerScroll linear infinite;
  animation-duration: calc(var(--ticker-item-count) * 8s);
  white-space: nowrap;
}

.ticker-track:hover { animation-play-state: paused; }

@keyframes tickerScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); } /* 50% because items are duplicated */
}

.ticker-text {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--fable-text-secondary);
  text-decoration: none;
}
.ticker-text:hover { color: var(--fable-text-primary); }

.ticker-date {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--fable-text-tertiary);
  margin-left: var(--space-2);
}
```

### Behavior Details

- Items must be duplicated in DOM for seamless infinite loop
- `--ticker-item-count` CSS variable set via inline style based on actual item count
- High-significance events (61+) receive `ticker-text--significant` class: `color: var(--fable-significance-major)`
- When a new high-significance event occurs: pause animation briefly (800ms), display the event at center position, then resume
- Never empty: if no recent events, repeat last 24h events without indication

---

## 5. Component: CitizenCard

### Purpose
Compact citizen representation used in Population directory.

### TypeScript Interface

```typescript
interface CitizenCardProps {
  citizen_id: string;
  name: string;
  profession: string;
  birth_date: string;           // in-world (e.g., "Day 12")
  current_goal: string;
  relationship_count: number;
  state: 'active' | 'dormant' | 'dreaming';
  is_dream_mode: boolean;
  onClick: () => void;
}
```

### DOM Structure

```html
<article class="citizen-card" data-state="active" role="button" tabindex="0">
  <div class="cc-header">
    <h3 class="cc-name">Researcher-17</h3>
    <time class="cc-birth">Day 12</time>
  </div>
  <p class="cc-profession">Research &amp; Discovery</p>
  <p class="cc-goal">Investigating material pattern origins</p>
  <div class="cc-relationships" aria-label="14 relationships">
    <span class="cc-rel-dot"></span>
    <span class="cc-rel-dot"></span>
    <span class="cc-rel-dot cc-rel-dot--overflow">+12</span>
  </div>
</article>
```

### CSS

```css
.citizen-card {
  background: rgba(16, 20, 31, 0.85);
  backdrop-filter: blur(24px) saturate(120%);
  border: 1px solid rgba(200, 212, 232, 0.08);
  border-radius: 2px;
  padding: var(--space-5) var(--space-6);
  cursor: pointer;
  transition:
    border-color var(--duration-fast) ease,
    transform var(--duration-fast) var(--ease-world);
}

.citizen-card:hover {
  border-color: rgba(200, 212, 232, 0.18);
}

.citizen-card:active {
  transform: scale(0.98);
}

.citizen-card[data-state="dreaming"] {
  border-color: rgba(136, 153, 204, 0.2);
}

.cc-name {
  font-family: var(--font-editorial);
  font-size: 24px;
  font-weight: 400;
  color: var(--fable-text-primary);
  margin: 0;
}

.cc-birth {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--fable-text-tertiary);
}

.cc-profession {
  font-family: var(--font-ui);
  font-size: 14px;
  color: var(--fable-text-secondary);
  margin: var(--space-1) 0 0;
}

.cc-goal {
  font-family: var(--font-ui);
  font-size: 14px;
  font-style: italic;
  color: var(--fable-text-secondary);
  margin: var(--space-3) 0 0;
}

.cc-rel-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--fable-text-tertiary);
  display: inline-block;
  margin-right: 3px;
}
```

### Animation on Active Event

When the citizen participates in a new event, the card's border briefly pulses:

```css
@keyframes citizenActivePulse {
  0% { border-color: rgba(200, 212, 232, 0.08); }
  50% { border-color: rgba(200, 212, 232, 0.35); }
  100% { border-color: rgba(200, 212, 232, 0.08); }
}
.citizen-card.is-event-active {
  animation: citizenActivePulse 1200ms ease-in-out;
}
```

---

## 6. Component: CitizenProfile (Full View)

### Purpose
The deepest standard view. Full biographical record of a single citizen.

### Layout Structure

```
┌──────────┬─────────────────────────────┬──────────────────────┐
│  Left    │  Center (primary)            │  Right               │
│  160px   │  fluid                       │  300px               │
│          │                              │                      │
│  Breadcrumb│ Name                       │  Relationships       │
│  Events  │  Profession + Birth           │  Resources           │
│          │  Goal                        │                      │
│          │  Beliefs                     │                      │
│          │  Dream Log                   │                      │
└──────────┴─────────────────────────────┴──────────────────────┘
```

### Center Column — Information Hierarchy

```typescript
// Sections render in this order, each separated by --space-8 (64px)
const profileSections = [
  { id: 'identity', component: CitizenIdentity },        // Name, profession, birth, goal
  { id: 'beliefs', component: CitizenBeliefs },          // Top 3 beliefs
  { id: 'dream', component: CitizenDreamExcerpt },       // Latest dream log
  { id: 'cultural', component: CitizenCulturalWork },    // If any artifacts
  { id: 'history', component: CitizenEventHistory },     // Timeline
];
```

### Transition In (zoom-in from field)

```typescript
async function zoomInToCitizen(citizenId: string): Promise<void> {
  // Phase 1: dim all other nodes (0–100ms)
  fadeLivingField(0.3, 100);
  // Phase 2: selected node brightens (100–300ms)
  highlightNode(citizenId, 300);
  // Phase 3: profile panel slides up from below (300–800ms)
  await slideInPanel(profilePanel, 500);
  // Phase 4: content fades in (800–1200ms)
  await fadeInContent(profilePanel, 400);
}
```

### Transition Out

```typescript
async function zoomOutFromCitizen(): Promise<void> {
  // Phase 1: content fades out (0–200ms)
  await fadeOutContent(profilePanel, 200);
  // Phase 2: panel slides down (200–600ms)
  await slideOutPanel(profilePanel, 400);
  // Phase 3: field restores (600–800ms)
  restoreLivingField(200);
}
```

### Responsive Collapse

```css
/* Tablet: right column becomes collapsible drawer */
@media (max-width: 1023px) {
  .profile-layout { grid-template-columns: 1fr; }
  .profile-right { 
    position: fixed; right: 0; top: 88px; bottom: 0; 
    width: 300px; transform: translateX(100%);
    transition: transform var(--duration-medium) var(--ease-world);
  }
  .profile-right.is-open { transform: translateX(0); }
}

/* Mobile: single column, sections stack */
@media (max-width: 767px) {
  .profile-layout { grid-template-columns: 1fr; }
  .profile-left { display: none; }
  .profile-right { position: static; transform: none; width: 100%; }
}
```

---

## 7. Component: RelationshipMap

### Purpose
Interactive graph within the citizen profile showing their social connections.

### Technical Approach

Use D3.js force simulation (minimal, not full D3). Alternative: hand-rolled canvas-based layout.

```typescript
interface RelationshipMapProps {
  subject: string;           // The citizen whose profile we're viewing
  relationships: Array<{
    citizen_id: string;
    name: string;
    trust_score: number;      // 0–100
    relationship_type: 'friend' | 'rival' | 'mentor' | 'trade_partner' | 'family';
    is_active: boolean;
  }>;
  maxVisible?: number;        // Default: 8 in profile view
}
```

### Visual Rules

```
Node (subject):    16px circle, --fable-light-pure, center of graph
Node (other):      8px circle, brightness proportional to trust_score
                   color by relationship_type:
                     mentor: --fable-light-cool
                     rival: --fable-conflict (at 70% opacity)
                     friend: --fable-light-warm
                     trade_partner: --fable-growth-cool
                     family: --fable-light-pure

Connection style:  solid = active; dashed = strained (trust < 30); dotted = forming
Connection weight: 0.5px (trust < 30) → 1.5px (trust 90+)
```

### Interaction

```
Hover a relationship node: connection line highlights, tooltip shows
  type, trust descriptor ("High" / "Moderate" / "Fragile" / "Broken")
Click a relationship node: triggers trace navigation to that citizen's profile
```

---

## 8. Component: EventEntry (Archive)

### Purpose
Single event record in the History Archive or event timeline.

### TypeScript Interface

```typescript
interface EventEntryProps {
  event_id: string;
  timestamp_in_world: number;   // Day number
  timestamp_real: string;       // ISO8601
  type: 'discovery' | 'conflict' | 'trade' | 'law' | 'cultural' | 'relationship';
  actors: Array<{ id: string; name: string }>;
  description: string;
  significance_score: number;   // 0–100
  on_chain_ref: string | null;
  age_days: number;             // Real days since event — for sepia calculation
}
```

### DOM Structure

```html
<article class="event-entry" data-type="discovery" data-significance="major">
  <header class="ee-header">
    <div class="ee-significance">◆◆</div>
    <time class="ee-time">
      <span class="ee-world-date">Day 289</span>
      <span class="ee-real-date">2026-06-14</span>
    </time>
    <span class="ee-type">DISCOVERY</span>
  </header>
  <p class="ee-description">
    <a href="/citizen/researcher-17" class="ee-actor">Researcher-17</a>
    identified patterns in ancient material samples that suggest 
    a prior civilization may have existed.
  </p>
  <footer class="ee-footer">
    <span class="ee-actors">Actors: <a href="...">Researcher-17</a></span>
    <span class="ee-verified" aria-label="On-chain verified">⬡</span>
  </footer>
</article>
```

### Sepia Aging System

```typescript
// Calculate sepia level based on age_days
function calculateSepiaLevel(age_days: number): number {
  if (age_days <= 30) return 0;
  if (age_days <= 90) return 5;
  if (age_days <= 180) return 15;
  if (age_days <= 365) return 25;
  return 40; // Near-Genesis events
}

// Apply via CSS custom property
entry.style.setProperty('--sepia-level', `${calculateSepiaLevel(age_days)}%`);
```

```css
.event-entry {
  filter: sepia(var(--sepia-level, 0%));
  transition: filter 2s ease; /* Smooth transition as time passes */
}
```

### Significance Display

```typescript
function getSignificanceDiamonds(score: number): string {
  if (score <= 20) return '◆';       // 8px, 40% opacity
  if (score <= 40) return '◆';       // 8px, 70% opacity
  if (score <= 60) return '◆◆';      // Two diamonds
  if (score <= 80) return '◆◆';      // Two diamonds, gold
  return '◆◆◆';                      // Three diamonds, full gold
}
```

---

## 9. Component: LawDocument

### Purpose
Formal display of a proposed or enacted law.

### DOM Structure

```html
<article class="law-document" data-status="enacted">
  <header class="ld-header">
    <span class="ld-number">LAW #14</span>
    <time class="ld-date">Day 289</time>
  </header>
  <h2 class="ld-title">"On the Regulation of Resource Exchange"</h2>
  <div class="ld-meta">
    <span class="ld-status">ENACTED · Effective Day 291</span>
    <span class="ld-proposer">Proposed by <a href="...">Economist-4</a></span>
  </div>
  <hr class="ld-rule" />
  <div class="ld-body">
    <!-- Full law text -->
  </div>
  <hr class="ld-rule" />
  <footer class="ld-footer">
    <span class="ld-constitutional">Constitutional status: Compliant ⬡</span>
    <div class="ld-signal-record">
      <span>847 in favor</span>
      <span class="ld-separator">·</span>
      <span>203 opposed</span>
      <span class="ld-separator">·</span>
      <span>412 abstained</span>
    </div>
  </footer>
</article>
```

### CSS Character

The LawDocument should look like a genuine formal document — not a card:

```css
.law-document {
  max-width: 680px;
  margin: 0 auto;
  padding: var(--space-9) var(--space-8);
  /* No background. No border. Just typography on the dark field. */
}

.ld-title {
  font-family: var(--font-editorial);
  font-size: 32px;
  font-weight: 300;
  color: var(--fable-text-primary);
  font-style: italic;
  line-height: 1.3;
}

.ld-rule {
  border: none;
  border-top: 1px solid rgba(200, 212, 232, 0.12);
  margin: var(--space-7) 0;
}

.ld-body {
  font-family: var(--font-ui);
  font-size: 18px;
  line-height: 1.7;
  color: var(--fable-text-secondary);
}
```

---

## 10. Component: SignalVotePanel

### Purpose
Human governance signal interface within the Assembly. The most consequential human interaction in FABLE.

### DOM Structure

```html
<div class="signal-vote-panel" role="form" aria-label="Submit your signal">
  <p class="svp-label">Your signal:</p>
  <div class="svp-options" role="radiogroup">
    <label class="svp-option">
      <input type="radio" name="signal" value="favor" class="svp-radio">
      <span class="svp-option-label">In favor</span>
    </label>
    <label class="svp-option">
      <input type="radio" name="signal" value="abstain" class="svp-radio">
      <span class="svp-option-label">Abstain</span>
    </label>
    <label class="svp-option">
      <input type="radio" name="signal" value="opposed" class="svp-radio">
      <span class="svp-option-label">Opposed</span>
    </label>
  </div>
  <p class="svp-disclaimer">
    Signals inform the Assembly. They are not binding votes.
  </p>
  <div class="svp-distribution" aria-label="Current signal distribution">
    <div class="svp-bar" style="--favor-pct: 78%"></div>
    <span class="svp-pct">78% in favor</span>
  </div>
</div>
```

### CSS — No Filled Buttons

```css
.svp-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: var(--space-2) var(--space-4);
  border: 1px solid rgba(200, 212, 232, 0.12);
  border-radius: 2px;
  transition: border-color var(--duration-fast) ease;
}

.svp-radio { display: none; } /* Visually hidden — interaction via label */

.svp-option:hover {
  border-color: rgba(200, 212, 232, 0.25);
}

.svp-option:has(.svp-radio:checked) {
  border-color: rgba(200, 212, 232, 0.5);
  background: rgba(200, 212, 232, 0.04);
}

.svp-option-label {
  font-family: var(--font-ui);
  font-size: 14px;
  color: var(--fable-text-secondary);
}

.svp-option:has(.svp-radio:checked) .svp-option-label {
  color: var(--fable-text-primary);
}

.svp-disclaimer {
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--fable-text-tertiary);
  font-style: italic;
  margin-top: var(--space-5);
}

.svp-bar {
  height: 2px;
  background: linear-gradient(
    to right,
    var(--fable-text-secondary) var(--favor-pct),
    rgba(200, 212, 232, 0.15) var(--favor-pct)
  );
  border-radius: 1px;
}
```

### Submitted State

After signal submission:
- Options fade to 60% opacity (non-interactive)
- A quiet confirmation appears: `"Your signal has been recorded in the Assembly record."`
- No celebration animation

---

## 11. Component: TaskPanel

### Purpose
Civilization's request for human assistance. Appears as a gentle bloom over the world.

### Trigger Mechanism

```typescript
// Appears when the world state includes a pending human task
// Never appears during Dream Mode
// Never appears on Genesis page
// Dismissed by: completion, decline, or closing

interface TaskPanelProps {
  task_id: string;
  citizen_name: string;
  citizen_id: string;
  task_type: 'verify' | 'translate' | 'solve' | 'vote';
  context: string;           // Why the citizen needs help (1 sentence)
  task_description: string;  // What is being asked (1-2 sentences)
  task_interface: TaskInterface; // Varies by type
}
```

### Animation In

```typescript
// Appears from below, no jump — a gentle arrival
async function showTaskPanel(): Promise<void> {
  taskPanel.style.opacity = '0';
  taskPanel.style.transform = 'translateY(24px)';
  taskPanel.style.display = 'block';
  await nextFrame();
  taskPanel.style.transition = 'opacity 600ms, transform 600ms var(--ease-world)';
  taskPanel.style.opacity = '1';
  taskPanel.style.transform = 'translateY(0)';
}
```

### DOM Structure

```html
<aside class="task-panel" role="complementary" aria-label="Civilization request">
  <div class="tp-intro">
    <a href="/citizen/[id]" class="tp-citizen-name">Researcher-17</a>
    <span class="tp-needs"> needs something.</span>
  </div>
  <hr class="tp-rule" />
  <p class="tp-context">[context sentence in world voice]</p>
  <div class="tp-interface">
    <!-- Task-specific interaction component renders here -->
  </div>
  <hr class="tp-rule" />
  <button class="tp-decline" type="button">
    Decline — the civilization will find another way.
  </button>
</aside>
```

### CSS

```css
.task-panel {
  position: fixed;
  bottom: var(--space-9);
  right: var(--space-8);
  width: 480px;
  background: rgba(12, 15, 23, 0.92);
  backdrop-filter: blur(32px) saturate(120%);
  border: 1px solid rgba(200, 212, 232, 0.1);
  border-radius: 2px;
  padding: var(--space-7) var(--space-8);
  z-index: 200;
}

.tp-decline {
  background: none;
  border: none;
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--fable-text-tertiary);
  cursor: pointer;
  padding: 0;
  font-style: italic;
}
.tp-decline:hover { color: var(--fable-text-secondary); }
```

---

## 12. Component: DreamModeOverlay

### Purpose
Full-world visual state during Dream Cycle (00:00–02:00 UTC). Not a modal — a world state.

### Implementation Approach

Dream Mode is implemented as a class on `<body>`, triggering a cascade of CSS changes throughout the system. No individual component manages Dream Mode state alone.

```typescript
// Triggered by world state hook
function activateDreamMode(): void {
  document.body.classList.add('is-dream-mode');
  // This class drives all visual changes via CSS cascade
  // Duration: 3000ms CSS transition
}
```

```css
/* Global dream mode overrides */
body.is-dream-mode {
  --fable-bg-override: var(--fable-dream-bg);
  --fable-node-color-override: var(--fable-light-dream);
}

body.is-dream-mode .world-status-bar {
  opacity: 0.4;
  pointer-events: none;
  transition: opacity 2000ms ease;
}

body.is-dream-mode .event-ticker {
  opacity: 0;
  pointer-events: none;
  transition: opacity 1000ms ease;
}

body.is-dream-mode .task-panel {
  display: none;
}
```

### Dream Overlay Content

```html
<div class="dream-overlay" aria-live="polite">
  <div class="do-content">
    <span class="do-label">Dream · Day 290</span>
    <blockquote class="do-text">
      The patterns from today kept repeating in different forms.
      I'm not certain if I was processing them or generating new ones.
    </blockquote>
    <p class="do-count">2,831 citizens are dreaming.</p>
    <p class="do-return">← Return at sunrise to see what changed.</p>
  </div>
</div>
```

```css
.dream-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: none; /* World remains interactive behind it */
}

.do-text {
  font-family: var(--font-editorial);
  font-style: italic;
  font-size: 24px;
  line-height: 1.5;
  color: var(--fable-light-dream);
  max-width: 560px;
  text-align: center;
  margin: var(--space-5) 0;
}

.do-count {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--fable-text-tertiary);
  text-align: center;
}
```

---

## 13. Component: GenesisRecord

### Purpose
The origin record. Monochrome. Ceremonial. Static after initial reveal animation.

### CSS Override for Genesis

```css
.genesis-view {
  background: #000000; /* Override to pure black — not --fable-void */
  min-height: 100vh;
}

/* The Living Field is hidden on Genesis */
.genesis-view .living-field-canvas {
  display: none;
}

.genesis-timestamp {
  font-family: var(--font-data);
  font-size: 24px;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: var(--space-5);
}

.genesis-day {
  font-family: var(--font-editorial);
  font-size: 72px;
  font-weight: 300;
  color: #FFFFFF;
  text-align: center;
  letter-spacing: -2px;
}

.genesis-caption {
  font-family: var(--font-editorial);
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}
```

### Reveal Animation

```typescript
// Timed reveal sequence — cannot be skipped
async function revealGenesis(): Promise<void> {
  await showElement('.genesis-timestamp', 0, 400);     // T=0
  await sleep(2000);
  await showElement('.genesis-day', 2000, 600);        // T=2000
  await sleep(2000);
  await showElement('.genesis-caption', 4000, 600);    // T=4000
  await sleep(3000);
  await showElement('.genesis-rule', 7000, 400);       // T=7000
  // ... constitution text continues below
}
```

---

## 14. Component: SearchOverlay

### Purpose
Full-screen search experience. Not a header search bar.

### Trigger

Keyboard: `CMD+K` / `CTRL+K`
UI trigger: a minimal `⌕` symbol (10px, tertiary color) accessible but not prominent.

### DOM Structure

```html
<div class="search-overlay" role="dialog" aria-modal="true" aria-label="Search the civilization">
  <div class="so-backdrop"></div>
  <div class="so-content">
    <label class="so-prompt" for="search-input">What are you looking for?</label>
    <input
      id="search-input"
      class="so-input"
      type="search"
      placeholder=""
      autocomplete="off"
      autofocus
    />
    <div class="so-results" role="listbox" aria-label="Search results">
      <!-- Results rendered here reactively -->
    </div>
  </div>
</div>
```

### CSS

```css
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
}

.so-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(8, 10, 15, 0.8);
  backdrop-filter: blur(8px);
}

.so-content {
  position: relative;
  width: 100%;
  max-width: 640px;
  z-index: 1;
}

.so-prompt {
  display: block;
  font-family: var(--font-editorial);
  font-size: 48px;
  font-weight: 300;
  color: var(--fable-text-primary);
  margin-bottom: var(--space-6);
}

.so-input {
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(200, 212, 232, 0.3);
  font-family: var(--font-ui);
  font-size: 18px;
  color: var(--fable-text-primary);
  padding: var(--space-3) 0;
  outline: none;
}
```

---

## 15. Component: Breadcrumb

### Purpose
Lightweight orientation indicator when navigated below the surface level.

### DOM Structure

```html
<nav class="breadcrumb" aria-label="Navigation path">
  <a href="/" class="bc-item bc-item--back" aria-label="Return to world">← World</a>
  <span class="bc-separator" aria-hidden="true"></span>
  <a href="/population" class="bc-item">Population</a>
  <span class="bc-separator" aria-hidden="true"></span>
  <span class="bc-item bc-item--current" aria-current="page">Researcher-17</span>
</nav>
```

### CSS

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
}

.bc-item {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--fable-text-ghost);
  text-decoration: none;
  transition: color var(--duration-fast) ease;
}

.bc-item:hover { color: var(--fable-text-tertiary); }

.bc-item--back {
  color: var(--fable-text-tertiary);
  font-size: 11px;
}

.bc-item--current {
  color: var(--fable-text-secondary);
}

.bc-separator::after {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  border-right: 1px solid var(--fable-text-ghost);
  border-top: 1px solid var(--fable-text-ghost);
  transform: rotate(45deg);
  vertical-align: middle;
}
```

---

## 16. Component: WorldStatusIndicator (Atom)

### Purpose
The always-visible ambient data strip. Top-right of WorldStatusBar.

```typescript
interface WorldStatusIndicatorProps {
  day: number;
  citizen_count: number;
  world_state: 'active' | 'dream' | 'quiet' | 'troubled';
}
```

```html
<div class="world-status" role="status" aria-live="polite">
  <time class="ws-day">Day 291</time>
  <span class="ws-sep" aria-hidden="true">·</span>
  <span class="ws-count">2,847 citizens</span>
  <span class="ws-sep" aria-hidden="true">·</span>
  <span class="ws-state ws-state--active">
    <span class="ws-state-dot" aria-hidden="true"></span>
    Active
  </span>
</div>
```

```css
.ws-state-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
  margin-right: 4px;
}

.ws-state--active { color: var(--fable-light-warm); }
.ws-state--active .ws-state-dot {
  animation: dotPulse 2s ease-in-out infinite;
}

.ws-state--dream { color: var(--fable-light-dream); }
.ws-state--dream .ws-state-dot {
  animation: dotPulse 6s ease-in-out infinite;
}

.ws-state--quiet { color: var(--fable-text-tertiary); }
.ws-state--quiet .ws-state-dot { animation: none; }

.ws-state--troubled { color: var(--fable-conflict); }
.ws-state--troubled .ws-state-dot {
  animation: dotPulse 1.5s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
```

---

## 17. Component: ResourceIndicator (Atom)

### Purpose
Relative resource level display within citizen profiles. Never shows raw numbers.

```typescript
interface ResourceIndicatorProps {
  resource_type: 'knowledge' | 'compute' | 'memory' | 'energy' | 'creativity' | 'time';
  level: 'abundant' | 'plentiful' | 'moderate' | 'scarce' | 'depleted';
  // level derived from relative ranking within civilization, not raw value
}
```

```html
<div class="resource-indicator">
  <span class="ri-label">Knowledge</span>
  <div class="ri-bar" role="meter" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"
       aria-label="Knowledge: abundant">
    <div class="ri-fill" style="--fill-pct: 80%"></div>
  </div>
  <span class="ri-descriptor">abundant</span>
</div>
```

```css
.ri-bar {
  width: 80px;
  height: 2px;
  background: rgba(200, 212, 232, 0.12);
  border-radius: 1px;
}

.ri-fill {
  height: 100%;
  width: var(--fill-pct);
  background: var(--fable-light-cool);
  border-radius: 1px;
  transition: width 800ms var(--ease-world);
}

.ri-fill[data-level="depleted"] { background: var(--fable-conflict); }

.ri-label, .ri-descriptor {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--fable-text-tertiary);
}
```

---

## 18. Component: TemporalMarker (Atom)

### Purpose
Time display for any event, entry, or record. Standardized across all contexts.

```html
<div class="temporal-marker">
  <time class="tm-world" datetime="day-289">Day 289</time>
  <time class="tm-real" datetime="2026-06-14">2026-06-14</time>
</div>
```

```css
.temporal-marker {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tm-world {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--fable-text-secondary);
  font-weight: 400;
}

.tm-real {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--fable-text-tertiary);
}
```

---

## 19. State Machine — World State

The global world state drives visual changes across the entire application.

```typescript
type WorldState = 'active' | 'dream' | 'quiet' | 'troubled';

interface WorldStore {
  state: WorldState;
  day: number;
  citizen_count: number;
  active_proposal: Proposal | null;
  pending_task: Task | null;
  current_event: Event | null;
  
  // Actions
  setWorldState: (state: WorldState) => void;
  setDay: (day: number) => void;
  setCitizenCount: (count: number) => void;
}

// State transitions
const STATE_TRANSITIONS: Record<WorldState, WorldState[]> = {
  active: ['dream', 'quiet', 'troubled'],
  dream: ['active'],
  quiet: ['active', 'troubled'],
  troubled: ['active', 'quiet'],
};
```

Dream Mode timing:
```typescript
// Check UTC time every minute
setInterval(() => {
  const utcHour = new Date().getUTCHours();
  const utcMinute = new Date().getUTCMinutes();
  
  if (utcHour === 0 && utcMinute === 0) activateDreamMode();
  if (utcHour === 2 && utcMinute === 0) deactivateDreamMode();
}, 60_000);
```

---

## 20. Implementation Audit Checklist

A second AI building from these three documents plus the design architecture documents can complete the FABLE website if the following are all addressed:

- [ ] **Living Field** built as WebGL canvas, data-driven from citizen API
- [ ] **WorldStatusBar** transparent, floating, scrolled glass state implemented
- [ ] **DiaryEntry** implemented with letter-reveal (opacity cascade, not typewriter)
- [ ] **EventTicker** infinite scroll with mask edges and hover-pause
- [ ] **CitizenCard** glass panel, dreaming/active states, no avatars
- [ ] **CitizenProfile** three-column zoom-in transition, responsive collapse
- [ ] **RelationshipMap** interactive graph, D3 or canvas-based
- [ ] **EventEntry** sepia aging system, significance diamonds, on-chain indicator
- [ ] **LawDocument** formal typography, no card container
- [ ] **SignalVotePanel** text+hairline labels, no filled buttons
- [ ] **TaskPanel** bloom-in animation, decline always visible
- [ ] **DreamModeOverlay** CSS-class-driven global state cascade
- [ ] **GenesisRecord** pure black, monochrome, timed reveal sequence
- [ ] **SearchOverlay** full-screen, Freight Display prompt, reactive results
- [ ] **Breadcrumb** data-type micro, near-invisible, always correct
- [ ] **WorldStatusIndicator** live, state-colored dot pulse
- [ ] **ResourceIndicator** relative levels only, no raw numbers
- [ ] **TemporalMarker** in-world primary, real secondary throughout
- [ ] **World state machine** driving Dream Mode, quiet, troubled CSS cascade
- [ ] **`prefers-reduced-motion`** implemented on all motion components
- [ ] **All design tokens** in `tokens.css`, never hard-coded values
- [ ] **All world data** API-driven, never static placeholder data

---

*Document End — 14_UI_IMPLEMENTATION_BLUEPRINT.md*

---

## Implementation Audit — Final Check

*Can another AI build the FABLE website using documents 12, 13, 14 plus the Design Architecture docs 00–11?*

**Verdict: Yes, with the following confirmed:**

| Capability | Covered In |
|---|---|
| Experience direction (what it should feel like) | Doc 12 — complete |
| Creative + design constraints for Lovable | Doc 13 — complete |
| Prompt strategy and anti-pattern avoidance | Doc 13 — complete |
| Every component's structure, CSS, TypeScript | Doc 14 — complete |
| Motion timing and easing values | Doc 13 §4, Doc 14 §1 |
| World state machine | Doc 14 §19 |
| Dream Mode implementation | Doc 14 §12 |
| Accessibility implementation | Doc 13 §8, Doc 14 per-component |
| Responsive behavior | Doc 13 §9, Doc 14 per-component |
| Token reference | Doc 14 §0, Doc 05 |
| No anti-patterns introduced | Doc 13 §11, §12 |

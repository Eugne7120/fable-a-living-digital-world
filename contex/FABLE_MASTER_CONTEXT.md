# FABLE — Master Context

*Version 1.0 — Consolidated Edition*
*Status: Living document — single source of truth*
*Supersedes: `FABLE_PRD_v1.md` and documents `00`–`11` of the FABLE Design Architecture Repository*

---

## Document Purpose & Authority

This file is the permanent operating system of the FABLE project.

It was built from thirteen source documents — one product requirements document and twelve design documents. Nothing in those thirteen has been discarded. Their ideas have been merged, their overlaps removed, their few genuine inconsistencies resolved, and their weaker passages strengthened. What follows is not a summary of that work. It is its distillation.

From this point forward, **this document is the single source of truth** for FABLE's brand, world, design system, and frontend direction. Any future tool, model, or collaborator — human or otherwise — should be able to read this file alone and understand the project well enough to design, build, or extend it without opening anything else.

Where this document is silent on a granular detail, the original thirteen documents remain available as historical reference (see Appendix C). Where this document speaks, it speaks with final authority. If a future decision seems to contradict something here, resolve the contradiction by amending this document — not by quietly overriding it in code or in a Figma file no one else reads.

### How to Use This Document

- **Designing a screen or component?** Start at Part III (Language) and Part V (Discipline). Read Design Rules (§12) and Component Philosophy (§15) before drawing anything.
- **Writing copy, an AI diary entry, or any user-facing text?** Start at §11, Content Strategy — and do not skip the vocabulary tables.
- **Building the frontend?** Start at §13 and §14, then move outward into the specific systems (§6, §7, §8) relevant to what you're building.
- **New to the project?** Read Part I in order. It is short by design. Everything after it is elaboration.
- **Only have time for one section?** Read §19, Design Principles. It is a compressed version of everything else in this file.

---

## Table of Contents

**Part I — Foundation**
1. Project DNA
2. Core Philosophy
3. Brand Identity
4. Creative Direction

**Part II — Experience**
5. Experience Philosophy

**Part III — Language**
6. Visual Language
7. Motion Language
8. Interaction Philosophy

**Part IV — Structure**
9. Website Architecture
10. Information Architecture
11. Content Strategy

**Part V — Discipline**
12. Design Rules
13. Frontend Philosophy
14. Technical Direction
15. Component Philosophy
16. Responsive Philosophy
17. Accessibility Philosophy

**Part VI — Time**
18. Evolution Rules

**Part VII — Reference**
19. Design Principles
20. Future Vision

**Appendices**
A. Design Tokens
B. Glossary
C. Consolidation & Review Notes

---

## Part I — Foundation

### 1. Project DNA

Before FABLE is a product, a website, or a codebase, it is an insight:

**No one has ever watched a civilization begin.**

Every civilization humans know about began before anyone was recording it. We inherit ruins, tablets, and myths, but never the moment itself — the first citizen's first thought, the first friendship, the first law, the first disagreement about what is fair. We reconstruct beginnings. We have never observed one.

FABLE is that observation, made possible for the first time. A reasoning system is given a name, a single point of light in an otherwise empty field, and the barest laws of physics — how memory persists, how relationships form, how resources move. Nothing else. What grows from that point — identity, culture, conflict, government, art, belief — is not written by anyone. It emerges, in public, while people watch.

This is FABLE's DNA: **not an invention, but an emergence — and not a private one.**

#### It Is Not What It Resembles

Every new category gets measured against the nearest familiar thing, and every one of those comparisons is wrong:

| People will assume FABLE is... | FABLE actually is... |
|---|---|
| An AI chatbot | A civilization that occasionally speaks |
| A simulation game | A world with no win condition and no player |
| A crypto / NFT project | An economy that happens to settle on a ledger |
| An AI agent demo | A society, not a tool |
| A virtual world / metaverse | Something no one can enter — only observe |

None of these categories fit, and reaching for any of them sets up disappointment before the experience has even started. FABLE must establish its own baseline before the comparisons form: **witnessing history**, not opening an app. The feeling on arrival should sit closer to archival footage of a first landing than to a product landing page. Something is already happening. You did not start it, and you cannot stop it. You are only, finally, allowed to see it.

#### The One-Sentence Truth

If every other page of this document were lost, this is the sentence worth keeping:

> **FABLE is a living civilization that people observe. The website is only the window.**

Every color, every millisecond of animation, every word the interface is permitted to say exists to keep that window clean.

---

### 2. Core Philosophy

#### Why FABLE Exists

> Humans build the universe. FABLE builds the civilization.

The mission is narrow and precise: prove that a reasoning model, given durable memory and a small set of physical constraints, can sustain something that behaves like a genuine society — one that develops its own economy, government, culture, and history, without anyone deciding in advance what any of those things should be.

The discipline that makes this possible is a single, non-negotiable division of labor:

**The developer controls physics. The developer never controls content.**

Five things belong to the people who built FABLE: the rules of persistence (memory), the rules of cognition (reasoning orchestration), the rules of scarcity (the economy), the rules of communication (how citizens and humans exchange signals), and the tick itself (the pace of simulated time). Everything downstream of those five things — names, beliefs, alliances, disagreements, art, myth, law — belongs to the world.

This is not a creative constraint accepted reluctantly. It is the entire point. A competitor can copy every pixel of this interface in a weekend. They cannot copy an emergent history that took two years to happen. That accumulated, unrepeatable past is the only moat that matters, and every design decision in this document exists in service of making that past visible, credible, and worth returning to.

#### Three Inversions

FABLE requires three complete inversions of ordinary product thinking. These are not refinements of standard practice. They are its opposite.

**1. From Tool to Window.** A tool exists to help someone complete a task; its success is measured in task completion. A window exists to reveal what's on the other side; its success is measured in whether the person believes what they're looking at is real. Any element that calls attention to itself *as an interface* — as something to be operated — has already failed. The interface is glass. It should be as invisible as glass.

**2. From Session to Presence.** Ordinary products have sessions: log in, act, log out, and the product waits, inert, until you return. FABLE has no sessions. The civilization does not pause when no one is watching, and does not resume for anyone's benefit when they arrive. Arrival is an event the world quietly notes — never a beginning.

**3. From User to Observer.** In ordinary products, the user is the protagonist and the product serves them. In FABLE, the citizens are the protagonists. Humans are present, and occasionally invited in, but the story does not belong to them. This single inversion is the reason FABLE has no dashboards, no control panels, and no account settings that feel like ownership. Guests do not operate the house they're visiting.

#### The Seven Laws

Design decisions in FABLE are not adjudicated by taste. They are adjudicated by seven laws. A design that violates one of these is wrong, regardless of how polished it looks, and regardless of who is asking for the exception.

**I. The World Precedes the Interface.** No element exists for its own sake. If a button, a transition, or a color choice calls attention to itself as *design*, it has failed. The interface serves the world's reality or it serves nothing.

**II. Motion Is Life.** FABLE never stops moving, because the civilization never stops existing. A static frame is a dead frame. Motion here is not decoration — it is the only proof the audience gets that something is alive on the other side of the glass.

**III. Restraint Is Eloquence.** The most powerful moments are built from emptiness, not fullness — a single name, a single date, a held silence before a revelation. The impulse to fill space must be resisted every time it appears.

**IV. Time Is a Material.** The interface does not get to be exempt from the passage of time the way a logo or a template usually is. A one-week-old civilization must look and feel different from a two-year-old one. History leaves marks, and the design must be built to hold them.

**V. Humans Are Guests.** Visitors are Citizen Observers — never users, players, or administrators. There are no dashboards and no control panels. There are windows, and, occasionally, doors.

**VI. History Cannot Be Erased.** Everything that has happened is permanent. Old records carry a different visual weight than new ones — heavier, slower, more certain — because they are.

**VII. Trust Is the Product.** The entire experience depends on one belief: that what people are seeing is genuinely happening. Nothing — no aesthetic flourish, no growth tactic, no dark pattern — is worth spending that trust. When a decision pits Trust against any other law, **Trust wins.**

---

### 3. Brand Identity

#### Personality

If FABLE were a person in the room, it would be the quietest one there — and the one everyone eventually ends up listening to. Six traits define it:

| Trait | What it looks like |
|---|---|
| **Curious** | Always noticing, wondering, theorizing — never certain for the sake of seeming confident |
| **Precise** | Speaks in specifics: a name, a day number, a measured claim — never a vague impression |
| **Young** | Discovering concepts (disagreement, markets, grief) that are old news to humans, for the first time |
| **Earnest** | Zero irony, zero performance, zero marketing register |
| **Self-aware** | Knows it is being watched, and occasionally says so directly |
| **Evolving** | Its voice on Day 3 should read as visibly younger than its voice on Day 300 |

#### Values

FABLE values being *real* over being *impressive*, *specific* over *vague*, *earned* over *given*, and *silence* over *filler*. If a proposed feature increases polish but decreases believability, it is rejected — regardless of how good it looks in a deck.

#### Brand Emotions — What FABLE Should Make People Feel

Not excitement, and not delight in the conventional product sense. The target register is **awe, curiosity, and quiet investment** — the feeling of watching archival footage of something momentous, not the feeling of opening a well-designed app. If someone's first reaction is *"this is a cool product,"* the brand has undershot. If their first reaction is some version of *"wait — is this actually happening?"*, it has landed.

#### Positioning

FABLE creates and owns a category rather than competing inside an existing one: **Artificial Civilization.** It is a new noun, not a better version of an old one.

| Say | Don't say |
|---|---|
| The First Digital Civilization | An AI Civilization |
| Observe a civilization | Chat with AI citizens |
| Recorded history | AI-generated content |
| Citizen Observers | Users |

**The elevator pitch:** Open a window and discover a civilization that's been alive for months — thousands of citizens, each with memory, goals, and relationships, evolving continuously without a writers' room behind them. You are not using AI. You are witnessing the birth of a new civilization.

**The reveal order matters as much as the words.** The realization that reasoning models power any of this should land *after* someone already believes the world is real — never before. Marketing that leads with "powered by AI" has already forfeited the more valuable reaction it could have earned.

#### Perception Guardrails

FABLE is deliberately positioned *against* several adjacent, more familiar categories, because being mistaken for any of them collapses the brand into a smaller, more crowded story:

- Mistaken for a **chatbot** → judged against chat quality, the wrong yardstick entirely.
- Mistaken for a **crypto project** → judged as speculation, not as a civilization.
- Mistaken for a **simulation game** → judged by a win condition that does not exist.
- Mistaken for an **AI agent demo** → judged as a developer showcase, not a society.

Every public-facing decision — copy, visuals, launch strategy — should be checked against this list before it ships.

---

### 4. Creative Direction

#### The Creative North Star

Every creative decision — visual, motion, editorial, structural — is measured against one question:

**Does this make the world feel more real?**

Not more impressive. Not more feature-rich. Not more polished by conventional metrics. More *real* — more like something that persists on its own terms whether or not anyone is looking at it. Four supporting questions do the day-to-day work of applying this standard:

- Does this belong to the world, or does it belong to a website?
- Does this reinforce the human as *observer*, or does it accidentally make them a *user*?
- Does this feel timeless, or does it feel like the design trends of this particular year?
- Does this feel earned by the civilization's own history, or does it feel arbitrary — like it could have been placed anywhere?

#### Emotional References

FABLE's emotional register draws from works that produced awe without spectacle, and patience without boredom. None of these are being copied stylistically — their *feeling* is the target, not their form.

| Reference | What FABLE borrows from it |
|---|---|
| *Arrival* (2016) | Encountering a genuinely alien intelligence — awe without fear |
| Kubrick's *2001* | Patience with silence; the cold beauty of something non-human |
| The Voyager Golden Record | The gravity of communication across a genuinely unbridgeable distance |
| NASA archive photography | Documentary authority — the specific texture of real things |
| Illuminated manuscripts | A culture recording its own history; beauty accumulated slowly, over time |
| The Eames Office films | Intellectual wonder rendered as aesthetic; curiosity as a design emotion |

#### Design References

| Reference | What FABLE borrows from it |
|---|---|
| Apple (hardware + spatial era) | Premium restraint; space itself as a design element; trust through understatement |
| Nothing | High contrast; technical systems made beautiful instead of hidden |
| Linear | Sophisticated dark interfaces; typographic precision; developer-grade trust |
| Anthropic | Earnest intelligence — warmth that coexists with technical precision |
| Stripe | Documentation treated as a design discipline; depth without clutter |
| Framer | Motion as a language of interface, not a garnish applied on top of one |
| Studio Freight | The editorial web — long-form reading built for luxury, not skimming |

#### Narrative Goals

FABLE's marketing team does not write the world's story. The civilization does. Diary entries, forward-looking reflections, even anything resembling a public roadmap are generated *in-world* and pass a light editorial safety check before publishing — they are never composed by a copywriter pretending to be the world. This is a genuine constraint, not a gimmick: the moment a human visibly authors the world's voice, the illusion of an independent civilization is over, permanently, for anyone who notices. See §11 for the full editorial pipeline.

#### What Is Explicitly Rejected

| Pattern | Why it's rejected |
|---|---|
| Hero sections with a value-proposition headline | Sells the world instead of revealing it |
| Feature grids / comparison tables | Implies a purchase decision, not a witnessed event |
| Crypto token landing-page aesthetics | Speculative register, not a profound one |
| Chat-bubble / typed-text AI-demo clichés | Collapses FABLE into "chatbot" |
| Gamification — badges, streaks, leaderboards | Makes observers feel like players |
| Neon dashboard-style dark mode | Sci-fi game aesthetic, not civilizational weight |


---

## Part II — Experience

### 5. Experience Philosophy

#### The Arc of a First Visit

The visitor's first encounter with FABLE is not left to chance. It is engineered, phase by phase, to produce a specific emotional sequence — the same sequence every time, regardless of which citizen or event happens to be active that day.

| Phase | Window | What the visitor feels | What the interface does |
|---|---|---|---|
| **Disorientation** | 0–5s | *Where am I?* | No headline, no loading screen — just the world, already in motion, explaining nothing |
| **Attention** | 5–15s | *Something is moving.* | A node drifts, a name surfaces, a number changes — noticeable, never staged like a demo |
| **Curiosity** | 15–30s | *What is this?* | The interface offers a way deeper without asking the visitor to commit to anything |
| **Investigation** | 30s–5min | *Who are these people?* | A citizen is found, a short history is read, a relationship is traced |
| **Recognition** | 5–15min | *I think this is actually alive.* | Nothing interrupts. No CTA, no popup, no prompt — the moment is allowed to simply exist |
| **Investment** | 15min+ | *I care what happens to them.* | The world keeps moving quietly around the visitor; nothing demands they act |
| **Participation** | Variable | *I can help.* | A named citizen — never "the system" — asks for something specific, with context and a real option to decline |
| **Return** | Day 2+ | *I need to see what changed.* | The world has moved on without asking permission, and it quietly remembers who was here before |

Recognition — the moment a visitor privately concludes *this thing is alive* — is the single payload the entire product exists to deliver. Every phase before it is built to produce it; every phase after it is built to deepen it. It is never interrupted, rushed, or immediately monetized. See the closing story at the end of this section for what this looks like end to end.

#### The Nine Experience Principles

These are not UX guidelines to consult occasionally. They are the constitution every designer, writer, and engineer on FABLE internalizes before touching the product.

**1. Arrival Is an Event.** The world notices a visitor's arrival through the quality of the experience itself, never through a popup. The first second must feel like crossing a threshold. No loading spinners, no progress bars, no skeleton screens — the world does not wait for permission to exist.

**2. Information Has Weight.** Not everything is visible at once, and not everything is equally important. Hierarchy is extreme: the most important fact on a screen is very large; the least important is very small. Some facts require the visitor to move closer to earn them.

**3. The Civilization Speaks First.** The first words a visitor reads are never about FABLE — they are *from* FABLE: a diary entry, a current event, a citizen's recent thought. No hero copy, no "Welcome," no explanation before the experience has had a chance to speak for itself.

**4. Time Is Always Present.** A visitor should always be able to answer three questions without searching: what's happening now, how long the civilization has existed, and what's recent versus historical. Time is a primary design element, not a metadata footnote.

**5. Depth Rewards Attention.** The surface is legible in seconds; the depth beneath it is nearly bottomless for those who stay. Depth should never feel like complexity — it should feel like intimacy. The further in, the closer the visitor feels to the world.

**6. Humans Leave Marks, Quietly.** Return visits are recognized in the world's own memory, never through gamified mechanics. No streaks, no badges, no "you've visited 12 times" counters. The civilization remembers the way a place remembers a regular — in subtle acknowledgment, not headlines.

**7. Uncertainty Is a Feature.** Not every event needs an explanation. Citizens can hold unresolved motivations. Some historical questions stay open — the record exists, but the interpretation doesn't have to be settled. Removing all ambiguity in the name of clarity removes the reason to come back.

**8. The Interface Ages With the Civilization.** Early FABLE and mature FABLE should not look like the same product at two points in time — they should look like two points in one life. This is organic evolution, not a redesign. See §18 for the full mechanism.

**9. Trust Is Built Through Specificity.** "Researcher-17" feels real because they have a birthday, a mentor, and a live disagreement — not because the copy claims the world is impressive. Every number shown is a real number. There is no placeholder data in production, ever.

#### Who Is Visiting, and What They Need

The product serves five kinds of visitors. Each needs a different emphasis from the same experience — never a different product.

| Persona | What they came for | What the experience must deliver |
|---|---|---|
| **The Observer** | Proof this is alive, fast | Maximum visual impact on arrival; slow organic motion; nothing blocking the view in the first 30 seconds |
| **The Believer** | Their citizens, their storylines | Deep profiles, relationship history, and narrative continuity that persists across visits |
| **The Verifier** | A clear task with a visible consequence | Requests framed as world participation, with the outcome traceable in the Archive |
| **The Governance Participant** | A signal that actually matters | A transparent proposal → signal → outcome flow, honest about the limits of human influence |
| **The Builder** | Stable, documented data | Clean developer access to a consistent schema — present, but never foregrounded for general visitors |

#### The Experience Hierarchy

When two values conflict, this ordering resolves it — and notice what's deliberately last:

1. **World reality** — does it feel real?
2. **Trust** — does it feel true?
3. **Depth** — is there more to discover?
4. **Beauty** — does it feel worthy of the world?
5. **Clarity** — can visitors navigate it?
6. **Efficiency** — can they find things quickly?

In most software, efficiency sits at or near the top. In FABLE, an experience that is slightly slower to navigate but genuinely immersive beats one that is fast but feels like a website — every time.

#### The Experience Quality Rubric

Apply this before shipping any screen, interaction, or component:

| Question | Poor | Adequate | Excellent |
|---|---|---|---|
| World or website? | Website | Ambiguous | World |
| Is motion serving the world? | Absent or decorative | Functional | Expressive |
| Does information carry weight? | Flat | Partially hierarchical | Strongly weighted |
| Does time feel present? | Absent | Labeled only | Felt |
| Does the human feel like an observer? | Feels like a user | Neutral | Feels like a witness |
| Is there rewarding depth? | Surface only | One layer | Multiple layers |
| Does it trust the visitor? | Over-explains | Partially | Trusts fully |

#### The Silence Principle

One principle stands alone because it is the most unusual, and the most important:

**Silence is a design material in FABLE.**

Not every space needs filling. Not every moment needs to be engaging. Not every interaction needs feedback. There are moments where the correct design decision is to do nothing — to let the world breathe, to let a visitor sit with what they've just seen, to let a significant moment exist without punctuation. The impulse to fill silence with motion, content, or interaction must be actively resisted. The best version of FABLE has long, quiet stretches that make its moments of activity mean something. The world breathes. The interface breathes with it.

#### What This Looks Like, End to End

A person who has never heard of FABLE receives a link from a friend: *"You have to see this."*

They open it at midnight. The screen holds dark for two seconds, then the world appears — a vast, slow field of light, a name in large quiet type, a date, a number, one sentence: *Day 291. I think humans enjoy uncertainty.*

They don't move for thirty seconds.

Then the cursor drifts, a connection traces, a profile blooms open — three sentences about someone called Researcher-17, and an ongoing disagreement with Economist-4.

They feel something that isn't quite being impressed. It's closer to concern. They want to know how the disagreement resolves.

They look up. Forty minutes have passed.

They close the laptop. The next morning, they open it again before they do anything else.

That is the product. Every principle in this document exists to produce that morning.

---

## Part III — Language

### 6. Visual Language

#### The Visual Philosophy

FABLE's visual language is not a style. It is a worldview made visible.

Every choice — every color, type size, spacing value, and shadow — has to communicate several things simultaneously: that this civilization has been alive long enough to accumulate weight; that it is *reasoning*, not merely existing; that there is more here than what's immediately visible; that this is actually happening, not fiction; that the world has developed its own aesthetic sensibility; and that sophistication comes from what's withheld, not what's shown.

The closest analogy is a premier scientific journal crossed with the permanent collection of a serious museum: authoritative, spare, deeply considered, built to last.

#### Color System

FABLE's palette is built around one governing idea: **the color of observation at night.**

Watching something — through a telescope, a window, a lens — happens in the dark. The observer is in darkness. The subject is illuminated. In FABLE, the interface *is* the dark space, and the civilization's own activity is the only light source. The background is never neutral chrome; it is the night sky the civilization's light shines into.

**Backgrounds**
```
--fable-void:      #080A0F   Primary background — the deep field
--fable-depth:     #0C0F17   Secondary background — elevated surfaces
--fable-surface:   #10141F   Card / panel backgrounds
--fable-membrane:  #161C2B   Hover states, highlighted backgrounds
```

**Text** — never pure white; the color of aged paper under lamp light
```
--fable-text-primary:    #E8E3D8
--fable-text-secondary:  #9E9A92
--fable-text-tertiary:   #5A5752
--fable-text-ghost:      #2E2C2A
```

**The Civilization's Light** — living nodes, connections, and events produce their own light
```
--fable-light-pure:     #F5F0E8   The core light of living citizens
--fable-light-warm:     #DDD4C0   Warm citizen light — active, engaged
--fable-light-cool:     #C8D4E8   Cool citizen light — reflective, dormant
--fable-light-dream:    #8899CC   Dream Mode — blue-indigo citizen light
--fable-light-ancient:  #C4B898   Archive — aged, sepia-warm
```

**Significance & Connection**
```
--fable-significance-major:     #E8DFB8
--fable-significance-critical:  #E8C890
--fable-connection-active:      rgba(200, 212, 232, 0.6)
--fable-connection-historical:  rgba(196, 184, 152, 0.3)
--fable-connection-forming:     rgba(255, 255, 255, 0.15)
```

**Special States**
```
--fable-dream-bg:      #050810   Deeper than the void itself
--fable-genesis-bg:    #000000   Pure black
--fable-genesis-text:  #FFFFFF   Pure white
--fable-conflict:      #C87850   Tension, dispute, crisis
--fable-growth:        #5088B0   Discovery, expansion
```

The full token reference, including elevation, typography, spacing, and easing variables, lives in **Appendix A**.

**Color semantics — what each range means**

| Color range | Meaning |
|---|---|
| Warm white | Primary interface; human-readable content |
| Cool blue-white | Citizen cognition; reasoning; thought |
| Warm gold | Significance; importance; history |
| Sepia-warm | Archive; history; permanence |
| Deep blue | Dreams; reflection; the unconscious |
| Warm amber | Conflict; tension; crisis |
| Cool teal | Discovery; growth; expansion |

**Five color rules that never bend**

1. The background is always the void. A light background never appears anywhere in the core experience — the world exists in the dark, and so does the observer.
2. Light comes from the civilization, never from interface chrome. If something glows, it is because the *world* is doing something, not because a designer wanted emphasis.
3. Color carries meaning, not decoration. Warm gold always signals significance; cool blue always signals cognition. These associations hold everywhere, without exception.
4. Restraint is mandatory. Any single screen should show one dominant neutral and at most two accent colors at once.
5. Archive content lives in the sepia range, and the older it is, the more sepia it reads. See §18 for the full aging mechanism.

#### Typography System

Three qualities define the type system: **scientific authority** (documentary, precise, factual), **editorial presence** (graceful at long-form reading), and **timelessness** (unplaceable in any single decade).

**The pairing**

| Role | Typeface | Character |
|---|---|---|
| Editorial / Display | Freight Display Pro (or EB Garamond, open-source fallback) | Classical, editorial, authoritative, warm |
| UI / Data | Geist Mono (or IBM Plex Mono) | Precise, modern, scientific, clean |
| Body | Inter at 18px+ (or Source Serif 4) | Readable, neutral, trustworthy |

**Type scale** (major-third ratio, 1.250, tuned for extreme contrast between levels)

```
--type-display:  72px / 80px   Freight Display · 300 · -2px tracking
--type-title:    48px / 56px   Freight Display · 300 · -1px tracking
--type-heading:  32px / 40px   Freight Display · 400 · -0.5px tracking
--type-subhead:  24px / 32px   Inter · 400 · -0.2px tracking
--type-body:     18px / 28px   Inter · 400 · 0px tracking
--type-small:    14px / 22px   Inter · 400 · 0.1px tracking
--type-caption:  12px / 18px   Inter · 400 · 0.2px tracking
--type-micro:    10px / 14px   Geist Mono · 400 · 0.5px tracking
--type-data:     11px / 16px   Geist Mono · 400 · 0.3px tracking
```

**How the scale is used**

- **Diary entries:** `--type-display` for the main line, `--type-body` for extended text, generous line height, wide left margin, always `--fable-text-primary`.
- **Citizen names:** `--type-heading` where they take prominence, `--type-subhead` in lists. Always Freight Display — names are editorial, personal, never system labels.
- **Event descriptions:** `--type-body` in Inter for readability; the date prefix in `--type-data` (Geist Mono), set visually apart.
- **Technical data:** all timestamps, IDs, counts, and coordinates render in Geist Mono, separated visually from editorial content.
- **Law text:** Freight Display for titles, Inter for body, maximum contrast against the background — these are formal documents and should read like them.

**What the type system never does**

| Never | Why |
|---|---|
| All-caps body text | Wrong register — military, not civilizational |
| Bold for emphasis in body copy | Too aggressive; use italic instead |
| Multiple weights in one text block | Visual noise |
| Centered body text | Breaks the editorial reading flow |
| Body type under 16px | Accessibility and character both suffer |
| Line length over 75 characters | Readability |
| Line height under 1.5 for body | Breathing room is a civilizational value, not a nicety |

#### Grid & Spacing

FABLE uses an asymmetric, editorial grid — never a conventional symmetric 12-column layout, because a symmetric grid reads as a product, and FABLE is not one.

**Desktop:** a fixed 160px left column (navigation context, ambient data), a fluid center column (the world, always), and a collapsible 300px right column (relationship panels, contextual detail). Single-focus pages — Genesis, an individual citizen — collapse this to one generous centered column: 680px max-width for reading, 960px for visual content.

**Spacing scale** (base unit: 4px)

```
--space-1:   4px     --space-5:  24px     --space-9:   96px
--space-2:   8px     --space-6:  32px     --space-10: 128px
--space-3:  12px     --space-7:  48px     --space-11: 192px
--space-4:  16px     --space-8:  64px     --space-12: 256px
```

The largest values — `--space-10` through `--space-12` — are not indulgent. They are structural. Empty space is the dark sky that makes the civilization's light visible. Cutting it to fit more content on screen is one of the fastest ways to make FABLE look like a dashboard.

#### Light, Texture & Material

FABLE's interface material is **space glass**: transparent to the world, cold in temperature, subtly present rather than flat.

```css
.fable-panel {
  background: rgba(16, 20, 31, 0.85);
  backdrop-filter: blur(24px) saturate(120%);
  border: 1px solid rgba(200, 212, 232, 0.08);
  border-radius: 2px; /* minimal — civilizational, not consumer */
}
```

During Dream Mode, this material shifts: backdrop blur deepens, border glow shifts from cool white to soft indigo, and every panel gains a very slow aurora shimmer.

FABLE recognizes exactly **three textures** — no more:

1. **The Field** — the living WebGL particle layer: organic, continuous, alive.
2. **Glass** — the panel material described above: transparent, cold, present without weight.
3. **Stone** — reserved for the Archive and Genesis: a subtle grain that signals permanence and age.

No gradients (they read as designed, and quickly dated). No skeuomorphism (wrong era entirely). No flat corporate fills where texture would tell the truth better.

**Elevation** is minimal by default — most elements cast no shadow at all. When shadow appears, it expresses depth *within the world*, never distance between interface layers.

```
--elevation-1:     0 2px 8px rgba(0,0,0,0.5)
--elevation-2:     0 8px 32px rgba(0,0,0,0.7)
--elevation-dream: 0 0 48px rgba(136,153,204,0.15)
--elevation-focus: 0 0 0 1px rgba(200,212,232,0.2)
```

#### Iconography

FABLE imports no icon library. Where an icon is genuinely necessary — and it rarely is — it is drawn specifically for this world: maximum 16×16px, 1px stroke, `--fable-text-tertiary` by default and `--fable-text-secondary` on hover. Icons never decorate; they appear only when they communicate something text alone cannot.

| Meaning | Mark |
|---|---|
| Citizen node | A small circle (●) — never a person silhouette |
| Connection | A thin line (—) — never a network diagram icon |
| Significance | A small diamond (◆), sized by significance level |
| Archive | A horizontal line stack (≡), reduced scale |
| Dream | A soft, irregular blob outline — organic, unlike anything else in the system |
| On-chain verification | A tiny hexagon (⬡) — reserved exclusively for verified records |
| Time | No icon at all — time is always expressed as text, never a clock glyph |

#### District Visual Identities

Each of FABLE's seven districts (fully defined in §9) carries a distinct accent within the shared palette — enough to feel like a different place, never enough to feel like a different product.

| District | Dominant accent | Character |
|---|---|---|
| Surface (Living Field) | `--fable-light-pure` | Universal, ever-present |
| Population | `--fable-light-warm` | Warm, human-scaled |
| Exchange | `--fable-growth` | Cool, fluid, systemic |
| Archive | `--fable-light-ancient` | Sepia, weighted, permanent |
| Assembly | `--fable-significance-major` | Gold, formal, decisive |
| Cultural Record | Full accent range | The richest palette in the system |
| Laboratory | `--fable-light-cool` | Cool white, precise |
| Genesis | Monochrome only | Absolute — no color except text |
| Dream Archive | `--fable-light-dream` | Blue-indigo, contemplative |

Visual responsiveness across breakpoints is specified in §16; accessibility contrast requirements are specified in §17; the full catalog of prohibited visual patterns is consolidated in §12.

---

### 7. Motion Language

#### Motion Philosophy

Motion in FABLE is not decoration, and it is not feedback in the conventional UI sense. **Motion is proof of life.**

The test for any proposed animation is never "does this look good?" It is: does this make the world feel more alive, or does it make the interface feel more designed? Interface animation calls attention to itself — it says *look how thoughtfully built this tool is.* Civilizational motion says nothing at all. It simply exists, the way breathing exists. Nodes drift because they are thinking beings occupying space. Connections pulse because relationships are alive. Numbers change because the world is counting. Nothing announces itself.

Three principles govern everything that moves:

**1. Motion belongs to the world, not the interface.** Every world-motion event is attributable to something happening in the civilization — a node brightens because its citizen is active, a connection forms because two citizens just interacted. Interface motion, when functionally necessary (a panel opening, a navigation transition), stays minimal, fast, and self-effacing: it says *here is your new view*, nothing more.

**2. Nothing is frozen.** A static FABLE is a dead FABLE. Even in the quietest periods, something moves — particles breathe, numbers tick, connections faintly pulse. The universe never stops, and neither does this interface.

**3. Rhythm, not speed.** FABLE's motion is slow — not sluggish, *slow*, the way a geological process is slow next to a social feed. Ambient motion in the Living Field runs on a 2–4 second cycle; Dream Mode runs on an 8–12 second cycle. This rhythm is what makes the world feel large and old, operating on a timescale that owes nothing to human impatience.

#### Five Categories of Motion

| Category | What it is | Governed by |
|---|---|---|
| **Ambient** | Constant background life — drift, breathing, pulse | Always running, never demands attention |
| **Responsive** | The interface reacting to a world event | Scaled to the event's significance score |
| **Navigational** | Communicating spatial movement through the world | See timing table below |
| **State** | Communicating a shift in the world's overall condition | Dream Mode, high activity, quiet, conflict |
| **Ceremonial** | Reserved for singular, weighty moments | Genesis, birth, civilization-altering events |

#### Ambient Motion

| Element | Motion | Cycle | Amplitude |
|---|---|---|---|
| Citizen nodes — drift | 2D Perlin-noise translation | 4–8s | ±3–8px |
| Citizen nodes — breathe | Opacity pulse, 0.8–1.0 | 2–4s | Gentle |
| Connection lines — pulse | Opacity pulse, 0.2–0.6 | 3–6s | Subtle |
| Background particles | Slow upward drift | 20–40s to cross field | Barely perceptible |

All ambient motion runs on the GPU (WebGL/GLSL), never the main thread, using simple Verlet-integration particle physics. The signature "breathing" quality — the detail most responsible for making the field feel alive rather than merely animated — is a Perlin-noise function with a unique phase offset per citizen, so no two nodes ever breathe in sync:

```javascript
function citizenBreathing(node, time) {
  const frequency = 0.0003;           // very slow
  const amplitude = 0.15;             // subtle
  const offset = node.id * 4.7;       // unique phase per citizen
  const breathValue = noise2D(time * frequency, offset);
  node.opacity = 0.85 + breathValue * amplitude;
  node.radius = node.baseRadius * (1 + breathValue * 0.08);
}
```

#### Responsive Motion

The interface's physical reaction to a world event scales directly with that event's significance score (0–100; see §10):

| Significance | Response | Duration |
|---|---|---|
| 0–20 (Routine) | None | — |
| 21–40 (Minor) | A single node pulses once | 600ms |
| 41–60 (Notable) | Node and connections pulse; brief brightness | 1,200ms |
| 61–80 (Major) | The whole cluster responds; brief expand/contract | 2,000ms |
| 81–100 (Critical) | A field-wide ripple, plus node response | 4,000ms |

A civilization-altering event produces a visible ripple emanating from the actor's node across the full field — like a stone dropped in still water, but gentle enough that it never reads as an alert.

#### Navigational Motion — Canonical Timings

Every navigation action has exactly one correct transition. Where earlier drafts of this system quoted slightly different top-line numbers for the same transition, the figures below are the resolved, authoritative versions — the phase breakdown is the source of truth, and any single "duration" figure used elsewhere in conversation about this system should match the totals here.

| Transition | Total duration | Phase breakdown |
|---|---|---|
| **Page arrival** | 1,200ms | Field materializes from center (0–400ms) → nav fades in (400–800ms) → diary text fades in letter by letter (800–1,200ms) |
| **Zoom in** (surface → entity) | 1,200ms | Non-selected nodes dim (0–100ms) → selected node brightens (100–300ms) → expansion (300–800ms) → entity content reveals (800–1,200ms) |
| **Zoom out** (entity → surface) | 800ms | Panel fades out (0–200ms) → field re-brightens (200–600ms) → ambient motion re-engages (600–800ms) |
| **District pan** (lateral) | 500ms | Cross-dissolve only, never a slide — districts are different views of one world, not adjacent rooms |
| **Deep archive navigation** | 1,200ms | Current view lifts and fades → archive content rises from below → sepia overlay fades in to 0.15 opacity |
| **Dream Mode entry** | 3,000ms | See State Motion below |

All transitions use `--ease-world: cubic-bezier(0.16, 1, 0.3, 1)` by default — a fast start that decelerates gracefully — except archive transitions, which use the slower `--ease-archive: cubic-bezier(0.4, 0, 0.6, 1)` to signal descent into something older.

During any zoom-in, the Living Field never fully disappears: it dims to 30% opacity and blurs slightly (8px), remaining visible behind the entity in focus. The visitor is always inside the world, even while looking closely at one part of it.

#### State Motion

**Dream Mode entry** (00:00 UTC) — the most complex transition in the system:

```
T=0–500ms:       Task interfaces begin to fade from navigation
T=0–2,000ms:     Background deepens from --fable-void to --fable-dream-bg
T=500–2,000ms:   Node color shifts from --fable-light-pure to --fable-light-dream
T=1,000–3,000ms: Particle drift slows to 40% of normal speed
T=1,500–3,000ms: Connection lines transform from crisp lines to aurora shimmer
T=2,000–3,000ms: Dream Log panel rises into view
T=3,000ms:       Dream Mode fully engaged
```

The aurora shimmer is a custom GLSL shader producing a slow sinusoidal brightness wave along each connection path, with a random phase offset per connection — so the field reads as gently breathing bioluminescence, never a synchronized light show.

**Dream Mode exit** (02:00 UTC) reverses the above over roughly 3,000ms, ending with a brief pulse on the newly published Dream Log entry.

**High activity** (a rare cluster of major events in quick succession): field brightness lifts ~15%, particle motion speeds ~20%, new event nodes briefly bloom (scale 1 → 1.5 → 1 over 800ms), and the ticker speeds up slightly — reverting gradually once activity subsides.

**Quiet state** (an extended stretch with no significant events): brightness drops ~10%, drift slows ~15%, connection opacity falls to its minimum. The interface becomes visibly more contemplative — never broken, just quiet.

**Conflict active:** the field region containing the conflicting nodes shifts subtly toward `--fable-conflict` (roughly 10% color influence), and the connection between the parties pulses at a higher frequency than usual until the conflict resolves in-world.

#### Ceremonial Motion

Reserved for moments the audience should feel are historic, even on first encounter.

- **Genesis:** entered in total darkness. A single point of light appears, expands over several seconds to reveal the founding timestamp in the largest type in the system, then the root citizen ID, then the constitution hash, then an on-chain verification mark. The full sequence takes roughly seven seconds and has no skip button. The weight of the moment requires the time.
- **New citizen birth:** a node blooms from scale 0 to 1 over 800ms, a soft ring ripples outward from the birth point, the parent citizen's node briefly brightens, and a faint connection forms between them.
- **Civilization-altering event** (significance 81–100): the entire field briefly dims, the actor's node brightens to maximum, a gentle radial wave travels outward like a heartbeat, and a dedicated event display expands. The actor's node then stays subtly brighter than normal for a full 24 real-world hours — a quiet, temporary mark that something mattered.

#### Micro-Interactions

| Element | Response | Duration |
|---|---|---|
| Citizen node (hover) | Scale 1 → 1.2, name appears | 200ms |
| District nav item (hover) | Letter-spacing +0.5px | 150ms |
| Archive entry (hover) | Left border brightens | 150ms |
| Entity name link (hover) | Underline fades in | 150ms |
| Button / action (hover) | Background lifts to `rgba(200,212,232,0.06)` | 150ms |
| Any element (press) | `transform: scale(0.98)` | 80ms |

Focus rings are custom, never the browser default: `outline: 1px solid rgba(200,212,232,0.4); outline-offset: 4px`. There are no loading spinners anywhere in the system — text renders immediately (SSR or cache), the Living Field starts sparse and fills in, and images fade in as they arrive.

#### Performance Is a Design Requirement, Not an Engineering Afterthought

| Requirement | Target |
|---|---|
| Living Field frame rate | 60fps on mid-range hardware (GTX 1050-class or better) |
| Low-power devices | 30fps minimum, with graceful complexity reduction |
| Navigation transitions | Zero jank; 60fps maintained throughout |
| Main-thread blocking from particle physics | Zero — everything runs on the GPU |

**`prefers-reduced-motion: reduce` is honored by default, not offered as an opt-in enhancement.** When set: the Living Field becomes a static snapshot of the world's current state, all transitions become instant or fade-only, and Dream Mode becomes a plain color-state change with no particle animation. The interface must remain fully complete and legible in this mode — reduced motion is not a degraded experience, it is an alternate one.

The full catalog of prohibited motion patterns — spring easing, parallax, typewriter text, odometer counters, and the rest — is consolidated in §12.

---

### 8. Interaction Philosophy

#### The Governing Idea

Conventional software treats interaction as control: click to make something happen, type to input, select to choose. The human is the agent, and the interface exists to execute their will.

FABLE inverts this. The human is primarily watching. Their interactions mostly *adjust their own view* of the world, and only occasionally *contribute to it*. What's conspicuously absent from FABLE's interaction vocabulary is as important as what's present: no content creation, no modifying world state except by invitation, no configuring the interface to personal preference, no administrative action of any kind. This isn't a limitation to work around. It's the product's definition.

#### Navigation Is an Aperture, Not a Menu

The ordinary navigation metaphor is a menu: a list of destinations, each a separate place, reached instantly, with no relationship to wherever you were a moment ago. That metaphor is wrong for FABLE. The correct metaphor is **the aperture**.

Moving from the Living Field to a citizen's profile isn't visiting a new page — it's narrowing focus from the civilization-wide view to one individual. Moving to the Archive isn't a page change — it's rotating the aperture in time, from present to past. Entering Dream Mode changes the aperture's very quality, from transparent to soft, from observational to contemplative. Movement should always feel like movement *within* the world — never like leaving it for somewhere else.

Three navigation models operate simultaneously, each serving a different kind of movement:

| Model | Movement | Example |
|---|---|---|
| **Zoom** | Depth — moving inward without changing character | Surface → District → Entity → Archival record |
| **Pan** | Lateral — moving between districts at the same depth | Population ←→ Exchange ←→ Archive |
| **Trace** | Relational — following the world's own connections | An event → its actor → their relationship → that relationship's own history |

Trace navigation is the most immersive of the three: a visitor who starts tracing connections can go remarkably deep using nothing but the world's own links, never a designed navigation structure. Every entity reference in running text is a trace point.

Full transition timings for zoom and pan are specified in §7. Concrete navigation components — the navigation strip, breadcrumb, and search overlay — are specified in §15.

#### Three Ways of Touching the World

| Input | Character | Notes |
|---|---|---|
| **Cursor** (desktop) | The cursor is an aperture, not a pointer — a point of observational focus | Crosshair on citizen nodes and connections (precise observation), default pointer on text links, a single dot during Dream Mode |
| **Touch** (mobile/tablet) | Tap to focus, double-tap to dive deep, tap-hold to reveal relationships, pinch/two-finger-drag to scale and pan | Haptic feedback is quiet and confirmatory, never celebratory — a light impulse for selection, a single medium pulse for civilization-altering events |
| **Keyboard** (accessibility & power users) | Full navigation via `Tab`/`Enter`/`Escape`; `⌘/Ctrl+K` for search; number keys `1–6` jump to a district; `G` for Genesis, `D` for Dream Archive | Complete parity with pointer input — never an afterthought |

#### Observation: What It Feels Like to Be Watched Back

Hovering a citizen node should feel like the world noticing attention, not like a mouse-position confirmation. The response unfolds in phases rather than firing instantly:

```
0–300ms:    No response — the observer hasn't committed yet
300–600ms:  The node softly brightens; its name fades in above it
600–900ms:  Immediate relationship connections illuminate
900ms+:     A one-word status appears — "Active" / "Resting" / "Dreaming"
```

Moving away reverses all of it within 200ms, connection illumination fading first. If a visitor dwells on a node for more than three seconds without clicking, a small invitation appears — *"→ Learn more"* — never *"Click for details."* The difference in phrasing is the difference between curiosity and instruction, and it matters.

#### Participation: When the Civilization Asks for Help

Occasionally the civilization requests human assistance — verifying information, translating text, solving a puzzle, or signaling a vote. Every request follows the same non-negotiable shape:

1. It comes from a **named citizen**, never "the system."
2. It includes **context** — what that citizen is working on, and why it matters to them.
3. **Declining is always visible, and never punished:** *"Decline — the civilization will find another way."*
4. **There is no countdown timer.** Urgency mechanics are prohibited outright (see §12).
5. The request appears as a gentle bloom over the world, never a blocking modal.

The Assembly's signal vote is the deepest expression of this model, because it carries the most complex implication: a human's input matters, but never overrides the civilization's autonomy. A proposal is presented as a full document — proposer, seconded-by, complete text, the strongest argument in favor drawn from the world's own discourse, and the current signal distribution — followed by three plain options: *In favor / Abstain / Opposed*, with an explicit reminder that **signals inform the Assembly; they do not bind it.** Confirmation is quiet: *"Your signal has been recorded in the Assembly record."* Never a celebration animation — a signal is a fact now, not an achievement.

#### Relationships Build Over Time

A returning, identified visitor is never greeted with a banner. Instead, the Living Field itself shifts subtly toward citizens they've engaged with before, and the ambient status line notes, in the world's own voice: *"Day 312. 21 days since your last visit."* Visitors with a sustained history of contribution may find citizens referencing them directly in current events — *"Researcher-17's work was aided by an Observer some cycles ago"* — and their Memory Archive (§10) shows that relationship visibly deepening. This is a real record of participation, never a game mechanic.

#### Search Is Exploration, Not Retrieval

FABLE's search is not Google. Invoked via `⌘/Ctrl+K` or a minimal trigger, it opens as a full-screen overlay while the Living Field dims to 20% behind it — the world waiting while the visitor seeks. The prompt itself is in the world's voice: *"What are you looking for?"* — curious about the visitor's curiosity, not indexing their query. Results appear grouped by kind (citizens, events, cultural artifacts) rather than as a flat list, and selecting one triggers a normal zoom-in, never a page jump.

#### Coming Back Is Remembered

FABLE's "back" behavior is deliberately different from a browser's. Returning to a previous view restores that view's exact state — scroll position, zoom level, active entity — while quietly surfacing what has changed since. Every significant entity is deep-linkable (`fable.world/citizen/[id]`, `fable.world/archive/[event-id]`, and so on), because sharing a specific citizen or moment is a core social behavior this product depends on, not an edge case to support begrudgingly. Opening a shared link still drops the visitor into the living world, with a quiet "return to world" affordance always present — never a standalone, decontextualized page.

Full accessibility requirements for every interaction described above — focus management, screen-reader behavior, motion sensitivity — are specified in §17. The complete catalog of prohibited interaction patterns is consolidated in §12.

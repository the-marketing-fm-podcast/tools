# Design

The visual system for `marketing-fm/tools` after the paper-newspaper redesign, 22 Sep 2026.
Governs the three-tier landing surface at `/`, `/audit`, `/january-campaign`, `/the-4-month-fill`.
The four free tools at `/who-stopped-coming`, `/dependency-audit`, `/cost-of-repeating`,
`/business-level-test` — and the tools index at `/tools` — are **untouched** in this pass: they
work, they pass 113 harness assertions, and their register (analyst's-desk) still fits the diagnostic
job they do.

## Theme

**Light only, by decision.** `data-theme="paper"` on `<html>` is the default; `data-theme="paper-bw"`
switches to the black-and-white variant. Both hold `color-scheme: light`. Rule preserved from the
earlier register.

The physical scene that anchors the new pages: a gym MD reading a broadsheet folded on a coffee-shop
table, mid-morning, sun through a window.

### ⚡ Two colourways, one register (22 Sep 2026)

| Variant | When it wins | What changes |
|---|---|---|
| `data-theme="paper"` | Default. Marketing FM's identity carries into the page | Terracotta accent on links, kickers, price figures, CTAs, editorial-em emphasis |
| `data-theme="paper-bw"` | The real broadsheet look — a page that reads as ink and paper only | Every terracotta token → near-black; slightly heavier paper texture to compensate for the missing accent colour |

**Switch mechanics.** Every paper page has a small `Read in black and white` link in the footer that
flips the attribute on `<html>` and persists it via `localStorage['mfm-theme']`. `?theme=bw` or
`?theme=colour` on the URL also flips it — useful for sharing a specific rendering.

## Color

**Strategy: restrained ink + committed accent.** Body is a true off-white at chroma 0 — not a
warm-tinted parchment. Ink for text. **Terracotta survives from the earlier register as the one
accent that carries brand identity**; kept because Karl's business has already been shipping in
that colour on the free tools and on the shipped launch video, and identity-preservation wins over
a fresh palette when there's an established one.

⚠️ **The AI cream/parchment trap.** impeccable's own reference is explicit: tokens named `--paper`,
`--cream`, `--parchment` and warm-tinted near-white body backgrounds are the AI monoculture move of
2026. **The newspaper feel here is typographic, not chromatic.** Grain overlay carries the paper
quality; the base is off-white at zero chroma.

| Token | Light | Role |
|---|---|---|
| `--ink` | `#141414` | Body text, headlines, rules |
| `--ink-2` | `#3a3a3a` | Secondary text, decks, bylines |
| `--ink-3` | `#6a6a6a` | Kickers, captions, metadata |
| `--paper` | `#faf8f4` | Body background — off-white at effective chroma 0 |
| `--paper-2` | `#f2eee7` | Recessed surfaces (banner, footer) — slightly warmer only where a section break needs it |
| `--brand` | `#D85A30` | Terracotta. Section rules, links, the primary action |
| `--brand-deep` | `#712B13` | Deep terracotta for headline figures and emphasis inside washed blocks |
| `--brand-wash` | `#FAECE7` | Tinted background for the front-page banner |
| `--rule` | `#141414` | Horizontal rules between sections (matches ink for that broadsheet weight) |
| `--rule-thin` | `#3a3a3a` | Kicker underlines, table hairlines |

⛔ **No gradient, no gradient text, no glassmorphism.** ⛔ **No sand/beige/wheat/parchment.**

**Grain overlay.** A single SVG `feTurbulence` filter applied as a `background-image` on `body`,
opacity ~4%, non-animated, respecting `prefers-reduced-motion` (still shown because it's static
and non-motion — reduced-motion only kills animation). This is what makes the off-white read as
paper without tinting it.

## Typography

**Seven typewriter fonts allocated to four roles.** Preserved from Karl's decision — 3 fonts per
page maximum, 4 across the whole site. All self-hosted; zero external requests.

| Token | Font | Used for |
|---|---|---|
| `--font-display` | **CF Remington Typewriter** | Masthead, hero, tier column headlines, prices. Heavier weight reads at scale |
| `--font-body` | **Traveling Typewriter** | Body prose, decks, ledes, tables. Best legibility at 16–18px |
| `--font-spec` | **Blade Runner Screenplay** | Spec-document register — offer sheets and contract-style pages only. **Partial demo font**; use only for headers where the character set is confirmed |
| `--font-hand` | **Albertsthal Typewriter** | Handwritten accents — margin notes, signatures, callouts. **Used sparingly** — max one instance per page. Italicised so it reads as an annotation, not a second column of body copy |
| `--font-alt-display` | **Established Typewriter** | Alternate display face, tested against CF Remington in `/live` before final lock |
| `--font-alt-body` | **Special Elite** | Alternate body face, tested against Traveling in `/live` before final lock |
| ⛔ ~~`--font-alt-hand` · Typewriter Keys~~ | **DROPPED 22 Sep 2026** | The circular-key glyphs made body copy unreadable as words. `--font-hand` now uses Albertsthal Typewriter directly, no alternate |

**Pairing rule:** display + body come from the typewriter family (contrast axis is weight and
proportion, not two different families). Spec-doc is a distinct face for the offer detail pages
where the contract register earns its place. Handwritten is a deliberate one-per-page accent.

⚠️ **Font licence status.** 6 of 7 fonts are non-commercial licences. Karl ships anyway; the
fallback stack (Special Elite / Courier Prime / IBM Plex Mono, all commercially cleared) is
documented in `_engine/fonts/LICENCE_STATUS.md`.

### Type scale

- Masthead: `clamp(24px, 3.5vw, 32px)`, letter-spacing `0.06em`, uppercase
- H1 / editorial headline: `clamp(28px, 6.5vw, 56px)`, `letter-spacing: -0.02em`, `line-height: 1.1`
- H2 / tier column headline: `clamp(22px, 3vw, 32px)`, `letter-spacing: -0.015em`, `line-height: 1.15`
- Kicker: `13px` uppercase, letter-spacing `0.14em`, colour `--ink-3`
- Deck (h2 subhead): `clamp(16px, 2vw, 20px)`, italic
- Body: `16px` on mobile, `17px` desktop, `line-height: 1.6`
- Price / countable: `clamp(28px, 5vw, 44px)`, `--font-display`
- `text-wrap: balance` on h1–h3
- `text-wrap: pretty` on prose
- `tabular-nums` on figures
- `overflow-wrap: anywhere` where pasted content can appear

## Layout

### Container

- **Landing pages**: max-width `72rem` (~1152px). Wider than the tool-page 640px because the
  three-column front-page structure needs the width.
- **Tier detail pages** (`/audit`, `/january-campaign`, `/the-4-month-fill`): max-width `48rem`
  (~768px). Long-form reading. One column.
- **Tool pages**: `wrap` at 640px, **unchanged** — see the tool-page architecture already documented
  in the existing register.

### Front-page structure

```
──── MASTHEAD (nameplate + date) ────
──── NAV (5 links) ────
▓ BANNER — free teardown CTA ▓
──── EDITORIAL — the through-line ────
COLUMN 1 ┃ COLUMN 2 ┃ COLUMN 3
(tier)    (tier)     (tier)
──── FOOTER ────
```

Three columns via `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` — no breakpoints,
naturally collapses to one column on narrow viewports (any width < 900px shows a single stacked
column).

### Rules

- Horizontal rules (`hr`) between sections at `--rule` weight. Broadsheet-heavy 2px on masthead,
  1px between story columns.
- **No side-stripe borders. No nested cards.** Rule preserved from the earlier DESIGN.md.
- Side padding respects `env(safe-area-inset-*)` for landscape notches.
- Radii: **0.** Newspapers don't have rounded corners. Rule breaks for one thing only: the CTA
  button, at 4px, so it still reads as a button.

## Motion

**Minimal and intentional.** Two moves only:

1. **View Transitions API on route change** — cross-document page-turn. Progressive enhancement:
   Chromium 111+ and Safari 18+ get the paper-fold transition; older browsers get an instant
   navigation. Gracefully degrades.
2. **Masthead rise on first paint** — one-time, 200ms, ease-out-quart. On the home page only.

⛔ **No typewriter character-by-character reveal on hero copy.** Considered and dropped. The
Editorial headline is the through-line — cognitively heavy prose. A reveal animation gates the
reader's ability to scan it and imposes cost on repeat visitors. Newspapers don't animate.

⛔ **No decorative scroll animations.** No parallax, no fade-in-on-scroll, no reveal transitions
on section headings. The masthead-rise is the only intentional load-in.

Grain SVG overlay is static; it isn't animation.

`prefers-reduced-motion: reduce` collapses everything to 0.01ms. Already implemented globally.

## Components in use

`.masthead` · `.nav` · `.banner` · `.editorial` · `.column` (a tier front-page story) ·
`.kicker` · `.deck` · `.lede` · `.byline` · `.price` · `.cta` · `.cta-ghost` · `.spec` (screenplay
block, tier detail pages) · `.margin-note` (handwritten accent) · `.rule` · `.footer`

Preserved from the tools' existing engine.css (used only on `/tools` and the four diagnostic
pages, not on the new landing surface): `.card` · `.btn` / `.btn-ghost` · `.stat` · `.tool` ·
`.list` / `.item` · `.ladder` / `.rung` · `.big` / `.bigsub` · `.blocker` · `.honest` · `.src` ·
`.prog`

## Interaction

Unchanged from the previous register. All still governing:

- Every screen is a history entry; Android Back is primary nav
- No autofocus on touch — gated on `(hover:hover) and (pointer:fine)`
- `touch-action: manipulation` and no tap-highlight flash
- `:focus-visible` outlines at 2px in `--brand`, offset 2–3px. Never on tap
- `(hover:hover)` states so laptops get feedback that touch devices don't need

## Bans specific to this project

⛔ **No stock photography.** Rule preserved from the earlier register.
⛔ **No cream / sand / beige / parchment body background.** The AI 2026 default — see Colour §.
⛔ **No SaaS three-tier pricing card layout.** Three columns are newspaper stories, not pricing tiles.
⛔ **No design-portfolio style.** The evidence is the thinking.
⛔ **No decorative "eyebrow" uppercase-tracked headings above every section.** Newspapers don't do
this; they use kickers over specific stories, not on every h2.
⛔ **No external requests.** Fonts self-hosted (all seven), grain SVG inline, all CSS inline in the
`<style>` block per page per the existing build pattern.
⛔ **No JavaScript framework.** Vanilla HTML+CSS. One inline `<script>` for View Transitions API
detection only.

## The bridge across register: what carries over from the previous DESIGN.md

- The whole tool-page architecture (`/who-stopped-coming` etc.) — untouched
- The four free tools' engine.css — untouched
- The `?ref=` partner attribution system — carried through onto the new pages
- The WhatsApp tag mechanism (`[GONE-?]`, `[BLT-L2]`, etc.) — extended with new tags for the new pages
- The 4.5:1 contrast rule
- The two-reader rule
- The proof-discipline stance — no fake logos, no invented outcomes, `no delivered gym campaign yet`
  said out loud when it applies
- The terracotta identity colour

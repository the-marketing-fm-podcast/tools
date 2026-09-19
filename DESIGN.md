# Design

The visual system for `marketing-fm/tools` — the four diagnostics and the Views to Members site that
now sits above them. Captured 19 September 2026 from `_engine/engine.css`, which is the single source
of truth and is stitched into every page at build time.

## Theme

**Light only, by decision.** `data-theme="light"` on `<html>`, plus `color-scheme: light` and a matching
`theme-color`, so the Android address bar and native controls follow the page instead of the phone. The
full dark palette stays defined in `engine.css` — removing the attribute brings it back.

The physical scene that settles it: a gym marketer on a budget Android, on mobile data, in daylight,
between other tasks. Dark would be a style choice fighting the ambient light.

## Color

**Strategy: committed.** Terracotta carries real surface area on site pages — the hero, section breaks,
the offer block — not a sprinkle of accent on neutral. On tool pages it stays restrained, because a
question card is a product surface and the colour there is functional.

⚠️ **This is a deliberate correction.** The first pass wrote *restrained* for both, and the brand
register is blunt that restraint without intent reads as mediocre rather than refined: *safe = invisible.*
Terracotta predates this work and is the identity, so committing to it is both the braver and the
more faithful move.

**The named reference for the strategy:** a terracotta field carrying the argument, the way Klim's
specimen pages let one colour own the page — but with the type doing the talking rather than the
colour being the subject.

| Token | Light | Role |
|---|---|---|
| `--brand` | `#D85A30` | Terracotta. Accents, links, the one primary action |
| `--brand-soft` | `#F5C4B3` | Borders on brand-washed blocks |
| `--brand-wash` | `#FAECE7` | Tinted background for a figure that matters |
| `--brand-deep` | `#712B13` | Headline figures, emphasis inside washed blocks |
| `--canvas` / `--bg` / `--bg-2` | `#f6f6f4` / `#ffffff` / `#f1f1ef` | Page, card, recessed |
| `--text` / `--text-2` / `--text-3` | `#1a1a1a` / `#565656` / `#888a8d` | Ink, secondary, tertiary |
| `--border` / `--border-2` | `#e2e2df` / `#ededea` | Rules and hairlines |
| `--ok-bg` / `--ok-text` | `#e6f4ed` / `#15875a` | Resolved, passing |
| `--warn-bg` / `--warn-text` | `#fbf1e0` / `#b45309` | Caution, blockers |

⛔ **No cream, sand, beige or parchment body background.** `--canvas` is a near-neutral at effectively
zero chroma, not a warm tint. ⛔ **No gradients, no gradient text, no glassmorphism.**

## Typography

**System stacks only.** Zero external requests is a hard constraint — these pages load on poor mobile
data and are sometimes sent as a file over WhatsApp.

| Token | Stack | Used for |
|---|---|---|
| `--font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | Body, UI, navigation |
| ⚡ `--font-serif` | `Georgia, ui-serif, "Times New Roman", serif` | **Display headings and pull quotes on site pages.** Added 19 Sep |
| ⚡ `--font-mono` | `ui-monospace, "Cascadia Code", Consolas, monospace` | **Figures and tabular data only.** Added 19 Sep |

**Pairing rule:** serif for argument, sans for reading, mono for anything countable. The contrast axis is
serif-versus-sans, never two similar sans faces.

> ### Why Georgia, named deliberately rather than reached for
> **Three brand-voice words: sturdy, exact, unhurried.** The physical object is a ruled ledger with
> figures entered by hand — the repo's own *kasuku book*, not a magazine.
>
> Georgia is **not on the reflex-reject list**, was drawn for screen legibility rather than fashion, has
> true tabular-ish figures, and reads institutional rather than styled. ⚠️ **It is also the one serif
> that needs no download**, which matters: a web font is an external request, and these pages load on
> Kenyan mobile data and are sometimes sent as a file over WhatsApp.
>
> ⛔ **Mono is confined to figures.** The register bans *"monospace as lazy shorthand for technical"* —
> here it marks things that are countable, which is the actual subject, not a costume.

- `h1`: `clamp(26px, 6.5vw, 36px)`, `letter-spacing: -.02em`, `line-height: 1.15`
- Body: 16px, `line-height: 1.55`
- `.big` headline figure: `clamp(38px, 12vw, 60px)`, weight 800, `letter-spacing: -.035em`
- `text-wrap: balance` on headings, `pretty` on prose, `tabular-nums` on figures
- `overflow-wrap: anywhere` where pasted content can appear

## Layout

- **Tool pages: 640px max.** One column, thumb-reachable, unchanged.
- ⚡ **Site pages: wider.** The 640px `.wrap` is correct for a question card and too narrow for a
  landing page. Site pages use a wider container with prose blocks still capped at 65–75ch.
- Side padding respects `env(safe-area-inset-*)` for landscape notches.
- Radii: 8px medium, 12px large. Nothing else.
- ⛔ **No nested cards.** ⛔ **No identical three-card grids.** ⛔ **No side-stripe borders** — the one
  existing `inset 3px 0` on `.rung.here` is a state indicator inside a ladder, not decoration, and does
  not generalise.

## Motion

Minimal and functional. Transitions are `.12s`–`.25s` on colour and opacity only; no layout animation.
`prefers-reduced-motion: reduce` collapses everything to `.01ms` and is already implemented globally.

⚠️ Content is never gated behind a reveal transition — a class-triggered reveal that does not fire ships
a blank section.

## Components in use

`.card` · `.btn` / `.btn-ghost` · `.stat` (brand-washed figure block) · `.tool` (index link card) ·
`.list` / `.item` · `.ladder` / `.rung` · `.big` / `.bigsub` · `.blocker` · `.honest` (left-ruled aside
for caveats) · `.src` (source line) · `.prog` (step indicator)

⚡ **`.honest` is the most important one for the new pages.** It is the caveat voice — a quiet
left-ruled note in `--text-3` — and proof discipline means most claims travel with one.

## Interaction

Documented in full in `README.md` §*Interface rules this site holds to*, checked against the Web
Interface Guidelines. The load-bearing ones:

- Every screen is a history entry; Android Back is the primary navigation control.
- No autofocus on touch — gated on `(hover:hover) and (pointer:fine)`.
- `touch-action: manipulation` and no tap-highlight flash.
- `:focus-visible` outlines at 2px in `--brand`, offset 2–3px. Never on tap.
- `(hover:hover)` states so laptops get feedback that touch devices do not need.

## Bans specific to this project

⛔ **No stock photography.** There are no image assets in any repo, and a gym stock photo on a page that
sells analysis would be the first lie told.

> ### ⚡ But zero imagery is a bug, and the fix is the data
> The brand register is explicit: *"text-only pages where typography alone carries the entire visual
> weight are the failure mode"* — and equally explicit that **data visualisation counts as imagery.**
>
> **Every case study on this site owns a chart built from its own findings**, inline SVG, no library,
> no external request:
> - **rugsbysensei** — 9% like rate against a 0.41% follow rate, as two bars at wildly different
>   heights. The whole argument in one picture.
> - **Zelha** — five creators plotted on gym focus against gym engagement.
> - **AskSidney** — average views per video by month, 2023 to 2026, with the median underneath it.
> - **The gym offer teardown** — the per-month price ladder, showing the curve flattening at twelve
>   months.
>
> ⚠️ **Every chart is drawn from a number already in the source document.** No chart may introduce a
> figure that is not in the work it illustrates.

⛔ **No uppercase tracked eyebrow above every section**, and ⛔ **no ruled-column editorial grammar.**
The brand register names *"display serif + small mono labels + ruled separators + monochromatic
restraint"* as a saturated lane with a recognisable fingerprint. The analyst's-desk feel comes from the
charts, the sourcing and the caveats — **not from magazine furniture.** The existing `.step` and
`.grouphead` are functional labels inside tools, not section eyebrows on a landing page.

⛔ **No hero-metric template** — big number, small label, three supporting stats, accent. The figures on
this site belong next to the work that produced them.

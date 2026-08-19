# Marketing FM — free tools

Interactive diagnostics for Kenyan SME owners. Each one takes under five minutes, asks for nothing
the owner has to look up, and ends in a WhatsApp message that arrives already knowing what to sell.

**Live:** the Toolbox at `/`, and one path per tool.

| Path | Tool | Mode | Reveals |
|---|---|---|---|
| `/` | The Toolbox | — | Index. This is the link that goes in the bio and on every meme |
| `/business-level-test` | The Business Level Test | `levels` | Which of six digitalisation rungs they're on |
| `/cost-of-repeating` | The Cost of Repeating Yourself | `calc` | What answering the same questions costs, in KSh a year |
| `/dependency-audit` | The Gym Owner Dependency Audit | `score` | How much of the gym exists only in the owner's head |

---

## The two rules this repo exists to enforce

**1. Every number on screen is either the user's own input, or carries a source link.**

No benchmarks, no "most businesses like yours", no invented averages. The Drive spreadsheets these
tools came from are full of unsourced figures — *"30% is never recovered"*, *"SMEs overpay by 8–15%"* —
and none of them survived the conversion. The owner's own number needs no source and cannot be
checked and found wrong.

**2. Diagnose free, do paid.**

Every tool tells someone where they stand and then stops. Filling it in for them is the product.

---

## Adding a tool (about 30 minutes)

1. `mkdir <tool-name>` and write `<tool-name>/config.js`.
2. Pick a mode. `levels` for a ladder, `score` for a count out of N, `calc` for numeric inputs.
3. Run the build, then run the copy through the `ogilvy-audit` skill and fix every Critical and Moderate.
4. Commit and push. **The push is the deploy.**

```bash
pwsh tools/_engine/build.ps1
```

### What goes in a config

`config.js` holds **every word a user will read**, plus the arithmetic. That is deliberate: it means
one file per tool can be handed to a copy audit, and the engine never needs opening.

Two lines are load-bearing — the build script reads them to fill `<title>` and the meta description,
so each must sit on its own line and end with `",`:

```js
  title: "The Thing — Marketing FM",
  desc: "One sentence describing what the reader gets.",
```

### The three modes

| Mode | Config supplies | Engine does |
|---|---|---|
| `levels` | `levels[]`, `questions[]` each tagged `lv`, `verdict{}`, `next{}`, `skipNote()` | Your level is the highest rung where **every** question below it is a yes. Renders the ladder, the blocker, and a warning when rungs are skipped |
| `score` | `questions[]` with `no:` text, `bands[]`, `priority[]` | Counts the yeses, picks the band, groups the NOs in priority order |
| `calc` | `inputs[]`, `result(v, u)` returning `{body, msg, cta, alt}` | Renders one numeric field per screen, validates, clamps at `max`, hands the values to your `result()` |

Set `sell:false` on a band (or return `msg:null`) when a result should **not** go to a sales
conversation. The engine then shows `alt` instead of the WhatsApp button. A 15/15 audit score and a
Level 5 test result both use this — selling to someone the offer can't help costs more than the sale.

---

## How a lead is tracked, with no analytics

Every result writes its own WhatsApp message ending in a bracketed tag:

```
[BLT-L2]        Business Level Test, Level 2
[DEP-GYM-6]     Dependency Audit, gym, scored 6
[INT-533K]      Cost of Repeating, KSh 533,000 a year
```

The tag says which tool produced the lead and what it found. It goes in the `Tool Tag` column of
`tracking/pipeline.csv`. No cookies, no pixel, no consent banner, nothing to maintain.

### Partner attribution — `?ref=`

Give a partner their own link and their name rides along into the message:

```
/dependency-audit?ref=KEVIN     →     [DEP-GYM-6 via KEVIN]
```

Works on every tool, carries across internal links (so an owner who lands on the Toolbox and picks a
different tool is still attributed), and survives Back/Forward.

**It is never written into the page** — only into the WhatsApp text, where it is
`encodeURIComponent`'d. The value is URL input, so it is whitelisted to `A-Za-z0-9 _-` and capped at
24 characters. Brackets are stripped specifically so a `ref` cannot forge or break the tool tag.

This exists because the alternative was paying a friend on a remembered introduction.

---

## Build

`build.ps1` stitches `_engine/shell.html` + `engine.css` + `engine.js` + `<tool>/config.js` into a
single self-contained `<tool>/index.html`, and `_engine/toolbox.src.html` into `/index.html`.

Output is committed. There is no build step on Vercel — no framework, no install, no build command.
Each page is one file with **zero external requests**, so it also works offline and can be sent to
someone as a file on WhatsApp.

Edit `config.js` or anything in `_engine/`, then rebuild. Never hand-edit a generated `index.html`
you intend to keep — the next build overwrites it.

---

## Verification

The boundary-case harness stubs a minimal DOM and drives scoring through `window.__engine`, so the
logic is checked without clicking:

```bash
node harness.js
```

It covers all four Level Test boundaries, every Dependency Audit band edge (0, 4/5, 9/10, 12/13, 15),
the calculator's hand-checked arithmetic, its zero-interruption and zero-revenue branches, the
KSh 60,000 routing flip, and that no benchmark language has crept into any result. 55 assertions.

Screenshots at phone and laptop size, every screen — 40 images:

```bash
node shots.js
```

Needs `playwright-core` and a cached Chromium; the executable path is pinned at the top of the
file. Writes to `shots/`.

Before publishing a change, also check on a real phone:

- [ ] The WhatsApp link opens a chat to **254704334027** with the message and tag intact
- [ ] Result renders at 375px
- [ ] The headline result is above the fold at 640px — budget Androids, not iPhones
- [ ] **Hardware Back steps to the previous question** rather than leaving the site

---

## Interface rules this site holds to

Checked against the [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines).
The ones that carry real weight for this audience:

- **Every screen is a history entry.** Android's Back gesture is the primary navigation control
  here. Without this, a user eleven questions in who taps Back loses everything. The in-page Back
  button calls `history.back()` so the two can never disagree.
- **No autofocus on touch devices.** It throws up the keyboard and pushes the question off screen
  before it has been read. Desktop only, gated on `(hover:hover) and (pointer:fine)`.
- **The Next button is never disabled.** A greyed-out button explains nothing; an inline message
  says exactly what to type.
- **`touch-action: manipulation`** kills the 300ms double-tap delay, which is very visible on a
  budget Android.
- **`:focus-visible` rings and `(hover:hover)` states**, so the site is equally usable with a
  keyboard and trackpad on a laptop.
- **Light theme only**, set with `data-theme="light"` on `<html>` plus `color-scheme: light` and a
  matching `theme-color` meta, so the Android address bar and the native number spinner follow the
  page instead of the phone. The full dark palette is still in `engine.css` — drop the attribute to
  bring it back.
- **The Toolbox is a menu, not an argument.** It opens straight into the three tools. A hero or a
  statistics block pushes every link off the first screen at 360px, and most arrivals already know
  they have a problem — the evidence belongs inside the tools, where they have already clicked in.
- **The gym audit leads.** It is the live campaign and where the traffic is pointed. Revisit when a
  second vertical ships and the page is no longer aimed at one industry.

---

## Known minor copy notes

Logged from the `ogilvy-audit` pass rather than fixed, per the rule that polishing a help line is not
worth the time:

- *"That is..."* opens several verdict lines across the tools. Repetitive if you read them all in one
  sitting, which no user ever will.
- The bracketed tag is visible to the user in the WhatsApp message. It reads as a reference number,
  which is normal here, but a user could delete it. Losing the tag costs tracking, not the lead.

**Not yet done:** Ogilvy's rule 7 — read the questions aloud the morning after writing them, then
edit. These were written and shipped the same day.

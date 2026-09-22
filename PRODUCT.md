# Product

## Register

brand

## Platform

web

## Users

Kenyan gym groups — two people, addressed together on the same page, per the standing two-reader rule.

The **owner or MD** signs the fees, is not in the feed every day, and is measured by revenue. The
**head of marketing** owns the daily posting, is measured by a number nobody can attribute, and is
who forwards a page to a boss who has never met Karl.

They arrive cold on a phone, usually on mobile data, from a WhatsApp forward, an Instagram DM, or a
link in a bio. **The job they're trying to get done isn't "buy marketing."** It's answer the question
their boss keeps asking: *what did all that posting actually produce?*

⛔ **Every page has to work twice** — sharp enough to grip a practitioner who does this daily, safe
enough to survive being forwarded to a boss who has never heard of Marketing FM. Nothing that makes
the marketer look incompetent can be published, because the marketer is who forwards it.

## Product Purpose

The site sells **three tiered products** built on one thesis. From cold visitor to committed buyer:

1. **The Priced Teardown** — a paid audit. KSh 20,000. Delivered in 5 business days.
2. **The January Campaign** — the Views to Members 25K/6-week campaign, sold Oct–Nov only.
3. **The 4-Month Fill** — a fixed-term SMM consulting engagement, KSh 16,500/week.

Above them, one magnet: the **free public-data teardown** that produced this business's only warm
reply. It occupies the front-page banner slot on the home page.

**Success:** a gym sends its price page over WhatsApp without being asked twice, and the first three
paid audits deliver — producing the first delivered case study, which every other document in this
business treats as more valuable than the fee.

## Positioning

**The only person in this market who will read a gym's content and its price list together, and show
which one is breaking the other.** *(Preserved from the previous register — the argument holds.)*

## Conversion & proof

- **Primary CTA everywhere:** WhatsApp with a pre-filled message and a per-page source-tag —
  `[TEARDOWN]`, `[JAN-CAMPAIGN]`, `[4-MONTH-FILL]`, `[FREE-TEARDOWN]`. Same `?ref=` partner
  attribution the existing free tools already carry.
- **The line a visitor remembers after ten seconds:** the through-line above the fold —
  *"You have to do sales because you are poor at marketing. You have to do marketing because you are
  poor at product development — you have no offer."*
- **Belief ladder**, in the order the home page has to earn it:
  1. This is about gyms, and specifically about gyms that already post.
  2. The problem isn't the marketer. It's the offer. Every plan is a duration.
  3. This person has actually done this work before, on named businesses, with real numbers.
  4. There's a version of this that costs me nothing to find out.
  5. If I upgrade, there's a specific ladder: audit → campaign or fill.
- **Proof on hand** — four delivered pieces, all real, none invented. Moved **from the home page to
  `/audit` as *"what this looks like in practice"*** (Karl's decision, 22 Sep 2026). Rugsbysensei,
  Zelha creator roster, AskSidney catalogue, the two Nairobi gym price teardowns.
- ⛔ **No testimonials, no client logos, no results claims.** None exist. The work itself is the
  proof, and the format is *what were you doing before this* — never a testimonial.

## Brand Personality

**A local newspaper's front page.** Editorial, evidence-first, unhurried. Ink on off-white paper.
Typewriter voice.

The physical scene that anchors it: a gym MD reading a broadsheet folded on a coffee-shop table,
mid-morning, sun through a window. Not a magazine. Not a design portfolio. **A newspaper — because a
newspaper's job is to argue with evidence, in public, and be forwarded.**

Serifed typewriter faces do the display work; the same typewriter voice runs body. Numbers do the
talking and the prose stays out of their way. Confident because it shows its working, never because
it asserts loudly.

## Anti-references

- ⛔ **A SaaS three-tier pricing page.** Notion/Vercel/Linear-style cards side by side, feature
  checkmarks, "Trusted by" strip, a free-trial button. This is the exact aesthetic the buyer's own
  agency already delivered. **Three tiers arranged as three newspaper columns, not three pricing
  tiles.**
- ⛔ **A digital marketing agency site.** Stock gym photography, *"we grow brands"*, gradient hero,
  team grid, logo carousel. The register the buyer has already been burned by.
- ⛔ **The AI cream / sand / parchment landing page.** Warm-tinted near-white body background, tiny
  uppercase tracked eyebrow above every section, three identical cards, big-number hero metric
  block. Naming a background `--paper` or `--parchment` is itself the tell — impeccable's own
  reference flags this. The body background is **true off-white at chroma 0**; paper texture comes
  from **SVG grain overlay**, not colour. Warmth is carried by the typewriter faces and by the one
  terracotta accent that survives from the previous register.
- ⛔ **A design portfolio.** The evidence is the thinking. Every case study is analysis; nothing
  decorative earns a place.

## Design Principles

**The two-reader rule is load-bearing.** Every page has to grip a practitioner AND survive being
forwarded to a boss who's never met Karl. This governs copy tone (no jargon a boss can't parse),
image choices (none), and the register (evidence-first, no manufactured urgency).

**The paper metaphor is typographic, not chromatic.** Newspaper feel comes from mastheads, kickers,
decks, ledes, ruled dividers, columned layouts, and typewriter type. Not from beige backgrounds or
crumpled-paper illustrations. The body is off-white; grain is added via SVG noise, not tint.

**Show them their own numbers.** Every figure is either computed from the subject's published page
or carries a source on the page. An invented number never reaches a visitor. *(Rule preserved from
the previous register.)*

**The missing offer is the villain, never the marketer.** The category has the problem, not the
person reading. Rule preserved from Views to Members §11.

**Practise what the work preaches.** The rugsbysensei audit told its client to put one tap between
an interested stranger and a conversation. The site does the same thing — every CTA is one
WhatsApp tap with a pre-filled message.

**Every screen is a history entry.** Android Back is the primary navigation control. Multi-page
architecture (not SPA) makes this native.

## Accessibility & Inclusion

Preserved from the existing DESIGN.md's interface rules — all still hold on the new pages:

- Every screen is a history entry; Android Back is primary nav
- No autofocus on touch — gated on `(hover:hover) and (pointer:fine)`
- `touch-action: manipulation` to kill the 300ms double-tap delay
- `:focus-visible` outlines at 2px, offset 2–3px
- `(hover:hover)` states so laptops get feedback that touch devices don't need
- Light theme only, `data-theme="light"` + `color-scheme: light` + `theme-color`
- Body text ≥4.5:1 against its background; large text ≥3:1
- Every animation needs a `prefers-reduced-motion` alternative
- **Zero external requests.** Fonts self-hosted, no analytics, no CDN calls, no framework

## ⚠️ Font licence status (Karl's decision, 22 Sep 2026)

Six of seven typewriter fonts on this site are **non-commercial licences**. Karl was surfaced this
finding and chose to ship anyway, accepting the risk. The one commercially-cleared font is
**Special Elite** (Apache 2.0). If a licence claim ever arrives, the fallback plan is:
Special Elite as body/display, Courier Prime (SIL OFL) as screenplay/spec-doc, IBM Plex Mono as
fallback. Rebuilding the site with the fallback stack is ~1 day of work.

Details: `_engine/fonts/LICENCE_STATUS.md`.

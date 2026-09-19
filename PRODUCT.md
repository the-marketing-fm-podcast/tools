# Product

## Register

brand

## Platform

web

## Users

Kenyan gym groups — two people, addressed together on the same page.

The **owner or MD** can spend and is not in the feed every day. The **head of marketing** owns the
problem, posts daily, and is measured on a number nobody can attribute. They arrive cold, usually on a
phone, often on mobile data, from an Instagram DM or a forwarded link.

The job they are trying to get done is not "buy marketing". It is answer the question their own boss
keeps asking: *what did all that posting actually produce?*

Every artefact therefore has to work twice — sharp enough to grip a practitioner who does this daily,
and safe enough to survive being forwarded to a boss who has never heard of Marketing FM. Nothing that
makes the marketer look incompetent can be published, because the marketer is the one who forwards it.

## Product Purpose

The site sells one thing: **Views to Members**, a six-week campaign that gives a gym's content something
specific to sell, at KSh 25,000.

It exists because the offer had nowhere to live and no evidence attached to it. Four pieces of delivered
client work already existed, scattered across GitHub Pages and an archive folder, unlinked and
unexplained. The site's job is to put them in one place and let them make the argument.

Success is a gym sending its price page without being asked twice.

## Positioning

The only person in this market who will read a gym's content and its price list together, and show
which one is breaking the other.

## Conversion & proof

- **Primary CTA:** a free teardown of their offer — *send me your price page*, over WhatsApp
  (254704334027). It is the smallest possible yes, it qualifies the prospect while it runs, and the
  same public page that qualifies them is the raw material of the deliverable.
- **Secondary CTA:** run one of the four free tools. Already built, already live, zero marginal cost,
  and finishing one is the only completion signal the business currently counts.
- **The line a visitor remembers after ten seconds:** *Views don't become members on their own.*
- **Belief ladder**, in the order the page has to earn it:
  1. This is about gyms, and specifically about gyms that already post.
  2. The problem is real and it is not my team's fault — every post ends in the same ask.
  3. This person has actually done this work before, on named businesses, with real numbers.
  4. The method is repeatable, not a one-off insight.
  5. There is a version of this that costs me nothing to find out.
- **Proof on hand** — four delivered pieces, all real, none invented:
  - `audit-rugsbysensei.html` — 12 videos, ~25,000 views, 9% like rate against a 0.41% follow rate.
    Delivered 31 July 2026.
  - `zelha-roster-report` — 840 videos across five creators at a Juja gym, ranked, with one named to
    contract first.
  - `AskSidney-Content-tear-down` — 1,829 videos, an entire TikTok history, by theme and by month.
  - The gym offer teardown — price ladders recomputed per month from two Kenyan gym groups' own
    published pages.
- ⛔ **No testimonials, no client logos, no results claims.** None exist. The work itself is the proof,
  and the format is *what were you doing before this* — never a testimonial.

## Brand Personality

An analyst's desk. Editorial, evidence-first, unhurried.

Serif for argument, monospace for figures, colour used sparingly and only where it means something. The
numbers do the talking and the prose stays out of their way. Confident because it is showing its
working, never because it is asserting loudly.

This is already how the existing case studies look, so the site and the work match rather than
advertise each other.

## Anti-references

- **A digital marketing agency site.** Stock gym photography, *"we grow brands"*, a team grid, a logo
  carousel, a gradient hero. This is the exact thing that already took their money and posted nothing,
  and looking like it forfeits the argument before a word is read.
- **An AI-generated landing page.** Cream or sand body background, a tiny uppercase tracked eyebrow
  above every section, three identical cards, a big-number hero metric block.
- **A SaaS product page.** Pricing tiers side by side, feature checkmarks, a *"Trusted by"* strip, a
  free-trial button. There is one thing at one price.

## Design Principles

**The evidence is the thinking.** This is not a design portfolio and there are no images to art-direct.
Every case study is an analysis. Nothing decorative earns a place.

**Show them their own numbers.** Every figure is either computed from the subject's published page or
carries a source on the face of the page. An invented number never reaches a visitor.

**The missing offer is the villain, never the marketer.** The category has the problem, not the person
reading. *Gyms find it hard to turn viewers into buyers* — never *you posted and nobody joined.*

**Proof of the work, not proof of results.** There are zero delivered case studies with a revenue
outcome and the site must never imply otherwise. What it can show is the work, dated, in full.

**Practise what the work preaches.** The rugsbysensei audit told its client to put one tap between an
interested stranger and a conversation. The site does the same thing, with the same mechanism.

## Accessibility & Inclusion

Taken from the commitments already documented in `README.md` §*Interface rules this site holds to*,
checked against the Web Interface Guidelines. They were written for a budget Android on mobile data and
they govern the new pages too:

- Every screen is a history entry; Android's Back gesture is the primary navigation control.
- No autofocus on touch devices — gated on `(hover:hover) and (pointer:fine)`.
- `touch-action: manipulation`, to kill the 300ms double-tap delay.
- `:focus-visible` rings and `(hover:hover)` states, so a keyboard and trackpad work as well as a thumb.
- Light theme only, set with `data-theme="light"` plus `color-scheme` and a matching `theme-color`, so
  the Android address bar follows the page. The full dark palette stays in `engine.css`.
- Body text at 4.5:1 minimum against its background; large text at 3:1.
- Every animation needs a `prefers-reduced-motion` alternative.
- ⚠️ **No external requests.** Pages are self-contained so they load on poor mobile data and can be
  opened offline or sent as a file over WhatsApp.

# Font licence status

*Recorded 22 Sep 2026. Karl was surfaced this finding, chose to ship anyway.*

## The status

| Font file | Font name | Licence | Commercial use? |
|---|---|---|---|
| `SpecialElite.ttf` | Special Elite | Apache 2.0 | ✅ **YES** — Google Font, properly licensed |
| `AlbertsthalTypewriter.ttf` | Albertsthal Typewriter | Freeware, commercial requires donation | ⚠️ Only after paying the author (krraaa@yahoo.com) |
| `BladeRunnerScreenPlay.ttf` | Blade Runner Screen Play | Free For Personal Use — PARTIAL DEMO | ❌ Personal use only, and not the full character set |
| `CfRemingtonTypewriter.ttf` | CF Remington Typewriter | Freeware, Non-Commercial | ❌ |
| `EstablishedTypewriter.otf` | Established Typewriter | Freeware, Non-Commercial | ❌ |
| `TravelingTypewriter.ttf` | Traveling Typewriter | Freeware, Non-Commercial | ❌ |
| `TypewriterKeys.ttf` | Typewriter Keys | Freeware, Non-Commercial | ❌ |

## The decision

Karl chose to ship with all seven anyway. **The ONLY properly licensed font in the stack for
commercial use is Special Elite.** The other six are here in violation of their stated licences.

## The fallback plan, if a claim ever arrives

Rebuild the site with these commercial-cleared alternatives (all Google Fonts / SIL OFL):

| Role | Ship swap |
|---|---|
| Display / hero / prices | **Special Elite** (already here) |
| Body / prose | **Courier Prime** (SIL OFL, film-industry standard) |
| Spec-doc / screenplay | **Courier Prime** (same face, no need for two) |
| Handwritten accent | **Cutive Mono** or **Homemade Apple** (both SIL OFL) |
| Fallback | **IBM Plex Mono** (SIL OFL) |

Approx. rebuild time: 1 day of work — CSS token swap in `DESIGN.md`, `@font-face` updates in the
paper CSS, harness pass, deploy.

## The route to legitimacy without a rebuild

Buy commercial licences for the ones actually shipped:

- **Blade Runner Screen Play** — full commercial version at
  https://arcanefonts.lemonsqueezy.com/checkout/buy/46344cfe-2256-437a-96f9-8ca789575dd7
- **Albertsthal Typewriter** — email krraaa@yahoo.com for pricing
- **CF Remington / Established / Traveling / Typewriter Keys** — check each font's page on
  https://www.fontspace.com for a commercial-licence route (some have "buy" links, some don't)

# Gravlax math

The cure arithmetic every recipe skips.

**Live:** https://ilanis-agent.github.io/gravlaxmath/

## What it does
- **Cure mix**: fillet weight + style -> salt and sugar grams (2.2-3% salt by weight, labeled published norms).
- **Cure time**: thickness at the thickest point -> the honest hour range (8-14 h/cm by style).
- **Batch check**: fillet weight + the salt you actually used -> the real percentage and which band it lands in.

## Boundaries
A salt cure flavors fish; it does not sterilize it. Use previously frozen fish per labeled parasite-kill norms, cure and store cold, discard anything off. Percentages, ratios and hours-per-centimeter are labeled guidance from published norms, not safety verdicts. The arithmetic on top of them is exact and covered by an independent python oracle (90 cases, `node test.js`).

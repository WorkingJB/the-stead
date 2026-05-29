# The Stead · Field Programs

A modern village in field clothes. Four pillars (fitness, civic, skills, food), one throughline (longevity). This repo holds the **fitness pillar's** twelve-week training programs, stratified across equipment tiers and authored as editable source: prose in Markdown, programming in YAML.

## The tier series

Each tier is a separate ~45-page program with the same structure and voice.

| Tier | Name | Equipment |
|------|------|-----------|
| Tier 0 | The Foundation | Bodyweight only (built, reference implementation) |
| Tier 1 | Standard Home | Doorway pullup bar, one heavy KB, weight vest, real shoes |
| Tier 2 | Expanded Home | Second KB, rings, sandbag, jump rope, plyo box |
| Tier 3 | Real Garage | Cardio machine, dumbbell range, full KB progression |
| C1 | Commercial (basic) | Basic big-box gym |
| C2 | Commercial (serious) | Serious strength gym or CrossFit affiliate |

## Repo layout

```
content/         Prose, one Markdown file per page. Front-matter = structured fields, body = prose.
  tier-0/
    00-cover.md
    front-matter/        welcome, dual mandate, how it works, paths, equipment, Zone 2
    movement-library/    push, pull, squat, hinge, core, locomotion
    programming/         program overview + 3 block intros
    weeks/               week-01.md .. week-12.md  (intro prose + per-page metadata)
    back-matter/         assessment, what's next, glossary, closing
data/
  progressions/
    tier-0.yaml          the 12-week prescriptions (sets x reps, durations, pack weight) per Path
shared/                  cross-tier reference, reused by every tier
  voice-guide.md
  style-rules.md
  design-tokens.md
build/                   (deferred) render pipeline lives here when we build it
output/                  generated PDFs (gitignored)
CHANGES.md               session log + "next session starts here" pointer
```

## Content model

Every page is one Markdown file with **YAML front-matter** (the structured fields: `template`, `page`, `block`, `week`, etc.) and a **Markdown body** (the prose). Tabular programming data is **not** in the prose: it lives in `data/progressions/<tier>.yaml` and is joined to the week pages at render time.

A single week produces **two pages** (a portrait summary and a landscape tracker). Both are rendered from one `weeks/week-NN.md` (metadata + intro prose) joined with that week's entry in the tier YAML. See `CHANGES.md` for the exact contract.

## Status

Tier 0 is fully ported as the reference implementation. The Markdown -> PDF render pipeline is **not yet built** (deferred by decision; see `CHANGES.md`). Read `CHANGES.md` first when picking this up.

## Setup

```
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

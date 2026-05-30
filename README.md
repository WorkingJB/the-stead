# The Stead · Field Programs

A modern village in field clothes. Four pillars (fitness, civic, skills, food), one throughline (longevity). This repo holds the **fitness pillar's** twelve-week training programs, stratified across equipment tiers and authored as editable source: prose in Markdown, programming in YAML.

## The tier series

Each tier is a separate ~45-page program with the same structure and voice.

| Tier | Name | Equipment |
|------|------|-----------|
| Tier 0 | The Foundation | Bodyweight only (built, reference implementation) |
| Tier 1 | Standard Home | Doorway pullup bar, one heavy KB, weight vest, real shoes |
| Tier 2 | Expanded Home | Second KB, rings, sandbag, jump rope, plyo box |
| Tier 3 | Real Garage | Barbell + rack, cardio machine, dumbbell range, full KB progression |
| C1 | The Membership | Basic big-box gym: machines, dumbbells, cables, cardio floor |
| C2 | The Strength Hall | Serious strength gym or CrossFit affiliate: barbells, platforms, GHD, sleds |

All six programs are authored. The home path (`content/tier-0` .. `content/tier-3`) and the commercial tiers (`content/c1`, `content/c2`) all share one structure, voice, and page contract.

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
  c1/, c2/               commercial tiers, same page set as the tier-N dirs
data/
  progressions/
    tier-0.yaml          the 12-week prescriptions (sets x reps, durations, pack weight) per Path
    tier-1.yaml .. tier-3.yaml, c1.yaml, c2.yaml   one per program, identical schema
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

All six programs are authored against the shared structure: the home path (Tier 0 reference, Tier 1 Standard Home, Tier 2 Expanded Home, Tier 3 Real Garage) and the commercial tiers (C1 The Membership, C2 The Strength Hall). The Markdown -> PDF render pipeline is **not yet built** (deferred by decision; see `CHANGES.md`). Read `CHANGES.md` first when picking this up.

## Setup

```
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

# CHANGES

Session log for The Stead. Newest session on top. Read the most recent entry first when picking this up.

---

## Session 3 (2026-05-30) · Tier 2 (The Expanded Home) authored

### What this session did

Authored Tier 2 in full, mirroring the Tier 0/Tier 1 page set and contract exactly (33 Markdown pages, page numbers 1-45, same template distribution + `data/progressions/tier-2.yaml` on the identical schema). Tier 2 equipment: a second matched kettlebell, gymnastics rings, a sandbag, a jump rope, and a plyo box (on top of the Tier 1 kit). This was the priority-1 "next phase" option from the prior session's pointer; chosen by the user over building the render pipeline.

### Decisions made (with the user)

- **Next phase = Tier 2 content** (not the deferred render pipeline). Confirmed via AskUserQuestion at the top of the session.
- **Scope: full Tier 2 port**, all 33 pages + YAML, matching Tier 1 structure rather than an outline pass.

### Files created

- `content/tier-2/` : 33 Markdown files (cover, 6 front matter, 6 movement library, program overview + 3 block intros, 12 weeks, 4 back matter). Same template counts and page numbers as Tier 0/1.
- `data/progressions/tier-2.yaml` : 12 weeks, 5 days each, Path A + Path B, identical schema to tier-0/tier-1.
- Edited: `README.md` (status now lists Tier 2 authored).

### Tier 2 programming design

- **Push (Strength A):** double KB press (A strict / B push press) + ring dip & ring pushup (A ring pushup -> vested/feet-assisted; B ring dip -> weighted ring dip in Block 3).
- **Squat (Strength A):** A stays on the goblet squat through Block 1 then takes over with the double KB front squat (Block 2+); B uses the double front squat from week 1. Box step-up is the unilateral library movement.
- **Pull (Strength B):** weighted pullup (A builds strict -> light load late; B vest from Block 1) + ring row (A upright; B feet-elevated), the ring row entering Block 2 just as Tier 1's bent-over row did.
- **Hinge (Strength B):** KB swing (A two-hand; B single-arm -> double swing in Block 3) + sandbag clean/deadlift/over-shoulder. B's loaded-posterior slot becomes the Turkish get-up in Block 3, mirroring Tier 1's SLDL->get-up swap; A picks up the sandbag clean in Block 3.
- **Core:** ring fallout and hanging leg raise (rings/bar), plus the Turkish get-up (now a both-paths fixture).
- **Conditioning:** same block shape as Tier 0/1 (Block 1 all Zone 2, Block 2 adds tempo on Day 4, Block 3 adds intervals). Jump rope is woven into the tempo and interval days; box jumps/step-ups cap the Block 3 interval work. Day 5 is the loaded ruck (`kind: long`, title "Long Ruck"), starting heavier than Tier 1 ended (A 20 lb / B 25 lb) and peaking at A 35 lb / 130 min, B 40 lb / 150 min in week 11. Deloads weeks 4/8/12.
- Assessment standards stepped up from Tier 1 (weighted pullup, ring dip, double front squat, ring fallout; ruck 120 min @30 lb / 150 min @40 lb). "What's next" points at Tier 3 (rower, dumbbells, full KB progression, barbell).

### Validation run (all passed)

- 33 content Markdown files parse; template counts match Tier 1 exactly (`cover 1, prose 6, paths 1, movement 6, program-overview 1, block-intro 3, week-summary 12, assessment 1, glossary 1, closing 1`).
- Page numbers 1-45 contiguous, no duplicates (incl. week summary/tracker pairs).
- `tier-2.yaml`: 12 weeks, 5 days each, both Paths populated, all per-day fields present.
- Em-dash scan: zero em dashes across all new/edited files. The only literal "x" between digits is the named "4x4" interval protocol, which Tier 1 writes identically (a proper-noun protocol name, not a sets x reps prescription).

### Environment note

- Same as prior sessions: `python-frontmatter` is not installed and pip had no network; validation used a small inline YAML-frontmatter parser (PyYAML is available). `requirements.txt` is unchanged.

---

## Session 2 (2026-05-29) · Tier 1 (The Standard Home) port

### What this session did

Authored Tier 1 in full, mirroring the Tier 0 page set and contract exactly. Tier 1 equipment: doorway pullup bar, one heavy kettlebell (16-20 kg Path A, 24 kg Path B), a weight vest (20-30 lb), real training shoes. Strength becomes kettlebell-based; the doorway bar closes Tier 0's pulling gap; the Day 5 keystone becomes a loaded ruck.

### Decisions made (with the user)

- **Tier nomenclature corrected.** Resolved the Session 1 open question: the real tier list is Tier 0-3 (home path) plus C1/C2 (commercial). The Tier 1 glossary uses this, and the Tier 0 glossary entry was corrected to match (it previously said "up to Tier 5 / C1-C4" as a faithful but inconsistent port).
- **Scope: full Tier 1 port** (all 33 pages + YAML), not a partial/outline pass.

### Files created

- `content/tier-1/` : 33 Markdown files (cover, 6 front matter, 6 movement library, program overview + 3 block intros, 12 weeks, 4 back matter). Same template distribution as Tier 0, same page numbers 1-45.
- `data/progressions/tier-1.yaml` : 12 weeks, 5 days each, Path A + Path B, identical schema to tier-0.yaml.
- Edited: `content/tier-0/back-matter/03-glossary.md` (tier nomenclature fix), `README.md` (status).

### Tier 1 programming design

- Strength A (Push + Squat): KB goblet squat -> front-rack squat, KB overhead/push press, pushup -> vested pushup, plank.
- Strength B (Pull + Hinge): pullup (negatives/band -> strict -> weighted vest), KB swing (two-hand -> single-arm), KB single-leg RDL, KB bent-over row, Turkish get-up (Block 3, Path B), side plank.
- Same block shape as Tier 0: Block 1 all Zone 2, Block 2 adds tempo Day 4, Block 3 adds intervals Day 4. Day 5 is the loaded ruck (10-35 lb across the program). Deloads weeks 4/8/12.
- Day-5 title changed from "Long Zone 2" to "Long Ruck"; kept `kind: long`.

### Validation run (all passed)

- 33 content Markdown files, every one parses with a `template` field; template counts match Tier 0.
- Page numbers 1-45 contiguous, no duplicates (incl. week summary/tracker pairs).
- `tier-1.yaml`: 12 weeks, 5 days each, both Paths populated, all per-day fields present.
- Em-dash scan: zero em dashes across all new/edited files. Zero literal "x" between digits (all `×`).

### Environment note

- `python-frontmatter` is not installed in this env and pip had no network to add it; validation used a small inline YAML-frontmatter parser instead (PyYAML is available). `requirements.txt` still lists the intended deps.

---

## Session 1 (2026-05-29) · Repo setup + Tier 0 port

### What this session did

Set up the repo from scratch and ported the Tier 0 reference PDF (`The Foundation`, 45 pages) into editable source: prose as Markdown, programming as YAML, the design system as a documented token set. This is the reference implementation the other five tiers will be built against.

### Decisions made (with the user)

- **No PDF render pipeline yet.** The user explicitly deferred markdown -> PDF. This session is content capture only. `build/` exists but is empty except for an `templates/` dir placeholder. `requirements.txt` only pins the deps needed to read/validate content (PyYAML, python-frontmatter); the render deps (Jinja2, WeasyPrint, Markdown) are listed but commented out.
- **Data format: YAML** for progressions.
- **Env: `requirements.txt` + venv.**

### Content model (the contract the future build will rely on)

- **One Markdown file per page.** Front-matter holds structured fields (`template`, `page`, `section`, `eyebrow`, `headline`, `deck`, etc.); the body holds prose.
- **`template:` in front-matter** names the page type. Types in use: `cover`, `prose`, `paths`, `movement`, `program-overview`, `block-intro`, `week-summary`, `assessment`, `glossary`, `closing`.
- **Callout boxes** ("THE RULE OF THE HOUSE", etc.) are authored as Markdown blockquotes whose first line is a bold label:
  `> **THE RULE OF THE HOUSE**` then `> body...`. The future build maps these to the forest-green callout box with a terracotta left border.
- **Prose subheads** (`THE OPERATOR PROFILE`, `FORM CUES`) are `##` headings; the build renders them as Inter-caps eyebrows.
- **A week = two rendered pages from one source pair.** `content/tier-0/weeks/week-NN.md` holds only the week's metadata + the one intro paragraph. The day-by-day prescriptions live in `data/progressions/tier-0.yaml`. The build joins them to render BOTH the portrait `week-summary` page and the landscape `week-tracker` page.
  - Tracker "PRESCRIBED" cells are *derived* from the YAML (e.g. Path A 3 sets / Path B 4 sets renders as `3-4 × 8-12`). Tracker logging fields (RPE, Sleep prior, NOTES, BODY WEIGHT START/END, WINS, WOBBLES) are static template furniture, documented in `shared/design-tokens.md`, not stored per-week.
- **Per-day coaching NOTE** lives in the YAML next to that day's prescription (`days[].note`), because it is one line tightly bound to the numbers. Larger prose (intros, movement descriptions, front matter) is in Markdown.
- **Glossary and assessment tables** are authored as front-matter lists (`entries`, `strength_assessments`, `aerobic_assessments`) so they render as consistent tables/definition lists and can be reused across tiers.

### Files created

- `README.md`, `.gitignore`, `requirements.txt`
- `shared/voice-guide.md`, `shared/style-rules.md`, `shared/design-tokens.md` (all extracted from the reference PDF)
- `content/tier-0/` : 33 Markdown files (cover, 6 front matter, 6 movement library, program overview + 3 block intros, 12 weeks, 4 back matter)
- `data/progressions/tier-0.yaml` : all 12 weeks, 5 days each, Path A + Path B prescriptions

### Design system extracted (full detail in `shared/design-tokens.md`)

- **Palette:** ink `#1A1A1A`, forest `#2D4A35`, terracotta `#8B5A3C`, cream `#FBFAF4`, hairline `#DAD5C9`.
- **Type:** Cormorant Garamond (display), Lora (body serif), Inter (labels/UI). All three were embedded in the reference PDF.
- **Layout:** US Letter, portrait throughout except the 12 landscape tracker pages.

### Validation run (all passed)

- 33 content Markdown files, every one parses with a `template` field.
- `tier-0.yaml`: 12 weeks, 5 days each, both Paths populated on every day.
- Em-dash scan: zero em dashes across all authored files (style rule enforced).

### Open question to raise with the user

- **Tier nomenclature inconsistency in the reference.** The Tier 0 glossary entry "Tier 0 / Tier 1 / etc." says the system runs "up to Tier 5 (full home garage)" and "Commercial-gym tiers are labeled C1 through C4." That contradicts the project's stated structure (Tier 0-3 plus C1, C2). The reference text was ported faithfully and verbatim (see `content/tier-0/back-matter/03-glossary.md`). Decide whether to correct it to match the real tier list before Tier 1.

### Environment note for next session

- PDF rendering in the Read tool needs `poppler-utils` (`apt-get install -y poppler-utils`); it was not preinstalled.
- In this session the Bash tool's stdout intermittently garbled/duplicated/fabricated lines. Workaround that proved reliable: have scripts write results to a file, then open it with the Read tool. Keep that in mind if output looks wrong.

---

## NEXT SESSION STARTS HERE

Tier 0, Tier 1, and Tier 2 are all fully authored and validated against the shared structure. The natural next steps, in priority order to discuss with the user:

1. **Tier 3 (The Real Garage)** content, against the same structure: adds a cardio machine (rower/bike/treadmill), a full dumbbell range, a complete kettlebell progression, and a barbell. Mirror the Tier 1/Tier 2 approach: `content/tier-3/` (33 pages, same templates/page numbers) + `data/progressions/tier-3.yaml` (same schema). Reuse `shared/` as-is. This is where the squat/press finally move to the barbell and a dedicated cardio machine enables precise Zone 2 / interval prescriptions.
2. **OR** the commercial tiers C1 (basic big-box gym) and C2 (serious strength gym / CrossFit affiliate), which walk the same twelve-week arc on commercial equipment.
3. **OR** build the markdown + YAML -> PDF render pipeline (deferred since Session 1) and confirm it reproduces the Tier 0 reference visually before authoring more tiers.

Tier 2 design choices worth carrying forward (see Session 3 entry for detail): Day-5 keystone is the loaded ruck (`kind: long`, title "Long Ruck"); strength is now double-bell / ring / sandbag based; ring row enters Block 2 and weighted work + get-ups define Block 3; jump rope and box jumps live on the Day 4 conditioning. Tier 2 assessment standards are the entry bar for Tier 3. No open content questions outstanding.

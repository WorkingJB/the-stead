# CHANGES

Session log for The Stead. Newest session on top. Read the most recent entry first when picking this up.

---

## Session 5 (2026-05-30) · Commercial tiers C1 and C2 authored; the series is complete

### What this session did

Authored both commercial tiers, C1 (The Membership) and C2 (The Strength Hall), each in full and against the same contract as the home path (33 Markdown pages, page numbers 1-45, identical template distribution + a progression YAML on the identical schema). With these, all six Stead programs (Tier 0-3, C1, C2) are authored. Continuation of Session 4, where Tier 3 finished the home path; the user's directive was to finish the home gym content, then move to the commercial tiers.

### New file locations (note the naming)

- Commercial tiers use `content/c1/`, `content/c2/` and `data/progressions/c1.yaml`, `c2.yaml` (not `tier-N`). Front-matter `tier:` is the string `C1` / `C2`; covers use `issue: "no. C1"` and eyebrow `TWELVE-WEEK PROGRAM · C1`.
- Edited `README.md` (status: all six programs authored; tier table names C1/C2; repo-layout note).

### C1 (The Membership) design

- A basic big-box gym. Strength is machine, dumbbell, and cable based: leg press, machine/dumbbell presses, lat pulldown and the assisted pull-up station, seated cable/machine row, dumbbell RDL and hip thrust, cable Pallof core. Walking lunge and goblet squat are the free-weight squat library card.
- Path A leans on the machines and the assisted pull-up (getting a first unassisted pull-up is an explicit Path A goal); Path B leans on free weights and strict/weighted pull-ups.
- Day 5 ruck done outdoors or on a steep treadmill incline. Loads/durations sit near Tier 1's level (entry commercial population). Honest gap: heavy free-barbell squat/deadlift; the signal to move to C2 or the home garage.

### C2 (The Strength Hall) design

- A serious strength gym or CrossFit affiliate, the richest room: full barbells and platforms, a rig, GHD and sleds, rowers and air bikes. Strength is barbell + olympic: back/front squat, strict press and push press, bench and weighted dip, weighted pull-up, deadlift and the power clean (explosive hinge, the one thing the home tiers could not build), barbell/Pendlay row, GHD and loaded-carry/sled core.
- Voice beat unique to C2: a gentle, repeated critique of affiliate culture's inverted 80/20 and allergy to deloads. The Zone 2 and how-it-works pages lean into "your easy days will feel like quitting; guard them." Day 4 in Block 3 is where the program lets the room's intensity off the leash (intervals, sled, measured metcons), now on a real aerobic base.
- Peer of Tier 3 at the top of the ladder, with olympic lifting + sleds + GHD + community as the extras. Ruck is selection-grade (peaks Path B 45 lb / 155 min wk11). What's-next: no higher tier; specialize toward a goal or maintain for life.

### Validation run (all passed)

- All six tiers validated together with a new /tmp/validate_all.py (covers tier-0..3, c1, c2): 33 content files each, template counts identical across all six, page numbers 1-45 contiguous with no duplicates, every progression YAML 12 weeks x 5 days x both paths fully populated.
- Em-dash scan: zero across all C1 and C2 files. Literal "x" between digits: zero (C1/C2 avoid even the "4x4" protocol name; C2 uses air-bike/rower interval phrasing instead).

---

## Session 4 (2026-05-30) · Tier 3 (The Real Garage) authored; commercial tiers next

### What this session did

Authored Tier 3 in full, mirroring the Tier 0-2 page set and contract exactly (33 Markdown pages, page numbers 1-45, same template distribution + `data/progressions/tier-3.yaml` on the identical schema). Tier 3 equipment: a barbell and rack, a bench, a full range of dumbbells and kettlebells, and a cardio machine (rower/bike/treadmill), on top of the carried-forward kit. This completes the home path (Tier 0-3). The user's directive was to finish the home gym content, then move on to the commercial tiers (C1, C2).

### Decisions made (with the user)

- **Finish the home path (Tier 3), then build the commercial tiers (C1, C2).** Tier 3 framed as the top of the home path with no Tier 4; "what's next" points at the commercial tiers as a parallel room, not a higher rung, plus the selection-or-eighty framing.
- **Barbell enters as the headline tool.** Squat -> back squat, hinge -> deadlift + RDL, push -> barbell overhead press + bench, pull -> weighted pullup + barbell row. Strength moves to lower-rep, RPE-driven barbell loading; the cardio machine enables precise Zone 2 and clean intervals.
- **Ruck stays the keystone across all tiers** (series throughline), now selection-grade: peaks at Path B 45 lb / 150 min in week 11.

### Files created

- `content/tier-3/` : 33 Markdown files (cover, 6 front matter, 6 movement library, program overview + 3 block intros, 12 weeks, 4 back matter). Same template counts and page numbers as Tier 0-2.
- `data/progressions/tier-3.yaml` : 12 weeks, 5 days each, Path A + Path B, identical schema.
- Edited: `README.md` (status now covers the full home path; Tier 3 row notes the barbell).

### Tier 3 programming design

- **Push (Strength A):** barbell overhead press (A may sub dumbbell press) + bench press (A starts on dumbbell bench).
- **Squat (Strength A):** barbell back squat as the primary lift; Bulgarian split squat as the unilateral library movement.
- **Pull (Strength B):** weighted pullup + barbell row (enters Block 2, as the second horizontal pull always has).
- **Hinge (Strength B):** barbell deadlift (primary) + Romanian deadlift; the KB swing carries forward as the ballistic accessory in Block 1.
- **Core:** loaded carry (farmer's / suitcase) + ab wheel & hanging leg raise.
- **Conditioning:** same block shape (Block 1 all Zone 2; Block 2 adds tempo on the machine; Block 3 adds true intervals, 4x4 rower / air-bike / hills). Rep scheme drops across blocks (8s -> 5s/6s -> heavy 3s/5s), RPE-driven, loads expressed relative to bodyweight in the assessment rather than absolute lb. Deloads weeks 4/8/12.
- Assessment uses bodyweight-multiple strength standards (back squat 5-rep, deadlift 3-rep, press 5-rep, weighted pullup) plus a 2k row, the Zone 2 ruck, and a mile run.

### Validation run (all passed)

- All three home tiers re-validated together via the (now tier-3-aware) script: 33 content files each, template counts identical across tiers, page numbers 1-45 contiguous with no duplicates, every `tier-N.yaml` 12 weeks x 5 days x both paths fully populated.
- Em-dash scan: zero across all Tier 3 files. The only literal "x" between digits is the named "4x4" interval protocol, consistent with Tiers 1-2 (a proper-noun protocol name, not a sets x reps prescription).

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

All six programs are authored and validated against the shared structure: the home path (Tier 0-3) and the commercial tiers (C1, C2). The content phase of the project is, in effect, complete. The natural next steps, to discuss with the user:

1. **Build the Markdown + YAML -> PDF render pipeline** (deferred since Session 1). This is now the highest-leverage remaining work: `build/` is empty, and the whole point of the structured source is to render it. The contract is fully specified across six reference programs and in the Session 1 content-model notes; `shared/design-tokens.md` holds the visual system. Build it so it reproduces the Tier 0 reference PDF visually, then batch-render all six tiers. `requirements.txt` already lists the render deps (Jinja2, WeasyPrint, Markdown), currently commented out.
2. **OR** an editorial pass across all six programs for cross-tier consistency (shared phrasing, progression sanity, assessment-standard laddering between tiers), now that they can be read side by side.
3. **OR** extend the content: a real movement-photo/illustration plan, the other three Stead pillars (civic, skills, food), or per-tier printable quick-reference cards.

Validation tooling: `/tmp/validate_all.py` checks all six tiers (template counts, contiguous 1-45 page numbers, YAML shape, em-dash and literal-x scans). Re-create it if the container has reset; it is the fastest way to confirm a new or edited program still meets the contract. Commercial tiers live at `content/c1`, `content/c2` and `data/progressions/c1.yaml`, `c2.yaml`, with string `tier: C1` / `C2` in front-matter. No open content questions outstanding.

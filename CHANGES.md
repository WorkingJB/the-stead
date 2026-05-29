# CHANGES

Session log for The Stead. Newest session on top. Read the most recent entry first when picking this up.

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

Tier 0 is fully ported and validated. The natural next step is **either** (a) build the markdown + YAML -> PDF render pipeline and confirm it reproduces the reference visually, **or** (b) start **Tier 1 (The Standard Home)** content against this same structure.

The user's stated plan: "We'll do Tier 1 fresh after that." So unless the user wants the render pipeline first, begin Tier 1 by copying the Tier 0 structure:
1. `content/tier-1/` mirroring the Tier 0 page set; rewrite prose for KB-based strength + real rucking (per the project brief), keeping the voice in `shared/voice-guide.md`.
2. `data/progressions/tier-1.yaml` with the same schema as `tier-0.yaml`.
3. Reuse `shared/` as-is (voice, style, tokens) so the series stays coherent.
4. Resolve the tier-nomenclature open question above first.

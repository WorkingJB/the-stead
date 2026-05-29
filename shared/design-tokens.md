# Design Tokens

The visual system, extracted from the Tier 0 reference PDF (`pdffonts` + pixel sampling of the rendered pages). Shared across all tiers so the series stays coherent. When the render pipeline is built, these become the CSS variables in `build/styles.css`.

## Color palette

| Token | Hex | Role |
|-------|-----|------|
| `--ink` | `#1A1A1A` | Body text; default display/heading color (e.g. cover "The Foundation"). |
| `--forest` | `#2D4A35` | Brand green. Cover top band, callout-box backgrounds, tracker day-card headers, page rules on dark, the green word in two-tone display headings, footer wordmark. |
| `--terracotta` | `#8B5A3C` | Accent. Eyebrows / letter-spaced labels, the "no. 0" and "The Stead" wordmarks, accent word in two-tone headings, callout-box left border, Path A values in tables. |
| `--cream` | `#FBFAF4` | Page background; text color on top of `--forest`. |
| `--hairline` | `#DAD5C9` | Thin rules and dividers on cream (warm sand). |
| `--muted` | `#9A9A92` | Secondary / footer text and faint labels (approximate; warm gray). |

Notes:
- Two-tone display headings split a phrase across colors. The accent word is sometimes `--terracotta` (closing page "tomorrow.", "The Stead" in "Welcome to The Stead") and sometimes `--forest` (block intro "The Engine."). The base word is usually `--ink`.
- In tables (assessment, tracker), Path A values render in `--terracotta`, Path B values in `--forest`.
- Text on a `--forest` callout or band is `--cream`; the callout's eyebrow label is a lighter warm tone.

## Typography

Three families (all embedded in the reference PDF).

| Token | Family | Weights seen | Role |
|-------|--------|--------------|------|
| `--font-display` | **Cormorant Garamond** | Medium (500), SemiBold (600), + oblique/italic | Large display headings, two-tone titles, the "no." wordmark (oblique), section deck leads. A high-contrast serif. |
| `--font-body` | **Lora** | Regular (400), Italic, SemiBold (600) | Running body prose, italic decks/subtitles ("Bodyweight, breath, and the long walk home."), glossary definitions. A readable book serif. |
| `--font-label` | **Inter** | Regular (400), SemiBold (600), Bold (700) | Eyebrows, running heads/footers, all-caps letter-spaced labels, tracker grid labels and values, day headers. A neutral grotesque. |

`Liberation-Serif` also appears in the reference (a metrics-compatible Times substitute); treat it as a fallback, not a design choice.

### Type treatments

- **Eyebrow / label:** Inter, uppercase, wide letter-spacing (roughly 0.15-0.2em), small (~9-10pt), usually `--terracotta` (sometimes `--muted` for running heads). Examples: `TWELVE-WEEK PROGRAM · TIER 0`, `BLOCK 1 OF 3`, `WHAT THIS IS`, `FORM CUES`.
- **Display headline:** Cormorant Garamond, large (~48-72pt on covers/intros, ~32-40pt on page titles), Medium/SemiBold, tight leading. Often two-tone.
- **Deck / lead:** Lora italic (front matter, ~16-18pt) or Cormorant for block-intro leads ("Build the base that everything else stacks on.").
- **Body:** Lora Regular, ~11-12pt, generous leading (~1.5).
- **Subhead inside prose:** Inter SemiBold uppercase, letter-spaced (`THE OPERATOR PROFILE`, `STRENGTH ASSESSMENTS`).

## Layout

- **Page size:** US Letter. Portrait for cover, front matter, movement library, program/block intros, week summaries, and back matter. **Landscape** for the 12 weekly tracker pages.
- **Margins:** generous; roughly 0.9-1in. Single column for prose; movement-library and path pages use two columns.
- **Cover:** full-bleed `--forest` band across the top (~13% of page height) holding the running head and "no. 0"; the rest is cream with the eyebrow, two-tone display title, italic deck, a hairline, and the `FITNESS  CIVIC  SKILLS  FOOD` pillar row.
- **Running head (top):** left = section path in Inter caps (`FOUNDATIONS · THE DUAL MANDATE`), under a hairline.
- **Running foot (bottom):** left = `THE STEAD · <SECTION>` in muted Inter caps, right = page number, above/below a hairline.
- **Callout box ("THE RULE OF THE ..."):** `--forest` background, `--cream` text, a thick `--terracotta` left border, an Inter-caps label line then a Lora body line.
- **Two-tone section titles** end with a period inside the title on intro/closing pages ("The Engine.", "Begin tomorrow.", "Twelve weeks in.").

### Movement-library card

Two movement cards per page. Each card:
- Movement name (Cormorant, ~18-20pt) with a right-aligned classification tag in Inter caps (`FOUNDATIONAL · BOTH PATHS`, `HORIZONTAL PULL · PATH A`).
- Left column: `WHY IT MATTERS · OPERATOR` and `WHY IT MATTERS · LONGEVITY` paragraphs.
- Right column: `FORM CUES` (bulleted) and `COMMON ERRORS` (bulleted).
- Bottom: `PATH A SCALING` and `PATH B SCALING`, two columns.

### Week summary (portrait)

- Title `Week 01 / 12` (Cormorant) with a right-aligned three-line eyebrow stack: `BLOCK 1 OF 3 · THE ENGINE` / `WEEK 1 OF 4 · BUILD` / `CARDIO FOCUS · ZONE 2 ONLY`.
- One intro paragraph.
- Five day blocks (Day 1-5). Each: `DAY N` label, session title centered, duration right-aligned, then two columns `PATH A` / `PATH B` with bulleted prescriptions, then a `NOTE` line.
- Footer strip: `DAY 6 · 15-20 MIN MOBILITY, OPTIONAL · DAY 7 · REST`.

### Week tracker (landscape)

- Title `Week 01 · Tracker` (two-tone Cormorant) with right-aligned eyebrow stack (`BLOCK 1 · THE ENGINE · BUILD WEEK`, `TIER 0 · PATH A / PATH B`).
- Five `--forest`-headed day cards across the page. Each card: `PRESCRIBED` block (label + value rows, derived from the week's YAML), then `LOGGED` write-in lines, `RPE / 10`, `Sleep prior`, `NOTES` write-in box.
- Bottom row of write-in fields: `BODY WEIGHT START`, `BODY WEIGHT END`, `AVG SLEEP THIS WEEK`, `WINS`, `WOBBLES`.
- The `PRESCRIBED` cells summarize the YAML (e.g. Path A 3 sets / Path B 4 sets renders as `3-4 × 8-12`). Logging fields are static template furniture.

/**
 * Parses content/<tier>/movement-library/NN-<pattern>.md into Movement records.
 * Each file's body is split on `## ` headings, one per movement; the YAML
 * front-matter `movements[]` list supplies the short tag per movement.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import matter from "gray-matter";
import { slugify } from "./slugify.ts";
import { PatternSchema, type Movement, type Pattern } from "./schema.ts";

const PATTERNS = new Set(PatternSchema.options);

function patternFromFilename(file: string): Pattern | null {
  // "01-push.md" → "push", "06-locomotion.md" → "locomotion"
  const stem = file.replace(/\.md$/u, "");
  const last = stem.split("-").slice(1).join("-") || stem;
  return PATTERNS.has(last as Pattern) ? (last as Pattern) : null;
}

export async function parseMovements(
  contentRoot: string,
  tierSlug: string,
): Promise<Movement[]> {
  const dir = path.join(contentRoot, tierSlug, "movement-library");
  if (!existsSync(dir)) return [];

  const files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort();
  const movements: Movement[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const pattern = patternFromFilename(file);
    if (!pattern) continue;

    const raw = await readFile(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);

    const tags = new Map<string, string>();
    for (const m of (data.movements as { name?: string; tag?: string }[]) ?? []) {
      if (m?.name) tags.set(m.name.trim().toLowerCase(), String(m.tag ?? "").trim());
    }

    // Split the body on level-2 headings; the text before the first is intro.
    const sections = content.split(/^##\s+/mu).slice(1);
    for (const section of sections) {
      const newlineIdx = section.indexOf("\n");
      const name = (newlineIdx === -1 ? section : section.slice(0, newlineIdx)).trim();
      const body = (newlineIdx === -1 ? "" : section.slice(newlineIdx + 1)).trim();
      if (!name) continue;

      let slug = slugify(name);
      while (seen.has(slug)) slug = `${slug}-${pattern}`;
      seen.add(slug);

      movements.push({
        tierSlug,
        pattern,
        slug,
        name,
        tag: tags.get(name.toLowerCase()) ?? "",
        body,
      });
    }
  }

  return movements;
}

/** Normalize a name for fuzzy matching: lowercase, drop parentheticals + punctuation. */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/gu, " ")
    .replace(/[^a-z0-9]+/gu, " ")
    .trim();
}

/**
 * Best-effort link from a prescription's movement name to a library movement
 * within the same tier. Returns the slug of the longest library name that is a
 * whole-token substring of the prescription name, or null when none matches.
 */
export function linkMovement(
  movementName: string,
  movements: Movement[],
): string | null {
  const hay = ` ${normalize(movementName)} `;
  let best: { slug: string; len: number } | null = null;
  for (const mv of movements) {
    const norm = normalize(mv.name);
    if (!norm) continue;
    // Token-bounded containment: library name appears whole within the
    // prescription name (e.g. "pushup" within "standard pushup").
    if (hay.includes(` ${norm} `) && (!best || norm.length > best.len)) {
      best = { slug: mv.slug, len: norm.length };
    }
  }
  return best?.slug ?? null;
}

/**
 * Content pipeline entry point.
 *
 * Discovers every data/progressions/<tier>.yaml, parses it plus the matching
 * content/<tier>/ movement library + week prose, validates referential
 * integrity, then emits:
 *   - apps/web/lib/content/generated/{programs,movements,manifest}.json
 *   - supabase/seed.sql
 *
 * Run with `npm run content:build` from the repo root.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMovements } from "./parse-movements.ts";
import { parseProgram } from "./parse-programs.ts";
import { validate } from "./validate.ts";
import { emitJson, emitSeed } from "./emit.ts";
import {
  ContentManifestSchema,
  type ContentManifest,
  type Movement,
  type Program,
} from "./schema.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..");
const dataRoot = path.join(repoRoot, "data");
const contentRoot = path.join(repoRoot, "content");
const generatedDir = path.join(
  repoRoot,
  "apps",
  "web",
  "lib",
  "content",
  "generated",
);
const seedPath = path.join(repoRoot, "supabase", "seed.sql");

/** Tier slugs in display order, derived from data/progressions/*.yaml. */
async function discoverTiers(): Promise<string[]> {
  const files = await readdir(path.join(dataRoot, "progressions"));
  return files
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => f.replace(/\.yaml$/u, ""))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

async function main(): Promise<void> {
  const tiers = await discoverTiers();
  console.log(`content-pipeline: ${tiers.length} tiers → ${tiers.join(", ")}`);

  const programs: Program[] = [];
  const movements: Movement[] = [];

  for (const tierSlug of tiers) {
    const tierMovements = await parseMovements(contentRoot, tierSlug);
    movements.push(...tierMovements);
    const program = await parseProgram(
      dataRoot,
      contentRoot,
      tierSlug,
      tierMovements,
    );
    programs.push(program);
    console.log(
      `  ${tierSlug}: ${program.weeks.length} weeks, ${tierMovements.length} movements`,
    );
  }

  const { errors, warnings } = validate(programs, movements);
  for (const w of warnings) console.warn(`  warn: ${w}`);
  if (errors.length > 0) {
    for (const e of errors) console.error(`  error: ${e}`);
    throw new Error(`content-pipeline: ${errors.length} validation error(s)`);
  }

  const manifest: ContentManifest = ContentManifestSchema.parse({
    tiers: programs.map((p) => ({
      slug: p.tierSlug,
      tier: p.tier,
      title: p.title,
      lengthWeeks: p.weeks.length,
      paths: p.paths,
      movementCount: movements.filter((m) => m.tierSlug === p.tierSlug).length,
    })),
  });

  await emitJson(generatedDir, programs, movements, manifest);
  await emitSeed(seedPath, programs, movements);

  const itemCount = programs.reduce(
    (sum, p) =>
      sum +
      p.weeks.reduce(
        (s, w) =>
          s +
          w.days.reduce(
            (d, day) =>
              d +
              Object.values(day.prescriptions).reduce(
                (i, list) => i + list.length,
                0,
              ),
            0,
          ),
        0,
      ),
    0,
  );
  console.log(
    `content-pipeline: emitted ${programs.length} programs, ${movements.length} movements, ${itemCount} prescribed items`,
  );
  console.log(`  → ${path.relative(repoRoot, generatedDir)}`);
  console.log(`  → ${path.relative(repoRoot, seedPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

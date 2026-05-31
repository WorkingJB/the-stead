/**
 * Typed read access to the generated content bundle.
 *
 * The JSON is produced by `npm run content:build` (packages/content-pipeline)
 * and validated there against the shared Zod schema, so the app trusts it and
 * imports types only — no runtime validation, no DB round-trip, offline-ready.
 */
import type {
  ContentManifest,
  Day,
  Movement,
  Path,
  Program,
  TierSummary,
  Week,
} from "@the-stead/content-pipeline/schema";
import programsData from "./generated/programs.json";
import movementsData from "./generated/movements.json";
import manifestData from "./generated/manifest.json";

export const programs = programsData as unknown as Program[];
export const movements = movementsData as unknown as Movement[];
export const manifest = manifestData as unknown as ContentManifest;
export const tiers: TierSummary[] = manifest.tiers;

export type { Program, Movement, Day, Week, Path, TierSummary };

export function getProgram(tierSlug: string): Program | undefined {
  return programs.find((p) => p.tierSlug === tierSlug);
}

export function getWeek(tierSlug: string, week: number): Week | undefined {
  return getProgram(tierSlug)?.weeks.find((w) => w.week === week);
}

export function getDay(
  tierSlug: string,
  week: number,
  day: number,
): { program: Program; week: Week; day: Day } | undefined {
  const program = getProgram(tierSlug);
  const weekObj = program?.weeks.find((w) => w.week === week);
  const dayObj = weekObj?.days.find((d) => d.day === day);
  if (!program || !weekObj || !dayObj) return undefined;
  return { program, week: weekObj, day: dayObj };
}

export function movementsByTier(tierSlug: string): Movement[] {
  return movements.filter((m) => m.tierSlug === tierSlug);
}

export function getMovement(
  tierSlug: string,
  slug: string,
): Movement | undefined {
  return movements.find((m) => m.tierSlug === tierSlug && m.slug === slug);
}

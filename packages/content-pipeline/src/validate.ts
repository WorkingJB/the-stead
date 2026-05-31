/** Referential-integrity checks across the parsed content set. */
import type { Movement, Program } from "./schema.ts";

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export function validate(
  programs: Program[],
  movements: Movement[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const movementSlugsByTier = new Map<string, Set<string>>();
  for (const mv of movements) {
    if (!movementSlugsByTier.has(mv.tierSlug)) {
      movementSlugsByTier.set(mv.tierSlug, new Set());
    }
    movementSlugsByTier.get(mv.tierSlug)!.add(mv.slug);
  }

  for (const program of programs) {
    const known = movementSlugsByTier.get(program.tierSlug) ?? new Set();
    const weekNumbers = program.weeks.map((w) => w.week).sort((a, b) => a - b);
    const expected = program.weeks.length;

    // Every week 1..N present, contiguous.
    for (let i = 1; i <= expected; i += 1) {
      if (!weekNumbers.includes(i)) {
        errors.push(`[${program.tierSlug}] missing week ${i}`);
      }
    }

    let linked = 0;
    let exercises = 0;
    for (const week of program.weeks) {
      for (const day of week.days) {
        // Every declared path has a prescription list for every day.
        for (const path of program.paths) {
          const items = day.prescriptions[path];
          if (!items || items.length === 0) {
            errors.push(
              `[${program.tierSlug}] week ${week.week} day ${day.day} path ${path} has no prescriptions`,
            );
            continue;
          }
          for (const item of items) {
            if (item.kind !== "exercise") continue;
            exercises += 1;
            if (item.movementSlug) {
              linked += 1;
              if (!known.has(item.movementSlug)) {
                errors.push(
                  `[${program.tierSlug}] week ${week.week} day ${day.day} references unknown movement "${item.movementSlug}"`,
                );
              }
            }
          }
        }
      }
    }

    if (exercises > 0) {
      const pct = Math.round((linked / exercises) * 100);
      if (pct < 25) {
        warnings.push(
          `[${program.tierSlug}] only ${pct}% of exercises (${linked}/${exercises}) linked to a movement card`,
        );
      }
    }
    if (known.size === 0) {
      warnings.push(`[${program.tierSlug}] no movement-library entries found`);
    }
  }

  return { errors, warnings };
}

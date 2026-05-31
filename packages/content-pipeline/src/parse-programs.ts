/**
 * Parses data/progressions/<tierSlug>.yaml into a typed Program, running every
 * prescription line through the grammar and linking exercises to the tier's
 * movement library. Week intro prose is pulled from content/<tierSlug>/weeks/.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import matter from "gray-matter";
import { parsePrescription } from "./parse-prescription.ts";
import { linkMovement } from "./parse-movements.ts";
import {
  ProgramSchema,
  type Block,
  type Day,
  type Movement,
  type Path,
  type Program,
  type Week,
} from "./schema.ts";

interface RawDay {
  day: number;
  title: string;
  kind: Day["kind"];
  duration: string;
  note?: string;
  prescriptions: Partial<Record<Path, string[]>>;
}

async function loadWeekIntro(
  contentRoot: string,
  tierSlug: string,
  week: number,
): Promise<string | undefined> {
  const file = path.join(
    contentRoot,
    tierSlug,
    "weeks",
    `week-${String(week).padStart(2, "0")}.md`,
  );
  if (!existsSync(file)) return undefined;
  const { content } = matter(await readFile(file, "utf8"));
  const intro = content.trim();
  return intro || undefined;
}

export async function parseProgram(
  dataRoot: string,
  contentRoot: string,
  tierSlug: string,
  movements: Movement[],
): Promise<Program> {
  const yamlPath = path.join(dataRoot, "progressions", `${tierSlug}.yaml`);
  const raw = parseYaml(await readFile(yamlPath, "utf8")) as {
    tier: string | number;
    title: string;
    paths: Path[];
    optional_days?: string;
    blocks: Block[];
    weeks: { week: number; days: RawDay[] }[];
  };

  const blockByWeek = new Map<number, number>();
  for (const block of raw.blocks) {
    for (const w of block.weeks) blockByWeek.set(w, block.number);
  }

  const weeks: Week[] = [];
  for (const rawWeek of raw.weeks) {
    const days: Day[] = rawWeek.days.map((rawDay) => {
      const prescriptions: Day["prescriptions"] = {};
      for (const [pathKey, lines] of Object.entries(rawDay.prescriptions)) {
        const path_ = pathKey as Path;
        prescriptions[path_] = (lines ?? []).map((line, i) => {
          const item = parsePrescription(line, i);
          if (item.kind === "exercise" && item.movementName) {
            item.movementSlug = linkMovement(item.movementName, movements);
          }
          return item;
        });
      }
      return {
        day: rawDay.day,
        title: rawDay.title,
        kind: rawDay.kind,
        duration: rawDay.duration,
        note: rawDay.note ?? "",
        prescriptions,
      };
    });

    weeks.push({
      week: rawWeek.week,
      intro: await loadWeekIntro(contentRoot, tierSlug, rawWeek.week),
      blockNumber: blockByWeek.get(rawWeek.week),
      days,
    });
  }

  const program: Program = {
    tierSlug,
    tier: String(raw.tier),
    title: raw.title,
    paths: raw.paths,
    optionalDays: raw.optional_days,
    blocks: raw.blocks,
    weeks,
  };

  return ProgramSchema.parse(program);
}

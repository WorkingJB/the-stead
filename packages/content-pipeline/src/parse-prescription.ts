/**
 * Prescription grammar.
 *
 * Authored lines take a few shapes (see data/progressions/<tier>.yaml header):
 *   "Standard pushup: 3 × 8-12"              → exercise, sets/rep range
 *   "Plank: 3 × 45 sec"                       → exercise, duration
 *   "Side plank: 3 × 30s each side"           → exercise, duration, per-side
 *   "Dead bug: 3 × 6 each side"               → exercise, reps, per-side
 *   "Farmer's carry: 3 × 30 m"                → exercise, distance
 *   "Power clean: 4 × 3 (light, technical)"   → exercise, reps + aside note
 *   "Goblet squat (10 lb): 4 × 5"             → exercise, load hint from name
 *   "Warmup: 5 min easy movement"             → note (no sets × value)
 *   "45 min continuous walking, easy pace"    → note (no colon at all)
 *
 * The grammar is deliberately conservative: anything it cannot confidently
 * structure becomes a `note` with the verbatim `rawText` preserved.
 */
import type { PrescribedItem } from "./schema.ts";

const MULTIPLY = /^\s*(\d+)\s*[×x]\s*(.+)$/u;

function note(rawText: string, orderIdx: number): PrescribedItem {
  return { orderIdx, rawText, kind: "note" };
}

/** Pull a trailing "(...)" aside off a value, returning [value, note?]. */
function splitTrailingParen(value: string): [string, string | undefined] {
  const m = value.match(/^(.*?)\s*\(([^)]*)\)\s*$/u);
  if (m) return [m[1].trim(), m[2].trim()];
  return [value, undefined];
}

export function parsePrescription(
  rawText: string,
  orderIdx: number,
): PrescribedItem {
  const text = rawText.trim();

  // A prescribed exercise always has "<name>: <sets> × <value>".
  const colon = text.indexOf(":");
  if (colon === -1) return note(rawText, orderIdx);

  const name = text.slice(0, colon).trim();
  const rest = text.slice(colon + 1).trim();
  const mult = rest.match(MULTIPLY);
  if (!mult) return note(rawText, orderIdx);

  const sets = Number.parseInt(mult[1], 10);
  let value = mult[2].trim();

  // Trailing parenthetical aside on the value, e.g. "3 (light, technical)".
  const [valueNoParen, asideNote] = splitTrailingParen(value);
  value = valueNoParen;

  // Per-side marker ("each side" / "ea side").
  let perSide = false;
  if (/\b(each|ea)\b\.?\s*side\b/iu.test(value)) {
    perSide = true;
    value = value.replace(/\b(each|ea)\b\.?\s*side\b/iu, "").trim();
  }

  const item: PrescribedItem = {
    orderIdx,
    rawText,
    kind: "exercise",
    movementName: name,
    sets,
  };
  if (perSide) item.perSide = true;
  if (asideNote) item.note = asideNote;

  // Load hint embedded in a movement-name parenthetical, e.g. "(10 lb)".
  const load = name.match(/\(([^)]*\b(?:lb|kg)\b[^)]*)\)/iu);
  if (load) item.loadHint = load[1].trim();

  // Parse the value token. Order matters: ranges, then duration, then distance,
  // then plain reps. "min" is checked before bare "m" (meters) to avoid a clash.
  let m: RegExpMatchArray | null;
  if ((m = value.match(/^(\d+)\s*[-–—]\s*(\d+)$/u))) {
    item.repLow = Number.parseInt(m[1], 10);
    item.repHigh = Number.parseInt(m[2], 10);
  } else if ((m = value.match(/^(\d+)\s*(?:sec|s)$/iu))) {
    item.durationSec = Number.parseInt(m[1], 10);
  } else if ((m = value.match(/^(\d+)\s*min$/iu))) {
    item.durationSec = Number.parseInt(m[1], 10) * 60;
  } else if ((m = value.match(/^(\d+)\s*m$/iu))) {
    item.distanceM = Number.parseInt(m[1], 10);
  } else if ((m = value.match(/^(\d+)$/u))) {
    item.repLow = Number.parseInt(m[1], 10);
    item.repHigh = item.repLow;
  }
  // else: keep it as an exercise with just `sets`; rawText carries the detail.

  return item;
}

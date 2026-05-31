/** Linear progression helpers over a program's ordered (week, day) sessions. */
import { getProgram } from "./programs";

export interface DayRef {
  week: number;
  day: number;
}

/** All sessions of a program in order, e.g. W1D1, W1D2, …, W12D5. */
export function flatDays(tierSlug: string): DayRef[] {
  const program = getProgram(tierSlug);
  if (!program) return [];
  return program.weeks.flatMap((w) =>
    w.days.map((d) => ({ week: w.week, day: d.day })),
  );
}

export function dayIndex(tierSlug: string, week: number, day: number): number {
  return flatDays(tierSlug).findIndex((d) => d.week === week && d.day === day);
}

/** The next session after (week, day), or null if this is the final one. */
export function nextDay(
  tierSlug: string,
  week: number,
  day: number,
): DayRef | null {
  const all = flatDays(tierSlug);
  const i = all.findIndex((d) => d.week === week && d.day === day);
  if (i === -1 || i >= all.length - 1) return null;
  return all[i + 1];
}

export function totalSessions(tierSlug: string): number {
  return flatDays(tierSlug).length;
}

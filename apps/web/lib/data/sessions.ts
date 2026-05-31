import type { DB, Enrollment } from "@/lib/data/enrollments";

/** Deterministic content key matching the seed's program_days.id. */
export function programDayId(
  tierSlug: string,
  week: number,
  day: number,
  path: string,
): string {
  return `${tierSlug}-w${week}-d${day}-${path}`;
}

export interface ParsedDayId {
  tierSlug: string;
  week: number;
  day: number;
  path: string;
}

/** Inverse of programDayId. tierSlug never contains "-w<digit>", so this is safe. */
export function parseProgramDayId(id: string): ParsedDayId | null {
  const m = id.match(/^(.+)-w(\d+)-d(\d+)-([AB])$/);
  if (!m) return null;
  return {
    tierSlug: m[1],
    week: Number(m[2]),
    day: Number(m[3]),
    path: m[4],
  };
}

/**
 * Returns the id of an in-progress session for the enrollment's current day,
 * creating one if none exists. One session per (enrollment, program_day) until
 * the day is finished and the enrollment pointer advances.
 */
export async function startOrResumeSession(
  supabase: DB,
  userId: string,
  enrollment: Enrollment,
): Promise<string | null> {
  const dayId = programDayId(
    enrollment.program_slug,
    enrollment.current_week,
    enrollment.current_day,
    enrollment.path,
  );

  const { data: existing } = await supabase
    .from("workout_sessions")
    .select("id")
    .eq("user_id", userId)
    .eq("enrollment_id", enrollment.id)
    .eq("program_day_id", dayId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("workout_sessions")
    .insert({
      user_id: userId,
      enrollment_id: enrollment.id,
      program_day_id: dayId,
    })
    .select("id")
    .single();
  if (error || !created) return null;
  return created.id;
}

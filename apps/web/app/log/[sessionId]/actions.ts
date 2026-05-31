"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { parseProgramDayId } from "@/lib/data/sessions";
import { getDay, type Path } from "@/lib/content/programs";
import { nextDay } from "@/lib/content/progress";

const setSchema = z.object({
  orderIdx: z.number().int().nonnegative(),
  setIndex: z.number().int().nonnegative(),
  reps: z.number().int().nonnegative().nullable(),
  weight: z.number().nonnegative().nullable(),
  weightUnit: z.enum(["lb", "kg"]).nullable(),
  durationSec: z.number().int().nonnegative().nullable(),
  distanceM: z.number().int().nonnegative().nullable(),
  completed: z.boolean(),
});

const payloadSchema = z.object({
  rpe: z.number().int().min(1).max(10).nullable(),
  notes: z.string().max(2000).nullable(),
  bodyWeight: z.number().positive().nullable(),
  sets: z.array(setSchema).max(200),
});

export type FinishPayload = z.infer<typeof payloadSchema>;

/**
 * Finalize a session: replace its set logs, stamp the session, and advance the
 * enrollment pointer. Returns a result instead of redirecting so it can be
 * called both from the gym screen (happy path) and from the background sync
 * flush. Idempotent: safe to replay an already-applied finish.
 */
export async function syncSession(
  sessionId: string,
  raw: unknown,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) return { ok: false };
  const { rpe, notes, bodyWeight, sets } = parsed.data;

  // Ownership enforced by RLS; also gives us the day + enrollment.
  const { data: session } = await supabase
    .from("workout_sessions")
    .select("id, enrollment_id, program_day_id")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session || !session.program_day_id) return { ok: false };

  const dayId = session.program_day_id;
  const parsedDay = parseProgramDayId(dayId);

  // Resolve content ids server-side so the FK keys are always correct.
  const itemByOrder = new Map<number, { movementId: string | null }>();
  if (parsedDay) {
    const found = getDay(parsedDay.tierSlug, parsedDay.week, parsedDay.day);
    const items = found?.day.prescriptions[parsedDay.path as Path] ?? [];
    for (const it of items) {
      itemByOrder.set(it.orderIdx, {
        movementId: it.movementSlug
          ? `${parsedDay.tierSlug}-${it.movementSlug}`
          : null,
      });
    }
  }

  // Replace this session's set logs (re-finishing overwrites, never duplicates).
  await supabase.from("set_logs").delete().eq("session_id", sessionId);
  const rows = sets
    .filter((s) => itemByOrder.has(s.orderIdx))
    .map((s) => ({
      session_id: sessionId,
      user_id: user.id,
      prescribed_item_id: `${dayId}-${s.orderIdx}`,
      movement_id: itemByOrder.get(s.orderIdx)!.movementId,
      set_index: s.setIndex,
      reps: s.reps,
      weight: s.weight,
      weight_unit: s.weightUnit,
      duration_sec: s.durationSec,
      distance_m: s.distanceM,
      completed: s.completed,
    }));
  if (rows.length > 0) {
    await supabase.from("set_logs").insert(rows);
  }

  await supabase
    .from("workout_sessions")
    .update({
      rpe,
      notes,
      body_weight: bodyWeight,
      performed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  // Advance the enrollment pointer — only if it still points at this day, so
  // re-finishing an already-advanced session is a no-op.
  if (session.enrollment_id && parsedDay) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id, program_slug, current_week, current_day")
      .eq("id", session.enrollment_id)
      .maybeSingle();
    if (
      enrollment &&
      enrollment.current_week === parsedDay.week &&
      enrollment.current_day === parsedDay.day
    ) {
      const next = nextDay(enrollment.program_slug, parsedDay.week, parsedDay.day);
      await supabase
        .from("enrollments")
        .update(
          next
            ? { current_week: next.week, current_day: next.day }
            : { status: "complete" },
        )
        .eq("id", enrollment.id);
    }
  }

  return { ok: true };
}

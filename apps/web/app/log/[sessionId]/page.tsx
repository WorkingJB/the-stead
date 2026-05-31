import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseProgramDayId } from "@/lib/data/sessions";
import { getDay, type Path } from "@/lib/content/programs";
import { LogForm } from "./log-form";

export const metadata: Metadata = { title: "Log session" };

export default async function LogPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectTo=/log/${sessionId}`);

  // RLS scopes this to the owner; a stranger's id returns null.
  const { data: session } = await supabase
    .from("workout_sessions")
    .select("id, program_day_id, rpe, notes, body_weight")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session || !session.program_day_id) notFound();

  const parsed = parseProgramDayId(session.program_day_id);
  if (!parsed) notFound();

  const found = getDay(parsed.tierSlug, parsed.week, parsed.day);
  if (!found) notFound();
  const { program, day } = found;
  const items = day.prescriptions[parsed.path as Path] ?? [];

  // Prefill from any previously saved logs (resuming a session).
  const { data: existing } = await supabase
    .from("set_logs")
    .select(
      "prescribed_item_id, set_index, reps, weight, weight_unit, duration_sec, distance_m, completed",
    )
    .eq("session_id", sessionId);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
      <p className="eyebrow">
        {program.title} · W{parsed.week} D{parsed.day} · Path {parsed.path}
      </p>
      <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{day.title}</h1>
      <p className="mt-1 font-[family-name:var(--font-label)] text-sm uppercase tracking-[0.12em] text-muted">
        {day.duration}
      </p>

      <LogForm
        sessionId={sessionId}
        programDayId={session.program_day_id}
        items={items}
        existing={existing ?? []}
        initialRpe={session.rpe}
        initialNotes={session.notes}
        initialBodyWeight={session.body_weight}
      />
    </div>
  );
}

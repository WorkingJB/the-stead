"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveEnrollment } from "@/lib/data/enrollments";
import { startOrResumeSession } from "@/lib/data/sessions";

export async function startSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/today");

  const enrollment = await getActiveEnrollment(supabase, user.id);
  if (!enrollment) redirect("/onboarding");

  const sessionId = await startOrResumeSession(supabase, user.id, enrollment);
  if (!sessionId) redirect("/today?error=start");

  redirect(`/log/${sessionId}`);
}

"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getActiveEnrollment } from "@/lib/data/enrollments";
import { tiers } from "@/lib/content/programs";

const schema = z.object({
  path: z.enum(["A", "B"]),
  tierSlug: z.enum(tiers.map((t) => t.slug) as [string, ...string[]]),
  startedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function createEnrollment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/onboarding");

  const parsed = schema.safeParse({
    path: formData.get("path"),
    tierSlug: formData.get("tierSlug"),
    startedAt: formData.get("startedAt"),
  });
  if (!parsed.success) {
    redirect("/onboarding?error=invalid");
  }
  const { path, tierSlug, startedAt } = parsed.data;

  // Already enrolled? Don't create a duplicate — just go to today.
  const existing = await getActiveEnrollment(supabase, user.id);
  if (existing) redirect("/today");

  // Ensure a profile row exists (RLS: user owns it). Idempotent.
  await supabase
    .from("profiles")
    .upsert({ user_id: user.id }, { onConflict: "user_id" });

  const { error } = await supabase.from("enrollments").insert({
    user_id: user.id,
    program_slug: tierSlug,
    path,
    started_at: startedAt,
    current_week: 1,
    current_day: 1,
    status: "active",
  });
  if (error) redirect("/onboarding?error=save");

  redirect("/today");
}

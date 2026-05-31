import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type DB = SupabaseClient<Database>;
export type Enrollment = Database["public"]["Tables"]["enrollments"]["Row"];

/** The user's most recent active enrollment, or null if they haven't onboarded. */
export async function getActiveEnrollment(
  supabase: DB,
  userId: string,
): Promise<Enrollment | null> {
  const { data } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

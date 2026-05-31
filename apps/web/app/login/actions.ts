"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { authRedirectOrigin } from "@/lib/site-url";
import { magicLinkSchema } from "@/lib/validation/auth";

export type MagicLinkResult =
  | { status: "sent"; email: string }
  | { status: "error"; message: string };

/**
 * Send a passwordless magic link. The redirect origin is derived from the live
 * request so links work from whatever device/host opened the app (laptop, phone,
 * Vercel preview) — not a hardcoded localhost.
 */
export async function sendMagicLink(
  email: string,
  redirectTo?: string,
): Promise<MagicLinkResult> {
  const parsed = magicLinkSchema.safeParse({ email });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid email." };
  }

  const h = await headers();
  const origin = authRedirectOrigin(h);
  const next = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/today";
  const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo },
  });

  if (error) {
    return { status: "error", message: error.message };
  }
  return { status: "sent", email: parsed.data.email };
}

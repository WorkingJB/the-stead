import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to The Stead with a passwordless magic link.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  // Already signed in → skip the form.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/today");

  return (
    <div className="mx-auto w-full max-w-md flex-1 px-5 py-16">
      <p className="eyebrow">Sign in</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold">
        Welcome back.
      </h1>
      <p className="mt-3 font-[family-name:var(--font-body)] text-lg text-muted">
        No passwords. We&apos;ll email you a one-time sign-in link.
      </p>
      <div className="mt-8">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}

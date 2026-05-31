import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export const metadata: Metadata = { title: "Today" };

// Default authenticated landing. Real "today's session" content arrives in Phase 3;
// for now this proves the protected route + session round-trip against TheStead cloud.
export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already guards, but never render for an anon user.
  if (!user) redirect("/login?redirectTo=/today");

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-16">
      <p className="eyebrow">Today</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold">
        You&apos;re signed in.
      </h1>
      <p className="mt-3 font-[family-name:var(--font-body)] text-lg text-muted">
        Signed in as <strong className="text-foreground">{user.email}</strong>. Your program
        and today&apos;s session land here in Phase 3.
      </p>
      <form action={signOut} className="mt-8">
        <button
          type="submit"
          className="tap-target inline-flex items-center rounded-md border border-hairline px-6 font-[family-name:var(--font-label)] text-foreground hover:bg-brand hover:text-on-brand"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

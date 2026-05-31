import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveEnrollment } from "@/lib/data/enrollments";
import { getDay, movementsByTier, type Path } from "@/lib/content/programs";
import { dayIndex, totalSessions } from "@/lib/content/progress";
import {
  PrescribedItems,
  movementSlugSet,
} from "@/components/prescribed-items";
import { signOut } from "@/app/auth/actions";
import { startSession } from "./actions";

export const metadata: Metadata = { title: "Today" };

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ logged?: string; offline?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/today");

  const { logged, offline } = await searchParams;

  const enrollment = await getActiveEnrollment(supabase, user.id);
  if (!enrollment) redirect("/onboarding");

  const path = enrollment.path as Path;
  const found = getDay(
    enrollment.program_slug,
    enrollment.current_week,
    enrollment.current_day,
  );
  if (!found) redirect("/onboarding?error=program");

  const { program, week, day } = found;
  const items = day.prescriptions[path] ?? [];
  const slugSet = movementSlugSet(movementsByTier(program.tierSlug));
  const idx = dayIndex(program.tierSlug, week.week, day.day);
  const total = totalSessions(program.tierSlug);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">Today</p>
        <Link
          href={`/program/${program.tierSlug}`}
          className="font-[family-name:var(--font-label)] text-sm text-muted hover:text-brand"
        >
          {program.title} →
        </Link>
      </div>

      {logged ? (
        <p
          role="status"
          className="mt-6 rounded-md border border-brand bg-callout px-4 py-3 font-[family-name:var(--font-label)] text-sm text-callout-foreground"
        >
          Session logged. On to the next one.
        </p>
      ) : null}
      {offline ? (
        <p
          role="status"
          className="mt-6 rounded-md border border-hairline bg-callout px-4 py-3 font-[family-name:var(--font-label)] text-sm text-callout-foreground"
        >
          Saved on your device. It&apos;ll sync to your account once you&apos;re back online.
        </p>
      ) : null}

      <p className="mt-4 font-[family-name:var(--font-label)] text-sm text-muted">
        Week {week.week} · Day {day.day}
        {idx >= 0 ? ` · Session ${idx + 1} of ${total}` : ""}
      </p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{day.title}</h1>
      <p className="mt-2 font-[family-name:var(--font-label)] text-sm uppercase tracking-[0.12em] text-muted">
        {day.duration} ·{" "}
        <span style={{ color: `var(--path-${path.toLowerCase()})` }}>
          Path {path}
        </span>
      </p>

      {day.note ? (
        <p className="mt-5 border-l-4 border-callout-border bg-callout px-4 py-3 font-[family-name:var(--font-body)] leading-relaxed text-callout-foreground">
          {day.note}
        </p>
      ) : null}

      <form action={startSession} className="mt-8">
        <button
          type="submit"
          className="tap-target inline-flex w-full items-center justify-center rounded-md bg-brand px-8 text-lg font-semibold text-on-brand hover:opacity-90 sm:w-auto"
        >
          Start session
        </button>
      </form>

      <section className="mt-10" aria-label="Today's prescription">
        <h2 className="font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-[0.14em] text-muted">
          What you&apos;ll do
        </h2>
        <div className="mt-4">
          <PrescribedItems
            items={items}
            movementSlugs={slugSet}
            tierSlug={program.tierSlug}
          />
        </div>
      </section>

      <div className="mt-12 border-t border-hairline pt-6">
        <p className="font-[family-name:var(--font-label)] text-sm text-muted">
          Signed in as {user.email}
        </p>
        <form action={signOut} className="mt-3">
          <button
            type="submit"
            className="tap-target inline-flex items-center rounded-md border border-hairline px-5 font-[family-name:var(--font-label)] text-sm text-foreground hover:bg-brand hover:text-on-brand"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

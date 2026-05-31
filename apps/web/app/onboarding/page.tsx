import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveEnrollment } from "@/lib/data/enrollments";
import { tiers } from "@/lib/content/programs";
import { createEnrollment } from "./actions";

export const metadata: Metadata = { title: "Get started" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/onboarding");

  const existing = await getActiveEnrollment(supabase, user.id);
  if (existing) redirect("/today");

  const { error } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12">
      <p className="eyebrow">Get started</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
        Set up your program
      </h1>
      <p className="mt-3 font-[family-name:var(--font-body)] text-lg text-muted">
        Three choices and you&apos;re training. You can change paths or programs
        later.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-6 border-l-4 border-callout-border bg-callout px-4 py-3 text-callout-foreground"
        >
          Something didn&apos;t save. Please check your choices and try again.
        </p>
      ) : null}

      <form action={createEnrollment} className="mt-10 space-y-10">
        {/* Step 1 — fitness level / path */}
        <fieldset>
          <legend className="font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-[0.12em]">
            1 · Choose your path
          </legend>
          <p className="mt-1 text-sm text-muted">
            When in doubt, start on Path A. You can move up whenever it feels
            easy.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "A",
                title: "Path A · On-ramp",
                desc: "Build the base. Gentler volume and regressions.",
              },
              {
                value: "B",
                title: "Path B · Build",
                desc: "Already active. Standard volume and progressions.",
              },
            ].map((opt, i) => (
              <label
                key={opt.value}
                className="cursor-pointer rounded-lg border border-hairline p-4 transition-colors has-[:checked]:border-brand has-[:checked]:bg-callout"
              >
                <input
                  type="radio"
                  name="path"
                  value={opt.value}
                  defaultChecked={i === 0}
                  className="sr-only"
                  required
                />
                <span
                  className="block font-[family-name:var(--font-label)] font-semibold"
                  style={{ color: `var(--path-${opt.value.toLowerCase()})` }}
                >
                  {opt.title}
                </span>
                <span className="mt-1 block text-sm text-muted">{opt.desc}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Step 2 — equipment tier */}
        <fieldset>
          <legend className="font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-[0.12em]">
            2 · Choose your equipment tier
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tiers.map((t, i) => (
              <label
                key={t.slug}
                className="cursor-pointer rounded-lg border border-hairline p-4 transition-colors has-[:checked]:border-brand has-[:checked]:bg-callout"
              >
                <input
                  type="radio"
                  name="tierSlug"
                  value={t.slug}
                  defaultChecked={i === 0}
                  className="sr-only"
                  required
                />
                <span className="eyebrow">Tier {t.tier}</span>
                <span className="mt-1 block font-[family-name:var(--font-display)] text-xl font-semibold">
                  {t.title}
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {t.lengthWeeks} weeks
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Step 3 — start date */}
        <fieldset>
          <legend className="font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-[0.12em]">
            3 · When do you start?
          </legend>
          <label htmlFor="startedAt" className="mt-2 block text-sm text-muted">
            Week 1, Day 1 begins on this date.
          </label>
          <input
            id="startedAt"
            type="date"
            name="startedAt"
            defaultValue={today}
            required
            className="tap-target mt-2 rounded-md border border-hairline bg-background px-4 font-[family-name:var(--font-label)] text-foreground"
          />
        </fieldset>

        <button
          type="submit"
          className="tap-target inline-flex items-center rounded-md bg-brand px-8 font-[family-name:var(--font-label)] font-semibold text-on-brand hover:opacity-90"
        >
          Start training
        </button>
      </form>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgram, movementsByTier, tiers } from "@/lib/content/programs";

export function generateStaticParams() {
  return tiers.map((t) => ({ tier: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tier: string }>;
}): Promise<Metadata> {
  const { tier } = await params;
  const program = getProgram(tier);
  if (!program) return { title: "Program" };
  return {
    title: program.title,
    description: `Tier ${program.tier} — ${program.title}. A twelve-week field program.`,
  };
}

const DAY_KIND_LABEL: Record<string, string> = {
  strength: "Strength",
  cardio: "Zone 2",
  tempo: "Tempo",
  intervals: "Intervals",
  long: "Long",
};

export default async function ProgramOverviewPage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier } = await params;
  const program = getProgram(tier);
  if (!program) notFound();

  const movementCount = movementsByTier(tier).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <Link href="/program" className="eyebrow hover:underline">
        ← All programs
      </Link>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
        {program.title}
      </h1>
      <p className="mt-2 font-[family-name:var(--font-label)] text-sm text-muted">
        Tier {program.tier} · {program.weeks.length} weeks ·{" "}
        <Link
          href={`/movements/${program.tierSlug}`}
          className="text-brand underline underline-offset-2"
        >
          {movementCount} movements
        </Link>
      </p>

      <div className="mt-10 space-y-10">
        {program.blocks.map((block) => (
          <section key={block.number}>
            <p className="eyebrow">Block {block.number}</p>
            <h2 className="mt-1 text-2xl font-semibold">{block.name}</h2>
            <div className="mt-4 space-y-2">
              {block.weeks.map((weekNum) => {
                const week = program.weeks.find((w) => w.week === weekNum);
                if (!week) return null;
                return (
                  <div
                    key={weekNum}
                    className="rounded-lg border border-hairline p-4"
                  >
                    <p className="font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-[0.12em]">
                      Week {weekNum}
                    </p>
                    <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {week.days.map((day) => (
                        <li key={day.day}>
                          <Link
                            href={`/program/${program.tierSlug}/${weekNum}/${day.day}`}
                            className="tap-target flex h-full flex-col justify-center rounded-md border border-hairline px-3 py-2 text-center transition-colors hover:border-brand"
                          >
                            <span className="font-[family-name:var(--font-label)] text-xs text-muted">
                              Day {day.day}
                            </span>
                            <span className="font-[family-name:var(--font-label)] text-sm font-semibold">
                              {DAY_KIND_LABEL[day.kind] ?? day.kind}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {program.optionalDays ? (
        <p className="mt-10 border-t border-hairline pt-6 font-[family-name:var(--font-body)] text-muted">
          {program.optionalDays}
        </p>
      ) : null}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDay,
  movementsByTier,
  programs,
  type Path,
} from "@/lib/content/programs";
import {
  PrescribedItems,
  movementSlugSet,
} from "@/components/prescribed-items";

export function generateStaticParams() {
  const out: { tier: string; week: string; day: string }[] = [];
  for (const program of programs) {
    for (const week of program.weeks) {
      for (const day of week.days) {
        out.push({
          tier: program.tierSlug,
          week: String(week.week),
          day: String(day.day),
        });
      }
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tier: string; week: string; day: string }>;
}): Promise<Metadata> {
  const { tier, week, day } = await params;
  const found = getDay(tier, Number(week), Number(day));
  if (!found) return { title: "Session" };
  return {
    title: `${found.program.title} · W${week} D${day}`,
    description: found.day.title,
  };
}

const PATH_LABEL: Record<Path, string> = { A: "Path A · On-ramp", B: "Path B · Build" };

export default async function DayPage({
  params,
}: {
  params: Promise<{ tier: string; week: string; day: string }>;
}) {
  const { tier, week, day } = await params;
  const weekNum = Number(week);
  const dayNum = Number(day);
  const found = getDay(tier, weekNum, dayNum);
  if (!found) notFound();

  const { program, week: weekObj, day: dayObj } = found;
  const slugSet = movementSlugSet(movementsByTier(tier));
  const paths = program.paths;

  // Linear prev/next across the program's days.
  const flat = program.weeks.flatMap((w) =>
    w.days.map((d) => ({ week: w.week, day: d.day })),
  );
  const idx = flat.findIndex((f) => f.week === weekNum && f.day === dayNum);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <Link
        href={`/program/${program.tierSlug}`}
        className="eyebrow hover:underline"
      >
        ← {program.title}
      </Link>

      <p className="mt-4 font-[family-name:var(--font-label)] text-sm text-muted">
        Week {weekNum} · Day {dayNum}
        {weekObj.blockNumber ? ` · Block ${weekObj.blockNumber}` : ""}
      </p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{dayObj.title}</h1>
      <p className="mt-2 font-[family-name:var(--font-label)] text-sm uppercase tracking-[0.12em] text-muted">
        {dayObj.duration}
      </p>

      {dayObj.note ? (
        <p className="mt-5 border-l-4 border-callout-border bg-callout px-4 py-3 font-[family-name:var(--font-body)] leading-relaxed text-callout-foreground">
          {dayObj.note}
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {paths.map((path) => {
          const items = dayObj.prescriptions[path] ?? [];
          return (
            <section key={path} aria-labelledby={`path-${path}`}>
              <h2
                id={`path-${path}`}
                className="font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-[0.14em]"
                style={{ color: `var(--path-${path.toLowerCase()})` }}
              >
                {PATH_LABEL[path]}
              </h2>
              <div className="mt-4">
                <PrescribedItems
                  items={items}
                  movementSlugs={slugSet}
                  tierSlug={program.tierSlug}
                />
              </div>
            </section>
          );
        })}
      </div>

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-hairline pt-6">
        {prev ? (
          <Link
            href={`/program/${program.tierSlug}/${prev.week}/${prev.day}`}
            className="tap-target inline-flex items-center font-[family-name:var(--font-label)] text-sm text-foreground hover:text-brand"
          >
            ← W{prev.week} D{prev.day}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/program/${program.tierSlug}/${next.week}/${next.day}`}
            className="tap-target inline-flex items-center font-[family-name:var(--font-label)] text-sm text-foreground hover:text-brand"
          >
            W{next.week} D{next.day} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

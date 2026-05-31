import type { Metadata } from "next";
import Link from "next/link";
import { movements, tiers } from "@/lib/content/programs";
import type { Pattern } from "@the-stead/content-pipeline/schema";

export const metadata: Metadata = {
  title: "Movement Library",
  description:
    "Every movement in the field programs — operator and longevity rationale, form cues, common errors, and how to scale it.",
};

const PATTERN_ORDER: Pattern[] = [
  "push",
  "pull",
  "squat",
  "hinge",
  "core",
  "locomotion",
];
const PATTERN_LABEL: Record<Pattern, string> = {
  push: "Push",
  pull: "Pull",
  squat: "Squat",
  hinge: "Hinge",
  core: "Core",
  locomotion: "Locomotion",
};

export default function MovementsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <p className="eyebrow">The Stead · Movement Library</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Movements</h1>
      <p className="mt-3 max-w-xl font-[family-name:var(--font-body)] text-xl italic text-muted">
        Six patterns, scaled per tier. Each card carries the why, the cues, the
        common errors, and how to regress or progress it.
      </p>

      <div className="mt-10 space-y-12">
        {tiers.map((t) => {
          const tierMovements = movements.filter((m) => m.tierSlug === t.slug);
          if (tierMovements.length === 0) return null;
          return (
            <section key={t.slug} aria-labelledby={`mv-${t.slug}`}>
              <h2
                id={`mv-${t.slug}`}
                className="text-2xl font-semibold text-foreground"
              >
                Tier {t.tier} · {t.title}
              </h2>
              <div className="mt-4 space-y-5">
                {PATTERN_ORDER.map((pattern) => {
                  const inPattern = tierMovements.filter(
                    (m) => m.pattern === pattern,
                  );
                  if (inPattern.length === 0) return null;
                  return (
                    <div key={pattern}>
                      <p className="eyebrow">{PATTERN_LABEL[pattern]}</p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {inPattern.map((m) => (
                          <li key={m.slug}>
                            <Link
                              href={`/movements/${t.slug}/${m.slug}`}
                              className="tap-target inline-flex items-center rounded-md border border-hairline px-3 font-[family-name:var(--font-label)] text-sm transition-colors hover:border-brand hover:text-brand"
                            >
                              {m.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

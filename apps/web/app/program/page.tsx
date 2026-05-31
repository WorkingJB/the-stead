import type { Metadata } from "next";
import Link from "next/link";
import { tiers } from "@/lib/content/programs";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Six twelve-week field programs, from bodyweight-only to the strength hall. Browse any tier's full prescription.",
};

export default function ProgramIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <p className="eyebrow">The Stead · Field Programs</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Programs</h1>
      <p className="mt-3 max-w-xl font-[family-name:var(--font-body)] text-xl italic text-muted">
        Each program is twelve weeks, two paths — A to on-ramp, B to build.
        Browse any tier; pick one when you enroll.
      </p>

      <ul className="mt-10 space-y-3">
        {tiers.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/program/${t.slug}`}
              className="group flex items-center justify-between gap-4 rounded-lg border border-hairline px-5 py-4 transition-colors hover:border-brand"
            >
              <span>
                <span className="eyebrow">Tier {t.tier}</span>
                <span className="mt-1 block font-[family-name:var(--font-display)] text-2xl font-semibold text-foreground group-hover:text-brand">
                  {t.title}
                </span>
              </span>
              <span className="font-[family-name:var(--font-label)] text-sm text-muted">
                {t.lengthWeeks} weeks · {t.movementCount} movements
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

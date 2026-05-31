import Link from "next/link";
import type { Movement, Path } from "@/lib/content/programs";
import type { PrescribedItem } from "@the-stead/content-pipeline/schema";

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s === 0 ? `${m} min` : `${m}:${String(s).padStart(2, "0")}`;
}

/** The big, gym-readable prescription value (e.g. "3 × 8–12"). */
function targetText(item: PrescribedItem): string | null {
  if (item.sets === undefined) return null;
  let value: string;
  if (item.repLow !== undefined && item.repHigh !== undefined) {
    value =
      item.repLow === item.repHigh
        ? `${item.repLow}`
        : `${item.repLow}–${item.repHigh}`;
  } else if (item.durationSec !== undefined) {
    value = formatDuration(item.durationSec);
  } else if (item.distanceM !== undefined) {
    value = `${item.distanceM} m`;
  } else {
    return `${item.sets} sets`;
  }
  return `${item.sets} × ${value}${item.perSide ? " / side" : ""}`;
}

export function PrescribedItems({
  items,
  movementSlugs,
  tierSlug,
}: {
  items: PrescribedItem[];
  /** Slugs that have a movement card, so only those become links. */
  movementSlugs: Set<string>;
  tierSlug: string;
}) {
  return (
    <ol className="space-y-3">
      {items.map((item) => {
        if (item.kind === "note") {
          return (
            <li
              key={item.orderIdx}
              className="font-[family-name:var(--font-body)] leading-relaxed text-muted"
            >
              {item.rawText}
            </li>
          );
        }

        const target = targetText(item);
        const linkable =
          item.movementSlug && movementSlugs.has(item.movementSlug)
            ? item.movementSlug
            : null;

        const name = (
          <span className="font-[family-name:var(--font-label)] font-semibold text-foreground">
            {item.movementName}
          </span>
        );

        return (
          <li
            key={item.orderIdx}
            className="flex flex-col gap-1 border-b border-hairline pb-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <span className="flex flex-wrap items-baseline gap-x-2">
              {linkable ? (
                <Link
                  href={`/movements/${tierSlug}/${linkable}`}
                  className="underline decoration-hairline underline-offset-4 hover:decoration-brand"
                >
                  {name}
                </Link>
              ) : (
                name
              )}
              {item.loadHint ? (
                <span className="rounded bg-callout px-1.5 py-0.5 text-xs font-medium text-callout-foreground">
                  {item.loadHint}
                </span>
              ) : null}
              {item.note ? (
                <span className="text-sm italic text-muted">({item.note})</span>
              ) : null}
            </span>
            {target ? (
              <span className="font-[family-name:var(--font-label)] text-[length:var(--text-prescribed)] font-semibold leading-none tracking-tight text-brand tabular-nums">
                {target}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function movementSlugSet(movements: Movement[]): Set<string> {
  return new Set(movements.map((m) => m.slug));
}

export type { Path };

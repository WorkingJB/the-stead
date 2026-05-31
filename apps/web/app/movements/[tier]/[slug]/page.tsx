import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovement, getProgram, movements } from "@/lib/content/programs";
import { Markdown } from "@/components/markdown";

export function generateStaticParams() {
  return movements.map((m) => ({ tier: m.tierSlug, slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tier: string; slug: string }>;
}): Promise<Metadata> {
  const { tier, slug } = await params;
  const movement = getMovement(tier, slug);
  if (!movement) return { title: "Movement" };
  return { title: movement.name, description: movement.tag || movement.name };
}

export default async function MovementPage({
  params,
}: {
  params: Promise<{ tier: string; slug: string }>;
}) {
  const { tier, slug } = await params;
  const movement = getMovement(tier, slug);
  if (!movement) notFound();

  const program = getProgram(tier);

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-12">
      <Link href={`/movements/${tier}`} className="eyebrow hover:underline">
        ← Movement library
      </Link>
      <p className="mt-4 eyebrow">
        {movement.pattern}
        {program ? ` · Tier ${program.tier}` : ""}
      </p>
      <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">
        {movement.name}
      </h1>
      {movement.tag ? (
        <p className="mt-2 font-[family-name:var(--font-label)] text-sm uppercase tracking-[0.12em] text-muted">
          {movement.tag}
        </p>
      ) : null}

      <div className="mt-8">
        <Markdown>{movement.body}</Markdown>
      </div>
    </article>
  );
}

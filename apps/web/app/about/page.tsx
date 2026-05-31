import type { Metadata } from "next";
import { loadAboutSections } from "@/lib/content/about";
import { TwoToneHeading } from "@/components/two-tone-heading";
import { Markdown } from "@/components/markdown";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Stead is a modern village in field clothes — four pillars, one throughline: longevity. About the program and your data.",
};

// Rendered from the authored Markdown in content/tier-0/front-matter/*.md.
export default async function AboutPage() {
  const sections = await loadAboutSections();

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-12">
      <p className="eyebrow">About · The Stead</p>
      <div className="mt-12 space-y-16">
        {sections.map((s) => (
          <section key={s.slug} aria-labelledby={`${s.slug}-h`}>
            {s.section ? <p className="eyebrow mb-3">{s.section}</p> : null}
            <TwoToneHeading
              as="h2"
              text={s.headline}
              accent={s.headlineAccent}
              className="text-3xl font-semibold sm:text-4xl"
            />
            {s.deck ? (
              <p className="mt-3 font-[family-name:var(--font-body)] text-xl italic text-muted">
                {s.deck}
              </p>
            ) : null}
            <div className="mt-6">
              <span id={`${s.slug}-h`} className="sr-only">
                {s.headline}
              </span>
              <Markdown>{s.body}</Markdown>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

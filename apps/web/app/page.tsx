import Link from "next/link";

const PILLARS = ["Fitness", "Civic", "Skills", "Food"] as const;

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-5">
      <section className="flex flex-col items-start gap-6 py-20 sm:py-28">
        <p className="eyebrow">Twelve-week programs · Tier 0 → C2</p>
        <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.05] sm:text-6xl">
          A modern village in <span className="text-brand">field clothes.</span>
        </h1>
        <p className="max-w-2xl font-[family-name:var(--font-body)] text-xl italic text-muted">
          Pick your fitness level and equipment tier and get a continuous,
          automatically-progressing program you can log at the gym, offline, in dark mode.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/login"
            className="tap-target inline-flex items-center rounded-md bg-brand px-6 font-[family-name:var(--font-label)] font-semibold text-on-brand"
          >
            Get started
          </Link>
          <Link
            href="/about"
            className="tap-target inline-flex items-center rounded-md border border-hairline px-6 font-[family-name:var(--font-label)] text-foreground hover:bg-brand hover:text-on-brand"
          >
            About the Stead
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-6">
          {PILLARS.map((p) => (
            <span
              key={p}
              className="font-[family-name:var(--font-label)] text-sm uppercase tracking-[0.18em] text-muted"
            >
              {p}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

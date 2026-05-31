import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground"
        >
          The <span className="text-brand">Stead</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/program"
            className="tap-target inline-flex items-center rounded-md px-3 font-[family-name:var(--font-label)] text-sm text-foreground hover:text-brand"
          >
            Programs
          </Link>
          <Link
            href="/movements"
            className="tap-target hidden items-center rounded-md px-3 font-[family-name:var(--font-label)] text-sm text-foreground hover:text-brand sm:inline-flex"
          >
            Movements
          </Link>
          <Link
            href="/about"
            className="tap-target inline-flex items-center rounded-md px-3 font-[family-name:var(--font-label)] text-sm text-foreground hover:text-brand"
          >
            About
          </Link>
          <Link
            href="/login"
            className="tap-target inline-flex items-center rounded-md bg-brand px-4 font-[family-name:var(--font-label)] text-sm font-semibold text-on-brand"
          >
            Sign in
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

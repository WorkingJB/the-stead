"use client";

import { useTheme } from "next-themes";

/**
 * Light/dark toggle. The visible label is driven by CSS `dark:` variants rather
 * than React state, so it never mismatches between server and client render
 * (no mounted-flag / setState-in-effect needed).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="tap-target inline-flex items-center justify-center rounded-md border border-hairline px-3 font-[family-name:var(--font-label)] text-sm text-foreground transition-colors hover:bg-brand hover:text-on-brand"
    >
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </button>
  );
}

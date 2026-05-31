import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolve the repo's authoring `content/` directory.
 *
 * Phase 1 renders the About page directly from the Markdown source. Depending on
 * whether Next runs from apps/web or the monorepo root, the content lives at a
 * different relative depth — probe the likely candidates. (Phase 2's content
 * pipeline will replace this filesystem read with generated typed JSON.)
 */
export function contentRoot(): string {
  const candidates = [
    path.join(process.cwd(), "content"),
    path.join(process.cwd(), "..", "..", "content"),
    path.join(process.cwd(), "..", "content"),
  ];
  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }
  throw new Error(
    `Could not locate the authoring content/ directory. Looked in:\n${candidates.join("\n")}`,
  );
}

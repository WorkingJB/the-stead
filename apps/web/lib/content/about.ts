import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { contentRoot } from "@/lib/content/paths";

export interface AboutSection {
  slug: string;
  section: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  deck: string;
  body: string;
}

/**
 * Load the "About the Stead" front-matter pages from the Tier 0 reference content.
 * Files are ordered by their NN- filename prefix (welcome, dual mandate, …).
 */
export async function loadAboutSections(): Promise<AboutSection[]> {
  const dir = path.join(contentRoot(), "tier-0", "front-matter");
  const files = (await readdir(dir))
    .filter((f) => f.endsWith(".md"))
    .sort();

  const sections = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        section: String(data.section ?? ""),
        eyebrow: String(data.eyebrow ?? ""),
        headline: String(data.headline ?? ""),
        headlineAccent: String(data.headline_accent ?? ""),
        deck: String(data.deck ?? ""),
        body: content.trim(),
      } satisfies AboutSection;
    }),
  );

  return sections;
}

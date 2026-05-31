import { cn } from "@/lib/utils";

/**
 * Two-tone display heading: the `accent` substring of `text` renders in the accent
 * color, the rest in ink/foreground. Mirrors the print treatment (e.g. "Welcome to
 * The Stead" with "The Stead" in terracotta).
 */
export function TwoToneHeading({
  text,
  accent,
  as: Tag = "h2",
  className,
}: {
  text: string;
  accent?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  if (!accent || !text.includes(accent)) {
    return <Tag className={className}>{text}</Tag>;
  }

  const [before, after] = text.split(accent);
  return (
    <Tag className={cn(className)}>
      {before}
      <span className="text-accent">{accent}</span>
      {after}
    </Tag>
  );
}

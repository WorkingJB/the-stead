/**
 * Canonical content model — the single source of truth shared between the
 * content pipeline (which validates + emits) and the web app (which imports the
 * generated JSON, typed against these schemas).
 *
 * The app imports TYPES only (`import type { Program } ...`), so none of this —
 * or zod — is ever bundled into the client. Runtime validation happens once, in
 * the pipeline, at build time.
 */
import { z } from "zod";

export const PathSchema = z.enum(["A", "B"]);
export type Path = z.infer<typeof PathSchema>;

export const PatternSchema = z.enum([
  "push",
  "pull",
  "squat",
  "hinge",
  "core",
  "locomotion",
]);
export type Pattern = z.infer<typeof PatternSchema>;

export const SessionKindSchema = z.enum([
  "strength",
  "cardio",
  "tempo",
  "intervals",
  "long",
]);
export type SessionKind = z.infer<typeof SessionKindSchema>;

/**
 * One line of a day's prescription. `kind: "exercise"` means the grammar pulled
 * structured logging fields out of the line; `kind: "note"` is a warmup,
 * cooldown, cardio instruction, or anything unparseable — rendered as prose.
 * `rawText` is always the verbatim authored line, the durable fallback.
 */
export const PrescribedItemSchema = z.object({
  orderIdx: z.number().int().nonnegative(),
  rawText: z.string(),
  kind: z.enum(["exercise", "note"]),
  movementName: z.string().optional(),
  /** Best-effort link into the movement library; null when no confident match. */
  movementSlug: z.string().nullable().optional(),
  sets: z.number().int().positive().optional(),
  repLow: z.number().int().positive().optional(),
  repHigh: z.number().int().positive().optional(),
  durationSec: z.number().int().positive().optional(),
  distanceM: z.number().int().positive().optional(),
  perSide: z.boolean().optional(),
  /** e.g. "10 lb" pulled from a movement-name parenthetical. */
  loadHint: z.string().optional(),
  /** Trailing parenthetical aside, e.g. "light, technical". */
  note: z.string().optional(),
});
export type PrescribedItem = z.infer<typeof PrescribedItemSchema>;

export const DaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string(),
  kind: SessionKindSchema,
  duration: z.string(),
  note: z.string().default(""),
  /** Ordered prescribed items per path (A on-ramp, B build). */
  prescriptions: z.record(PathSchema, z.array(PrescribedItemSchema)),
});
export type Day = z.infer<typeof DaySchema>;

export const WeekSchema = z.object({
  week: z.number().int().positive(),
  /** Coaching prose from content/<tier>/weeks/week-NN.md, if present. */
  intro: z.string().optional(),
  blockNumber: z.number().int().positive().optional(),
  days: z.array(DaySchema),
});
export type Week = z.infer<typeof WeekSchema>;

export const BlockSchema = z.object({
  number: z.number().int().positive(),
  name: z.string(),
  weeks: z.array(z.number().int().positive()),
});
export type Block = z.infer<typeof BlockSchema>;

export const ProgramSchema = z.object({
  /** Filesystem-derived slug: "tier-0", "tier-1", "c1", "c2". */
  tierSlug: z.string(),
  /** Authored tier label as printed: "0", "1", "C1", "C2". */
  tier: z.string(),
  title: z.string(),
  paths: z.array(PathSchema),
  optionalDays: z.string().optional(),
  blocks: z.array(BlockSchema),
  weeks: z.array(WeekSchema),
});
export type Program = z.infer<typeof ProgramSchema>;

export const MovementSchema = z.object({
  tierSlug: z.string(),
  pattern: PatternSchema,
  /** Unique within a tier. */
  slug: z.string(),
  name: z.string(),
  tag: z.string().default(""),
  /** Markdown body: why-it-matters, form cues, common errors, scaling. */
  body: z.string(),
});
export type Movement = z.infer<typeof MovementSchema>;

export const TierSummarySchema = z.object({
  slug: z.string(),
  tier: z.string(),
  title: z.string(),
  lengthWeeks: z.number().int().positive(),
  paths: z.array(PathSchema),
  movementCount: z.number().int().nonnegative(),
});
export type TierSummary = z.infer<typeof TierSummarySchema>;

export const ContentManifestSchema = z.object({
  tiers: z.array(TierSummarySchema),
});
export type ContentManifest = z.infer<typeof ContentManifestSchema>;

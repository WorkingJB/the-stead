"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PrescribedItem } from "@the-stead/content-pipeline/schema";
import {
  clearLocal,
  enqueue,
  loadDraft,
  saveDraft,
  type DraftState,
  type SetDraft,
} from "@/lib/offline/db";
import { HAS_LOGGED_KEY } from "@/lib/offline/flags";
import { syncSession, type FinishPayload } from "./actions";

type InputKind = "reps" | "duration" | "distance";

interface ExistingLog {
  prescribed_item_id: string | null;
  set_index: number;
  reps: number | null;
  weight: number | null;
  weight_unit: string | null;
  duration_sec: number | null;
  distance_m: number | null;
  completed: boolean;
}

interface Group {
  item: PrescribedItem;
  kind: InputKind;
  sets: SetDraft[];
}

function inputKind(item: PrescribedItem): InputKind {
  if (item.durationSec != null) return "duration";
  if (item.distanceM != null) return "distance";
  return "reps";
}

function num(s: string): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function LogForm({
  sessionId,
  programDayId,
  items,
  existing,
  initialRpe,
  initialNotes,
  initialBodyWeight,
}: {
  sessionId: string;
  programDayId: string;
  items: PrescribedItem[];
  existing: ExistingLog[];
  initialRpe: number | null;
  initialNotes: string | null;
  initialBodyWeight: number | null;
}) {
  const router = useRouter();

  // Seed from the server-provided logs (and prescription defaults). The Dexie
  // draft, if any, is layered on top after mount — local edits win.
  const initial = useMemo<Group[]>(() => {
    const byKey = new Map<string, ExistingLog>();
    for (const e of existing) {
      if (e.prescribed_item_id) byKey.set(`${e.prescribed_item_id}-${e.set_index}`, e);
    }
    return items
      .filter((it) => it.kind === "exercise")
      .map((item) => {
        const kind = inputKind(item);
        const count = item.sets ?? 1;
        const sets: SetDraft[] = Array.from({ length: count }, (_, i) => {
          const e = byKey.get(`${programDayId}-${item.orderIdx}-${i}`);
          const defReps = kind === "reps" ? (item.repHigh ?? item.repLow ?? "") : "";
          const defDur = kind === "duration" ? (item.durationSec ?? "") : "";
          const defDist = kind === "distance" ? (item.distanceM ?? "") : "";
          return {
            reps: e?.reps != null ? String(e.reps) : String(defReps),
            weight: e?.weight != null ? String(e.weight) : "",
            durationSec:
              e?.duration_sec != null ? String(e.duration_sec) : String(defDur),
            distanceM:
              e?.distance_m != null ? String(e.distance_m) : String(defDist),
            completed: e?.completed ?? false,
          };
        });
        return { item, kind, sets };
      });
  }, [items, existing, programDayId]);

  const [groups, setGroups] = useState<Group[]>(initial);
  const [weightUnit, setWeightUnit] = useState<"lb" | "kg">(
    (existing.find((e) => e.weight_unit)?.weight_unit as "lb" | "kg") ?? "lb",
  );
  const [rpe, setRpe] = useState<string>(initialRpe ? String(initialRpe) : "");
  const [notes, setNotes] = useState<string>(initialNotes ?? "");
  const [bodyWeight, setBodyWeight] = useState<string>(
    initialBodyWeight ? String(initialBodyWeight) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const hydrated = useRef(false);

  const noteItems = items.filter((it) => it.kind === "note");

  const draftState = (): DraftState => ({
    sets: Object.fromEntries(groups.map((g) => [g.item.orderIdx, g.sets])),
    weightUnit,
    rpe,
    notes,
    bodyWeight,
  });

  // Hydrate from any locally-saved draft (resuming, possibly offline).
  useEffect(() => {
    let cancelled = false;
    loadDraft(sessionId)
      .then((draft) => {
        if (cancelled) return;
        if (draft) {
          setGroups((prev) =>
            prev.map((g) => {
              const saved = draft.state.sets[g.item.orderIdx];
              return saved ? { ...g, sets: saved } : g;
            }),
          );
          setWeightUnit(draft.state.weightUnit);
          setRpe(draft.state.rpe);
          setNotes(draft.state.notes);
          setBodyWeight(draft.state.bodyWeight);
        }
      })
      .finally(() => {
        hydrated.current = true;
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // Debounced autosave — every edit is persisted locally, so losing signal or
  // closing the tab mid-workout never loses data.
  useEffect(() => {
    if (!hydrated.current) return;
    const snapshot = draftState();
    const t = setTimeout(() => {
      void saveDraft(sessionId, snapshot);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, weightUnit, rpe, notes, bodyWeight, sessionId]);

  function update(gi: number, si: number, patch: Partial<SetDraft>) {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === gi
          ? { ...g, sets: g.sets.map((r, j) => (j === si ? { ...r, ...patch } : r)) }
          : g,
      ),
    );
  }

  async function onFinish() {
    if (submitting) return;
    setSubmitting(true);

    const sets = groups.flatMap((g) =>
      g.sets.map((row, si) => ({
        orderIdx: g.item.orderIdx,
        setIndex: si,
        reps: g.kind === "reps" ? num(row.reps) : null,
        weight: num(row.weight),
        weightUnit: num(row.weight) != null ? weightUnit : null,
        durationSec: g.kind === "duration" ? num(row.durationSec) : null,
        distanceM: g.kind === "distance" ? num(row.distanceM) : null,
        completed: row.completed,
      })),
    );
    const payload: FinishPayload = {
      rpe: num(rpe),
      notes: notes.trim() ? notes.trim() : null,
      bodyWeight: num(bodyWeight),
      sets,
    };

    try {
      // Local-first: queue the finish, then try to sync immediately.
      await saveDraft(sessionId, draftState());
      await enqueue(sessionId, payload);
      try {
        localStorage.setItem(HAS_LOGGED_KEY, "1");
      } catch {
        // private mode / storage disabled — non-fatal
      }

      let ok = false;
      if (typeof navigator === "undefined" || navigator.onLine) {
        try {
          ok = (await syncSession(sessionId, payload)).ok;
        } catch {
          ok = false; // offline / network error → stays queued
        }
      }

      if (ok) {
        await clearLocal(sessionId);
        router.replace("/today?logged=1");
      } else {
        router.replace("/today?offline=1");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6">
      {noteItems.length > 0 ? (
        <ul className="mb-6 space-y-1 border-l-4 border-hairline pl-4">
          {noteItems.map((it) => (
            <li key={it.orderIdx} className="text-sm leading-relaxed text-muted">
              {it.rawText}
            </li>
          ))}
        </ul>
      ) : null}

      {groups.length > 0 ? (
        <div className="flex items-center justify-end gap-2">
          <span className="font-[family-name:var(--font-label)] text-xs text-muted">
            Weight unit
          </span>
          <div className="flex overflow-hidden rounded-md border border-hairline">
            {(["lb", "kg"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setWeightUnit(u)}
                aria-pressed={weightUnit === u}
                className={`px-3 py-1 font-[family-name:var(--font-label)] text-sm ${
                  weightUnit === u
                    ? "bg-brand text-on-brand"
                    : "text-foreground hover:bg-callout"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <ol className="mt-4 space-y-5">
        {groups.map((g, gi) => (
          <li key={g.item.orderIdx} className="rounded-lg border border-hairline p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-[family-name:var(--font-label)] font-semibold">
                {g.item.movementName}
              </span>
              {g.item.loadHint ? (
                <span className="rounded bg-callout px-1.5 py-0.5 text-xs text-callout-foreground">
                  {g.item.loadHint}
                </span>
              ) : null}
            </div>

            <div className="mt-3 space-y-2">
              {g.sets.map((row, si) => (
                <div key={si} className="flex flex-wrap items-center gap-2">
                  <span className="w-12 font-[family-name:var(--font-label)] text-xs uppercase tracking-wide text-muted">
                    Set {si + 1}
                  </span>

                  {g.kind === "reps" ? (
                    <Field
                      label="reps"
                      value={row.reps}
                      onChange={(v) => update(gi, si, { reps: v })}
                    />
                  ) : null}
                  {g.kind === "duration" ? (
                    <Field
                      label="sec"
                      value={row.durationSec}
                      onChange={(v) => update(gi, si, { durationSec: v })}
                    />
                  ) : null}
                  {g.kind === "distance" ? (
                    <Field
                      label="m"
                      value={row.distanceM}
                      onChange={(v) => update(gi, si, { distanceM: v })}
                    />
                  ) : null}

                  <Field
                    label={weightUnit}
                    value={row.weight}
                    onChange={(v) => update(gi, si, { weight: v })}
                  />

                  <label className="ml-auto inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={row.completed}
                      onChange={(e) => update(gi, si, { completed: e.target.checked })}
                      className="size-6 accent-[var(--brand)]"
                    />
                    <span className="font-[family-name:var(--font-label)] text-xs text-muted">
                      done
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-4 rounded-lg border border-hairline p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="rpe"
            className="font-[family-name:var(--font-label)] text-sm font-semibold"
          >
            Session RPE
          </label>
          <input
            id="rpe"
            type="number"
            min={1}
            max={10}
            inputMode="numeric"
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            placeholder="1–10"
            className="tap-target w-24 rounded-md border border-hairline bg-background px-3 text-center text-lg"
          />
          <label
            htmlFor="bw"
            className="ml-2 font-[family-name:var(--font-label)] text-sm font-semibold"
          >
            Body weight
          </label>
          <input
            id="bw"
            type="number"
            inputMode="decimal"
            value={bodyWeight}
            onChange={(e) => setBodyWeight(e.target.value)}
            placeholder={weightUnit}
            className="tap-target w-24 rounded-md border border-hairline bg-background px-3 text-center text-lg"
          />
        </div>
        <div>
          <label
            htmlFor="notes"
            className="font-[family-name:var(--font-label)] text-sm font-semibold"
          >
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-hairline bg-background px-3 py-2"
            placeholder="How did it feel?"
          />
        </div>
      </div>

      <div className="sticky bottom-0 mt-6 -mx-5 border-t border-hairline bg-background px-5 py-4">
        <button
          type="button"
          onClick={onFinish}
          disabled={submitting}
          className="tap-target inline-flex w-full items-center justify-center rounded-md bg-brand px-8 text-lg font-semibold text-on-brand hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Finish session"}
        </button>
        <p className="mt-2 text-center font-[family-name:var(--font-label)] text-xs text-muted">
          Saved on this device as you go — syncs when you&apos;re online.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="tap-target w-20 rounded-md border border-hairline bg-background px-2 text-center text-lg tabular-nums"
      />
      <span className="font-[family-name:var(--font-label)] text-xs text-muted">
        {label}
      </span>
    </span>
  );
}

/**
 * Offline store for the gym screen (IndexedDB via Dexie).
 *
 * - `drafts`: the in-progress form snapshot for a session, autosaved on every
 *   edit so losing signal or closing the tab mid-workout never loses data.
 * - `outbox`: finished sessions awaiting sync to Supabase. Flushed by
 *   components/offline-sync on load and on reconnect; entries are idempotent
 *   (the server action replaces set logs and guards the enrollment advance).
 *
 * The Dexie instance is created lazily and only in the browser, so importing
 * this module during SSR of a client component never touches `indexedDB`.
 */
import Dexie, { type Table } from "dexie";

export interface SetDraft {
  reps: string;
  weight: string;
  durationSec: string;
  distanceM: string;
  completed: boolean;
}

export interface DraftState {
  /** Keyed by the prescribed item's orderIdx. */
  sets: Record<number, SetDraft[]>;
  weightUnit: "lb" | "kg";
  rpe: string;
  notes: string;
  bodyWeight: string;
}

export interface SessionDraft {
  sessionId: string;
  state: DraftState;
  updatedAt: number;
}

export interface OutboxItem<P = unknown> {
  sessionId: string;
  payload: P;
  updatedAt: number;
  attempts: number;
}

class SteadDB extends Dexie {
  drafts!: Table<SessionDraft, string>;
  outbox!: Table<OutboxItem, string>;

  constructor() {
    super("the-stead");
    this.version(1).stores({
      drafts: "sessionId",
      outbox: "sessionId",
    });
  }
}

let instance: SteadDB | null = null;

/** Browser-only Dexie handle. Never call during render or on the server. */
function db(): SteadDB {
  if (typeof window === "undefined") {
    throw new Error("offline db is browser-only");
  }
  if (!instance) instance = new SteadDB();
  return instance;
}

export async function saveDraft(sessionId: string, state: DraftState): Promise<void> {
  await db().drafts.put({ sessionId, state, updatedAt: Date.now() });
}

export async function loadDraft(sessionId: string): Promise<SessionDraft | undefined> {
  return db().drafts.get(sessionId);
}

export async function enqueue<P>(sessionId: string, payload: P): Promise<void> {
  await db().outbox.put({ sessionId, payload, updatedAt: Date.now(), attempts: 0 });
}

export async function listOutbox(): Promise<OutboxItem[]> {
  return db().outbox.toArray();
}

export async function bumpAttempts(sessionId: string): Promise<void> {
  const item = await db().outbox.get(sessionId);
  if (item) await db().outbox.update(sessionId, { attempts: item.attempts + 1 });
}

export async function removeOutbox(sessionId: string): Promise<void> {
  await db().outbox.delete(sessionId);
}

/** Clear both the draft and any queued sync for a synced session. */
export async function clearLocal(sessionId: string): Promise<void> {
  await Promise.all([db().drafts.delete(sessionId), db().outbox.delete(sessionId)]);
}

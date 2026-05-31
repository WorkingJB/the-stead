"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { bumpAttempts, clearLocal, listOutbox } from "@/lib/offline/db";
import { syncSession } from "@/app/log/[sessionId]/actions";

/**
 * Flushes the offline outbox: replays each queued session finish to Supabase on
 * app load and whenever the browser comes back online. Idempotent on the server
 * side, so a partial/duplicate replay is safe. Mounted once in the root layout.
 */
export function OfflineSync() {
  const router = useRouter();

  useEffect(() => {
    let running = false;

    async function flush() {
      if (running) return;
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      running = true;
      try {
        const items = await listOutbox();
        let synced = 0;
        for (const item of items) {
          try {
            const res = await syncSession(item.sessionId, item.payload);
            if (res.ok) {
              await clearLocal(item.sessionId);
              synced += 1;
            } else {
              await bumpAttempts(item.sessionId);
            }
          } catch {
            await bumpAttempts(item.sessionId);
          }
        }
        // Reflect any advanced-enrollment state on a stale server-rendered page.
        if (synced > 0) router.refresh();
      } finally {
        running = false;
      }
    }

    void flush();
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
  }, [router]);

  return null;
}

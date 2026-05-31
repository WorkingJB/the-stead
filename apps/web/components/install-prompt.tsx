"use client";

import { useEffect, useState } from "react";
import { hasLoggedSession } from "@/lib/offline/flags";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Custom install prompt, shown on /about only after the user has logged a
 * session (per the plan) and only when the browser offers installation
 * (Chrome/Android fire `beforeinstallprompt`; iOS Safari does not).
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      // Only surface the prompt once the user has finished a session.
      if (hasLoggedSession()) setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!deferred) return null;

  return (
    <div className="mt-12 rounded-lg border border-brand bg-callout p-5">
      <p className="font-[family-name:var(--font-label)] font-semibold text-callout-foreground">
        Install The Stead
      </p>
      <p className="mt-1 text-sm text-callout-foreground">
        Add it to your home screen for one-tap, offline access at the gym.
      </p>
      <button
        type="button"
        onClick={async () => {
          await deferred.prompt();
          await deferred.userChoice;
          setDeferred(null);
        }}
        className="tap-target mt-4 inline-flex items-center rounded-md bg-brand px-6 font-[family-name:var(--font-label)] font-semibold text-on-brand hover:opacity-90"
      >
        Install
      </button>
    </div>
  );
}

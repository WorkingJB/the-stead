import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  description: "You're offline.",
};

// Served by the service worker when a navigation request can't reach the
// network and the page isn't already cached. Pages you've visited (and the
// gym screen for your current session) still work offline from cache.
export default function OfflinePage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-20">
      <p className="eyebrow">Offline</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
        No connection right now.
      </h1>
      <p className="mt-4 font-[family-name:var(--font-body)] text-lg text-muted">
        You can still open pages and your current session that you&apos;ve
        already loaded. Anything you log while offline is saved on this device
        and syncs the moment you&apos;re back online.
      </p>
      <p className="mt-6 font-[family-name:var(--font-label)] text-sm text-muted">
        Try again once you have signal.
      </p>
    </div>
  );
}

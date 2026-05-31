import { createSerwistRoute } from "@serwist/turbopack";

// Stable per-deploy revision so the offline fallback busts when code ships.
// Vercel sets the commit SHA; local/dev falls back to a constant.
const revision = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";

// Serves the compiled service worker at /serwist/sw.js (built from app/sw.ts
// with esbuild). The library sets Service-Worker-Allowed so the SW can claim
// the whole "/" scope despite living under /serwist/.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "app/sw.ts",
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
    useNativeEsbuild: true,
  });

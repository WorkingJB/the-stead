import type { NextConfig } from "next";
import path from "node:path";

// Repo (monorepo) root, one level above apps/web's parent.
const repoRoot = path.join(process.cwd(), "..", "..");

const isProd = process.env.NODE_ENV === "production";

/**
 * Baseline transport hardening. A full nonce-based CSP is a Phase 2 item
 * (tracked in SECURITY.md); these headers are the cheap, no-breakage portion
 * we can land in the foundation. HSTS is only meaningful over HTTPS (prod).
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // Monorepo: trace from the repo root and bundle the authored Markdown the
  // About page reads at request time (Phase 2 replaces this with generated JSON).
  outputFileTracingRoot: repoRoot,
  outputFileTracingIncludes: {
    "/about": ["../../content/tier-0/front-matter/**/*.md"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

/**
 * Resolve the canonical site origin for auth redirects.
 *
 * Multi-device cloud testing: the magic-link redirect must match the origin the
 * user actually opened the app from (laptop, phone, Vercel preview) — not a
 * hardcoded localhost. Prefer the live request Origin header; fall back to env.
 */

/** Best-effort origin from server-side request headers. */
export function originFromHeaders(headers: Headers): string | null {
  const origin = headers.get("origin");
  if (origin) return origin;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return null;
  const proto = headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Static fallback used when no request context is available. */
export function configuredSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Origin to use for an auth callback, given the current request headers. */
export function authRedirectOrigin(headers: Headers): string {
  return originFromHeaders(headers) ?? configuredSiteUrl();
}

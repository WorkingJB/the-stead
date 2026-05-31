import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * Refreshes the Supabase session on every request and keeps auth cookies in sync.
 * Per @supabase/ssr guidance: always return the `supabaseResponse` object as-is so
 * the refreshed cookies reach the browser. Do not run other logic between
 * createServerClient and getUser().
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: refresh the auth token. Do not insert logic before this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guard authenticated-only routes. Public routes stay open.
  // Match a segment exactly or as a path prefix so "/login" is NOT caught by "/log".
  const { pathname } = request.nextUrl;
  const protectedRoots = ["/today", "/log", "/program", "/history", "/settings", "/onboarding"];
  const isProtected = protectedRoots.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

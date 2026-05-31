import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and image optimization files, so
     * the Supabase session is refreshed across all page navigations.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons/|serwist/|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

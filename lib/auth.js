import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "epc_admin_session";

/**
 * Deliberately simple: a single shared admin password (set via env var),
 * checked against a signed-ish session cookie set on login. Fine for a
 * one-or-two-person admin panel. If more than one person needs distinct
 * logins/roles later, swap this for NextAuth or Clerk without touching
 * the rest of the app — every route already calls requireAdmin().
 */
export function requireAdmin(request) {
  const cookieStore = cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (session !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function adminCookieName() {
  return COOKIE_NAME;
}

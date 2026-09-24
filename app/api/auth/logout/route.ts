import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hashToken, sessionCookie } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie.name)?.value;
  if (token) {
    try { await query("DELETE FROM sessions WHERE token_hash=$1", [hashToken(token)]); }
    catch (error) { console.error("logout_session_revoke_failed", error); }
  }
  const url = new URL(request.url);
  const target = url.searchParams.get("return_to") || "/";
  const safe = target.startsWith("/") && !target.startsWith("//") && !target.startsWith("/\\") ? target : "/";
  const response = NextResponse.redirect(new URL(safe, url.origin), 303);
  response.cookies.set(sessionCookie.name, "", { ...sessionCookie.options, maxAge: 0, expires: new Date(0) });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Clear-Site-Data", '"cache"');
  return response;
}

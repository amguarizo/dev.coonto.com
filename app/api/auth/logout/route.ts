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
  const target = new URL(request.url).searchParams.get("return_to") || "/";
  const safe = target.startsWith("/") && !target.startsWith("//") && !target.startsWith("/\\") && !/[\r\n]/.test(target) ? target : "/";
  // Um Location relativo preserva o domínio público atrás do proxy.
  const response = new NextResponse(null, { status:303, headers:{ Location:safe } });
  response.cookies.set(sessionCookie.name, "", { ...sessionCookie.options, maxAge: 0, expires: new Date(0) });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Clear-Site-Data", '"cache"');
  return response;
}

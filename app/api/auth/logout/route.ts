import { cookies } from "next/headers";
import { hashToken, sessionCookie } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie.name)?.value;
  if (token) await query("DELETE FROM sessions WHERE token_hash=$1", [hashToken(token)]);
  cookieStore.set(sessionCookie.name, "", { ...sessionCookie.options, maxAge: 0 });
  const url = new URL(request.url);
  const target = url.searchParams.get("return_to") || "/";
  const response = Response.redirect(new URL(target.startsWith("/") && !target.startsWith("//") ? target : "/", url.origin));
  response.headers.set("Clear-Site-Data", '"cache"');
  return response;
}

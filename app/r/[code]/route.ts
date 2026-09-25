import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[A-Z0-9]{12}$/.test(code)) return new Response("Indicação inválida", { status: 404 });
  const result = await query("SELECT 1 FROM partner_referrals WHERE code=$1 AND active=TRUE", [code]);
  if (!result.rowCount) return new Response("Indicação inválida", { status: 404 });
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("coonto_ref", code, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

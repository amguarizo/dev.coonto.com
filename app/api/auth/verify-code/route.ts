import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { hashToken, sessionCookie } from "@/lib/auth";
import { query } from "@/lib/db";

const normalize = (value: unknown) => String(value || "").trim().toLowerCase().slice(0, 320);
const hashCode = (email: string, code: string) => createHmac("sha256", process.env.AUTH_SECRET || "").update(`${email}:${code}`).digest("hex");

export async function POST(request: Request) {
  const body = await request.json() as { email?: string; code?: string; returnTo?: string };
  const email = normalize(body.email);
  const code = String(body.code || "").trim();
  if (!/^\d{6}$/.test(code)) return Response.json({ error: "Informe o código de seis números." }, { status: 400 });
  const codeResult = await query<{ id: string; code_hash: string; attempts: number }>("SELECT id,code_hash,attempts FROM login_codes WHERE email=$1 AND used_at IS NULL AND expires_at>NOW() ORDER BY created_at DESC LIMIT 1", [email]);
  const loginCode = codeResult.rows[0];
  const suppliedHash = hashCode(email, code);
  const valid = loginCode && loginCode.attempts < 10 && timingSafeEqual(Buffer.from(loginCode.code_hash, "hex"), Buffer.from(suppliedHash, "hex"));
  if (!valid) {
    if (loginCode) await query("UPDATE login_codes SET attempts=attempts+1, used_at=CASE WHEN attempts>=9 THEN NOW() ELSE used_at END WHERE id=$1", [loginCode.id]);
    return Response.json({ error: "Código inválido ou expirado." }, { status: 401 });
  }
  await query("UPDATE login_codes SET used_at=NOW() WHERE id=$1", [loginCode.id]);
  const name = email.split("@")[0];
  const userResult = await query<{ id: string }>(`INSERT INTO users (id,email,name) VALUES ($1,$2,$3) ON CONFLICT (email) DO UPDATE SET last_seen_at=NOW() RETURNING id`, [crypto.randomUUID(), email, name]);
  const userId = userResult.rows[0].id;
  const admins = String(process.env.ADMIN_EMAILS || "").split(",").map(item => item.trim().toLowerCase()).filter(Boolean);
  if (admins.includes(email)) await query("UPDATE users SET role='admin' WHERE id=$1", [userId]);
  const token = randomBytes(32).toString("base64url");
  await query("INSERT INTO sessions (token_hash,user_id,expires_at) VALUES ($1,$2,NOW() + INTERVAL '30 days')", [hashToken(token), userId]);
  (await cookies()).set(sessionCookie.name, token, sessionCookie.options);
  const returnTo = body.returnTo?.startsWith("/") && !body.returnTo.startsWith("//") ? body.returnTo : "/minha-biblioteca";
  return Response.json({ ok: true, returnTo });
}

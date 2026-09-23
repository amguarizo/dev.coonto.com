import { createHmac, randomInt } from "node:crypto";
import nodemailer from "nodemailer";
import { query } from "@/lib/db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalize = (value: unknown) => String(value || "").trim().toLowerCase().slice(0, 320);
const hashCode = (email: string, code: string) => createHmac("sha256", process.env.AUTH_SECRET || "").update(`${email}:${code}`).digest("hex");

export async function POST(request: Request) {
  const body = await request.json() as { email?: string };
  const email = normalize(body.email);
  if (!emailPattern.test(email)) return Response.json({ error: "Informe um e-mail válido." }, { status: 400 });
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) return Response.json({ error: "Autenticação ainda não configurada." }, { status: 503 });
  const recent = await query<{ count: string }>("SELECT COUNT(*)::text AS count FROM login_codes WHERE email = $1 AND created_at > NOW() - INTERVAL '15 minutes'", [email]);
  if (Number(recent.rows[0]?.count || 0) >= 5) return Response.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });

  const validationMode = process.env.AUTH_MODE === "validation";
  const code = validationMode ? String(process.env.VALIDATION_ACCESS_CODE || "") : String(randomInt(100000, 1000000));
  if (!/^\d{6}$/.test(code)) return Response.json({ error: "Código de validação não configurado." }, { status: 503 });
  await query("INSERT INTO login_codes (id,email,code_hash,requester_ip,expires_at) VALUES ($1,$2,$3,$4,NOW() + INTERVAL '10 minutes')", [crypto.randomUUID(), email, hashCode(email, code), request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null]);

  if (!validationMode) {
    try {
      const port = Number(process.env.SMTP_PORT || 587);
      const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
      await transporter.sendMail({ from: process.env.SMTP_FROM, to: email, subject: `${code} é seu código de acesso ao Coonto`, text: `Seu código Coonto é ${code}. Ele expira em 10 minutos.`, html: `<div style="font-family:Arial,sans-serif;color:#10192d"><h1 style="color:#2454ff">${code}</h1><p>Este é seu código de acesso ao Coonto.</p><p>Ele expira em 10 minutos.</p></div>` });
    } catch (error) {
      console.error("smtp_send_failed", error);
      return Response.json({ error: "Não foi possível enviar o código agora. Tente novamente em alguns minutos." }, { status: 503 });
    }
  }
  return Response.json({ ok: true, mode: validationMode ? "validation" : "email" });
}

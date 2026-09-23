import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !String(body.message || "").trim() || !String(body.understood || "").trim()) return Response.json({ error: "Dados incompletos" }, { status: 400 });
    await query("INSERT INTO feedback (id,source,rating,understood,message,email) VALUES ($1,$2,$3,$4,$5,$6)", [crypto.randomUUID(), String(body.source || "site"), rating, String(body.understood), String(body.message).slice(0,4000), String(body.email || "").slice(0,320) || null]);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) { console.error("feedback_save_failed", error); return Response.json({ error: "Serviço temporariamente indisponível" }, { status: 503 }); }
}


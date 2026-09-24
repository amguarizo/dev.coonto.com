import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") || 0) > 6000) return Response.json({ error: "Sugestão muito longa" }, { status: 413 });
    const body = await request.json() as Record<string, unknown>;
    if (body.website) return Response.json({ ok: true }, { status: 201 });
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const author = typeof body.author === "string" ? body.author.trim() : "";
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!title || title.length > 200 || author.length > 200 || !reason || reason.length > 1500 || email.length > 320 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return Response.json({ error: "Confira os dados enviados" }, { status: 400 });
    }
    await query("INSERT INTO work_suggestions (id,title,author,reason,email) VALUES ($1,$2,$3,$4,$5)", [crypto.randomUUID(), title, author || null, reason, email || null]);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("work_suggestion_save_failed", error);
    return Response.json({ error: "Serviço temporariamente indisponível" }, { status: 503 });
  }
}

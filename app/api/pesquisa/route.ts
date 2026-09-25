import { query } from "@/lib/db";
import { surveyChoices } from "@/lib/survey";

const singleKeys = ["role", "understood", "difficulty", "helpful", "adoption", "payer", "obstacle", "followup"] as const;
const multiKeys = ["timing", "trust"] as const;
const textKeys = ["explanation", "doubt", "problem", "adoption_reason", "timing_reason", "payer_reason", "clarity_improvement", "priority", "contact", "role_other", "helpful_other", "trust_other", "obstacle_other"] as const;

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") || 0) > 18000) return Response.json({ error: "Resposta muito longa" }, { status: 413 });
    const raw = await request.text();
    if (raw.length > 18000) return Response.json({ error: "Resposta muito longa" }, { status: 413 });
    const payload: unknown = JSON.parse(raw);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return Response.json({ error: "Dados inválidos" }, { status: 400 });
    const body = payload as Record<string, unknown>;
    if (body.website) return Response.json({ ok: true }, { status: 201 });
    const input = body.answers;
    if (!input || typeof input !== "object" || Array.isArray(input)) return Response.json({ error: "Dados inválidos" }, { status: 400 });
    const incoming = input as Record<string, unknown>;
    const answers: Record<string, string | string[]> = {};
    for (const key of singleKeys) {
      const value = incoming[key];
      if (typeof value !== "string" || !(surveyChoices[key] as readonly string[]).includes(value)) return Response.json({ error: "Confira as respostas de múltipla escolha" }, { status: 400 });
      answers[key] = value;
    }
    for (const key of multiKeys) {
      const value = incoming[key];
      if (!Array.isArray(value) || !value.length || value.length > surveyChoices[key].length || new Set(value).size !== value.length || !value.every(item => typeof item === "string" && (surveyChoices[key] as readonly string[]).includes(item))) return Response.json({ error: "Escolha ao menos uma opção nas perguntas 7 e 8" }, { status: 400 });
      answers[key] = value;
    }
    for (const key of textKeys) {
      const value = incoming[key] ?? "";
      if (typeof value !== "string" || value.length > (key === "contact" ? 320 : 1200)) return Response.json({ error: "Confira os textos enviados" }, { status: 400 });
      answers[key] = value.trim();
    }
    if (!answers.problem || !answers.clarity_improvement || !answers.priority) return Response.json({ error: "Responda às perguntas abertas 5, 11 e 12" }, { status: 400 });
    await query("INSERT INTO survey_responses (id,survey_version,answers) VALUES ($1,$2,$3::jsonb)", [crypto.randomUUID(), "1.6.0", JSON.stringify(answers)]);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Dados inválidos" }, { status: 400 });
    console.error("survey_save_failed", error);
    return Response.json({ error: "Não foi possível salvar agora. Tente novamente em instantes." }, { status: 503 });
  }
}

"use client";

import { useEffect } from "react";

type ModelContext = { registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void> };

export function WebMcpTools() {
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const post = async (url: string, input: unknown) => {
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      if (!response.ok) throw new Error("Não foi possível concluir a ação.");
      return { status: "received" };
    };
    const register = (tool: Record<string, unknown>) => Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined);
    void register({
      name: "submit_coonto_feedback",
      title: "Enviar feedback ao Coonto",
      description: "Envia uma avaliação sobre a experiência O Alienista para orientar a próxima versão.",
      inputSchema: { type: "object", properties: { rating: { type: "integer", minimum: 1, maximum: 5 }, understood: { type: "string" }, message: { type: "string" }, email: { type: "string" } }, required: ["rating", "understood", "message"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input: unknown) => post("/api/feedback", { ...(input as object), source: "webmcp-o-alienista" }),
    });
    void register({
      name: "register_coonto_partner_interest",
      title: "Registrar interesse em parceria",
      description: "Registra o interesse de um educador, escola, curador ou criador em colaborar com o Coonto.",
      inputSchema: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, role: { type: "string" }, organization: { type: "string" }, message: { type: "string" } }, required: ["name", "email", "role", "message"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input: unknown) => post("/api/partners", input),
    });
    return () => lifecycle.abort();
  }, []);
  return null;
}

"use client";

import { useState } from "react";

export function SuggestionForm() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSending(true);
    setStatus("Enviando sugestão…");
    try {
      const response = await fetch("/api/sugestoes-obras", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.get("title"), author: form.get("author"), reason: form.get("reason"), email: form.get("email"), website: form.get("website") }),
      });
      if (!response.ok) throw new Error();
      formElement.reset();
      setStatus("Sugestão recebida. Obrigado por ajudar a construir o catálogo.");
    } catch {
      setStatus("Não conseguimos receber sua sugestão agora. Tente novamente mais tarde.");
    } finally {
      setSending(false);
    }
  }
  return <form className="form-card" onSubmit={submit}>
    <div className="field"><label htmlFor="suggestion-title">Nome da obra *</label><input id="suggestion-title" name="title" required maxLength={200} placeholder="Ex.: A hora da estrela" /></div>
    <div className="field"><label htmlFor="suggestion-author">Autor ou autora (se souber)</label><input id="suggestion-author" name="author" maxLength={200} /></div>
    <div className="field"><label htmlFor="suggestion-reason">Por que você sugere essa obra? *</label><textarea id="suggestion-reason" name="reason" required maxLength={1500} placeholder="Conte o que gostaria de compreender ou explorar nela." /></div>
    <div className="field"><label htmlFor="suggestion-email">Seu e-mail (opcional)</label><input id="suggestion-email" name="email" type="email" maxLength={320} placeholder="Se quiser conversar sobre sua sugestão" /></div>
    <div className="suggestion-trap" aria-hidden="true"><label htmlFor="suggestion-website">Site</label><input id="suggestion-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <button className="button button-primary" type="submit" disabled={sending}>{sending ? "Enviando…" : "Sugerir obra"}</button>
    {status && <p className="form-status" role="status">{status}</p>}
  </form>;
}

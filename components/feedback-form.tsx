"use client";

import { useState } from "react";

export function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Enviando…");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, understood: form.get("understood"), message: form.get("message"), email: form.get("email"), source: "o-alienista" }) });
    setStatus(response.ok ? "Obrigado. Seu feedback entrou na construção do próximo Coonto." : "Não foi possível enviar agora. Tente novamente em instantes.");
    if (response.ok) event.currentTarget.reset();
  }
  return (
    <form className="form-card" onSubmit={submit}>
      <div className="field"><label>Quanto esta experiência ajudou você a compreender?</label><div className="rating-row">{[1,2,3,4,5].map(n => <button type="button" key={n} className={rating === n ? "active" : ""} onClick={() => setRating(n)} aria-label={`${n} de 5`}>{n}</button>)}</div></div>
      <div className="field"><label htmlFor="understood">O que ficou mais claro?</label><select id="understood" name="understood" required defaultValue=""><option value="" disabled>Escolha uma opção</option><option>Personagens e conflitos</option><option>Contexto histórico</option><option>Decisões e consequências</option><option>Ideias centrais da obra</option><option>Ainda não ficou claro</option></select></div>
      <div className="field"><label htmlFor="message">O que devemos melhorar primeiro?</label><textarea id="message" name="message" required placeholder="Diga com suas palavras. É isso que vai orientar a próxima versão." /></div>
      <div className="field"><label htmlFor="feedback-email">E-mail (opcional)</label><input id="feedback-email" name="email" type="email" placeholder="Para avisarmos quando sua sugestão entrar" /></div>
      <button className="button button-primary" type="submit">Enviar meu feedback</button>
      {status && <p className="form-status" role="status">{status}</p>}
    </form>
  );
}

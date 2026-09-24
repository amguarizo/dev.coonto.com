"use client";

import { useState } from "react";

export function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(sending)return;
    const element=event.currentTarget;
    const form = new FormData(element);
    setSending(true);setStatus("Enviando…");
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, understood: form.get("understood"), message: form.get("message"), email: form.get("email"), source: "o-alienista" }) });
      if(!response.ok)throw new Error();
      setStatus("Obrigado. Seu feedback foi recebido.");element.reset();
    } catch {setStatus("Não foi possível enviar. Confira sua conexão e tente novamente.");}
    finally {setSending(false);}
  }
  return (
    <form className="form-card" onSubmit={submit}>
      <div className="field"><label>Quanto esta experiência ajudou você a compreender?</label><div className="rating-row">{[1,2,3,4,5].map(n => <button type="button" key={n} className={rating === n ? "active" : ""} onClick={() => setRating(n)} aria-label={`${n} de 5`}>{n}</button>)}</div></div>
      <div className="field"><label htmlFor="understood">O que ficou mais claro?</label><select id="understood" name="understood" required defaultValue=""><option value="" disabled>Escolha uma opção</option><option>Personagens e conflitos</option><option>Contexto histórico</option><option>Decisões e consequências</option><option>Ideias centrais da obra</option><option>Ainda não ficou claro</option></select></div>
      <div className="field"><label htmlFor="message">O que devemos melhorar primeiro?</label><textarea id="message" name="message" required placeholder="Diga com suas palavras. É isso que vai orientar a próxima versão." /></div>
      <div className="field"><label htmlFor="feedback-email">E-mail (opcional)</label><input id="feedback-email" name="email" type="email" placeholder="Para avisarmos quando sua sugestão entrar" /></div>
      <button className="button button-primary" type="submit" disabled={sending}>{sending?"Enviando…":"Enviar meu feedback"}</button>
      {status && <p className="form-status" role="status">{status}</p>}
    </form>
  );
}

"use client";

import { useState } from "react";

export function PartnerForm({ initialRole="" }:{ initialRole?:string }) {
  const [status, setStatus] = useState("");
  const [sending,setSending]=useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();if(sending)return;
    const element=event.currentTarget;
    const form = new FormData(element);
    setSending(true);setStatus("Enviando…");
    try {
      const response = await fetch("/api/partners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      if(!response.ok)throw new Error();
      setStatus("Recebido. Vamos conversar sobre como construir essa parceria.");element.reset();
    } catch {setStatus("Não foi possível enviar. Confira sua conexão e tente novamente.");}
    finally {setSending(false);}
  }
  return (
    <form className="form-card" onSubmit={submit}>
      <div className="field"><label htmlFor="name">Nome</label><input id="name" name="name" required /></div>
      <div className="field"><label htmlFor="partner-email">E-mail</label><input id="partner-email" name="email" type="email" required /></div>
      <div className="field"><label htmlFor="role">Como você quer participar?</label><select id="role" name="role" required defaultValue={initialRole}><option value="" disabled>Escolha uma opção</option><option value="educador">Professor ou educador</option><option value="escola">Coordenação ou direção escolar</option><option value="influenciador">Influenciador ou criador de conteúdo</option><option value="curador">Curador ou especialista</option></select></div>
      <div className="field"><label htmlFor="organization">Escola, canal ou organização</label><input id="organization" name="organization" /></div>
      <div className="field"><label htmlFor="partner-message">O que podemos construir juntos?</label><textarea id="partner-message" name="message" required /></div>
      <button className="button button-coral" type="submit" disabled={sending}>{sending?"Enviando…":"Quero ser parceiro"}</button>
      {status && <p className="form-status" role="status">{status}</p>}
    </form>
  );
}

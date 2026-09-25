"use client";

import { useState } from "react";

export function FreeCheckoutButton({ returnTo }:{ returnTo:string }) {
  const [sending,setSending]=useState(false);
  const [error,setError]=useState("");
  async function confirm() {
    setSending(true);setError("");
    try {
      const response=await fetch("/api/checkout/free",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"}});
      if(!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || "Não foi possível concluir agora. Tente novamente.");
      }
      window.location.assign(returnTo);
    } catch (cause) {setError(cause instanceof Error ? cause.message : "Não foi possível concluir agora. Tente novamente.");setSending(false);}
  }
  return <><button type="button" className="button button-primary" onClick={confirm} disabled={sending}>{sending?"Concluindo pedido…":"Confirmar pedido gratuito"}</button>{error&&<p role="alert">{error}</p>}</>;
}

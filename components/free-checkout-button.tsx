"use client";

import { useState } from "react";

export function FreeCheckoutButton({ returnTo }:{ returnTo:string }) {
  const [sending,setSending]=useState(false);
  const [error,setError]=useState("");
  async function confirm() {
    setSending(true);setError("");
    try {
      const response=await fetch("/api/checkout/free",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"}});
      if(!response.ok)throw new Error();
      window.location.assign(returnTo);
    } catch {setError("Não foi possível concluir agora. Tente novamente.");setSending(false);}
  }
  return <><button type="button" className="button button-primary" onClick={confirm} disabled={sending}>{sending?"Concluindo pedido…":"Confirmar pedido gratuito"}</button>{error&&<p role="alert">{error}</p>}</>;
}

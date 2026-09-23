import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name=String(body.name||"").trim(), email=String(body.email||"").trim().toLowerCase(), role=String(body.role||"").trim(), message=String(body.message||"").trim();
    if(!name||!email||!role||!message) return Response.json({error:"Dados incompletos"},{status:400});
    await query("INSERT INTO partner_leads (id,name,email,role,organization,message) VALUES ($1,$2,$3,$4,$5,$6)",[crypto.randomUUID(),name.slice(0,160),email.slice(0,320),role.slice(0,100),String(body.organization||"").slice(0,200)||null,message.slice(0,4000)]);
    return Response.json({ok:true},{status:201});
  } catch(error){ console.error("partner_save_failed",error); return Response.json({error:"Serviço temporariamente indisponível"},{status:503}); }
}


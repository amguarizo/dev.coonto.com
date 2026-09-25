import "../crm/styles.css";
import { requireCrmHost } from "@/lib/admin-host";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { createOpportunity, createReferral, updateOpportunity } from "../crm/actions";

export const dynamic = "force-dynamic";
type Lead = { id: string; name: string; role: string; organization: string | null; code: string | null; attributed: string };
type Opportunity = { id: string; title: string; stage: string; model: string; potential_cents: number; organization: string | null; lead: string | null; notes: string };

export default async function Partnerships() {
  await requireCrmHost();
  const user = await requireUser("/backoffice/parcerias");
  if (user.role !== "admin") return <main className="page"><SiteHeader/><div className="content page-hero"><h1>Área restrita</h1></div></main>;
  const [leads, organizations, opportunities] = await Promise.all([
    query<Lead>(`SELECT l.id,l.name,l.role,l.organization,r.code,
      (SELECT COUNT(*)::text FROM referral_attributions a WHERE a.referral_id=r.id) AS attributed
      FROM partner_leads l LEFT JOIN partner_referrals r ON r.lead_id=l.id ORDER BY l.created_at DESC LIMIT 100`),
    query<{ id: string; name: string }>("SELECT id,name FROM organizations ORDER BY name"),
    query<Opportunity>(`SELECT p.id,p.title,p.stage,p.model,p.potential_cents,p.notes,o.name AS organization,l.name AS lead
      FROM crm_opportunities p LEFT JOIN organizations o ON o.id=p.organization_id
      LEFT JOIN partner_leads l ON l.id=p.lead_id ORDER BY p.updated_at DESC LIMIT 100`),
  ]);
  return <main className="backoffice"><SiteHeader/><div className="content crm-page">
    <a className="survey-back" href="/backoffice">← Painel administrativo</a>
    <section className="backoffice-hero"><span className="section-kicker">CRM · PARCERIAS</span><h1>De onde vêm as relações</h1><p>Links de indicação, oportunidades e cenários comerciais. Nenhuma comissão ou pagamento é gerado nesta fase gratuita.</p></section>
    <section className="dashboard-card"><h2>Indicações</h2><p>Compartilhe o link individual. Ele registra a origem quando uma pessoa entra pela primeira vez com sua conta.</p>{leads.rows.length ? <div className="status-list">{leads.rows.map(lead => <div className="status-item" key={lead.id}><div><strong>{lead.name}</strong> · {lead.role}{lead.organization && <> · {lead.organization}</>}<p>{lead.code ? <><code>{`${process.env.APP_URL || "https://dev.coonto.com"}/r/${lead.code}`}</code> · {lead.attributed} conta(s) atribuída(s)</> : "Ainda sem link de indicação"}</p></div>{!lead.code && <form action={createReferral}><input type="hidden" name="lead_id" value={lead.id}/><button className="button button-primary">Criar link</button></form>}</div>)}</div> : <p>Ainda não há contatos.</p>}</section>
    <section className="dashboard-card"><h2>Nova oportunidade</h2><p>O valor abaixo é uma estimativa de cenário. Não representa receita, comissão ou saldo devido.</p><form action={createOpportunity} className="crm-form-grid"><label className="field">Título<input name="title" required maxLength={200}/></label><label className="field">Conta<select name="organization_id"><option value="">Selecione, se houver</option>{organizations.rows.map(org => <option value={org.id} key={org.id}>{org.name}</option>)}</select></label><label className="field">Contato<select name="lead_id"><option value="">Selecione, se houver</option>{leads.rows.map(lead => <option value={lead.id} key={lead.id}>{lead.name}</option>)}</select></label><label className="field">Modelo<select name="model"><option value="to_define">A definir</option><option value="pilot">Piloto</option><option value="referral">Indicação</option><option value="recurring">Recorrente</option><option value="fixed">Valor fixo</option></select></label><label className="field">Potencial estimado (R$)<input name="potential" type="number" min="0" max="1000000" step="0.01" defaultValue="0" required/></label><label className="field">Observações<input name="notes" maxLength={1000}/></label><button className="button button-primary">Criar oportunidade</button></form></section>
    <section className="dashboard-card"><h2>Oportunidades</h2>{opportunities.rows.length ? <div className="status-list">{opportunities.rows.map(item => <div className="status-item" key={item.id}><div><strong>{item.title}</strong> · {item.organization || item.lead}<p>{item.model} · potencial simulado: {(item.potential_cents/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</p>{item.notes && <small>{item.notes}</small>}</div><form action={updateOpportunity}><input type="hidden" name="id" value={item.id}/><label className="field">Etapa<select name="stage" defaultValue={item.stage}><option value="idea">Ideia</option><option value="conversation">Conversa</option><option value="proposal">Proposta</option><option value="agreed">Acordada</option><option value="closed">Encerrada</option></select></label><button className="button button-primary">Salvar</button></form></div>)}</div> : <p>Ainda não há oportunidades.</p>}</section>
  </div></main>;
}

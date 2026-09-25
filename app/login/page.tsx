import { LoginForm } from "@/components/login-form";
import "../backoffice/crm/styles.css";
import { SiteHeader } from "@/components/site-header";
import { isCrmHost } from "@/lib/admin-host";

export default async function Login({ searchParams }: { searchParams: Promise<{ return_to?: string }> }) {
  const crm = await isCrmHost();
  const params = await searchParams;
  const returnTo = crm ? "/backoffice" : params.return_to?.startsWith("/") && !params.return_to.startsWith("//") ? params.return_to : "/minha-biblioteca";
  return <main className="login-page"><SiteHeader/><div className="login-layout"><div><span className="section-kicker">{crm ? "ADMINISTRAÇÃO COONTO" : "SUA CONTA COONTO"}</span><h1>{crm ? "Acesse o CRM." : <>Entre na obra.<br/>Continue de onde parou.</>}</h1><p>{crm ? "Ambiente reservado à equipe de administração." : "Sua biblioteca, decisões e progresso acompanham você em qualquer aparelho autorizado."}</p></div><LoginForm returnTo={returnTo}/></div></main>;
}

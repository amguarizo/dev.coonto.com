import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";

export default async function Login({ searchParams }: { searchParams: Promise<{ return_to?: string }> }) {
  const params = await searchParams;
  const returnTo = params.return_to?.startsWith("/") && !params.return_to.startsWith("//") ? params.return_to : "/minha-biblioteca";
  return <main className="login-page"><SiteHeader/><div className="login-layout"><div><span className="section-kicker">SUA CONTA COONTO</span><h1>Entre na obra.<br/>Continue de onde parou.</h1><p>Sua biblioteca, decisões e progresso acompanham você em qualquer aparelho autorizado.</p></div><LoginForm returnTo={returnTo}/></div></main>;
}

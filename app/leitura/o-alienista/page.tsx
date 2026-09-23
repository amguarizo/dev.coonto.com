import { ExperienceFrame } from "@/components/experience-frame";
import { SiteHeader } from "@/components/site-header";
import { ensureAlienistaEntitlement } from "@/lib/member";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LeituraAlienista() {
  const user = await requireUser("/leitura/o-alienista");
  await ensureAlienistaEntitlement(user.userId);
  return <main className="reader-page"><SiteHeader/><div className="reader-heading"><div><span className="section-kicker">SUA EXPERIÊNCIA</span><h1>O Alienista</h1></div><a href="/minha-biblioteca">Minha biblioteca</a></div><ExperienceFrame/></main>;
}

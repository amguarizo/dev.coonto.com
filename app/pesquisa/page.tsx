import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SurveyForm } from "@/components/survey-form";

export const metadata = { title: "Pesquisa sobre o Coonto" };

export default function Pesquisa() {
  return <main className="page"><SiteHeader/><div className="survey-page content">
    <div className="survey-intro"><span className="section-kicker">PESQUISA DE DIRECIONAMENTO</span><h1>Ajude a decidir os próximos passos do Coonto.</h1><p>Queremos saber se a proposta está clara e onde ela pode ser mais útil. São 13 perguntas; leva cerca de 7 minutos. Sua resposta sincera faz diferença.</p><p>Antes de responder, conheça a <a href="/">página inicial</a>. Se puder, veja também <a href="/obra/o-alienista">O Alienista</a>.</p></div>
    <SurveyForm />
  </div><SiteFooter/></main>;
}

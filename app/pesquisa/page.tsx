import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SurveyForm } from "@/components/survey-form";
import { FormJump } from "@/components/form-jump";
import Link from "next/link";

export const metadata = { title: "Pesquisa sobre o Coonto" };

export default function Pesquisa() {
  return <main className="page"><SiteHeader/><FormJump target="responder"/><div className="survey-page content">
    <div className="survey-intro"><span className="section-kicker">PESQUISA DE DIRECIONAMENTO</span><h1>Ajude a decidir os próximos passos do Coonto.</h1><p>Queremos saber se a proposta está clara e onde ela pode ser mais útil. São 13 perguntas; leva cerca de 7 minutos. Sua resposta sincera faz diferença.</p><p>Antes de responder, conheça a <Link href="/">página inicial</Link>. Se puder, veja também <Link href="/obra/o-alienista">O Alienista</Link>.</p></div>
    <div id="responder"><SurveyForm /></div>
  </div><SiteFooter/></main>;
}

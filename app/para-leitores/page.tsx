import { BookHeart, GraduationCap, Search } from "lucide-react";
import { PathChoice } from "@/components/path-choice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Leitores() {
  const choices = [
    { icon:<GraduationCap />, title:"Preciso para uma prova", text:"Quero compreender a obra para escola, vestibular ou ENEM — sem depender de decorar um resumo." },
    { icon:<Search />, title:"Li, mas não entendi", text:"Terminei ou comecei a obra, mas personagens, contexto e ideias ainda parecem distantes." },
    { icon:<BookHeart />, title:"Quero viver uma grande história", text:"Quero entrar no universo da obra, decidir, descobrir consequências e encontrar o caminho do autor." },
  ];
  return <main className="page"><SiteHeader /><div className="content"><section className="page-hero"><span className="section-kicker">NÃO É SOBRE LER MAIS RÁPIDO</span><h1>O que você precisa compreender agora?</h1><p>O Coonto começa pela sua pergunta. A explicação aparece depois que a história já significa alguma coisa para você.</p></section><PathChoice choices={choices} /></div><SiteFooter /></main>;
}

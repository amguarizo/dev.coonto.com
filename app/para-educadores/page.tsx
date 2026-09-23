import { BookOpenCheck, Building2, Megaphone } from "lucide-react";
import { PathChoice } from "@/components/path-choice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Educadores() {
  const choices = [
    { icon:<BookOpenCheck />, title:"Usar com meus alunos", text:"Quero uma experiência que desperte perguntas, dê contexto e ajude a lembrar da obra." },
    { icon:<Building2 />, title:"Levar para minha escola", text:"Quero avaliar o Coonto como solução pedagógica para turmas, professores e acompanhamento." },
    { icon:<Megaphone />, title:"Apresentar para minha audiência", text:"Quero experimentar, produzir conteúdo e aproximar mais pessoas das grandes obras." },
  ];
  return <main className="page"><SiteHeader /><div className="content"><section className="page-hero"><span className="section-kicker">SEU CAMINHO COMEÇA AQUI</span><h1>Como você quer transformar compreensão em aprendizagem?</h1><p>Escolha a situação que mais se aproxima da sua. Não queremos empurrar uma ferramenta: queremos mostrar onde ela resolve um problema real.</p></section><PathChoice choices={choices} /></div><SiteFooter /></main>;
}

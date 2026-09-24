import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const paths = [
  { id:"alunos", title:"Usar com meus alunos", description:"Comece pela experiência gratuita de O Alienista e use as cenas para levantar hipóteses e voltar às passagens de Machado. O Coonto Club será uma opção individual quando as três primeiras obras estiverem completas; não há assinatura ativa hoje.", action:"Abrir o espaço do professor", href:"/professor" },
  { id:"escola", title:"Levar para minha escola", description:"Apresente o método à coordenação com os guias abaixo, experimente O Alienista com uma turma e combine quais evidências de compreensão observar. Um piloto institucional, a adaptação e seus valores devem ser discutidos com a escola; o Coonto ainda não afirma resultados medidos.", action:"Conversar sobre um piloto", href:"/parceiros" },
  { id:"audiencia", title:"Apresentar para minha audiência", description:"Criadores, curadores e educadores podem experimentar a obra, avaliar o conteúdo e propor materiais ou divulgação em conjunto. Conte sua ideia para definirmos uma colaboração concreta, sem promessa antecipada de comissão.", action:"Propor parceria", href:"/parceiros" },
];

export default function Educadores() {
  return <main className="page"><SiteHeader/><div className="content">
    <section className="page-hero"><span className="section-kicker">COONTO PARA EDUCADORES</span><h1>Escolha como quer usar a experiência.</h1>
      <p>O livro original continua sendo a referência. O Coonto organiza cenas, decisões e perguntas para apoiar sua mediação.</p></section>
    <div className="educator-paths">{paths.map(path=><article id={path.id} key={path.id} className="educator-path"><h2>{path.title}</h2><p>{path.description}</p><a className="button button-primary" href={path.href}>{path.action}</a></article>)}</div>
    <section className="educator-guides"><span className="section-kicker">MATERIAL DE APOIO</span><h2>Guias para planejar a aula</h2><p>Leia, baixe e adapte as perguntas ao momento da turma.</p>
      <div className="guide-list"><a href="/guias/Coonto_Para_Educadores_01_Como_Funciona.pdf" target="_blank" rel="noopener">01 · Como funciona o Coonto (PDF)</a>
        <a href="/guias/Coonto_Para_Educadores_02_Quando_Usar.pdf" target="_blank" rel="noopener">02 · Quando usar: antes, durante ou depois (PDF)</a>
        <a href="/guias/Coonto_Para_Educadores_03_Uso_em_Aula.pdf" target="_blank" rel="noopener">03 · Como usar o Coonto em aula (PDF)</a></div>
      <p>Veja também o <a href="/para-educadores/roteiro-de-aula">roteiro de aula em formato de página</a> e o <a href="/professor">exercício guiado na área do professor</a>.</p>
    </section>
  </div><SiteFooter/></main>;
}

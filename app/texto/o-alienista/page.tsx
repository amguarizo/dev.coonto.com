import { readFile } from "node:fs/promises";
import path from "node:path";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic="force-static";

const numerals=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"];

export default async function TextoAlienista() {
  const text=await readFile(path.join(process.cwd(),"public","textos","o-alienista-original.txt"),"utf8");
  const sections=text.split(/(?=^CAPÍTULO [IVX]+\s*-)/gm).filter(Boolean);
  return <main className="page"><SiteHeader/><div className="content original-page">
    <section className="page-hero"><span className="section-kicker">TEXTO DE MACHADO DE ASSIS</span><h1>O Alienista</h1>
      <p>Leia o texto original e compare cada cena com as palavras do autor. O Coonto apresenta interpretações e situações próprias; elas são identificadas separadamente do texto abaixo.</p>
      <a className="button button-primary" href="/textos/o-alienista-original.txt" download>Baixar texto integral (.txt)</a>
      <p>Transcrição atribuída ao Departamento Nacional do Livro / Fundação Biblioteca Nacional, preservada como texto. <a href="https://dominiopublico.mec.gov.br/pesquisa/DetalheObraForm.do?co_obra=1939&select_action=" target="_blank" rel="noopener noreferrer">Consulte também a edição em PDF do portal Domínio Público</a>. As páginas variam conforme a edição; por isso as referências do Coonto usam capítulos.</p>
    </section>
    <nav className="chapter-nav" aria-label="Capítulos">{numerals.map(n=><a key={n} href={`#capitulo-${n.toLowerCase()}`}>Capítulo {n}</a>)}</nav>
    {sections.map((section,index)=>{
      const [heading,...lines]=section.trim().split("\n");
      const numeral=numerals[index];
      return <section key={numeral} id={`capitulo-${numeral?.toLowerCase()}`} className="original-chapter"><h2>{heading}</h2><div className="original-text">{lines.join("\n").trim()}</div></section>;
    })}
    <p><a href="/obra/o-alienista">Voltar à experiência Coonto</a></p>
  </div><SiteFooter/></main>;
}

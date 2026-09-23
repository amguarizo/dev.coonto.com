import { ArrowRight, LockKeyhole } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Catalogo() {
  return (
    <main className="page">
      <SiteHeader />
      <div className="content">
        <section className="catalog-hero">
          <div><span className="section-kicker">ESCOLHA ONDE ENTRAR</span><h1>Grandes obras.<br/>Novas portas.</h1></div>
          <p>O Alienista é a primeira experiência. As próximas obras já aparecem como destino — porque o catálogo começa pequeno, mas a ideia não termina.</p>
        </section>
        <section className="catalog-grid">
          <article className="book-card featured">
            <span className="book-number">01</span>
            <div><span className="tag">DISPONÍVEL · GRÁTIS AGORA</span><h2>O Alienista</h2><span className="author">Machado de Assis</span><p>Entre em Itaguaí, tome decisões, descubra as consequências e encontre o caminho do autor.</p></div>
            <a href="/leitura/o-alienista" className="button button-light">Começar a experiência <ArrowRight size={18}/></a>
          </article>
          <article className="book-card upcoming"><div><span className="tag">PRÓXIMA OBRA</span><h2>Dom Casmurro</h2><p>Memória, dúvida e interpretação: o leitor diante de uma narrativa que nunca entrega tudo.</p></div><span className="button button-outline"><LockKeyhole size={17}/>Em preparação</span></article>
          <article className="book-card upcoming"><div><span className="tag">NO HORIZONTE</span><h2>Memórias Póstumas</h2><p>Uma entrada irreverente em Machado, nas escolhas do narrador e nas contradições humanas.</p></div><span className="button button-outline"><LockKeyhole size={17}/>Receber teaser</span></article>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

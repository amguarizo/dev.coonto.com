import { ArrowRight, BookOpen, Download, LockKeyhole } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SuggestionForm } from "@/components/suggestion-form";
import { formatBRL, getCommercialSettings } from "@/lib/commercial";

const nextWorks = [
  "Memórias de Martha", "Vida e morte de M. J. Gonzaga de Sá", "Lésbia",
  "O Cortiço", "Úrsula", "Triste fim de Policarpo Quaresma", "Quincas Borba",
  "O Ateneu", "Nebulosas", "Conselhos à minha filha", "Opúsculo Humanitário", "Broquéis",
];

export const dynamic = "force-dynamic";
export default async function Catalogo() {
  const prices = await getCommercialSettings();
  const singlePrice = formatBRL(prices.single_price_cents);
  const clubPrice = formatBRL(prices.club_price_cents);
  return (
    <main className="page">
      <SiteHeader />
      <div className="content">
        <section className="catalog-hero">
          <div><span className="section-kicker">CATÁLOGO COONTO</span><h1>Grandes obras.<br/>Novas portas.</h1></div>
          <p>Estas são as três obras previstas para o catálogo inicial. Publicaremos cada experiência quando estiver concluída e revisada; o lançamento do Coonto Club como produto depende das três prontas.</p>
        </section>
        <section className="catalog-grid" aria-label="Três obras do catálogo inicial">
          <article className="book-card featured">
            <span className="book-number">01</span>
            <div><span className="tag">DISPONÍVEL · GRÁTIS AGORA</span><h2>O Alienista</h2><span className="author">Machado de Assis</span><p>Entre em Itaguaí, tome decisões, descubra as consequências e encontre o caminho do autor.</p></div>
            <a href="/leitura/o-alienista" className="button button-light">Acessar gratuitamente <ArrowRight size={18}/></a>
          </article>
          <article className="book-card upcoming"><div><span className="tag">EM PREPARAÇÃO</span><h2>Dom Casmurro</h2><span>Machado de Assis</span><p>Memória, dúvida e interpretação: uma narrativa que nunca entrega tudo.</p></div><span className="button button-outline"><LockKeyhole size={17}/>Ainda indisponível</span></article>
          <article className="book-card upcoming"><div><span className="tag">EM PREPARAÇÃO</span><h2>Memórias Póstumas de Brás Cubas</h2><span>Machado de Assis</span><p>Uma entrada irreverente nas escolhas do narrador e nas contradições humanas.</p></div><span className="button button-outline"><LockKeyhole size={17}/>Ainda indisponível</span></article>
        </section>
        <section className="catalog-offer" aria-labelledby="catalog-offer-title">
          <span className="section-kicker">VALORES DE REFERÊNCIA · FASE DE VALIDAÇÃO</span>
          <h2 id="catalog-offer-title">Conheça o valor. Experimente gratuitamente.</h2>
          <p>Os valores abaixo indicam o preço planejado para a fase comercial. Hoje não há cobrança nem assinatura ativa.</p>
          <div className="offer-grid">
            <article className="price-card"><h3>Obra individual</h3><p>Acesso a uma experiência Coonto disponível.</p><span className="old-price" aria-label={`Preço de referência, riscado: ${singlePrice}`}>{singlePrice}</span><span className="free-price">GRÁTIS</span><span className="limited">Na fase de validação</span><a className="button button-primary" href="/leitura/o-alienista"><BookOpen size={18}/>Acessar gratuitamente</a><p className="access-note"><Download size={15}/> Depois de entrar, você pode salvar <em>O Alienista</em> no aparelho para leitura offline autorizada. Não é um arquivo público para baixar.</p></article>
            <article className="price-card club"><h3>Coonto Club</h3><p>Catálogo e novas edições mensais, após o lançamento com três obras prontas.</p><span className="old-price" aria-label={`Preço de referência, riscado: ${clubPrice} por mês`}>{clubPrice}/mês</span><span className="free-price">GRÁTIS</span><span className="limited">Experimente a obra disponível agora</span><a className="button button-coral" href="/leitura/o-alienista">Explorar sem pagar</a><p className="access-note">O Club ainda não aceita assinaturas. Não haverá cobrança automática por este acesso gratuito.</p></article>
          </div>
        </section>
        <section className="catalog-pipeline" aria-labelledby="pipeline-title"><span className="section-kicker">PRÓXIMAS CANDIDATAS</span><h2 id="pipeline-title">A lista continua.</h2><p>A ordem abaixo está em estudo. A seleção final depende de curadoria, direitos e produção; a frequência mensal começa com o Club lançado.</p><ol>{nextWorks.map(work=><li key={work}>{work}</li>)}</ol></section>
        <section className="suggestion-section" id="sugerir-obra"><div><span className="section-kicker">SUA VOZ NO CATÁLOGO</span><h2>Qual obra você quer viver no Coonto?</h2><p>Sugira uma obra e conte por que ela importa para você. A sugestão entra na avaliação editorial, sem garantir produção ou data.</p></div><SuggestionForm/></section>
      </div>
      <SiteFooter />
    </main>
  );
}

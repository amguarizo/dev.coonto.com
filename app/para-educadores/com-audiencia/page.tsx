import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CatalogArt } from "@/components/catalog-art";

export default function ComAudiencia() {
  return <main className="page"><SiteHeader/><div className="content educator-detail">
    <header className="educator-detail-hero"><div><span className="section-kicker">CRIADORES · CURADORES · COMUNIDADES</span><h1>Uma parceria começa com conteúdo que seu público queira viver.</h1>
      <p>Experimente a obra, proponha uma leitura, uma conversa ou uma série para sua comunidade. A partir da resposta real do público, podemos desenhar uma colaboração duradoura.</p><a className="button button-primary" href="/parceiros?tipo=influenciador#contato">Propor uma colaboração</a></div><CatalogArt index={5} className="educator-detail-image"/></header>
    <section className="educator-detail-steps"><article><h2>Crie com a obra</h2><p>Uma cena pode abrir um vídeo, uma aula aberta ou um clube de leitura. O texto original e os guias ajudam a manter a conversa fiel à obra.</p></article><article><h2>Aprenda com a audiência</h2><p>Indicações, encontros e feedback podem mostrar quais temas e formatos fazem sentido antes de lançar novas obras.</p></article><article><h2>Combine o modelo</h2><p>Quando houver produtos comerciais, podemos negociar indicação rastreada e remuneração recorrente, com regras, métricas e duração definidas em acordo. Não há comissão ativa hoje.</p></article></section>
    <section className="educator-detail-next"><h2>Comece por uma proposta concreta</h2><p>Conte quem você alcança, qual formato imagina e como podemos medir a resposta do público.</p><a href="/parceiros?tipo=influenciador#contato">Descrever a proposta →</a><a href="/obra/o-alienista">Experimentar O Alienista →</a></section>
  </div><SiteFooter/></main>;
}

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CatalogArt } from "@/components/catalog-art";

export default function NaEscola() {
  return <main className="page"><SiteHeader/><div className="content educator-detail">
    <header className="educator-detail-hero"><div><span className="section-kicker">PARA ESCOLAS · PILOTO</span><h1>Leve uma hipótese pedagógica concreta à coordenação.</h1>
      <p>A escola pode começar com O Alienista, disponível gratuitamente, e observar como os estudantes justificam uma leitura antes e depois de voltar ao texto.</p><a className="button button-primary" href="/parceiros?tipo=escola#contato">Conversar sobre um piloto escolar</a></div><CatalogArt index={6} className="educator-detail-image"/></header>
    <section className="educator-detail-steps"><article><h2>Apresente o método</h2><p>Compartilhe os três guias para explicar o uso antes, durante e depois da leitura. Escolha uma turma e um objetivo interpretativo.</p></article><article><h2>Defina a observação</h2><p>Combine uma resposta inicial, uma evidência textual e uma resposta final. Observe a qualidade das justificativas, não apenas cliques ou conclusão.</p></article><article><h2>Desenhe o piloto</h2><p>Alinhe duração, acesso, apoio aos docentes e critérios de avaliação. Adaptação institucional e valores dependem de uma proposta específica.</p></article></section>
    <section className="educator-detail-next"><h2>Material para levar à reunião</h2><p>Comece pelo guia metodológico e pela experiência gratuita. Ainda não há resultado de aprendizagem medido que possamos prometer à escola.</p><a href="/guias/Coonto_Para_Educadores_01_Como_Funciona.pdf">Baixar guia metodológico →</a><a href="/catalogo">Conhecer a obra gratuita →</a></section>
  </div><SiteFooter/></main>;
}

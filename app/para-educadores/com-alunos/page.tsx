import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CatalogArt } from "@/components/catalog-art";

export default function ComAlunos() {
  return <main className="page"><SiteHeader/><div className="content educator-detail">
    <header className="educator-detail-hero"><div><span className="section-kicker">PARA O PROFESSOR · USO EM AULA</span><h1>Uma cena. Uma escolha. Uma conversa melhor sobre o livro.</h1>
      <p>Use O Alienista gratuitamente com a turma. Você decide onde começar, apresenta uma pergunta e volta ao texto original para conferir as interpretações.</p><a className="button button-primary" href="/professor">Abrir o espaço do professor</a></div><CatalogArt index={10} className="educator-detail-image"/></header>
    <section className="educator-detail-steps"><article><h2>1. Escolha a pausa</h2><p>Abra um ponto sugerido ou marque sua própria cena. Os pontos com revelações são sinalizados para você planejar o momento da aula.</p></article><article><h2>2. Faça o exercício</h2><p>Na prévia, responda às escolhas, teste explicações e use o roteiro da Revolta dos Canjicas: observar, interpretar, provar, conectar e lembrar.</p></article><article><h2>3. Confira com Machado</h2><p>Depois da escolha, abra o capítulo original. Peça que os alunos defendam ou revisem a interpretação com uma passagem da obra.</p></article></section>
    <section className="educator-detail-next"><h2>Uma aula possível em 45 minutos</h2><p>O guia 03 traz tempos, perguntas e uma ficha de observação. Também há um roteiro navegável para preparar a atividade.</p><a href="/guias/Coonto_Para_Educadores_03_Uso_em_Aula.pdf">Baixar guia 03 (PDF) →</a><a href="/para-educadores/roteiro-de-aula">Ler roteiro na página →</a></section>
  </div><SiteFooter/></main>;
}

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function RoteiroDeAula() {
  return <main className="page"><SiteHeader/><article className="content guide-page">
    <header className="page-hero"><span className="section-kicker">GUIA 03 · COONTO PARA EDUCADORES</span><h1>Roteiro de aula: O Alienista</h1>
      <p>Uma proposta de 50 minutos para ler, discutir e voltar ao texto de Machado de Assis. Ajuste os tempos ao repertório e às necessidades da turma.</p></header>
    <section><h2>Antes da aula</h2><p>Leia os capítulos I a V e escolha o ponto de entrada no <a href="/professor">espaço do professor</a>. Prepare um trecho da edição original para comparação. O texto integral está <a href="/texto/o-alienista">disponível por capítulos</a>.</p></section>
    <section><h2>1 · Levantar hipóteses (10 min)</h2><p>Apresente a Casa Verde sem antecipar a conclusão. Pergunte: quem decide o que é normal em Itaguaí? Peça que cada estudante registre uma hipótese e o motivo dela.</p></section>
    <section><h2>2 · Explorar uma cena (15 min)</h2><p>Abra a cena “Da ilha ao continente” ou o checkpoint “Da Casa Verde à vida da cidade”. Deixe que os estudantes escolham uma resposta individualmente. Compare razões diferentes antes de mostrar o comentário da experiência.</p></section>
    <section><h2>3 · Voltar à obra (15 min)</h2><p>Leia o capítulo IV ou V no texto original. Em duplas, peça que encontrem uma passagem capaz de sustentar, questionar ou tornar mais complexa a interpretação escolhida na cena.</p></section>
    <section><h2>4 · Fechar e registrar (10 min)</h2><p>Retome a hipótese inicial. Cada estudante escreve o que mudou em sua leitura, citando um detalhe do texto. Convide a turma a distinguir as palavras de Machado das interpretações oferecidas pelo Coonto.</p></section>
    <section className="guide-observation"><h2>Ficha de observação para o professor</h2><p>Durante a conversa, registre exemplos concretos. Esta ficha é um apoio de planejamento, não uma avaliação automática.</p>
      <ul><li>O estudante formula uma hipótese e a explica?</li><li>Localiza uma passagem ou um detalhe da obra como evidência?</li><li>Consegue revisar a própria interpretação após ouvir outra leitura?</li><li>Distingue o texto original da cena interpretativa?</li></ul>
      <p>Ao final, anote uma pergunta que permaneceu aberta e escolha uma cena para a próxima aula.</p></section>
    <p><a href="/para-educadores">Voltar aos guias</a></p>
  </article><SiteFooter/></main>;
}

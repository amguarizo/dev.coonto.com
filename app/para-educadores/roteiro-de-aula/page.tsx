import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function RoteiroDeAula() {
  return <main className="page"><SiteHeader/><article className="content guide-page">
    <header className="page-hero"><span className="section-kicker">GUIA 03 · COONTO PARA EDUCADORES</span><h1>Roteiro de aula: O Alienista</h1>
      <p>Uma proposta de 45 minutos para ler, discutir e voltar ao texto de Machado de Assis. Ajuste os tempos ao repertório e às necessidades da turma. <a href="/guias/Coonto_Para_Educadores_03_Uso_em_Aula.pdf">Baixe o guia 03 completo em PDF</a>.</p></header>
    <section><h2>Antes da aula</h2><p>Leia os capítulos I a V e escolha o ponto de entrada no <a href="/professor">espaço do professor</a>. Prepare um trecho da edição original para comparação. O texto integral está <a href="/texto/o-alienista">disponível por capítulos</a>.</p></section>
    <section><h2>1 · Objetivo e leitura (15 min)</h2><p>Apresente a pergunta “Como a autoridade de Bacamarte é contestada?” e leia um trecho do capítulo VI. Peça que cada estudante registre uma hipótese sem antecipar a conclusão.</p></section>
    <section><h2>2 · Explorar e justificar (8 min)</h2><p>No <a href="/professor">exercício guiado da Revolta dos Canjicas</a>, abra uma cena e peça que a turma escolha e justifique uma resposta antes de conferir o comentário da experiência.</p></section>
    <section><h2>3 · Voltar à obra (12 min)</h2><p>Em duplas, localizem no texto original uma evidência favorável e outra que complique a interpretação escolhida. Compare as leituras em discussão.</p></section>
    <section><h2>4 · Discussão e ficha de saída (10 min)</h2><p>Peça duas frases: “Minha interpretação é...” e “A passagem que a sustenta ou desafia é...”. Registre uma dúvida para a aula seguinte.</p></section>
    <section className="guide-observation"><h2>Ficha de observação para o professor</h2><p>Durante a conversa, registre exemplos concretos. Esta ficha é um apoio de planejamento, não uma avaliação automática.</p>
      <ul><li>O estudante formula uma hipótese e a explica?</li><li>Localiza uma passagem ou um detalhe da obra como evidência?</li><li>Consegue revisar a própria interpretação após ouvir outra leitura?</li><li>Distingue o texto original da cena interpretativa?</li></ul>
      <p>Ao final, anote uma pergunta que permaneceu aberta e escolha uma cena para a próxima aula.</p></section>
    <p><a href="/para-educadores">Voltar aos guias</a></p>
  </article><SiteFooter/></main>;
}

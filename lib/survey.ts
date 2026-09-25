export const surveyChoices = {
  role: ["Professor(a) ou educador(a)", "Aluno(a) ou vestibulando(a)", "Coordenador(a) ou gestor(a) escolar", "Curador(a), criador(a) de conteúdo ou parceiro(a)", "Leitor(a)", "Outra"],
  understood: ["Sim, claramente", "Entendi em parte", "Não entendi"],
  difficulty: ["Fácil", "Médio: precisei reler ou explorar o site", "Difícil"],
  helpful: ["A explicação inicial da página", "O exemplo de O Alienista", "A experiência dentro da obra", "A página voltada ao meu perfil", "Nada disso foi suficiente", "Outro"],
  adoption: ["Sim", "Talvez, depois de testar com uma turma", "Talvez, se houvesse apoio ou material para o professor", "Não", "Não sei"],
  timing: ["Antes da leitura do livro", "Durante a leitura", "Depois da leitura", "Para revisão antes de uma prova", "Não vejo uma aplicação clara"],
  trust: ["Fidelidade à obra original", "Atividades e orientações para professores", "Referências a trechos do livro", "Acompanhamento do progresso dos alunos", "Resultados de testes com turmas", "Facilidade de uso no celular", "Outro"],
  payer: ["O aluno ou sua família", "A escola ou instituição", "A rede de ensino", "Escola e aluno, em um modelo compartilhado", "Não deveria haver cobrança", "Não sei"],
  obstacle: ["Não entender bem como funciona", "Tempo necessário para aplicar", "Preço", "Acesso dos alunos a celular ou internet", "Dúvidas sobre o valor pedagógico", "Outro"],
  followup: ["Sim", "Talvez", "Não"],
} as const;

export const surveyLabels: Record<string, string> = {
  role: "1. Relação com educação e leitura", understood: "2. Entendimento do Coonto", explanation: "2. Como explica o Coonto", difficulty: "3. Facilidade de entendimento", doubt: "3. Principal dúvida", helpful: "4. O que ajudou a entender", problem: "5. Problema que o Coonto resolve", adoption: "6. Adoção por professores", adoption_reason: "6. Motivo da resposta", timing: "7. Momento de uso", timing_reason: "7. Por quê", trust: "8. Condições para confiar no uso", payer: "9. Quem deveria pagar", payer_reason: "9. Por quê", obstacle: "10. Maior obstáculo", clarity_improvement: "11. Melhoria da explicação", priority: "12. Prioridade", followup: "13. Participação em teste", contact: "13. Contato opcional",
};

export type SurveyAnswers = Record<keyof typeof surveyChoices, string | string[]> & {
  explanation: string; doubt: string; problem: string; adoption_reason: string; timing_reason: string;
  payer_reason: string; clarity_improvement: string; priority: string; contact: string;
};

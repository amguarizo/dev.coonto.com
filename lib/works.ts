export const ALIENISTA = {
  slug: "o-alienista",
  title: "O Alienista",
  vertical: "literatura",
  language: "pt-BR",
  territory: "BR",
  version: "1.3.0",
  source: "Machado de Assis, Papéis avulsos (1882)",
  rights: "Texto de Machado de Assis em domínio público no Brasil",
} as const;

// IDs são estáveis e não dependem da posição das cenas na experiência.
export const ALIENISTA_SCENES = [
  { id: "s0", label: "Abertura", chapter: "Introdução", phase: "Antes da leitura", spoiler: false },
  { id: "s2", label: "Quem é Simão Bacamarte?", chapter: "I", phase: "O experimento", spoiler: false },
  { id: "s7", label: "O que mudou até aqui?", chapter: "I–III", phase: "O experimento", spoiler: true },
  { id: "s9", label: "Da ilha ao continente", chapter: "IV", phase: "Quem é louco?", spoiler: true },
  { id: "s16", label: "Da Casa Verde à vida da cidade", chapter: "IV–V", phase: "Quem é louco?", spoiler: true },
  { id: "s19", label: "A Revolta dos Canjicas", chapter: "VI", phase: "A revolta", spoiler: true },
  { id: "s26", label: "O que a revolta revelou?", chapter: "VI–VIII", phase: "A revolta", spoiler: true },
  { id: "s33", label: "Pessoas mudam. Sistemas permanecem.", chapter: "IX–X", phase: "Ciência, política e poder", spoiler: true },
  { id: "s34", label: "A inversão", chapter: "XI–XIII", phase: "A inversão", spoiler: true },
] as const;

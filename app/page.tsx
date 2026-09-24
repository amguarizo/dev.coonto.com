"use client";

import { ArrowRight, Building2, GraduationCap, MessageCircle, Sparkles } from "lucide-react";

const audienceCards = [
  {
    href: "/para-educadores",
    eyebrow: "EU ENSINO, ORIENTO OU MULTIPLICO",
    title: "Quero ajudar alguém a compreender melhor.",
    text: "Sou professor, coordenador, dirigente escolar, curador, influenciador ou criador de conteúdo.",
    image: "/images/educadores.png",
    className: "audience-card educator",
    icon: GraduationCap,
  },
  {
    href: "/para-leitores",
    eyebrow: "EU QUERO COMPREENDER",
    title: "Quero entrar na obra — e sair entendendo.",
    text: "Sou aluno, vestibulando, leitor ou alguém que cansou de terminar uma obra sem realmente compreendê-la.",
    image: "/images/leitores.png",
    className: "audience-card learner",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <main className="home-shell">
      <header className="home-header">
        <img src="/images/coonto-logo.png" alt="Coonto" className="brand-logo" />
        <nav aria-label="Navegação principal">
          <a href="/catalogo">Catálogo</a>
          <a href="/parceiros">Seja parceiro</a>
          <a href="#feedback">Feedback</a>
          <a href="/login?return_to=%2Fminha-biblioteca">Entrar</a>
        </nav>
      </header>
      <section className="split-hero" aria-labelledby="main-question">
        <h1 id="main-question" className="sr-only">Como você quer entrar no Coonto?</h1>
        {audienceCards.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.href} href={item.href} className={item.className} aria-label={`${item.eyebrow}: ${item.title}`}>
              <img src={item.image} alt="" className="audience-image" />
              <span className="audience-overlay" />
              <span className="audience-copy">
                <span className="audience-eyebrow"><Icon size={18} />{item.eyebrow}</span>
                <strong>{item.title}</strong>
                <span className="audience-description">{item.text}</span>
                <span className="audience-cta">Escolher este caminho <ArrowRight size={20} /></span>
              </span>
            </a>
          );
        })}
        <div className="hero-center-mark" aria-hidden="true">ou</div>
      </section>
      <section className="proof-strip">
        <a href="/obra/o-alienista" className="proof-link"><strong>Primeiro, viva a pergunta.</strong><span>Veja como a experiência funciona →</span></a>
        <a href="/obra/o-alienista" className="proof-link"><strong>O Alienista</strong><span>Conheça a primeira experiência →</span></a>
        <a href="/obra/o-alienista#oferta" className="proof-link"><strong>O Alienista sempre grátis</strong><span>Conheça a obra gratuita →</span></a>
      </section>
      <section className="home-next" id="feedback">
        <div>
          <span className="section-kicker">A PLATAFORMA COMEÇA ESCUTANDO</span>
          <h2>O que você disser agora ajuda a decidir o que o Coonto será amanhã.</h2>
        </div>
        <div className="home-next-actions">
          <a href="/obra/o-alienista#feedback" className="button button-coral"><MessageCircle size={19} />Dar feedback</a>
          <a href="/parceiros" className="button button-outline"><Building2 size={19} />Construir conosco</a>
        </div>
      </section>
    </main>
  );
}

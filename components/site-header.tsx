import { getCurrentUser, loginPath, logoutPath } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header className="site-header">
      <a href="/" aria-label="Voltar para o início"><img src="/images/coonto-logo.png" alt="Coonto" className="brand-logo" /></a>
      <nav aria-label="Navegação">
        <a href="/catalogo">Catálogo</a>
        <a className="survey-nav-link" href="/pesquisa">Pesquisa</a>
        <a href="/parceiros">Parceiros</a>
        <a href="/para-educadores">Educadores</a>
        {user ? <><a className="member-nav" href="/minha-biblioteca">Minha biblioteca</a><a className="account-link" href={logoutPath("/")}>Sair</a></> : <a className="button button-coral" href={loginPath("/minha-biblioteca")}>Entrar</a>}
      </nav>
    </header>
  );
}

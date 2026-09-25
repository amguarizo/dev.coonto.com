import { Building2, GraduationCap, Megaphone } from "lucide-react";
import { PartnerForm } from "@/components/partner-form";
import { CatalogArt } from "@/components/catalog-art";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FormJump } from "@/components/form-jump";

const roles=["educador","escola","influenciador","curador"];
export default async function Parceiros({searchParams}:{searchParams:Promise<{tipo?:string}>}) {
  const params=await searchParams;
  const role=roles.includes(params.tipo||"")?params.tipo:"";
  return <main className="page"><SiteHeader/><FormJump target="contato"/><div className="content">
    <section className="partners-intro partners-feature"><div><span className="section-kicker">CONSTRUIR COM O COONTO</span><h1>Uma boa parceria melhora a experiência de quem aprende.</h1><p>Viva a obra para compreendê-la. Professores, escolas e criadores podem participar de maneiras diferentes. Escolha a contribuição que faz sentido para você.</p></div><CatalogArt index={13} className="partners-visual"/></section>
    <section className="partner-types"><article className="partner-type"><GraduationCap/><h2>Professores e curadores</h2><p>Testam cenas, conferem fidelidade à obra e ajudam a construir atividades que peçam evidências reais. Começamos com o espaço de preparação docente e uma conversa sobre o que funcionou em aula.</p><a href="/para-educadores/com-alunos">Ver uso em aula →</a></article>
      <article className="partner-type"><Building2/><h2>Escolas e coordenações</h2><p>Podem organizar um piloto com objetivo, turma e observações acordados. A adaptação institucional, o suporte e os valores serão definidos em proposta própria.</p><a href="/para-educadores/na-escola">Entender o piloto →</a></article>
      <article className="partner-type"><Megaphone/><h2>Criadores e comunidades</h2><p>Podem desenvolver encontros, vídeos e séries de leitura. Futuramente, indicações com acompanhamento e remuneração recorrente podem ser negociadas por contrato, sem promessa de comissão hoje.</p><a href="/para-educadores/com-audiencia">Ver colaboração →</a></article></section>
    <section className="partner-opportunity"><h2>Como uma colaboração pode evoluir</h2><p>Primeiro experimentamos juntos, depois medimos o interesse e acertamos responsabilidades. Quando o Coonto Club estiver ativo, modelos comerciais como indicação recorrente poderão ser discutidos com regras claras de atribuição, duração e pagamento. Cada proposta terá seu próprio acordo.</p></section>
    <section className="partners-form-wrap" id="contato"><div><span className="section-kicker">CONVERSA INICIAL</span><h2>Conte que público você aproxima e o que podemos criar.</h2><p>Descreva uma ideia concreta. Responderemos com próximos passos adequados ao tipo de parceria, sem exigir compromisso comercial neste contato.</p></div><PartnerForm initialRole={role}/></section>
  </div><SiteFooter/></main>;
}

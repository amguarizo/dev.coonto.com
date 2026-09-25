import "./styles.css";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { addMember, assignLicense, createClassroom, createOrganization, enrollStudent, revokeLicense, setSeats, updateLead } from "./actions";

export const dynamic = "force-dynamic";

type Organization = { id: string; name: string; kind: string; seats: number | null; used: string };
type Member = { organization_id: string; user_id: string; role: string; name: string; email: string; licensed: boolean };
type Classroom = { id: string; organization_id: string; name: string; student_count: string };
type Lead = { id: string; name: string; email: string; role: string; organization: string | null; message: string; status: string; created_at: Date };
type Student = { id: string; name: string; email: string; last_seen_at: Date; progress: string; school_count: string };

export default async function CRM({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const user = await requireUser("/backoffice/crm");
  if (user.role !== "admin") return <main className="page"><SiteHeader/><div className="content page-hero"><h1>Área restrita</h1></div></main>;
  const [organizations, memberships, classrooms, leads, students] = await Promise.all([
    query<Organization>(`SELECT o.id,o.name,o.kind,p.seats,
      (SELECT COUNT(*)::text FROM license_assignments a WHERE a.organization_id=o.id AND a.work_slug='o-alienista' AND a.status='active') AS used
      FROM organizations o LEFT JOIN license_pools p ON p.organization_id=o.id AND p.work_slug='o-alienista' ORDER BY o.name`),
    query<Member>(`SELECT m.organization_id,m.user_id,m.role,u.name,u.email,
      EXISTS(SELECT 1 FROM license_assignments a WHERE a.organization_id=m.organization_id AND a.user_id=m.user_id AND a.work_slug='o-alienista' AND a.status='active') AS licensed
      FROM organization_memberships m JOIN users u ON u.id=m.user_id ORDER BY u.name`),
    query<Classroom>(`SELECT c.id,c.organization_id,c.name,COUNT(e.user_id)::text AS student_count
      FROM classrooms c LEFT JOIN classroom_enrollments e ON e.classroom_id=c.id GROUP BY c.id ORDER BY c.name`),
    query<Lead>("SELECT id,name,email,role,organization,message,status,created_at FROM partner_leads ORDER BY created_at DESC LIMIT 100"),
    query<Student>(`SELECT u.id,u.name,u.email,u.last_seen_at,
      (SELECT COUNT(*)::text FROM learning_progress p WHERE p.user_id=u.id) AS progress,
      (SELECT COUNT(*)::text FROM organization_memberships m WHERE m.user_id=u.id AND m.role='student') AS school_count
      FROM users u ORDER BY u.last_seen_at DESC LIMIT 100`),
  ]);
  const saved = (await searchParams).salvo === "1";
  return <main className="backoffice"><SiteHeader/><div className="content crm-page">
    <a href="/backoffice" className="survey-back">← Voltar ao backoffice</a>
    <section className="backoffice-hero"><span className="section-kicker">BACKOFFICE · CRM E LICENÇAS</span><h1>Relacionamentos, escolas e alunos</h1><p>Organizações separadas, turmas e vagas por obra. Contas de alunos são vinculadas pelo e-mail já cadastrado no Coonto.</p>{saved && <p role="status">Alteração salva.</p>}</section>
    <nav className="crm-jump" aria-label="Áreas do CRM"><a href="#relacionamentos">Relacionamentos</a><a href="#alunos">Alunos</a><a href="#organizacoes">Escolas e turmas</a></nav>
    <section id="relacionamentos" className="dashboard-card"><h2>Professores, curadores e parceiros</h2><p>Entradas recentes dos formulários de parceria; atualize a etapa de acompanhamento.</p>
      {leads.rows.length ? <div className="status-list">{leads.rows.map(lead => <article className="status-item" key={lead.id}><div><strong>{lead.name}</strong> · {lead.role}{lead.organization && <> · {lead.organization}</>}<p><a href={`mailto:${lead.email}`}>{lead.email}</a> · {new Date(lead.created_at).toLocaleDateString("pt-BR")}</p><p>{lead.message}</p></div><form action={updateLead}><input type="hidden" name="id" value={lead.id}/><label className="field">Etapa<select name="status" defaultValue={lead.status}><option value="new">Novo</option><option value="contacted">Contatado</option><option value="qualified">Qualificado</option><option value="closed">Encerrado</option></select></label><button className="button button-primary">Salvar</button></form></article>)}</div> : <p>Nenhum contato recebido.</p>}</section>
    <section id="alunos" className="dashboard-card"><h2>Alunos e contas</h2><p>Até 100 contas com atividade recente. O mesmo aluno pode participar de mais de uma organização, mantendo uma única identidade e progresso.</p>
      <div className="crm-table-wrap"><table className="crm-table"><thead><tr><th>Nome</th><th>E-mail</th><th>Experiências</th><th>Escolas</th><th>Última atividade</th></tr></thead><tbody>{students.rows.map(student => <tr key={student.id}><td>{student.name}</td><td>{student.email}</td><td>{student.progress}</td><td>{student.school_count}</td><td>{new Date(student.last_seen_at).toLocaleDateString("pt-BR")}</td></tr>)}</tbody></table></div></section>
    <section id="organizacoes" className="dashboard-card"><h2>Escolas e organizações</h2><form action={createOrganization} className="crm-inline-form"><label className="field">Nome<input name="name" required maxLength={200}/></label><label className="field">Tipo<select name="kind"><option value="school">Escola</option><option value="course">Cursinho</option><option value="partner">Parceiro</option></select></label><button className="button button-primary">Criar organização</button></form></section>
    {organizations.rows.map(org => {
      const members = memberships.rows.filter(m => m.organization_id === org.id);
      const classes = classrooms.rows.filter(c => c.organization_id === org.id);
      const studentsInOrg = members.filter(m => m.role === "student");
      return <section className="dashboard-card" key={org.id}><h2>{org.name}</h2><p>{org.kind} · {members.length} pessoa(s) · O Alienista: {org.used}/{org.seats ?? 0} vaga(s) em uso</p>
        <div className="crm-form-grid"><form action={addMember} className="form-card"><h3>Vincular pessoa</h3><input type="hidden" name="organization_id" value={org.id}/><label className="field">E-mail da conta<input name="email" type="email" required/></label><label className="field">Função<select name="role"><option value="student">Aluno</option><option value="teacher">Professor</option><option value="manager">Gestor</option></select></label><button className="button button-primary">Vincular</button></form>
          <form action={createClassroom} className="form-card"><h3>Nova turma</h3><input type="hidden" name="organization_id" value={org.id}/><label className="field">Nome da turma<input name="name" required/></label><button className="button button-primary">Criar turma</button></form>
          <form action={setSeats} className="form-card"><h3>Licenças de O Alienista</h3><input type="hidden" name="organization_id" value={org.id}/><label className="field">Vagas contratadas ou de piloto<input name="seats" type="number" min={org.used} max="100000" defaultValue={org.seats ?? 0} required/></label><button className="button button-primary">Salvar vagas</button></form></div>
        <h3>Pessoas vinculadas</h3>{members.length ? <div className="status-list">{members.map(member => <div className="status-item" key={member.user_id}><div><strong>{member.name}</strong> · {member.role}<br/><small>{member.email}</small></div>{member.role === "student" && <form action={member.licensed ? revokeLicense : assignLicense}><input type="hidden" name="organization_id" value={org.id}/><input type="hidden" name="user_id" value={member.user_id}/><button className="button button-primary">{member.licensed ? "Revogar licença" : "Atribuir licença"}</button></form>}</div>)}</div> : <p>Nenhuma pessoa vinculada.</p>}
        <h3>Turmas</h3>{classes.length ? classes.map(classroom => <div className="status-item" key={classroom.id}><div><strong>{classroom.name}</strong> · {classroom.student_count} aluno(s)</div><form action={enrollStudent} className="crm-inline-form"><input type="hidden" name="organization_id" value={org.id}/><input type="hidden" name="classroom_id" value={classroom.id}/><label className="field">Adicionar aluno<select name="user_id" required defaultValue=""><option value="" disabled>Selecione</option>{studentsInOrg.map(student => <option key={student.user_id} value={student.user_id}>{student.name} · {student.email}</option>)}</select></label><button className="button button-primary" disabled={!studentsInOrg.length}>Adicionar</button></form></div>) : <p>Nenhuma turma criada.</p>}
      </section>;
    })}
  </div></main>;
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { transaction } from "@/lib/transaction";
import { ALIENISTA_SLUG } from "@/lib/member";

async function admin() {
  const user = await requireUser("/backoffice/crm");
  if (user.role !== "admin") throw new Error("Acesso negado");
}
function field(form: FormData, key: string, limit = 200) {
  return String(form.get(key) || "").trim().slice(0, limit);
}
function done() { revalidatePath("/backoffice/crm"); redirect("/backoffice/crm?salvo=1"); }

export async function updateLead(form: FormData) {
  await admin();
  const id = field(form, "id"), status = field(form, "status");
  if (!id || !["new", "contacted", "qualified", "closed"].includes(status)) throw new Error("Dados inválidos");
  await query("UPDATE partner_leads SET status=$1 WHERE id=$2", [status, id]);
  done();
}

export async function createOrganization(form: FormData) {
  await admin();
  const name = field(form, "name"), kind = field(form, "kind");
  if (!name || !["school", "course", "partner"].includes(kind)) throw new Error("Organização inválida");
  await query("INSERT INTO organizations(id,name,kind) VALUES($1,$2,$3)", [crypto.randomUUID(), name, kind]);
  done();
}

export async function addMember(form: FormData) {
  await admin();
  const organizationId = field(form, "organization_id"), email = field(form, "email", 320).toLowerCase(), role = field(form, "role");
  if (!organizationId || !email || !["manager", "teacher", "student"].includes(role)) throw new Error("Vínculo inválido");
  const found = await query<{ id: string }>("SELECT id FROM users WHERE email=$1", [email]);
  if (!found.rows[0]) throw new Error("Conta não encontrada. A pessoa precisa entrar no Coonto primeiro.");
  await transaction(async client => {
    const current = await client.query("SELECT 1 FROM organization_memberships WHERE organization_id=$1 AND user_id=$2 FOR UPDATE", [organizationId, found.rows[0].id]);
    if (current.rowCount && role !== "student") {
      const active = await client.query("SELECT 1 FROM license_assignments WHERE organization_id=$1 AND user_id=$2 AND status='active' LIMIT 1", [organizationId, found.rows[0].id]);
      if (active.rowCount) throw new Error("Revogue as licenças antes de alterar a função do aluno");
    }
    await client.query(`INSERT INTO organization_memberships(organization_id,user_id,role) VALUES($1,$2,$3)
      ON CONFLICT (organization_id,user_id) DO UPDATE SET role=EXCLUDED.role`, [organizationId, found.rows[0].id, role]);
  });
  done();
}

export async function createClassroom(form: FormData) {
  await admin();
  const organizationId = field(form, "organization_id"), name = field(form, "name");
  if (!organizationId || !name) throw new Error("Turma inválida");
  await query("INSERT INTO classrooms(id,organization_id,name) VALUES($1,$2,$3)", [crypto.randomUUID(), organizationId, name]);
  done();
}

export async function enrollStudent(form: FormData) {
  await admin();
  const organizationId = field(form, "organization_id"), classroomId = field(form, "classroom_id"), userId = field(form, "user_id");
  const member = await query("SELECT 1 FROM organization_memberships WHERE organization_id=$1 AND user_id=$2 AND role='student'", [organizationId, userId]);
  if (!member.rowCount) throw new Error("Aluno não pertence a esta organização");
  await query(`INSERT INTO classroom_enrollments(organization_id,classroom_id,user_id) VALUES($1,$2,$3)
    ON CONFLICT (classroom_id,user_id) DO NOTHING`, [organizationId, classroomId, userId]);
  done();
}

export async function setSeats(form: FormData) {
  await admin();
  const organizationId = field(form, "organization_id"), seats = Number(field(form, "seats"));
  if (!organizationId || !Number.isInteger(seats) || seats < 0 || seats > 100000) throw new Error("Quantidade inválida");
  await transaction(async client => {
    await client.query(`INSERT INTO license_pools(organization_id,work_slug,seats) VALUES($1,$2,0)
      ON CONFLICT (organization_id,work_slug) DO NOTHING`, [organizationId, ALIENISTA_SLUG]);
    await client.query("SELECT 1 FROM license_pools WHERE organization_id=$1 AND work_slug=$2 FOR UPDATE", [organizationId, ALIENISTA_SLUG]);
    const used = await client.query<{ total: string }>("SELECT COUNT(*)::text AS total FROM license_assignments WHERE organization_id=$1 AND work_slug=$2 AND status='active'", [organizationId, ALIENISTA_SLUG]);
    if (seats < Number(used.rows[0].total)) throw new Error("Há mais licenças ativas do que o novo limite");
    await client.query("UPDATE license_pools SET seats=$1 WHERE organization_id=$2 AND work_slug=$3", [seats, organizationId, ALIENISTA_SLUG]);
  });
  done();
}

export async function assignLicense(form: FormData) {
  await admin();
  const organizationId = field(form, "organization_id"), userId = field(form, "user_id");
  if (!organizationId || !userId) throw new Error("Licença inválida");
  await transaction(async client => {
    const pool = await client.query<{ seats: number }>("SELECT seats FROM license_pools WHERE organization_id=$1 AND work_slug=$2 FOR UPDATE", [organizationId, ALIENISTA_SLUG]);
    if (!pool.rows[0]) throw new Error("Defina as vagas da organização primeiro");
    const member = await client.query("SELECT 1 FROM organization_memberships WHERE organization_id=$1 AND user_id=$2 AND role='student' FOR UPDATE", [organizationId, userId]);
    if (!member.rowCount) throw new Error("Aluno não pertence a esta organização");
    const existing = await client.query<{ status: string }>("SELECT status FROM license_assignments WHERE organization_id=$1 AND user_id=$2 AND work_slug=$3", [organizationId, userId, ALIENISTA_SLUG]);
    if (existing.rows[0]?.status === "active") return;
    const used = await client.query<{ total: string }>("SELECT COUNT(*)::text AS total FROM license_assignments WHERE organization_id=$1 AND work_slug=$2 AND status='active'", [organizationId, ALIENISTA_SLUG]);
    if (Number(used.rows[0].total) >= pool.rows[0].seats) throw new Error("Todas as vagas estão ocupadas");
    await client.query(`INSERT INTO license_assignments(id,organization_id,user_id,work_slug) VALUES($1,$2,$3,$4)
      ON CONFLICT (organization_id,user_id,work_slug) DO UPDATE SET status='active',updated_at=NOW()`, [crypto.randomUUID(), organizationId, userId, ALIENISTA_SLUG]);
    await client.query(`INSERT INTO entitlements(id,user_id,work_slug,source,status) VALUES($1,$2,$3,$4,'active')
      ON CONFLICT (user_id,work_slug) DO UPDATE SET source=EXCLUDED.source,status='active',expires_at=NULL
      WHERE entitlements.status <> 'active'`, [crypto.randomUUID(), userId, ALIENISTA_SLUG, `school:${organizationId}`]);
  });
  done();
}

export async function revokeLicense(form: FormData) {
  await admin();
  const organizationId = field(form, "organization_id"), userId = field(form, "user_id");
  if (!organizationId || !userId) throw new Error("Licença inválida");
  await transaction(async client => {
    await client.query("SELECT 1 FROM license_pools WHERE organization_id=$1 AND work_slug=$2 FOR UPDATE", [organizationId, ALIENISTA_SLUG]);
    await client.query("UPDATE license_assignments SET status='revoked',updated_at=NOW() WHERE organization_id=$1 AND user_id=$2 AND work_slug=$3", [organizationId, userId, ALIENISTA_SLUG]);
    const alternate = await client.query<{ organization_id: string }>("SELECT organization_id FROM license_assignments WHERE user_id=$1 AND work_slug=$2 AND status='active' ORDER BY created_at LIMIT 1", [userId, ALIENISTA_SLUG]);
    await client.query("UPDATE entitlements SET status=$1,source=$2 WHERE user_id=$3 AND work_slug=$4 AND source=$5", [alternate.rows[0] ? "active" : "revoked", alternate.rows[0] ? `school:${alternate.rows[0].organization_id}` : `school:${organizationId}`, userId, ALIENISTA_SLUG, `school:${organizationId}`]);
  });
  done();
}

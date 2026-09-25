"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { requireCrmHost } from "@/lib/admin-host";
import { query } from "@/lib/db";

export async function saveCommercialSettings(form: FormData) {
  await requireCrmHost();
  const user = await requireUser("/backoffice");
  if (user.role !== "admin") throw new Error("Acesso negado");
  const single = Number(form.get("single_price"));
  const club = Number(form.get("club_price"));
  if (!Number.isFinite(single) || !Number.isFinite(club) || single < 0 || club < 0 || single > 10000 || club > 10000) throw new Error("Preço inválido");
  const centsSingle = Math.round(single * 100);
  const centsClub = Math.round(club * 100);
  await query("UPDATE commercial_settings SET single_price_cents=$1,club_price_cents=$2,updated_at=NOW() WHERE id=1", [centsSingle,centsClub]);
  revalidatePath("/catalogo");
  revalidatePath("/obra/o-alienista");
  redirect("/backoffice?prices=saved");
}

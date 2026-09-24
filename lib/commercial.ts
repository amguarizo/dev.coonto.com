import { query } from "@/lib/db";

export async function getCommercialSettings() {
  const result = await query<{ single_price_cents: number; club_price_cents: number }>("SELECT single_price_cents,club_price_cents FROM commercial_settings WHERE id=1");
  return result.rows[0] ?? { single_price_cents: 990, club_price_cents: 1990 };
}

export function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

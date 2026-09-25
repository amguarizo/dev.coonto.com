import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const crmDomain = () => process.env.CRM_DOMAIN || "crm.dev.coonto.com";

export async function isCrmHost() {
  const host = (await headers()).get("host")?.split(":")[0]?.toLowerCase();
  return host === crmDomain().toLowerCase();
}

export async function requireCrmHost() {
  if (!await isCrmHost()) notFound();
}

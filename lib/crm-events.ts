import { query } from "@/lib/db";

type EventInput = {
  type: string;
  userId?: string | null;
  organizationId?: string | null;
  relatedType?: string;
  relatedId?: string;
  channel?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

// Telemetria não deve impedir login, compra gratuita ou leitura.
export async function recordCrmEvent(event: EventInput) {
  try {
    await query(`WITH inserted AS (
      INSERT INTO crm_events(id,event_type,user_id,organization_id,related_type,related_id,channel,metadata)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb) RETURNING id
    ) INSERT INTO crm_event_organizations(event_id,organization_id)
      SELECT inserted.id,m.organization_id FROM inserted JOIN organization_memberships m ON m.user_id=$3 WHERE true
      ON CONFLICT DO NOTHING`, [crypto.randomUUID(), event.type, event.userId || null,
      event.organizationId || null, event.relatedType || null, event.relatedId || null,
      event.channel || null, JSON.stringify(event.metadata || {})]);
  } catch (error) {
    console.error("crm_event_failed", { type: event.type, error });
  }
}

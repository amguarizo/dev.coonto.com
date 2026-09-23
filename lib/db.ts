import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL não configurada.");
  pool ??= new Pool({ connectionString, max: Number(process.env.DB_POOL_SIZE || 10), idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000 });
  return pool;
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  return getPool().query<T>(text, values);
}

export async function databaseHealth() {
  const result = await query<{ ok: number }>("SELECT 1 AS ok");
  return result.rows[0]?.ok === 1;
}

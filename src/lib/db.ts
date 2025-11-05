import { Pool } from 'pg';

let pool: Pool;

// Esta função cria uma instância única do pool de conexões (singleton).
export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error("A variável de ambiente POSTGRES_URL não está definida.");
    }

    pool = new Pool({
      connectionString,
    });
  }
  return pool;
}
import { getDbPool } from './db';

export async function initializeDatabase() {
  console.log('Verificando e inicializando o esquema do banco de dados...');
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Usamos CREATE TABLE IF NOT EXISTS para evitar erros em execuções subsequentes.
    await client.query(`
      CREATE TABLE IF NOT EXISTS analyses (
        id UUID PRIMARY KEY,
        comments TEXT NOT NULL,
        prompt TEXT NOT NULL,
        "generatedIdeas" TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY,
        "analysisId" UUID,
        title VARCHAR(255) NOT NULL,
        "lowTicket" JSONB NOT NULL,
        "orderBumps" JSONB NOT NULL,
        "ebookContent" TEXT,
        "salesPageCopy" TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('Esquema do banco de dados verificado com sucesso.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao inicializar o esquema do banco de dados:', error);
    // Não relançamos o erro para não quebrar a aplicação se o DB já estiver criado
    // mas com algum problema de permissão momentâneo. O log é suficiente.
  } finally {
    client.release();
  }
}
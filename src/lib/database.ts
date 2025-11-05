import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';

// Definindo a estrutura de um Projeto
interface Project {
  id: string;
  analysisId: string;
  title: string;
  type: 'ebook' | 'desafio' | 'guia';
  opportunityScore: number;
  suggestedPrice: number;
  targetAudience: string;
  demand: 'alta' | 'média' | 'baixa';
  duration?: 7 | 14 | 21 | 30;
  tone: 'profissional' | 'casual' | 'motivacional';
  outline: object[];
  content: string;
  salesPageCopy: string;
  createdAt: string;
}

// Definindo a estrutura de uma Análise
interface Analysis {
  id: string;
  comments: string;
  prompt: string;
  createdAt: string;
  // Futuramente, podemos armazenar as 10 ideias geradas aqui
}

// Definindo a estrutura de um Prompt
interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}


// Estendendo o esquema do banco de dados
interface DbSchema {
  examples: { id: number; name: string; createdAt: string }[];
  analyses: Analysis[];
  projects: Project[];
  prompts: Prompt[];
}

const DB_FILE_NAME = 'db.json';
const DB_DIR_PATH = process.env.DATABASE_DIR || './data';
const DB_FULL_PATH = path.resolve(process.cwd(), DB_DIR_PATH, DB_FILE_NAME);

let dbInstance: Low<DbSchema> | null = null;

export async function getDb(): Promise<Low<DbSchema>> {
  if (dbInstance) {
    if (dbInstance.data) {
      return dbInstance;
    }
    await dbInstance.read();
    return dbInstance;
  }

  try {
    const dir = path.dirname(DB_FULL_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const adapter = new JSONFile<DbSchema>(DB_FULL_PATH);
    // Inicializando com as novas coleções vazias
    dbInstance = new Low<DbSchema>(adapter, { examples: [], analyses: [], projects: [], prompts: [] });

    await dbInstance.read();

    console.log(`Database initialized/loaded from: ${DB_FULL_PATH}`);

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize Lowdb database:', error);
    throw error;
  }
}
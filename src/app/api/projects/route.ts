import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { randomUUID } from 'crypto';

// GET - Listar todos os projetos
export async function GET() {
  try {
    const pool = getDbPool();
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY "createdAt" DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Falha ao buscar projetos:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST - Criar um novo projeto
export async function POST(request: Request) {
  try {
    const { funnelTitle, lowTicket, orderBumps, analysisId } = await request.json();

    if (!funnelTitle || !lowTicket || !orderBumps) {
      return NextResponse.json({ message: 'Dados do funil incompletos.' }, { status: 400 });
    }

    const newProject = {
      id: randomUUID(),
      analysisId,
      title: funnelTitle,
      lowTicket,
      orderBumps,
      createdAt: new Date(),
    };

    const pool = getDbPool();
    // Os objetos lowTicket e orderBumps precisam ser convertidos para string JSON para serem inseridos nas colunas JSONB
    await pool.query(
      'INSERT INTO projects (id, "analysisId", title, "lowTicket", "orderBumps", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)',
      [newProject.id, newProject.analysisId, newProject.title, JSON.stringify(newProject.lowTicket), JSON.stringify(newProject.orderBumps), newProject.createdAt]
    );

    return NextResponse.json({ message: 'Projeto criado com sucesso', project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Falha ao criar projeto:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
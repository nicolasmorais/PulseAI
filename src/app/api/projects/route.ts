import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
import { randomUUID } from 'crypto';

// GET - Listar todos os projetos
export async function GET() {
  try {
    const db = await getDb();
    const projects = db.data.projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Falha ao buscar projetos:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST - Criar um novo projeto
export async function POST(request: Request) {
  try {
    const db = await getDb();
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
      createdAt: new Date().toISOString(),
    };

    db.data.projects.push(newProject);
    await db.write();

    return NextResponse.json({ message: 'Projeto criado com sucesso', project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Falha ao criar projeto:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
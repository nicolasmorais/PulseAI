import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const pool = getDbPool();
    const { rows } = await pool.query('SELECT * FROM prompts ORDER BY "createdAt" DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Falha ao buscar prompts:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Título e conteúdo são obrigatórios.' }, { status: 400 });
    }

    const newPrompt = {
      id: randomUUID(),
      title,
      content,
      createdAt: new Date(),
    };

    const pool = getDbPool();
    await pool.query(
      'INSERT INTO prompts (id, title, content, "createdAt") VALUES ($1, $2, $3, $4)',
      [newPrompt.id, newPrompt.title, newPrompt.content, newPrompt.createdAt]
    );

    return NextResponse.json({ message: 'Prompt salvo com sucesso', prompt: newPrompt }, { status: 201 });
  } catch (error) {
    console.error('Falha ao salvar prompt:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
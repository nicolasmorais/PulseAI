import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const db = await getDb();
    const prompts = db.data.prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Falha ao buscar prompts:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Título e conteúdo são obrigatórios.' }, { status: 400 });
    }

    const newPrompt = {
      id: randomUUID(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    db.data.prompts.push(newPrompt);
    await db.write();

    return NextResponse.json({ message: 'Prompt salvo com sucesso', prompt: newPrompt }, { status: 201 });
  } catch (error) {
    console.error('Falha ao salvar prompt:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
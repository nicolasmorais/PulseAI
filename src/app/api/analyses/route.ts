import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const { comments, prompt, videoTranscript, videoUrl } = await request.json();

    if (!comments || comments.length < 100) {
      return NextResponse.json({ message: 'Comentários são obrigatórios e devem ter no mínimo 100 caracteres.' }, { status: 400 });
    }

    const newAnalysis = {
      id: randomUUID(),
      comments,
      prompt: prompt || '',
      videoTranscript: videoTranscript || '',
      videoUrl: videoUrl || '',
      createdAt: new Date().toISOString(),
    };

    db.data.analyses.push(newAnalysis);
    await db.write();

    return NextResponse.json({ message: 'Análise criada com sucesso', id: newAnalysis.id }, { status: 201 });
  } catch (error) {
    console.error('Falha ao criar análise:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
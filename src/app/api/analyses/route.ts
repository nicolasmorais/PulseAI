import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { comments, prompt } = await request.json();

    if (!comments || comments.length < 100) {
      return NextResponse.json({ message: 'Comentários são obrigatórios e devem ter no mínimo 100 caracteres.' }, { status: 400 });
    }
    if (!prompt) {
      return NextResponse.json({ message: 'O campo de prompt é obrigatório.' }, { status: 400 });
    }

    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const deepseekApiUrl = process.env.DEEPSEEK_API_URL;

    if (!deepseekApiKey || !deepseekApiUrl) {
      return NextResponse.json({ message: 'As variáveis de ambiente da API DeepSeek não estão configuradas.' }, { status: 500 });
    }

    const response = await fetch(`${deepseekApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: comments },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Erro da API DeepSeek:', errorBody);
      return NextResponse.json({ message: `Erro ao se comunicar com a API DeepSeek: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    const generatedIdeas = result.choices[0].message.content;

    const newAnalysis = {
      id: randomUUID(),
      comments,
      prompt,
      generatedIdeas,
      createdAt: new Date(),
    };

    const pool = getDbPool();
    await pool.query(
      'INSERT INTO analyses (id, comments, prompt, "generatedIdeas", "createdAt") VALUES ($1, $2, $3, $4, $5)',
      [newAnalysis.id, newAnalysis.comments, newAnalysis.prompt, newAnalysis.generatedIdeas, newAnalysis.createdAt]
    );

    return NextResponse.json({
      message: 'Ideias geradas com sucesso!',
      id: newAnalysis.id,
      ideas: generatedIdeas,
    }, { status: 201 });

  } catch (error) {
    console.error('Falha ao criar análise:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
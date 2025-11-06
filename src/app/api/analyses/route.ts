import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { randomUUID } from 'crypto';
import { initializeDatabase } from '@/lib/schema';

export async function POST(request: Request) {
  console.log("--- [API /api/analyses] Rota POST recebida ---");
  try {
    // Garante que o banco de dados e as tabelas estão prontos
    if (process.env.POSTGRES_URL) {
      await initializeDatabase();
    }

    const { comments, prompt } = await request.json();
    console.log("--- [API /api/analyses] Corpo da requisição analisado ---");

    if (!comments || comments.length < 100) {
      return NextResponse.json({ message: 'Comentários são obrigatórios e devem ter no mínimo 100 caracteres.' }, { status: 400 });
    }
    if (!prompt) {
      return NextResponse.json({ message: 'O campo de prompt é obrigatório.' }, { status: 400 });
    }

    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const deepseekApiUrl = process.env.DEEPSEEK_API_URL;

    if (!deepseekApiKey || !deepseekApiUrl) {
      console.error("--- [API /api/analyses] Variáveis de ambiente da API DeepSeek não configuradas. ---");
      return NextResponse.json({ message: 'As variáveis de ambiente da API DeepSeek não estão configuradas.' }, { status: 500 });
    }

    console.log("--- [API /api/analyses] Chamando a API DeepSeek... ---");
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

    console.log(`--- [API /api/analyses] Status da resposta da API DeepSeek: ${response.status} ---`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('--- [API /api/analyses] Erro da API DeepSeek:', errorBody);
      return NextResponse.json({ message: `Erro ao se comunicar com a API DeepSeek: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    console.log('--- [API /api/analyses] Resposta completa da API DeepSeek:', JSON.stringify(result, null, 2));

    const generatedIdeas = result.choices?.[0]?.message?.content || "";

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
    
    console.log("--- [API /api/analyses] Análise salva no banco de dados. Enviando resposta. ---");
    return NextResponse.json({
      message: 'Ideias geradas com sucesso!',
      id: newAnalysis.id,
      ideas: generatedIdeas,
    }, { status: 201 });

  } catch (error) {
    console.error('--- [API /api/analyses] Erro inesperado na rota:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
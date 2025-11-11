import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { randomUUID } from 'crypto';
import { initializeDatabase } from '@/lib/schema';

export async function POST(request: Request) {
  console.log("--- [API /api/analyses] Rota POST recebida ---");
  try {
    if (process.env.POSTGRES_URL) {
      await initializeDatabase();
    }

    const { comments, transcription, prompt } = await request.json();
    console.log("--- [API /api/analyses] Corpo da requisição analisado ---");

    if (!comments || comments.length < 100) {
      return NextResponse.json({ message: 'Comentários são obrigatórios e devem ter no mínimo 100 caracteres.' }, { status: 400 });
    }
    if (!prompt) {
      return NextResponse.json({ message: 'O campo de prompt é obrigatório.' }, { status: 400 });
    }

    const claudeApiKey = process.env.CLAUDE_API_KEY;
    const claudeApiUrl = process.env.CLAUDE_API_URL;

    if (!claudeApiKey || !claudeApiUrl) {
      console.error("--- [API /api/analyses] Variáveis de ambiente da API Claude não configuradas. ---");
      return NextResponse.json({ message: 'As variáveis de ambiente da API Claude não estão configuradas.' }, { status: 500 });
    }

    const combinedContent = `
      **Transcrição do Vídeo:**
      ${transcription || "Nenhuma transcrição fornecida."}

      ---

      **Comentários do Vídeo:**
      ${comments}
    `;

    console.log("--- [API /api/analyses] Chamando a API Claude... ---");
    const response = await fetch(`${claudeApiUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        system: prompt,
        messages: [
          { role: 'user', content: combinedContent },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    console.log(`--- [API /api/analyses] Status da resposta da API Claude: ${response.status} ---`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('--- [API /api/analyses] Erro da API Claude:', errorBody);
      return NextResponse.json({ message: `Erro ao se comunicar com a API Claude: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    const generatedIdeas = result.content?.[0]?.text || "";

    const newAnalysis = {
      id: randomUUID(),
      comments: combinedContent,
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
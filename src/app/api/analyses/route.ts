import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
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

    // 1. Chamar a API da DeepSeek
    const systemPrompt = `
      Você é um especialista em marketing digital e criação de produtos digitais.
      Sua tarefa é analisar uma lista de comentários de um vídeo do YouTube e um prompt do usuário para gerar 10 ideias de produtos digitais (como ebooks, desafios, guias, etc.).

      Para cada ideia, forneça:
      - **Nome do Produto:** Um título atraente.
      - **Tipo:** (Ebook, Desafio de 7 dias, Guia Prático, etc.).
      - **Público-Alvo:** Quem se beneficiaria mais com este produto.
      - **Dor Principal:** Qual problema específico o produto resolve.
      - **Preço Sugerido:** Um valor em BRL (ex: R$ 27, R$ 47, R$ 97).

      Formate a saída de forma clara e organizada, usando markdown.
    `;

    const userContent = `
      **Comentários do YouTube:**
      ---
      ${comments}
      ---

      **Prompt do Usuário:**
      ---
      ${prompt}
      ---
    `;

    const response = await fetch(`${deepseekApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        max_tokens: 2048,
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

    // 2. Salvar a análise e as ideias no banco de dados
    const db = await getDb();
    const newAnalysis = {
      id: randomUUID(),
      comments,
      prompt,
      generatedIdeas,
      createdAt: new Date().toISOString(),
    };

    db.data.analyses.push(newAnalysis);
    await db.write();

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
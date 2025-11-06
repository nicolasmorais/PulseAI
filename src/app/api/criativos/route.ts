import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { productInfo, prompt } = await request.json();

    if (!productInfo || productInfo.length < 50) {
      return NextResponse.json({ message: 'A descrição do produto é obrigatória e deve ter no mínimo 50 caracteres.' }, { status: 400 });
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
          { role: 'user', content: productInfo },
        ],
        max_tokens: 2048,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Erro da API DeepSeek:', errorBody);
      return NextResponse.json({ message: `Erro ao se comunicar com a API DeepSeek: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    const generatedCriativos = result.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      message: 'Criativos gerados com sucesso!',
      criativos: generatedCriativos,
    }, { status: 201 });

  } catch (error) {
    console.error('Erro inesperado na rota /api/criativos:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
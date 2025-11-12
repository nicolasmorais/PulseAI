import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

const CREATIVES_PROMPT = `Atue como um redator especialista em anúncios diretos para Facebook e Instagram Ads, no estilo de Jason Kutasi.
Você deve criar textos curtos, emocionais e com alto poder de curiosidade, sem promessas diretas ou chamadas agressivas de venda.
O produto é um tratamento que ajuda a reduzir a flacidez e rugas no pescoço, restaurando a firmeza da pele sem cirurgias.

Sua missão é gerar 3 blocos de texto:

🧩 BLOCO 1 — HOOKS (TÍTULOS PARA IMAGEM)

Crie 5 opções de hooks curtos (máx. 10 palavras), com emoção, curiosidade ou revelação, que possam ser colocados na imagem do criativo.
Os hooks devem seguir o estilo “Andromeda / Jason Kutasi”: frases que fazem o leitor parar de rolar e sentir algo.
Evite palavras como “produto”, “milagre”, “creme”, “tratamento”.

Exemplos de tom:

“O que mais envelhece não está no rosto…”

“Descobri por que o pescoço denuncia a idade 😳”

“Ninguém fala sobre isso — mas toda mulher nota um dia”

Gere 5 novas opções únicas e fortes.

🧩 BLOCO 2 — CTA LEVE (TEXTO INFERIOR DA IMAGEM)

Crie 5 variações sutis de CTA (máx. 10 palavras) que despertem curiosidade sem parecer um anúncio.
Deve ser algo que se colocaria em fonte branca e menor, no rodapé do criativo.

Exemplo base:
“Toque para ver o que causa isso 👇”

Gere 5 novas opções, mantendo o mesmo estilo.

🧩 BLOCO 3 — COPY PRINCIPAL (TEXTO DO ANÚNCIO)

Crie 1 copy principal de até 4 linhas, seguindo o modelo usado por Jason Kutasi nos anúncios de skincare:

Comece com uma observação emocional ou um fato que cria identificação;

Gere curiosidade sobre a causa do problema (sem falar de produto);

Finalize com uma promessa suave de descoberta.

Tom: empático, humano e curioso.
Exemplo de estilo:
“Você pode disfarçar as rugas com maquiagem…
mas o pescoço sempre entrega a idade.
Entenda o que realmente causa isso —
e como é possível reverter de forma natural.”

Gere 1 nova variação com o mesmo tom, mas 100% original.

Formato final esperado:

[HOOKS]
1. ...
2. ...
3. ...
4. ...
5. ...

[CTAs]
1. ...
2. ...
3. ...
4. ...
5. ...

[COPY PRINCIPAL]
...`;

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const pool = getDbPool();

    const projectResult = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (projectResult.rows.length === 0) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 });
    }
    const project = projectResult.rows[0];

    // Validação: Exige que a copy da página de vendas exista primeiro
    if (!project.salesPageCopy) {
      return NextResponse.json({ message: 'Gere a copy da página de vendas antes de criar os criativos.' }, { status: 400 });
    }

    const userInput = `
      A copy da página de vendas para o produto está abaixo. Use-a como base para entender o produto, a dor, o público e o tom, e então gere os criativos no estilo solicitado.

      --- COPY DA PÁGINA DE VENDAS ---
      ${project.salesPageCopy}
      ---
    `;

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
          { role: 'system', content: CREATIVES_PROMPT },
          { role: 'user', content: userInput },
        ],
        max_tokens: 4000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Erro da API DeepSeek:', errorBody);
      return NextResponse.json({ message: `Erro ao se comunicar com a API DeepSeek: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    const generatedCopy = result.choices?.[0]?.message?.content || "A IA não retornou uma copy para os criativos.";

    await pool.query(
      'UPDATE projects SET "creativesCopy" = $1 WHERE id = $2',
      [generatedCopy, id]
    );

    return NextResponse.json({ creativesCopy: generatedCopy });

  } catch (error) {
    console.error('Falha ao gerar a copy dos criativos:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
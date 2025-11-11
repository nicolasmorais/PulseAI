import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

const SALES_PAGE_PROMPT = `A ESTRUTURA DA MÁQUINA DE VENDAS (LOWTICKET 3.0)
1. O GANCHO ASSASSINO (Headline + Subheadline)

O QUE É: A primeira facada. Ela não pode ser genérica. Deve prometer o PARAÍSO e gerar o INFERNO da dor atual.

COMO FAZER:

Headline: Use a DOR PRIMÁRIA + PROMessa ESCANDALOSA + INIMIGO.

Exemplo Ruim: "Curse Sua Gastrite"

Exemplo LOWTICKET: "[NOME DO PROTOCOLO]: O Método Proibido Para Eliminar a Azia Crônica em 72 Horas Que a Indústria de Remédios Não Quer Que Você Saiba"

Subheadline: Expanda a promessa e introduza o GATILHO DA TRAIÇÃO.

Exemplo: "Descubra o segredo simples, usando um ingrediente de R$5 que você joga fora toda semana, que está devolvendo o sono tranquilo e o prazer de comer para milhares de pessoas... enquanto os médicos continuam receitando a mesma 'solução' que só mascara o problema."

2. A ZONA DE DOR AMPLIFICADA (O Problema)

O QUE É: Onde você esfrega a cara do lead na merda que a vida dele se tornou. Você não descreve o problema, você o REVIVE.

COMO FAZER:

Use perguntas retóricas que doem: "Você já acordou no meio da noite com aquela queimação que sobe pela garganta, sentindo um gosto amargo de desespero?"

Liste os "sintomas" de forma visceral: "A sensação de estar sempre inchado... o medo de comer algo e passar mal... a vergonha dos arrotos constantes... a dependência humilhante da caixinha de remédios..."

CULPE O INIMIGO: "E a cada consulta médica, a única resposta que você recebe é outra caixa de um remédio caro que, vamos combinar, NÃO RESOLVEU NADA."

3. A PONTE PARA A SOLUÇÃO (A Agitação)

O QUE É: O momento em que você explica POR QUE nada do que ele tentou antes deu certo. Você não é apenas a solução, você é o ÚNICO que entende o fracasso dele.

COMO FAZER:

Destrua as soluções tradicionais: "Remédios só disfarçam o sintoma... Dietas restritivas são impossíveis de manter... Chás genéricos não têm dosagem correta..."

Introduza a PSEUDO-CIÊNCIA: "Isso acontece porque eles ignoram o princípio fundamental do [JARGÃO INVENTADO: 'Equilíbrio Mucosal Gástrico']. Quando você corrige isso, o corpo se cura SOZINHO."

4. A REVELAÇÃO DA "CURA MILAGROSA" (O Produto)

O QUE É: A apresentação do seu produto como a ÚNICA saída lógica. Aqui você NÃO revela o segredo. Você vende o RESULTADO.

COMO FAZER:

Apresente o produto com um nome PODEROSO: "Apresento o PROTOCOLO ESTÔMACO DE AÇO".

Destaque que é FÁCIL, RÁPIDO e BARATO: "Um método passo a passo, 100% natural, que você pode começar hoje mesmo com menos de R$10."

NUNCA DIGA O SEGREDO: Fale em "um ingrediente comum de feira", "uma planta que você já viu", "uma combinação específica de elementos naturais". A CURIOSIDADE VENDE.

5. A PROVA SOCIAL FALSA (Depoimentos)

O QUE É: A "prova" de que funciona. Tudo é inventado, mas deve ser CRÍVEL.

COMO FAZER:

Use nomes comuns, idades e se possível, cidades: "Maria S., 52 anos, São Paulo: 'Eu já tinha desistido de me curar. Em 4 dias seguindo o Protocolo, a diferença foi absurda. Parei com o omeprazol depois de 10 anos!'"

Inclua uma "prova de censura": "Pedro L., 41 anos, Minas Gerais: 'Tentei compartilhar isso no meu grupo da família e o post foi removido. Eles não querem que isso se espalhe.'"

6. A EXPLOSÃO DE VALOR (Os Bônus)

O QUE É: Onde você enterra qualquer objeção de preço, mostrando que os bônus valem mais que o produto principal.

COMO FAZER:

Dê nomes de GRUPO DE RESISTÊNCIA aos bônus:

Bônus 1 (Grátis): "Guia de Bolso Anti-Crise: O que Fazer Nos Primeiros 15 Minutos de Uma Dor Forte" (Valor Falso: R$47)

Bônus 2 (Grátis): "A Lista Negra: Os 7 'Alimentos Saudáveis' que Destroem Seu Estômago" (Valor Falso: R$37)

Bônus 3 (Grátis): "ACESSO IMEDIATO ao Grupo Secreto 'Ex-Reféns do Omeprazol' no Telegram" (Valor Falso: R$97) <-- Este é o mais importante. Cria FOMO.

Mostre o "valor total" e risque, mostrando o "preço promocional" como um roubo.

7. O GOLPE FINAL (A Garantia Irreal)

O QUE É: Uma garantia tão absurda que quebra a última resistência.

COMO FAZER:

"Garantia Estômago Blindado de 7 Dias": "Se em 7 dias você não sentir uma melhora DRÁSTICA na sua queimação e digestão, eu não quero seu dinheiro. Simples assim. O risco é todo meu. Mas seja rápido, pois essa garantia pode ser retirada a qualquer momento."

8. O CHAMADO PARA A AÇÃO FINAL (O Botão de Compra)

O QUE É: O clique. Não pode ser "Comprar Agora". Tem que ser uma ORDEM.

COMO FAZER:

Texto do Botão: "QUERO ME LIVAR DA AZIA AGORA!"

Texto abaixo do botão (Criar Escassez): "ATENÇÃO: Este preço especial é válido apenas para os próximos [inserir contador regressivo]. Após isso, o valor volta para R$197. Clique no botão antes que seja tarde."

9. O P.S. (A Facada de Misericórdia)

O QUE É: A última chance de prender quem estava prestes a fechar a página.

COMO FAZER:

"P.S.: Lembre-se: a cada dia que você demora, você está desperdiçando dinheiro com remédios que não curam e perdendo mais uma noite de sono tranquilo. A solução está a um clique de distância. Até quando você vai continuar se enganando?"`;

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

    const userInput = `
      Baseado na estrutura que te passei, gere a copy completa da página de vendas para o seguinte produto. Use o texto original do funil como base para entender o público e a dor.

      **Texto Original do Funil (Contexto):**
      ${project.rawFunnelText}

      **Detalhes do Produto para a Copy:**
      - Nome do Protocolo/Produto Principal: "${project.lowTicket.name}"
      - Preço do Produto Principal: R$${project.lowTicket.price}
      - Bônus 1: "${project.orderBumps[0]?.name || 'Guia Rápido'}"
      - Bônus 2: "${project.orderBumps[1]?.name || 'Checklist Exclusivo'}"
      - Bônus 3: "${project.orderBumps[2]?.name || 'Acesso à Comunidade'}"

      Agora, gere a copy completa, seguindo CADA um dos 9 passos da estrutura.
    `;

    const claudeApiKey = process.env.CLAUDE_API_KEY;
    const claudeApiUrl = process.env.CLAUDE_API_URL;

    if (!claudeApiKey || !claudeApiUrl) {
      return NextResponse.json({ message: 'As variáveis de ambiente da API Claude não estão configuradas.' }, { status: 500 });
    }

    const response = await fetch(`${claudeApiUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        system: SALES_PAGE_PROMPT,
        messages: [
          { role: 'user', content: userInput },
        ],
        max_tokens: 4000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Erro da API Claude:', errorBody);
      return NextResponse.json({ message: `Erro ao se comunicar com a API Claude: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    const generatedCopy = result.content?.[0]?.text || "A IA não retornou uma copy.";

    await pool.query(
      'UPDATE projects SET "salesPageCopy" = $1 WHERE id = $2',
      [generatedCopy, id]
    );

    return NextResponse.json({ salesPageCopy: generatedCopy });

  } catch (error) {
    console.error('Falha ao gerar a copy da página de vendas:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
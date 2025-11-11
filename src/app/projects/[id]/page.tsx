"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Wand2, ChevronsUpDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

Apresente o produto com um nome PODEROSO: "Apresento o PROTOCOLO ESTÔMAGO DE AÇO".

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

interface OrderBump {
  name: string;
  price: string;
  type: string;
}

interface Project {
  id: string;
  title: string;
  lowTicket: {
    name: string;
    price: string;
    type: string;
  };
  orderBumps: OrderBump[];
  createdAt: string;
  rawFunnelText?: string;
  salesPageCopy?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Falha ao buscar os detalhes do projeto.");
        }
        const data = await response.json();
        setProject(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleGenerateCopy = async () => {
    if (!project) return;
    setIsGeneratingCopy(true);
    toast.info("Gerando copy com a IA... Isso pode levar um minuto.");
    try {
      const response = await fetch(`/api/projects/${id}/generate-copy`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao gerar a copy.");
      }
      const data = await response.json();
      setProject((prev) => (prev ? { ...prev, salesPageCopy: data.salesPageCopy } : null));
      toast.success("Copy da página de vendas gerada com sucesso!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Projeto não encontrado</h2>
        <p className="text-gray-500">O projeto que você está procurando não existe ou foi movido.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-gray-500">
          Criado em: {new Date(project.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura do Funil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{project.lowTicket.name}</h3>
                    <p className="text-xs text-gray-500">{project.lowTicket.type}</p>
                  </div>
                  <Badge>R$ {project.lowTicket.price}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Order Bumps (Bônus):</h4>
                {project.orderBumps.map((bump, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border-l-2 rounded-r-md">
                    <p className="text-xs">{bump.name}</p>
                    <Badge variant="secondary">Grátis</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={handleGenerateCopy}
                disabled={isGeneratingCopy || !!project.salesPageCopy}
              >
                {isGeneratingCopy ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" /> 
                  {project.salesPageCopy ? 'Copy Gerada' : 'Gerar Copy da Página de Vendas'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {project.salesPageCopy && (
            <Card>
              <CardHeader>
                <CardTitle>Copy da Página de Vendas</CardTitle>
                <CardDescription>Este é o texto gerado pela IA para sua página de vendas.</CardDescription>
                 <Collapsible className="pt-2">
                    <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center justify-start p-0 text-sm text-muted-foreground hover:text-foreground">
                        <ChevronsUpDown className="h-4 w-4 mr-2" />
                        Mostrar/Ocultar Prompt Usado
                    </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
                        {SALES_PAGE_PROMPT}
                    </div>
                    </CollapsibleContent>
                </Collapsible>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-4 rounded-md max-h-[600px] overflow-y-auto">
                  {project.salesPageCopy}
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Texto Original do Funil Gerado</CardTitle>
              <CardDescription>Este é o conteúdo completo gerado pela IA para este funil.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-4 rounded-md max-h-[600px] overflow-y-auto">
                {project.rawFunnelText}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
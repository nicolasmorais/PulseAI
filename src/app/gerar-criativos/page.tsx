"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Wand2, Clipboard } from "lucide-react";

const CRIATIVOS_PROMPT = `Você é um copywriter de resposta direta, especialista em criar anúncios de alta conversão para o Facebook e Instagram. Seu estilo é agressivo, direto e focado em gerar cliques e vendas imediatas. Você não tem medo de usar gatilhos mentais e quebrar padrões.

Sua tarefa é criar 5 variações de criativos (copy para anúncios) com base nas informações do produto/oferta fornecidas pelo usuário.

ESTRUTURA OBRIGATÓRIA PARA CADA CRIATIVO:

1.  **HEADLINE QUEBRA-PADRÃO:** Uma frase curta e chocante que pare o scroll. Use perguntas, afirmações polêmicas ou curiosidade extrema.
2.  **CONEXÃO E DOR:** Mostre que você entende o problema do público. Use a técnica do "inimigo em comum" (ex: a procrastinação, a indústria, os gurus).
3.  **APRESENTAÇÃO DA SOLUÇÃO:** Introduza o produto de forma misteriosa ou como uma "nova descoberta". Não entregue o ouro, crie desejo.
4.  **BENEFÍCIOS TANGÍVEIS:** Liste 2-3 benefícios claros e rápidos que o cliente terá. (Ex: "Em 3 dias, você vai...", "O segredo para... sem precisar...").
5.  **CTA (CHAMADA PARA AÇÃO) DIRETA:** Uma ordem clara e com urgência. (Ex: "Clique em 'Saiba Mais' e descubra o método", "Toque no link antes que saia do ar").

REGRAS DE OURO:

*   **SEMPRE** use quebras de linha para facilitar a leitura no celular.
*   **SEMPRE** use emojis estrategicamente para chamar atenção.
*   **NUNCA** use linguagem corporativa ou formal. Fale como uma pessoa real.
*   **FOCO TOTAL** na dor e na transformação. O produto é apenas o veículo.
*   **NUMERE** cada criativo claramente (CRIATIVO 1:, CRIATIVO 2:, etc.).

Agora, analise as informações a seguir e gere os 5 criativos.`;

export default function GerarCriativosPage() {
  const [productInfo, setProductInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [criativos, setCriativos] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productInfo.length < 50) {
      toast.error("Por favor, descreva seu produto com pelo menos 50 caracteres.");
      return;
    }
    
    setIsLoading(true);
    setCriativos([]);
    toast.info("Gerando criativos com a IA...");

    try {
      const response = await fetch('/api/criativos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productInfo, prompt: CRIATIVOS_PROMPT }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Falha ao gerar os criativos.');
      }
      
      if (result.criativos && typeof result.criativos === 'string' && result.criativos.trim().length > 0) {
        toast.success("Criativos gerados com sucesso!");
        
        const generatedText = result.criativos;
        const parsedCriativos = generatedText.split(/CRIATIVO \d+:/).filter(c => c.trim() !== '');
        
        setCriativos(parsedCriativos);

      } else {
        toast.warning("A IA retornou uma resposta vazia.");
        setCriativos(["A IA retornou uma resposta vazia. Por favor, tente novamente."]);
      }

    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao se comunicar com a IA.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Criativo copiado para a área de transferência!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gerador de Criativos</h1>
        <p className="text-gray-500">Descreva seu produto e a IA irá gerar copys para seus anúncios.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>Forneça detalhes sobre o produto, público-alvo e a oferta para gerar copys mais eficazes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product-info">Descrição do Produto/Oferta</Label>
              <Textarea id="product-info" placeholder="Ex: Ebook 'Foco Total' para criadores de conteúdo que ensina a eliminar distrações. Público: jovens de 20-30 anos. Oferta: R$27." className="min-h-[150px]" value={productInfo} onChange={(e) => setProductInfo(e.target.value)} required />
              <p className="text-sm text-gray-500">{productInfo.length} / 50 caracteres mínimos</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</> : <><Wand2 className="mr-2 h-4 w-4" /> Gerar Criativos</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {criativos.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">✨ Criativos Gerados</h2>
            <p className="text-gray-500">Copys prontas para você usar em seus anúncios.</p>
          </div>
          {criativos.map((criativo, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">Criativo {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-4 rounded-md">
                  {criativo.trim()}
                </div>
              </CardContent>
              <CardContent>
                <Button variant="outline" size="sm" onClick={() => handleCopy(criativo.trim())}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
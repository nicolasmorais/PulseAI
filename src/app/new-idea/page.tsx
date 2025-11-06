"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";

export default function NewIdeaPage() {
  const [comments, setComments] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comments.length < 100) {
      toast.error("Por favor, insira pelo menos 100 caracteres nos comentários.");
      return;
    }
    if (!prompt) {
      toast.error("O campo de prompt é obrigatório.");
      return;
    }
    setIsLoading(true);
    setGeneratedIdeas("");
    toast.info("Analisando dados e gerando ideias com a IA...");

    try {
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments, prompt }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Falha ao gerar as ideias.');
      }
      
      if (result.ideas && typeof result.ideas === 'string' && result.ideas.trim().length > 0) {
        toast.success("Ideias de produtos geradas com sucesso!");
        setGeneratedIdeas(result.ideas);
      } else {
        toast.warning("A IA retornou uma resposta vazia.");
        setGeneratedIdeas("A IA retornou uma resposta vazia. Por favor, tente novamente com um prompt diferente ou verifique o status da API.");
      }

    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao se comunicar com a IA.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Geração de Ideias</h1>
        <p className="text-gray-500">Cole os dados abaixo para a IA gerar ideias de produtos.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Entrada de Dados</CardTitle>
          <CardDescription>A IA usará os comentários e o seu prompt para gerar as ideias.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="comments">Comentários do YouTube (obrigatório)</Label>
              <Textarea id="comments" placeholder="Cole aqui os comentários..." className="min-h-[200px]" value={comments} onChange={(e) => setComments(e.target.value)} required />
              <p className="text-sm text-gray-500">{comments.length} / 100 caracteres mínimos</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt (obrigatório)</Label>
              <Textarea id="prompt" placeholder="Cole aqui o seu prompt detalhado..." className="min-h-[150px]" value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</> : <><Wand2 className="mr-2 h-4 w-4" /> Gerar Ideias de Produtos</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedIdeas && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>✨ Resposta da IA</CardTitle>
              <CardDescription>Abaixo está o texto completo gerado pela inteligência artificial.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                className="min-h-[300px] bg-gray-50 text-gray-800"
                value={generatedIdeas}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
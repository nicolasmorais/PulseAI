"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewIdeaPage() {
  const [comments, setComments] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string | null>(null);
  const router = useRouter();

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
    setGeneratedIdeas(null);
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
      
      toast.success("Ideias de produtos geradas com sucesso!");
      setGeneratedIdeas(result.ideas);
      setComments("");
      setPrompt("");

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
              <Textarea
                id="comments"
                placeholder="Cole aqui os comentários, um por linha..."
                className="min-h-[200px]"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">{comments.length} / 100 caracteres mínimos</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt (obrigatório)</Label>
              <Textarea
                id="prompt"
                placeholder="Direcione a IA com um prompt específico. Ex: 'Foque em dores sobre produtividade para iniciantes'."
                className="min-h-[100px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Gerar 10 Ideias de Produtos"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedIdeas && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>✨ Ideias Geradas pela IA</CardTitle>
            <CardDescription>Aqui estão as ideias de produtos com base nos dados fornecidos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: generatedIdeas.replace(/\n/g, '<br />') }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
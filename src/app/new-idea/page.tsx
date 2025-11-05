"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Wand2, ArrowRight } from "lucide-react";
import { parseGeneratedIdeas, ParsedFunnel } from "@/lib/utils";

export default function NewIdeaPage() {
  const [comments, setComments] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [parsedFunnels, setParsedFunnels] = useState<ParsedFunnel[]>([]);
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
    setParsedFunnels([]);
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
      setAnalysisId(result.id);
      const funnels = parseGeneratedIdeas(result.ideas);
      setParsedFunnels(funnels);

    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao se comunicar com a IA.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (funnel: ParsedFunnel) => {
    setIsCreatingProject(funnel.funnelTitle);
    toast.info(`Criando projeto para "${funnel.funnelTitle}"...`);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...funnel, analysisId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar o projeto.');
      }
      
      toast.success("Projeto criado com sucesso! Redirecionando...");
      router.push('/projects');

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCreatingProject(null);
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

      {parsedFunnels.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">✨ Ideias Geradas</h2>
          <div className="space-y-6">
            {parsedFunnels.map((funnel, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{funnel.funnelTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Low Ticket */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{funnel.lowTicket.name}</h3>
                        <p className="text-sm text-gray-500">{funnel.lowTicket.type}</p>
                      </div>
                      <Badge variant="secondary">R$ {funnel.lowTicket.price}</Badge>
                    </div>
                    <p className="text-sm mt-2 italic text-gray-600">"{funnel.lowTicket.copy}"</p>
                  </div>
                  {/* Order Bumps */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Order Bumps:</h4>
                    {funnel.orderBumps.map((bump, i) => (
                      <div key={i} className="flex justify-between items-center p-2 border-l-4 rounded-r-md bg-gray-50">
                        <div>
                          <p className="text-sm font-medium">{bump.name}</p>
                          <p className="text-xs text-gray-500">{bump.type}</p>
                        </div>
                        <Badge variant="outline">R$ {bump.price}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleCreateProject(funnel)} disabled={!!isCreatingProject}>
                    {isCreatingProject === funnel.funnelTitle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    {isCreatingProject === funnel.funnelTitle ? 'Criando Projeto...' : 'Gerar Projeto com este Funil'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
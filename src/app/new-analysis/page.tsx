"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewAnalysisPage() {
  const [comments, setComments] = useState("");
  const [videoTranscript, setVideoTranscript] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comments.length < 100) {
      toast.error("Por favor, insira pelo menos 100 caracteres nos comentários.");
      return;
    }
    setIsLoading(true);
    toast.info("Enviando análise para processamento...");

    try {
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments, videoTranscript, videoUrl }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar a análise.');
      }
      
      const result = await response.json();
      toast.success("Análise criada! Gerando ideias de produtos...");
      
      // Futuramente, redirecionar para a página de ideias:
      // router.push(`/analysis/${result.id}/ideas`);
      console.log("Análise criada com ID:", result.id);
      // Por enquanto, apenas limpamos o formulário
      setComments("");
      setVideoTranscript("");
      setVideoUrl("");

    } catch (error) {
      toast.error("Ocorreu um erro ao enviar a análise.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nova Análise de Comentários</h1>
        <p className="text-gray-500">Cole os dados abaixo para gerar ideias de produtos.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Entrada de Dados</CardTitle>
          <CardDescription>Quanto mais dados você fornecer, melhores serão as ideias geradas.</CardDescription>
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
              <Label htmlFor="transcript">Transcrição do Vídeo (opcional)</Label>
              <Textarea
                id="transcript"
                placeholder="Cole a transcrição do vídeo para mais contexto..."
                className="min-h-[100px]"
                value={videoTranscript}
                onChange={(e) => setVideoTranscript(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL do Vídeo (opcional)</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
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
    </div>
  );
}
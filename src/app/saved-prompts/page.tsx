"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Clipboard } from "lucide-react";

interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function SavedPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts');
      if (!response.ok) throw new Error("Falha ao buscar prompts.");
      const data = await response.json();
      setPrompts(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Por favor, preencha o título e o conteúdo do prompt.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar o prompt.');
      }
      
      toast.success("Prompt salvo com sucesso!");
      setTitle("");
      setContent("");
      fetchPrompts(); // Recarrega a lista de prompts
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copiado para a área de transferência!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Prompts Salvos</h1>
        <p className="text-gray-500">Gerencie e adicione novos prompts para reutilizar na geração de ideias.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Prompt</CardTitle>
              <CardDescription>Crie um novo prompt para usar futuramente.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Prompt para Ebooks de Produtividade"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo do Prompt</Label>
                  <Textarea
                    id="content"
                    placeholder="Cole ou escreva o conteúdo do seu prompt aqui..."
                    className="min-h-[150px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar Prompt
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-2xl font-semibold">Meus Prompts</h2>
          {isFetching ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : prompts.length > 0 ? (
            <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
              {prompts.map((prompt) => (
                <Card key={prompt.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{prompt.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(prompt.content)}>
                      <Clipboard className="mr-2 h-4 w-4" />
                      Copiar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum prompt salvo ainda. Adicione um no formulário ao lado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";

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
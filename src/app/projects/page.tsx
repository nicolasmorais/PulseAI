"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, FolderKanban, PlusCircle, ArrowRight } from "lucide-react";

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
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error("Falha ao buscar os projetos.");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meus Projetos</h1>
          <p className="text-gray-500">Aqui você verá a lista de todos os produtos criados.</p>
        </div>
        <Link href="/new-project" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Novo Projeto
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : projects.length > 0 ? (
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>
                  Criado em: {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.lowTicket.name}</h3>
                      <p className="text-sm text-gray-500">{project.lowTicket.type}</p>
                    </div>
                    <Badge>R$ {project.lowTicket.price}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Order Bumps:</h4>
                  {project.orderBumps.map((bump, i) => (
                    <div key={i} className="flex justify-between items-center p-2 border-l-2 rounded-r-md">
                      <p className="text-sm">{bump.name}</p>
                      <Badge variant="outline">R$ {bump.price}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/projects/${project.id}`} passHref className="w-full">
                  <Button className="w-full">
                    Abrir Projeto
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum projeto encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vá para a página "Geração de Ideias" para criar seu primeiro projeto.
          </p>
        </div>
      )}
    </div>
  );
}
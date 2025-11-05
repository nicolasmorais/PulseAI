import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusSquare, FolderKanban, History } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Bem-vindo ao ProductFlow. Comece por aqui.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusSquare className="h-6 w-6 text-primary" />
              <span>Geração de Ideias</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Use IA para gerar ideias de produtos a partir de comentários.</p>
            <Button asChild className="w-full">
              <Link href="/new-idea">Gerar Novas Ideias</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-6 w-6 text-primary" />
              <span>Projetos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Veja e gerencie todos os produtos que você já criou.</p>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/projects">Meus Projetos</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              <span>Histórico</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Revise todas as análises de comentários já realizadas.</p>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/history">Ver Histórico</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Estatísticas</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total de Produtos Criados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Produtos Esta Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Último Produto Criado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-600">Nenhum ainda</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
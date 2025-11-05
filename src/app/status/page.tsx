import { getDbPool } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Status {
  status: 'ok' | 'error';
  message: string;
}

async function checkDatabaseStatus(): Promise<Status> {
  try {
    if (!process.env.POSTGRES_URL) {
      return { status: 'error', message: 'A variável de ambiente POSTGRES_URL não está definida.' };
    }
    const pool = getDbPool();
    const client = await pool.connect();
    await client.query('SELECT NOW()'); // Simple query to check connection
    client.release();
    return { status: 'ok', message: 'Conexão com o banco de dados bem-sucedida.' };
  } catch (error: any) {
    console.error("Erro de status do banco de dados:", error);
    return { status: 'error', message: error.message || 'Não foi possível conectar ao banco de dados.' };
  }
}

async function checkAiApiStatus(): Promise<Status> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = process.env.DEEPSEEK_API_URL;

  if (apiKey && apiUrl) {
    return { status: 'ok', message: 'As variáveis de ambiente da API estão configuradas.' };
  } else {
    const missingVars = [];
    if (!apiKey) missingVars.push('DEEPSEEK_API_KEY');
    if (!apiUrl) missingVars.push('DEEPSEEK_API_URL');
    return { status: 'error', message: `Variáveis de ambiente ausentes: ${missingVars.join(', ')}.` };
  }
}

export default async function StatusPage() {
  const dbStatus = await checkDatabaseStatus();
  const apiStatus = await checkAiApiStatus();

  const StatusIndicator = ({ status }: { status: 'ok' | 'error' }) => {
    if (status === 'ok') {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="mr-2 h-4 w-4" /> Operacional</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="mr-2 h-4 w-4" /> Erro</Badge>;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Status do Sistema</h1>
        <p className="text-gray-500">Verifique a saúde dos serviços essenciais da aplicação.</p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Banco de Dados (PostgreSQL)</CardTitle>
              <StatusIndicator status={dbStatus.status} />
            </div>
            <CardDescription>Responsável por armazenar todos os dados da aplicação.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono p-2 bg-gray-100 rounded">{dbStatus.message}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>API de Inteligência Artificial (DeepSeek)</CardTitle>
              <StatusIndicator status={apiStatus.status} />
            </div>
            <CardDescription>Responsável pela geração de ideias e conteúdo.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono p-2 bg-gray-100 rounded">{apiStatus.message}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
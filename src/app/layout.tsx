import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { initializeDatabase } from "@/lib/schema";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PULSEAI - GERAÇÃO DE PRODUTOS COM IA",
  description: "Geração de Produtos com IA",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inicializa o banco de dados no lado do servidor se a URL estiver configurada
  if (process.env.POSTGRES_URL) {
    await initializeDatabase();
  }

  return (
    <html lang="pt-BR">
      <body className={spaceGrotesk.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
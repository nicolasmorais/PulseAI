"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusSquare, FolderKanban, History, Bookmark, Server, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/new-idea", label: "Geração de Ideias", icon: PlusSquare },
  { href: "/new-project", label: "Novo Projeto", icon: FolderPlus },
  { href: "/projects", label: "Meus Projetos", icon: FolderKanban },
  { href: "/history", label: "Histórico", icon: History },
  { href: "/saved-prompts", label: "Prompts Salvos", icon: Bookmark },
  { href: "/status", label: "Status do Sistema", icon: Server },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="h-16" />
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
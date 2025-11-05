"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PlusSquare, FolderKanban, History, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/new-idea", label: "Geração de Ideias", icon: PlusSquare },
  { href: "/projects", label: "Meus Projetos", icon: FolderKanban },
  { href: "/history", label: "Histórico", icon: History },
  { href: "/saved-prompts", label: "Prompts Salvos", icon: Bookmark },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6 flex flex-col items-center">
        <Image
          src="https://iv2jb3repd5xzuuy.public.blob.vercel-storage.com/c8093d73-3d60-4dfb-8203-5496220550ce-0PUV2p1YshrJhgdkbOAFqWtI1KzyKc.png"
          alt="PULSEAI Logo"
          width={128}
          height={128}
        />
      </div>
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
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PlusSquare, FolderKanban, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/new-idea", label: "Geração de Ideias", icon: PlusSquare },
  { href: "/projects", label: "Meus Projetos", icon: FolderKanban },
  { href: "/history", label: "Histórico", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-4 border-b border-sidebar-border flex flex-col items-center text-center">
        <Image
          src="https://iv2jb3repd5xzuuy.public.blob.vercel-storage.com/c8093d73-3d60-4dfb-8203-5496220550ce-0PUV2p1YshrJhgdkbOAFqWtI1KzyKc.png"
          alt="ProductFlow Logo"
          width={48}
          height={48}
          className="mb-3"
        />
        <h1 className="text-xl font-bold">ProductFlow</h1>
        <p className="text-sm text-sidebar-foreground/80">Internal Tool</p>
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
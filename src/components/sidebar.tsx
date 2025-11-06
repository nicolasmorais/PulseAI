"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PlusSquare, FolderKanban, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    title: "Principal",
    items: [
      { href: "/new-idea", label: "Geração de Ideias", icon: PlusSquare },
      { href: "/projects", label: "Meus Projetos", icon: FolderKanban },
    ],
  },
  {
    title: "Configurações",
    items: [
      { href: "/saved-prompts", label: "Prompts Salvos", icon: Bookmark },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://iv2jb3repd5xzuuy.public.blob.vercel-storage.com/c8093d73-3d60-4dfb-8203-5496220550ce-0PUV2p1YshrJhgdkbOAFqWtI1KzyKc.png"
            width={120}
            height={40}
            alt="PulseAI Logo"
          />
        </Link>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          {navSections.map((section) => (
            <li key={section.title}>
              <h2 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
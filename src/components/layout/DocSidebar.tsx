'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DocModuleItem } from '@/lib/types';
import {
  ChevronRight,
  ChevronDown,
  Server,
  Database,
  Layout,
  Shield,
  FileText,
  Layers,
  BookOpen,
} from 'lucide-react';

interface DocSidebarProps {
  modules: DocModuleItem[];
}

const ICON_MAP: Record<string, any> = {
  Server,
  Database,
  Layout,
  Shield,
  Layers,
  BookOpen,
};

export function DocSidebar({ modules }: DocSidebarProps) {
  const pathname = usePathname();
  // Keep active module expanded by default
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    modules.forEach((m) => {
      map[m.id] = true;
    });
    return map;
  });

  const toggleModule = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 py-6 pr-4 lg:border-r border-[#ececee] dark:border-[#27272a] overflow-y-auto max-h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        <div className="px-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Pohon Dokumentasi Sistem
          </span>
        </div>

        <nav className="space-y-4">
          {modules.map((mod) => {
            const Icon = Layers;
            const isExp = expanded[mod.id];

            return (
              <div key={mod.id} className="space-y-1">
                {/* Module Header Toggle */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-[12px] text-left text-xs font-bold text-[#09090b] dark:text-white hover:bg-white dark:hover:bg-[#18181b] transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{mod.title}</span>
                  </div>
                  {isExp ? (
                    <ChevronDown className="w-4 h-4 text-[#71717a]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#71717a]" />
                  )}
                </button>

                {/* Sub-Articles List */}
                {isExp && mod.articles && mod.articles.length > 0 && (
                  <div className="ml-4 pl-3 border-l-2 border-[#ececee] dark:border-[#27272a] space-y-1 pt-1">
                    {mod.articles.map((art: any) => {
                      const isActive = pathname === `/${art.slug}` || pathname === `/docs/${art.slug}`;
                      return (
                        <Link
                          key={art.id}
                          href={`/${art.slug}`}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-xs transition-all ${
                            isActive
                              ? 'bg-[#09090b] text-white font-bold'
                              : 'text-[#52525b] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-white hover:bg-white dark:hover:bg-[#18181b]'
                          }`}
                        >
                          <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--accent)]/70'}`} />
                          <span className="truncate">{art.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

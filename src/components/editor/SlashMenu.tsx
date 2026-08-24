'use client';

import React, { useEffect, useState } from 'react';
import {
  Heading2,
  Heading3,
  Workflow,
  Layers,
  AlertTriangle,
  Link2,
  Table as TableIcon,
  Quote,
  Sparkles,
  GitFork,
  Network,
  MoveHorizontal,
  ChevronDownSquare,
  Lightbulb,
  CheckCircle2,
  FileCode,
  Globe,
  FileImage,
} from 'lucide-react';

export interface SlashCommandItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  template: string;
  category: 'Diagram' | 'Kode' | 'Format' | 'Konteks';
}

const COMMANDS: SlashCommandItem[] = [
  {
    id: 'mermaid-seq',
    title: 'Mermaid Sequence Diagram',
    description: 'Alur request-response antar service / microservice',
    icon: Workflow,
    category: 'Diagram',
    template: '```mermaid\nsequenceDiagram\n    autonumber\n    actor Client as Klien Web\n    participant API as API Gateway\n    participant DB as PostgreSQL (ACID)\n\n    Client->>API: POST /api/transactions (Idempotency-Key)\n    API->>DB: INSERT INTO ledger ON CONFLICT DO NOTHING\n    DB-->>API: 201 Created (Processed)\n    API-->>Client: 200 OK Status Terkonfirmasi\n```\n',
  },
  {
    id: 'mermaid-flow',
    title: 'Mermaid Flowchart Arsitektur',
    description: 'Topologi sistem, load balancer & routing data',
    icon: GitFork,
    category: 'Diagram',
    template: '```mermaid\nflowchart TD\n    A[Klien Web & Mobile] -->|HTTPS / TLS 1.3| B(Edge Reverse Proxy)\n    B --> C{Circuit Breaker}\n    C -->|Healthy| D[Layanan Utama]\n    C -->|Fallback| E[Cache KV Stale-While-Revalidate]\n    D --> F[(PostgreSQL Master)]\n    D --> G[(Read Replica Pool)]\n```\n',
  },
  {
    id: 'mermaid-graph-td',
    title: 'Graph TD Diagram',
    description: 'Diagram alur klasik atas-ke-bawah (graph TD)',
    icon: Network,
    category: 'Diagram',
    template: '```mermaid\ngraph TD\n    A[Mulai Request] --> B{Validasi Input}\n    B -->|Valid| C[Proses Bisnis]\n    B -->|Invalid| D[400 Bad Request]\n    C --> E[(Simpan ke Database)]\n    E --> F[Kirim Response 200 OK]\n```\n',
  },
  {
    id: 'mermaid-flow-lr',
    title: 'Flowchart LR Diagram',
    description: 'Alur pipeline kiri-ke-kanan (flowchart LR)',
    icon: MoveHorizontal,
    category: 'Diagram',
    template: '```mermaid\nflowchart LR\n    A[Klien] --> B[CDN Edge]\n    B --> C[Load Balancer]\n    C --> D[App Server 1]\n    C --> E[App Server 2]\n    D --> F[(Database Utama)]\n    E --> G[(Read Replica)]\n```\n',
  },
  {
    id: 'tabs',
    title: 'Multi-Tab Code Block',
    description: 'Blok kode multi-bahasa dengan tab interaktif',
    icon: Layers,
    category: 'Kode',
    template: '```tabs\n// tab: TypeScript\nexport async function verifySignature(req: Request): Promise<boolean> {\n  const signature = req.headers.get("x-signature");\n  return Boolean(signature && signature.length === 64);\n}\n// tab: SQL\nCREATE UNIQUE INDEX CONCURRENTLY idx_articles_slug ON "Article" ("slug");\n// tab: Go\nfunc HandleRequest(w http.ResponseWriter, r *http.Request) {\n    w.WriteHeader(http.StatusOK)\n}\n```\n',
  },
  {
    id: 'callout-note',
    title: 'Kotak Konteks (Note)',
    description: 'Penjelasan latar belakang atau konteks teknis',
    icon: AlertTriangle,
    category: 'Konteks',
    template: '> [!NOTE]\n> **Prinsip Dasar**: Pastikan setiap mutasi data krusial memiliki mekanisme idempotency key untuk mencegah double-processing pada jaringan yang tidak stabil.\n',
  },
  {
    id: 'callout-tip',
    title: 'Kotak Tips & Optimasi (Tip)',
    description: 'Rekomendasi kinerja tinggi dan best practice',
    icon: Lightbulb,
    category: 'Konteks',
    template: '> [!TIP]\n> Gunakan connection pooler Transaction Mode pada port 6543 untuk beban traffic tinggi tanpa membebani memori PostgreSQL server.\n',
  },
  {
    id: 'callout-important',
    title: 'Peringatan Kritis (Important)',
    description: 'Konsekuensi kegagalan sistem atau mitigasi risiko',
    icon: AlertTriangle,
    category: 'Konteks',
    template: '> [!IMPORTANT]\n> Jangan pernah mengeksekusi DDL migration (seperti alter table) secara langsung pada production saat jam sibuk tanpa zero-downtime strategy.\n',
  },
  {
    id: 'details-accordion',
    title: 'Lipatan Eksplorasi (Collapsible Deep-Dive)',
    description: 'Bagian detail teknis yang dapat dibuka-tutup',
    icon: ChevronDownSquare,
    category: 'Format',
    template: '<details>\n<summary><strong>🔍 Klik untuk melihat pembuktian matematis / benchmark latency</strong></summary>\n\nData hasil pengujian stress-testing dengan 50.000 virtual users menunjukkan p99 latency tetap stabil di bawah 45ms.\n\n</details>\n',
  },
  {
    id: 'wikilink',
    title: 'Wiki-Link Glosarium [[...]]',
    description: 'Tautan konsep internal dengan popup pratinjau instan',
    icon: Link2,
    category: 'Format',
    template: '[[idempotency-key]]',
  },
  {
    id: 'direct-link',
    title: 'Tautan Web Luar [Teks](URL)',
    description: 'Tautan langsung ke website, dokumentasi, atau sumber luar',
    icon: Globe,
    category: 'Format',
    template: '[Dokumentasi Resmi](https://example.com)',
  },
  {
    id: 'image',
    title: 'Sisipkan Gambar Konten ![...]',
    description: 'Ilustrasi arsitektur atau foto dengan keterangan di dalam naskah',
    icon: FileImage,
    category: 'Format',
    template: '![Diagram Arsitektur Sistem](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200)\n*Gambar 1: Alur topologi cluster database dan cache layer*\n',
  },
  {
    id: 'table',
    title: 'Tabel Komparasi Arsitektur',
    description: 'Tabel metrik perbandingan latensi dan throughput',
    icon: TableIcon,
    category: 'Format',
    template: '| Pola Desain | Kelebihan Utama | Trade-off Latency | Rekomendasi Beban |\n|---|---|---|---|\n| Cache-Aside | Cepat dibaca, simpel | Cache miss overhead | Read-heavy (> 80%) |\n| Write-Through | Konsistensi data tinggi | Write latency lebih tinggi | Critical Financial |\n| Event-Driven | Skalabilitas asinkron | Eventual consistency | Order processing |\n',
  },
  {
    id: 'h2',
    title: 'Heading 2 (Subjudul Bab)',
    description: 'Subjudul bagian utama dokumen',
    icon: Heading2,
    category: 'Format',
    template: '## Latar Belakang & Analisis Masalah\n',
  },
  {
    id: 'h3',
    title: 'Heading 3 (Sub-bagian)',
    description: 'Sub-bagian di dalam bab naskah',
    icon: Heading3,
    category: 'Format',
    template: '### Evaluasi Trade-off Solusi\n',
  },
  {
    id: 'quote',
    title: 'Blok Kutipan Prinsip',
    description: 'Kutipan filosofi rekayasa arsitektur',
    icon: Quote,
    category: 'Format',
    template: '> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra\n',
  },
];

export interface SlashMenuProps {
  isOpen?: boolean;
  query: string;
  onSelect: (template: string) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

export function SlashMenu({ query, onSelect, onClose, position, isOpen = true }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((idx) => (idx + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((idx) => (idx - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        onSelect(filtered[selectedIndex].template);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelect, onClose]);

  if (!isOpen || filtered.length === 0) return null;

  const style = position ? { top: `${position.top}px`, left: `${position.left}px` } : {};

  return (
    <div
      style={style}
      className={`${
        position ? 'absolute' : 'relative'
      } z-50 w-80 max-h-80 overflow-y-auto rounded-[24px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-100`}
    >
      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#71717a] flex items-center justify-between border-b border-[#ececee] dark:border-[#27272a] mb-1.5">
        <span className="flex items-center gap-1.5 text-[var(--accent)]">
          <Sparkles className="w-3.5 h-3.5" />
          Blok Notasi Arsitektur
        </span>
        <span className="font-mono text-[9px] text-[#a1a1aa]">Ketik &apos;/&apos; untuk cari</span>
      </div>

      <div className="space-y-1">
        {filtered.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.template)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`w-full text-left p-2.5 rounded-[14px] flex items-center gap-3 transition-all ${
                isSelected
                  ? 'bg-[#09090b] text-white dark:bg-white dark:text-[#09090b] shadow-xs'
                  : 'hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#09090b] dark:text-white'
              }`}
            >
              <div
                className={`p-2 rounded-[10px] shrink-0 ${
                  isSelected
                    ? 'bg-white/20 dark:bg-black/10 text-white dark:text-[#09090b]'
                    : 'bg-[var(--bg-card-muted)] text-[var(--accent)]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold truncate leading-tight">{item.title}</p>
                  <span className="text-[9px] uppercase font-mono opacity-60 shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'opacity-85' : 'text-[#71717a]'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

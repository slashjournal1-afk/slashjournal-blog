'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SlashMenu } from './SlashMenu';
import { SocialSimulatorModal } from './SocialSimulatorModal';
import { InsertImageModal } from './InsertImageModal';
import { ArticleContentRenderer } from '@/components/content/ArticleContentRenderer';
import {
  Save,
  Send,
  Eye,
  Columns,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  Upload,
  Loader2,
  FileImage,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Code,
  Table as TableIcon,
  Quote,
  AlertTriangle,
  Link2,
  Workflow,
  Clock,
  BookOpen,
  Tag as TagIcon,
  Shield,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
  Share2,
  RotateCcw,
  Undo2,
  Redo2,
  Globe,
} from 'lucide-react';
import { slugify, calculateReadingTime } from '@/lib/utils';

interface SlashEditorProps {
  initialArticle?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    contentMarkdown: string;
    categoryId: string;
    seriesId?: string | null;
    seriesOrder?: number | null;
    coverImageUrl?: string | null;
    coverImageSourceType?: string | null;
    isSponsored?: boolean;
    sponsorName?: string | null;
    sponsorUrl?: string | null;
    status: string;
  };
  categories: { id: string; name: string; isIndexable?: boolean }[];
  seriesList: { id: string; title: string }[];
  userRole?: string;
}

const DEFAULT_DEMO_CONTENT = `## 1. Analisis Latar Belakang & Problem Statement

Sistem terdistribusi modern membutuhkan keandalan transaksi tingkat tinggi. Pada arsitektur pembayaran dan mutasi keuangan, risiko terjadinya pemrosesan ganda (*double billing*) saat terjadi network timeout harus dieliminasi menggunakan [[idempotency-key]].

> [!NOTE]
> **Prinsip Dasar**: Kunci idempotensi unik wajib dihasilkan di sisi klien dan diverifikasi secara atomik pada lapisan basis data sebelum mutasi saldo dieksekusi.

---

## 2. Diagram Alur Transaksi (Mermaid Sequence)

Berikut adalah diagram sekuens interaktif yang menggambarkan pertukaran pesan antara klien, API Gateway, dan PostgreSQL:

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as Klien Pengguna
    participant Gateway as API Gateway
    participant Ledger as Layanan Ledger
    participant DB as PostgreSQL (ACID)

    User->>Gateway: POST /api/v1/charge (Idempotency-Key: abc-123)
    Gateway->>Ledger: Forward Request
    Ledger->>DB: INSERT INTO idempotency_records ON CONFLICT DO NOTHING
    alt Kunci Baru (Belum Pernah Diproses)
        DB-->>Ledger: Sukses Dibuat
        Ledger->>DB: Eksekusi Mutasi Saldo
        Ledger-->>Gateway: 201 Created (Transaksi Sukses)
        Gateway-->>User: 200 OK
    else Kunci Duplikat (Sedang/Sudah Diproses)
        DB-->>Ledger: Conflict Detected
        Ledger-->>Gateway: Return Hasil Cached Sebelumnya
        Gateway-->>User: 200 OK (Idempotent Response)
    end
\`\`\`

---

## 3. Implementasi Handler Transaksi Multi-Bahasa

\`\`\`tabs
// tab: TypeScript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const idempotencyKey = req.headers.get('x-idempotency-key');
  if (!idempotencyKey) {
    return NextResponse.json({ error: 'Header X-Idempotency-Key wajib disertakan' }, { status: 400 });
  }

  // Verifikasi kunci di basis data PostgreSQL
  return NextResponse.json({ status: 'PROCESSED', key: idempotencyKey });
}
// tab: SQL
CREATE TABLE IF NOT EXISTS idempotency_keys (
    key VARCHAR(64) PRIMARY KEY,
    response_body JSONB NOT NULL,
    status_code INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);
// tab: Go
package main

import (
    "net/http"
)

func IdempotentHandler(w http.ResponseWriter, r *http.Request) {
    key := r.Header.Get("X-Idempotency-Key")
    if key == "" {
        http.Error(w, "Missing Idempotency Key", http.StatusBadRequest)
        return
    }
    w.WriteHeader(http.StatusOK)
}
\`\`\`

---

## 4. Evaluasi Metrik & Latensi

| Lapisan Sistem | Mekanisme Penyimpanan | P95 Latency | Karakteristik Konsistensi |
|---|---|---|---|
| Edge Proxy | Redis Token Cache | < 2ms | In-memory atomic SETNX |
| Ledger Core | PostgreSQL Partitioned Table | ~ 8ms | Strong ACID Transactional |
| Audit Trail | ClickHouse Append-Only Log | ~ 15ms | High Throughput Analytics |
`;

export function SlashEditor({
  initialArticle,
  categories,
  seriesList,
  userRole = 'AUTHOR',
}: SlashEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

  const draftStorageKey = `slash_draft_${initialArticle?.id || 'new'}`;

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialArticle?.slug));
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [categoryId, setCategoryId] = useState(initialArticle?.categoryId || categories[0]?.id || '');
  const [seriesId, setSeriesId] = useState(initialArticle?.seriesId || '');
  const [seriesOrder, setSeriesOrder] = useState(initialArticle?.seriesOrder || 1);
  const [coverImageUrl, setCoverImageUrl] = useState(initialArticle?.coverImageUrl || '');
  const [coverImageSourceType, setCoverImageSourceType] = useState(
    initialArticle?.coverImageSourceType || 'FREE_STOCK'
  );
  const [isSponsored, setIsSponsored] = useState(initialArticle?.isSponsored || false);
  const [sponsorName, setSponsorName] = useState(initialArticle?.sponsorName || '');
  const [sponsorUrl, setSponsorUrl] = useState(initialArticle?.sponsorUrl || '');
  const [status, setStatus] = useState(initialArticle?.status || 'DRAFT');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [showMetadata, setShowMetadata] = useState(true);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  // Default starter content
  const [contentMarkdown, setContentMarkdown] = useState(
    initialArticle?.contentMarkdown || DEFAULT_DEMO_CONTENT
  );

  // Slash Menu State
  const [slashQuery, setSlashQuery] = useState('');
  const [isSlashOpen, setIsSlashOpen] = useState(false);
  const [slashTriggerIndex, setSlashTriggerIndex] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check for local draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.contentMarkdown && parsed.contentMarkdown !== initialArticle?.contentMarkdown) {
          setHasLocalDraft(true);
        }
      }
    } catch {}
  }, [draftStorageKey, initialArticle?.contentMarkdown]);

  // Auto-save to localStorage every 3s
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const draftData = {
          title,
          slug,
          excerpt,
          contentMarkdown,
          categoryId,
          seriesId,
          seriesOrder,
          coverImageUrl,
          coverImageSourceType,
          isSponsored,
          sponsorName,
          sponsorUrl,
          savedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        localStorage.setItem(draftStorageKey, JSON.stringify(draftData));
        setLastAutoSaved(draftData.savedAt);
      } catch {}
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    title,
    slug,
    excerpt,
    contentMarkdown,
    categoryId,
    seriesId,
    seriesOrder,
    coverImageUrl,
    coverImageSourceType,
    isSponsored,
    sponsorName,
    sponsorUrl,
    draftStorageKey,
  ]);

  const restoreLocalDraft = () => {
    try {
      const saved = localStorage.getItem(draftStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.slug) setSlug(parsed.slug);
        if (parsed.excerpt) setExcerpt(parsed.excerpt);
        if (parsed.contentMarkdown) setContentMarkdown(parsed.contentMarkdown);
        if (parsed.categoryId) setCategoryId(parsed.categoryId);
        if (parsed.seriesId) setSeriesId(parsed.seriesId);
        if (parsed.seriesOrder) setSeriesOrder(parsed.seriesOrder);
        if (parsed.coverImageUrl) setCoverImageUrl(parsed.coverImageUrl);
        if (parsed.coverImageSourceType) setCoverImageSourceType(parsed.coverImageSourceType);
        if (parsed.isSponsored !== undefined) setIsSponsored(parsed.isSponsored);
        if (parsed.sponsorName) setSponsorName(parsed.sponsorName);
        if (parsed.sponsorUrl) setSponsorUrl(parsed.sponsorUrl);

        setHasLocalDraft(false);
        setSuccessMsg('Draf dari penyimpanan lokal berhasil dipulihkan!');
      }
    } catch {}
  };

  // Auto-slug sync when typing title
  useEffect(() => {
    if (!isSlugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, isSlugManual]);

  // Undo / Redo History Stack Management
  const [history, setHistory] = useState<Array<{ content: string; cursor: number }>>(() => [
    { content: initialArticle?.contentMarkdown || DEFAULT_DEMO_CONTENT, cursor: 0 },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isPerformingUndoRedoRef = useRef(false);
  const lastSnapshotTimeRef = useRef(Date.now());

  const pushHistorySnapshot = useCallback(
    (newContent: string, cursorPosition?: number, forceNew = false) => {
      if (isPerformingUndoRedoRef.current) return;

      const cursor =
        cursorPosition !== undefined
          ? cursorPosition
          : textareaRef.current?.selectionStart || 0;

      const now = Date.now();
      const timeDiff = now - lastSnapshotTimeRef.current;
      lastSnapshotTimeRef.current = now;

      setHistory((prevHistory) => {
        const currentEntry = prevHistory[historyIndex];
        if (currentEntry && currentEntry.content === newContent) {
          return prevHistory;
        }

        // Group fast successive single-character typing (within 600ms)
        const shouldGroup =
          !forceNew &&
          timeDiff < 600 &&
          Math.abs(newContent.length - (currentEntry?.content.length || 0)) <= 2;

        const base = prevHistory.slice(0, historyIndex + 1);

        if (shouldGroup && base.length > 1) {
          const updated = [...base];
          updated[updated.length - 1] = { content: newContent, cursor };
          return updated;
        }

        const updated = [...base, { content: newContent, cursor }];
        if (updated.length > 100) {
          updated.shift();
        }
        return updated;
      });

      setHistoryIndex((prevIndex) => {
        const currentEntry = history[prevIndex];
        const shouldGroup =
          !forceNew &&
          timeDiff < 600 &&
          Math.abs(newContent.length - (currentEntry?.content.length || 0)) <= 2;

        if (shouldGroup && prevIndex > 0) {
          return prevIndex;
        }
        return Math.min(prevIndex + 1, 99);
      });
    },
    [history, historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const targetIdx = historyIndex - 1;
    const target = history[targetIdx];
    if (!target) return;

    isPerformingUndoRedoRef.current = true;
    setContentMarkdown(target.content);
    setHistoryIndex(targetIdx);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(target.cursor, target.cursor);
      }
      isPerformingUndoRedoRef.current = false;
    }, 15);
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const targetIdx = historyIndex + 1;
    const target = history[targetIdx];
    if (!target) return;

    isPerformingUndoRedoRef.current = true;
    setContentMarkdown(target.content);
    setHistoryIndex(targetIdx);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(target.cursor, target.cursor);
      }
      isPerformingUndoRedoRef.current = false;
    }, 15);
  }, [history, historyIndex]);

  // Reading time & stats
  const readingStats = useMemo(() => {
    const words = contentMarkdown.trim().split(/\s+/).filter(Boolean).length;
    const minutes = calculateReadingTime(contentMarkdown);
    const chars = contentMarkdown.length;
    return { words, minutes, chars };
  }, [contentMarkdown]);

  // Quick toolbar insert helper
  const insertFormatting = useCallback((prefix: string, suffix = '', defaultText = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = contentMarkdown.substring(start, end) || defaultText;

    const before = contentMarkdown.substring(0, start);
    const after = contentMarkdown.substring(end);
    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = before + replacement + after;
    const newCursor = start + prefix.length + selected.length;

    setContentMarkdown(newContent);
    pushHistorySnapshot(newContent, newCursor, true);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 30);
  }, [contentMarkdown, pushHistorySnapshot]);

  // Keyboard Shortcuts handler (Word / Notion standard)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;

    // Undo: Ctrl+Z / Cmd+Z (without Shift)
    if (isCmdOrCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }

    // Redo: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z
    if (
      (isCmdOrCtrl && e.key.toLowerCase() === 'y') ||
      (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z')
    ) {
      e.preventDefault();
      handleRedo();
      return;
    }

    // Save: Ctrl+S / Cmd+S
    if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handleSave('DRAFT');
      return;
    }

    // Bold: Ctrl+B / Cmd+B
    if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      insertFormatting('**', '**', 'teks tebal');
      return;
    }

    // Italic: Ctrl+I / Cmd+I
    if (isCmdOrCtrl && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      insertFormatting('*', '*', 'teks miring');
      return;
    }

    // WikiLink: Ctrl+K / Cmd+K
    if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      insertFormatting('[[', ']]', 'idempotency-key');
      return;
    }

    // Direct Web Link: Ctrl+L / Cmd+L
    if (isCmdOrCtrl && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      insertFormatting('[', '](https://example.com)', 'Teks Tautan');
      return;
    }

    // Inline Code: Ctrl+Shift+X / Cmd+Shift+X or Ctrl+` / Cmd+`
    if (
      (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'x') ||
      (isCmdOrCtrl && e.key === '`')
    ) {
      e.preventDefault();
      insertFormatting('`', '`', 'code');
      return;
    }

    // Underline: Ctrl+U / Cmd+U
    if (isCmdOrCtrl && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      insertFormatting('<u>', '</u>', 'teks bergaris bawah');
      return;
    }

    // Tab key for 2 space indentation / Shift+Tab for outdent
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!textareaRef.current) return;
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const before = contentMarkdown.substring(0, start);
      const after = contentMarkdown.substring(end);

      if (e.shiftKey) {
        if (before.endsWith('  ')) {
          const updated = before.slice(0, -2) + after;
          const newPos = Math.max(0, start - 2);
          setContentMarkdown(updated);
          pushHistorySnapshot(updated, newPos, true);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.focus();
              textareaRef.current.setSelectionRange(newPos, newPos);
            }
          }, 10);
        }
      } else {
        const updated = before + '  ' + after;
        const newPos = start + 2;
        setContentMarkdown(updated);
        pushHistorySnapshot(updated, newPos, true);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPos, newPos);
          }
        }, 10);
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const cursorPos = e.target.selectionStart;
    setContentMarkdown(val);
    pushHistorySnapshot(val, cursorPos, false);

    // Detect typing '/'
    const textBeforeCursor = val.slice(0, cursorPos);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (
      lastSlashIndex !== -1 &&
      (lastSlashIndex === 0 || val[lastSlashIndex - 1] === '\n' || val[lastSlashIndex - 1] === ' ')
    ) {
      const query = textBeforeCursor.slice(lastSlashIndex + 1);
      if (!query.includes(' ') && !query.includes('\n')) {
        setIsSlashOpen(true);
        setSlashQuery(query);
        setSlashTriggerIndex(lastSlashIndex);
        return;
      }
    }

    setIsSlashOpen(false);
  };

  const handleSlashSelect = (template: string) => {
    if (slashTriggerIndex === null || !textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart;
    const before = contentMarkdown.slice(0, slashTriggerIndex);
    const after = contentMarkdown.slice(cursorPos);

    const updated = before + template + after;
    const newPos = before.length + template.length;

    setContentMarkdown(updated);
    pushHistorySnapshot(updated, newPos, true);
    setIsSlashOpen(false);
    setSlashTriggerIndex(null);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 40);
  };

  // In-Content Image Insertion Helper (Inserts at exact cursor position)
  const handleInsertImageMarkdown = useCallback((markdown: string) => {
    if (!textareaRef.current) {
      setContentMarkdown((prev) => {
        const updated = prev + markdown;
        pushHistorySnapshot(updated, updated.length, true);
        return updated;
      });
      setSuccessMsg('Gambar berhasil disisipkan ke naskah!');
      return;
    }

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const before = contentMarkdown.substring(0, start);
    const after = contentMarkdown.substring(end);
    const updated = before + markdown + after;
    const newCursor = start + markdown.length;

    setContentMarkdown(updated);
    pushHistorySnapshot(updated, newCursor, true);
    setSuccessMsg('Gambar berhasil disisipkan ke posisi kursor!');

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 30);
  }, [contentMarkdown, pushHistorySnapshot]);

  // Image Upload & WebP Conversion Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', isCover ? 'thumbnail' : 'konten-artikel');
      formData.append('isCover', isCover ? 'true' : 'false');
      formData.append('sourceType', coverImageSourceType);
      formData.append('altText', title || file.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengunggah gambar');

      if (isCover) {
        setCoverImageUrl(data.url);
        setSuccessMsg('Gambar sampul berhasil diunggah dan dikonversi ke WebP!');
      } else {
        const imgMarkdown = `\n\n![${data.altText || data.originalName}](${data.url})\n`;
        handleInsertImageMarkdown(imgMarkdown);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses gambar');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async (targetStatus?: string) => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const nextStatus = targetStatus || status;

    const payload = {
      title,
      slug,
      excerpt,
      contentMarkdown,
      categoryId,
      seriesId: seriesId || null,
      seriesOrder: seriesId ? Number(seriesOrder) : null,
      coverImageUrl: coverImageUrl || null,
      coverImageSourceType: coverImageUrl ? coverImageSourceType : null,
      isSponsored,
      sponsorName: isSponsored ? sponsorName : null,
      sponsorUrl: isSponsored ? sponsorUrl : null,
      status: nextStatus,
    };

    try {
      const endpoint = initialArticle?.id
        ? `/api/articles/${initialArticle.id}`
        : '/api/articles';

      const method = initialArticle?.id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan naskah');

      setStatus(nextStatus);
      setSuccessMsg(
        nextStatus === 'PUBLISHED'
          ? 'Naskah berhasil diterbitkan secara publik!'
          : nextStatus === 'IN_REVIEW'
          ? 'Naskah dikirim ke Antrean Review Redaksi.'
          : 'Draf naskah berhasil disimpan di server.'
      );

      if (!initialArticle?.id && data.article?.id) {
        router.push(`/admin/docs/${data.article.id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan naskah');
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="space-y-6 w-full max-w-full mx-auto py-2">
      {/* Top Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ececee] dark:border-[#27272a] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a00] animate-pulse" />
            <h1 className="text-2xl font-extrabold text-[#09090b] dark:text-white tracking-tight">
              {initialArticle?.id ? 'Edit Naskah Arsitektur' : 'Studio Penulisan Dokumen & Diagram'}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717a] dark:text-[#a1a1aa] mt-1">
            <span>Editor Notion-Style dengan Live Mermaid Diagram &amp; Multi-Tab Code</span>
            <span>•</span>
            <span className="font-mono text-[#ff5a00] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readingStats.minutes} mnt baca ({readingStats.words} kata)
            </span>
            {lastAutoSaved && (
              <>
                <span>•</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                  ● Draf peramban: {lastAutoSaved}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSocialModalOpen(true)}
            className="px-3.5 py-2 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-[#09090b] dark:text-white transition-all flex items-center gap-1.5 active:scale-95"
            title="Pratinjau Simulator SEO & Social Card"
          >
            <Share2 className="w-3.5 h-3.5 text-[#ff5a00]" />
            <span>SEO Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('DRAFT')}
            disabled={saving}
            className="px-4 py-2 rounded-[12px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-xs font-bold text-[#09090b] dark:text-white transition-all shadow-xs flex items-center gap-2 active:scale-95"
          >
            <Save className="w-3.5 h-3.5 text-[#ff5a00]" />
            <span>Simpan Draf (Ctrl+S)</span>
          </button>

          {['ADMIN', 'EDITOR'].includes(userRole) ? (
            <button
              type="button"
              onClick={() => handleSave('PUBLISHED')}
              disabled={saving}
              className="px-5 py-2 rounded-[12px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] hover:bg-[#18181b] dark:hover:bg-zinc-200 text-xs font-bold shadow-awesomic-dark-btn transition-all flex items-center gap-2 active:scale-95"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-[#ff5a00]" />}
              <span>Terbitkan Publik</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSave('IN_REVIEW')}
              disabled={saving}
              className="px-5 py-2 rounded-[12px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] hover:bg-[#18181b] dark:hover:bg-zinc-200 text-xs font-bold shadow-awesomic-dark-btn transition-all flex items-center gap-2 active:scale-95"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-[#ff5a00]" />}
              <span>Kirim ke Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Local Draft Recovery Prompt */}
      {hasLocalDraft && (
        <div className="p-4 rounded-[20px] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-medium text-blue-900 dark:text-blue-200 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Draf Lokal Ditemukan:</strong> Ada salinan draf yang tersimpan otomatis di peramban Anda.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={restoreLocalDraft}
              className="px-3 py-1.5 rounded-[8px] bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Pulihkan Draf
            </button>
            <button
              type="button"
              onClick={() => setHasLocalDraft(false)}
              className="px-2.5 py-1.5 rounded-[8px] text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
            >
              Abaikan
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-[20px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-[20px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-800 dark:text-red-300 animate-in fade-in">
          {errorMsg}
        </div>
      )}

      {/* Collapsible Metadata Configuration Panel */}
      <div className="rounded-[32px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff5a00]" />
            <h3 className="text-sm font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
              Metadata, Kanal &amp; Atribusi
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowMetadata((prev) => !prev)}
            className="text-xs font-semibold text-[#71717a] hover:text-[#09090b] dark:hover:text-white flex items-center gap-1"
          >
            <span>{showMetadata ? 'Sembunyikan Panel' : 'Buka Pengaturan'}</span>
            {showMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showMetadata && (
          <div className="space-y-5 pt-2 border-t border-[#ececee] dark:border-[#27272a] animate-in fade-in">
            {/* Title & Clean Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                  Judul Artikel / Bab
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Merancang Sistem Idempotensi..."
                  className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs sm:text-sm font-medium text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                    Slug URL Bersih
                  </label>
                  <span className="text-[10px] text-[#71717a]">
                    {isSlugManual ? 'Manual' : 'Otomatis dari judul'}
                  </span>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsSlugManual(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="merancang-sistem-idempotensi"
                  className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-mono text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
                />
              </div>
            </div>

            {/* Excerpt / Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                Ringkasan Eksekutif (Excerpt / TL;DR)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Ringkasan padat arsitektur untuk pratinjau kartu, RSS feed, dan SEO metadata..."
                className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs sm:text-sm text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00] resize-none"
              ></textarea>
            </div>

            {/* Category & Series Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                  Kanal Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.isIndexable === false ? '(No-Index / Jurnal)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                  Seri Panduan (Opsional)
                </label>
                <select
                  value={seriesId}
                  onChange={(e) => setSeriesId(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white focus:outline-none"
                >
                  <option value="">Bukan Bagian dari Seri</option>
                  {seriesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                  Urutan dalam Seri
                </label>
                <input
                  type="number"
                  min={1}
                  value={seriesOrder}
                  onChange={(e) => setSeriesOrder(Number(e.target.value))}
                  disabled={!seriesId}
                  className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Cover Image Upload (WebP) & Source Type */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Gambar Sampul (Auto WebP Converter)</span>
                  <span className="text-[10px] text-[#71717a]">JPG, PNG ➔ WebP Modern</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://... atau klik Unggah File Sampul"
                    className="flex-1 px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none"
                  />
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, true)}
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => coverFileInputRef.current?.click()}
                    className="px-4 py-3 rounded-[14px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] hover:bg-[#18181b] dark:hover:bg-zinc-200 text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-2 active:scale-95"
                  >
                    {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-[#ff5a00]" />}
                    <span>Unggah WebP</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                  Sumber Visual (C4 &amp; CM7)
                </label>
                <select
                  value={coverImageSourceType}
                  onChange={(e) => setCoverImageSourceType(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white focus:outline-none"
                >
                  <option value="FREE_STOCK">Stok Bebas Royalty (Unsplash)</option>
                  <option value="SELF_SHOT">Dokumentasi / Foto Sendiri</option>
                  <option value="AI_GENERATED">Ilustrasi AI Berlabel</option>
                </select>
              </div>
            </div>

            {/* Sponsored Post Toggle (M5) */}
            <div className="p-4 rounded-[20px] bg-[#f4f4f5]/70 dark:bg-[#27272a]/40 border border-[#ececee] dark:border-[#3f3f46] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                    Pos Bersponsor / Advertorial (M5)
                  </h4>
                  <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">
                    Menandai naskah sebagai advertorial berlabel resmi dan mengecualikannya dari RSS utama.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isSponsored}
                  onChange={(e) => setIsSponsored(e.target.checked)}
                  className="w-5 h-5 accent-[#ff5a00] rounded cursor-pointer"
                />
              </div>

              {isSponsored && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#ececee] dark:border-[#3f3f46] animate-in fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-[#71717a]">Nama Sponsor</label>
                    <input
                      type="text"
                      value={sponsorName}
                      onChange={(e) => setSponsorName(e.target.value)}
                      placeholder="Contoh: ClickHouse Cloud"
                      className="w-full px-3 py-2 rounded-[10px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-[#71717a]">URL Sponsor</label>
                    <input
                      type="url"
                      value={sponsorUrl}
                      onChange={(e) => setSponsorUrl(e.target.value)}
                      placeholder="https://sponsor.com"
                      className="w-full px-3 py-2 rounded-[10px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Editor & Live Rendered Workspace */}
      <div className="space-y-4">
        {/* Rich Action Formatting Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-[24px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-xs">
          {/* Quick Insert & History Group */}
          <div className="flex flex-wrap items-center gap-1">
            {/* History Undo / Redo Controls */}
            <div className="flex items-center gap-0.5 bg-[#f4f4f5] dark:bg-[#27272a] p-0.5 rounded-[10px] mr-1">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-[8px] hover:bg-white dark:hover:bg-[#18181b] text-[#09090b] dark:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Batalkan (Undo: Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-[8px] hover:bg-white dark:hover:bg-[#18181b] text-[#09090b] dark:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Ulangi (Redo: Ctrl+Y / Ctrl+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
            <span className="w-px h-5 bg-[#ececee] dark:bg-[#27272a] mx-1" />

            <button
              type="button"
              onClick={() => insertFormatting('## ', '', 'Judul Bab')}
              className="p-2 rounded-[10px] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#09090b] dark:text-white text-xs font-bold"
              title="Heading 2 (Ctrl+2)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('### ', '', 'Sub-bab')}
              className="p-2 rounded-[10px] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#09090b] dark:text-white text-xs font-bold"
              title="Heading 3 (Ctrl+3)"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <span className="w-px h-5 bg-[#ececee] dark:bg-[#27272a] mx-1" />

            <button
              type="button"
              onClick={() => insertFormatting('**', '**', 'teks tebal')}
              className="p-2 rounded-[10px] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#09090b] dark:text-white text-xs font-bold"
              title="Tebal (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*', 'teks miring')}
              className="p-2 rounded-[10px] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#09090b] dark:text-white text-xs font-bold"
              title="Miring (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`', '`', 'code')}
              className="p-2 rounded-[10px] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#09090b] dark:text-white text-xs font-bold"
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('> ', '', 'Kutipan prinsip')}
              className="p-2 rounded-[10px] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#09090b] dark:text-white text-xs font-bold"
              title="Kutipan (Quote)"
            >
              <Quote className="w-4 h-4" />
            </button>
            <span className="w-px h-5 bg-[#ececee] dark:bg-[#27272a] mx-1" />

            {/* Architecture Blocks */}
            <button
              type="button"
              onClick={() =>
                insertFormatting(
                  '```mermaid\nsequenceDiagram\n    autonumber\n    Client->>Server: Request\n    Server-->>Client: Response\n```\n'
                )
              }
              className="px-2.5 py-1.5 rounded-[10px] bg-orange-50 dark:bg-orange-950/30 text-[#ff5a00] hover:bg-orange-100 dark:hover:bg-orange-900/40 text-xs font-bold flex items-center gap-1.5"
              title="Sisipkan Sequence Diagram Mermaid"
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Diagram Mermaid</span>
            </button>

            <button
              type="button"
              onClick={() =>
                insertFormatting(
                  '```tabs\n// tab: TypeScript\nconst hello = "world";\n// tab: Go\nfmt.Println("hello world")\n```\n'
                )
              }
              className="px-2.5 py-1.5 rounded-[10px] bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5"
              title="Sisipkan Multi-Tab Code"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Tab Code</span>
            </button>

            <button
              type="button"
              onClick={() =>
                insertFormatting(
                  '> [!NOTE]\n> Tulis catatan penting atau pertimbangan arsitektur di sini...\n'
                )
              }
              className="px-2.5 py-1.5 rounded-[10px] bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5"
              title="Sisipkan Kotak Callout"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Callout</span>
            </button>

            <button
              type="button"
              onClick={() => insertFormatting('[[', ']]', 'idempotency-key')}
              className="px-2.5 py-1.5 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5"
              title="Sisipkan WikiLink Glosarium (Ctrl+K)"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>[[WikiLink]]</span>
            </button>

            <button
              type="button"
              onClick={() => insertFormatting('[', '](https://example.com)', 'Teks Tautan')}
              className="px-2.5 py-1.5 rounded-[10px] bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-300 hover:bg-sky-100 text-xs font-bold flex items-center gap-1.5"
              title="Sisipkan Tautan Web Luar [Teks](URL) (Ctrl+L)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Link URL</span>
            </button>

            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="px-2.5 py-1.5 rounded-[10px] bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5"
              title="Sisipkan Media / Gambar ke Naskah (Upload atau Tautan URL)"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Gambar</span>
            </button>
          </div>

          {/* Right Toolbar Controls: Image Upload & View Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="px-3 py-1.5 rounded-[10px] bg-[#f4f4f5] dark:bg-[#27272a] text-xs font-bold text-[#09090b] dark:text-white hover:text-[#ff5a00] transition-colors flex items-center gap-1.5 active:scale-95"
              title="Sisipkan berkas gambar (auto WebP) atau tautan URL langsung"
            >
              <FileImage className="w-3.5 h-3.5 text-[#ff5a00]" />
              <span>Sisipkan Media Konten</span>
            </button>

            {/* View Switchers */}
            <div className="flex items-center gap-1 bg-[#f4f4f5] dark:bg-[#27272a] p-1 rounded-[12px]">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-2.5 py-1 rounded-[8px] text-xs font-bold transition-all ${
                  viewMode === 'edit'
                    ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                    : 'text-[#71717a]'
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-[8px] text-xs font-bold transition-all ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                    : 'text-[#71717a]'
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded-[8px] text-xs font-bold transition-all ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                    : 'text-[#71717a]'
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Dual Panel Writing Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          {/* Left Panel: Markdown Text Editor */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} relative`}>
              <textarea
                ref={textareaRef}
                value={contentMarkdown}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                rows={28}
                className="w-full font-mono text-xs sm:text-sm p-6 rounded-[28px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] focus:outline-none focus:border-[#ff5a00] leading-relaxed text-[#09090b] dark:text-white resize-y shadow-xs min-h-[680px]"
                placeholder="Mulai menulis arsitektur sistem di sini... Ketik '/' untuk membuka blok Notion-style. Pintasan: Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+B (Tebal), Ctrl+I (Miring), Ctrl+K (WikiLink), Tab (Indentasi)."
              ></textarea>

              {/* Shortcut Bar & Realtime Stats */}
              <div className="mt-2 px-3.5 py-2 rounded-[14px] bg-[#f4f4f5] dark:bg-[#1f1f23] border border-[#ececee] dark:border-[#27272a] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#71717a]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1" title="Batalkan perubahan terakhir">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#d4d4d8] dark:border-[#3f3f46] text-[#09090b] dark:text-white text-[10px] font-semibold shadow-2xs">Ctrl+Z</kbd> Undo
                  </span>
                  <span className="flex items-center gap-1" title="Ulangi perubahan yang dibatalkan">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#d4d4d8] dark:border-[#3f3f46] text-[#09090b] dark:text-white text-[10px] font-semibold shadow-2xs">Ctrl+Y</kbd> Redo
                  </span>
                  <span className="flex items-center gap-1" title="Format teks tebal">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#d4d4d8] dark:border-[#3f3f46] text-[#09090b] dark:text-white text-[10px] font-semibold shadow-2xs">Ctrl+B</kbd> Tebal
                  </span>
                  <span className="flex items-center gap-1" title="Format teks miring">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#d4d4d8] dark:border-[#3f3f46] text-[#09090b] dark:text-white text-[10px] font-semibold shadow-2xs">Ctrl+I</kbd> Miring
                  </span>
                  <span className="flex items-center gap-1" title="Sisipkan WikiLink konsep glosarium">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#d4d4d8] dark:border-[#3f3f46] text-[#09090b] dark:text-white text-[10px] font-semibold shadow-2xs">Ctrl+K</kbd> WikiLink
                  </span>
                  <span className="flex items-center gap-1" title="Sisipkan tautan web luar [Teks](URL)">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#d4d4d8] dark:border-[#3f3f46] text-[#09090b] dark:text-white text-[10px] font-semibold shadow-2xs">Ctrl+L</kbd> Link
                  </span>
                  <span className="flex items-center gap-1" title="Simpan naskah draf">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#d4d4d8] dark:border-[#3f3f46] text-[#09090b] dark:text-white text-[10px] font-semibold shadow-2xs">Ctrl+S</kbd> Simpan
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#a1a1aa]">{historyIndex + 1}/{history.length} snapshot</span>
                  <span className="font-semibold text-[#09090b] dark:text-white">{readingStats.words} kata</span>
                </div>
              </div>

              {/* Floating Slash Menu Popup */}
              {isSlashOpen && (
                <div className="absolute top-12 left-6 z-50">
                  <SlashMenu
                    isOpen={isSlashOpen}
                    query={slashQuery}
                    onSelect={handleSlashSelect}
                    onClose={() => setIsSlashOpen(false)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Right Panel: Live Rendered Output */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              className={`${
                viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
              } p-6 sm:p-8 rounded-[28px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-xs overflow-y-auto max-h-[850px] min-h-[680px]`}
            >
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#71717a] pb-3 border-b border-[#ececee] dark:border-[#27272a] mb-6 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#ff5a00]" />
                  Pratinjau Arsitektur &amp; Diagram Interaktif
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">● Live Render</span>
              </div>

              {/* Title & Excerpt in Preview */}
              {title && (
                <div className="space-y-3 pb-6 border-b border-[#ececee] dark:border-[#27272a] mb-6">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09090b] dark:text-white tracking-tight leading-tight">
                    {title}
                  </h1>
                  {excerpt && (
                    <p className="text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
                      {excerpt}
                    </p>
                  )}
                </div>
              )}

              {/* Cover Image in Preview */}
              {coverImageUrl && (
                <div className="mb-6 rounded-[24px] overflow-hidden relative h-56 border border-[#ececee] dark:border-[#27272a]">
                  <Image
                    src={coverImageUrl}
                    alt={title || 'Cover'}
                    fill
                    unoptimized={Boolean(coverImageUrl.startsWith('/uploads') || coverImageUrl.startsWith('data:'))}
                    className="object-cover"
                  />
                </div>
              )}

              {/* Body Content Preview with Live Mermaid & Tabs */}
              <ArticleContentRenderer content={contentMarkdown} />
            </div>
          )}
        </div>
      </div>

      {/* Social Media & SEO Simulator Modal */}
      <SocialSimulatorModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        title={title}
        slug={slug}
        excerpt={excerpt}
        coverImageUrl={coverImageUrl}
      />

      {/* In-Content Insert Image Modal (Upload & Direct URL) */}
      <InsertImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleInsertImageMarkdown}
        articleTitle={title}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, Layers, Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { slugify } from '@/lib/utils';

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newCategory: { id: string; name: string; slug: string }) => void;
}

export function NewCategoryModal({
  isOpen,
  onClose,
  onCreated,
}: NewCategoryModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isIndexable, setIsIndexable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama kategori wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          description: description.trim() || null,
          isIndexable,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat kategori baru');
      }

      onCreated(data.category);
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSlug('');
    setDescription('');
    setIsIndexable(true);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ececee] dark:border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[12px] bg-orange-50 dark:bg-orange-950/40 text-[#ff5a00]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#09090b] dark:text-white">
                Buat Kategori Baru
              </h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                Tambahkan kanal topik baru untuk mengelompokkan artikel Anda.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#71717a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-[12px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
              Nama Kategori *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="Contoh: Kecerdasan Buatan & LLM"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
              Slug URL
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="kecerdasan-buatan-llm"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-mono text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fokus pembahasan kanal kategori ini..."
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00] resize-none"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isIndexable}
              onChange={(e) => setIsIndexable(e.target.checked)}
              className="w-4 h-4 rounded text-[#ff5a00] focus:ring-[#ff5a00]"
            />
            <span className="text-xs font-medium text-[#09090b] dark:text-white">
              Izinkan Mesin Pencari (Google/SEO) mengindeks artikel di kategori ini
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ececee] dark:border-[#27272a]">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] text-xs font-bold text-[#71717a] hover:text-[#09090b] dark:hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="px-5 py-2.5 rounded-[12px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] text-xs font-extrabold hover:bg-[#18181b] dark:hover:bg-zinc-200 transition-all disabled:opacity-40 flex items-center gap-2 active:scale-95 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-[#ff5a00]" />
                  <span>Simpan Kategori</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

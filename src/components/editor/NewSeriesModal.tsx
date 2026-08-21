'use client';

import React, { useState, useRef } from 'react';
import { X, BookOpen, Plus, Loader2, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { slugify } from '@/lib/utils';

interface NewSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newSeries: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    coverImageUrl?: string | null;
    isPublished?: boolean;
  }) => void;
}

export function NewSeriesModal({
  isOpen,
  onClose,
  onCreated,
}: NewSeriesModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'thumbnail');
      formData.append('isCover', 'true');
      formData.append('sourceType', 'FREE_STOCK');
      formData.append('altText', title || file.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar sampul seri');
      }

      setCoverImageUrl(data.url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses gambar');
    } finally {
      setIsUploadingCover(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Judul seri panduan wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || slugify(title),
          description: description.trim() || null,
          coverImageUrl: coverImageUrl.trim() || null,
          isPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat seri panduan baru');
      }

      onCreated(data.series);
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat membuat seri');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setCoverImageUrl('');
    setIsPublished(true);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-[32px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ececee] dark:border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-[14px] bg-orange-50 dark:bg-orange-950/40 text-[#ff5a00]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#09090b] dark:text-white">
                Buat Seri Panduan Baru
              </h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                Rancang jalur kurikulum pembelajaran yang menyambungkan beberapa naskah.
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
          <div className="p-3 rounded-[14px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
              Judul Seri Panduan *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="Contoh: Arsitektur Event-Driven &amp; Kafka"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
              Slug URL
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="arsitektur-event-driven-kafka"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-mono text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
              Deskripsi / Sasaran Jalur Belajar (Opsional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rangkaian panduan dari fundamental arsitektur, pola idempotensi, hingga implementasi produksi..."
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00] resize-none"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center justify-between">
              <span>Gambar Sampul Seri (Opsional)</span>
              <span className="text-[10px] text-[#71717a]">Auto WebP</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://... atau klik tombol Unggah"
                className="flex-1 px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
              <button
                type="button"
                disabled={isUploadingCover}
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-bold text-[#09090b] dark:text-white hover:text-[#ff5a00] transition-colors shrink-0 flex items-center gap-1.5 active:scale-95"
              >
                {isUploadingCover ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-[#ff5a00]" />
                )}
                <span>Upload WebP</span>
              </button>
            </div>

            {coverImageUrl && (
              <div className="relative w-full rounded-[14px] overflow-hidden border border-[#ececee] dark:border-[#3f3f46] bg-[#f4f4f5] dark:bg-[#18181b] p-1 flex items-center justify-center">
                <img
                  src={coverImageUrl}
                  alt="Pratinjau Sampul Seri"
                  className="w-full h-auto max-h-40 object-contain rounded-[10px]"
                />
              </div>
            )}
          </div>

          {/* Published Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-[#ff5a00] focus:ring-[#ff5a00]"
            />
            <span className="text-xs font-medium text-[#09090b] dark:text-white">
              Publikasikan seri ini (Tampilkan di halaman katalog publik <code className="font-mono text-[11px] text-[#ff5a00]">/series</code>)
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
              disabled={!title.trim() || isSubmitting}
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
                  <span>Simpan Seri Panduan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

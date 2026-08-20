'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  Link2,
  FileImage,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface InsertImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (markdown: string) => void;
  articleTitle?: string;
}

export function InsertImageModal({
  isOpen,
  onClose,
  onInsert,
  articleTitle = '',
}: InsertImageModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [sourceType, setSourceType] = useState('SELF_SHOT');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // URL State
  const [imageUrl, setImageUrl] = useState('');
  const [urlAltText, setUrlAltText] = useState('');
  const [urlCaption, setUrlCaption] = useState('');
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSelectedFile(file);

    // Auto-fill alt text if empty
    if (!uploadAltText) {
      setUploadAltText(articleTitle || file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Pilih berkas gambar terlebih dahulu');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', 'konten-artikel');
      formData.append('isCover', 'false');
      formData.append('sourceType', sourceType);
      formData.append('altText', uploadAltText || articleTitle || selectedFile.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }

      const alt = uploadAltText.trim() || data.altText || data.originalName || 'Gambar';
      let markdown = `\n\n![${alt}](${data.url})\n`;
      if (uploadCaption.trim()) {
        markdown += `*${uploadCaption.trim()}*\n\n`;
      } else {
        markdown += '\n';
      }

      onInsert(markdown);
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat mengunggah berkas');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setErrorMsg('Masukkan URL gambar yang valid');
      return;
    }

    const alt = urlAltText.trim() || articleTitle || 'Gambar';
    let markdown = `\n\n![${alt}](${imageUrl.trim()})\n`;
    if (urlCaption.trim()) {
      markdown += `*${urlCaption.trim()}*\n\n`;
    } else {
      markdown += '\n';
    }

    onInsert(markdown);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploadAltText('');
    setUploadCaption('');
    setImageUrl('');
    setUrlAltText('');
    setUrlCaption('');
    setErrorMsg(null);
    setIsUrlValid(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-[32px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ececee] dark:border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[12px] bg-orange-50 dark:bg-orange-950/40 text-[#ff5a00]">
              <FileImage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#09090b] dark:text-white">
                Sisipkan Gambar ke Konten
              </h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                Tambahkan ilustrasi, diagram, atau tangkapan layar langsung ke dalam naskah artikel.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#71717a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#f4f4f5] dark:bg-[#27272a] rounded-[16px]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-[12px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                : 'text-[#71717a] hover:text-[#09090b] dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#ff5a00]" />
            <span>Unggah Berkas (Auto WebP)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('url');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-[12px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'url'
                ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                : 'text-[#71717a] hover:text-[#09090b] dark:hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Tautan URL Gambar</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-[14px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: UPLOAD FILE */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* File Drop / Picker Zone */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {!filePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#ececee] dark:border-[#3f3f46] hover:border-[#ff5a00] rounded-[20px] p-6 text-center cursor-pointer transition-colors bg-[#fafafa] dark:bg-[#141416]/50 space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff5a00] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#09090b] dark:text-white">
                    Klik untuk memilih gambar atau seret berkas ke sini
                  </p>
                  <p className="text-[11px] text-[#71717a]">
                    JPG, PNG, GIF, WebP, SVG • Otomatis dikonversi ke WebP modern
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-[20px] overflow-hidden border border-[#ececee] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#141416] p-3 flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-[12px] overflow-hidden bg-black/5 shrink-0">
                  <img
                    src={filePreview}
                    alt="Pratinjau"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#09090b] dark:text-white truncate">
                    {selectedFile?.name}
                  </p>
                  <p className="text-[10.5px] text-[#71717a] font-mono">
                    {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB • Siap dikonversi
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-[#ececee] dark:hover:bg-[#27272a] text-[#71717a]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Inputs: Alt Text, Caption, Source Type */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                  Deskripsi / Alt Text (Aksesibilitas &amp; SEO)
                </label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="Contoh: Diagram Alur Arsitektur Microservices"
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                  Keterangan Gambar / Caption (Opsional)
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Contoh: Gambar 1: Topologi cluster database dengan 3 read-replica"
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                  Sumber Visual (Kepatuhan Editorial)
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white focus:outline-none"
                >
                  <option value="SELF_SHOT">Dokumentasi / Screenshot Sendiri</option>
                  <option value="FREE_STOCK">Stok Bebas Royalti (Unsplash / Pexels)</option>
                  <option value="AI_GENERATED">Ilustrasi AI Berlabel</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ececee] dark:border-[#27272a]">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] text-xs font-bold text-[#71717a] hover:text-[#09090b] dark:hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="px-5 py-2.5 rounded-[12px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] text-xs font-extrabold hover:bg-[#18181b] dark:hover:bg-zinc-200 transition-all disabled:opacity-40 flex items-center gap-2 active:scale-95 shadow-xs"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengonversi &amp; Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#ff5a00]" />
                    <span>Unggah &amp; Sisipkan ke Naskah</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: INPUT URL LINK */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                URL Gambar Langsung (Direct Image URL)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setIsUrlValid(null);
                  }}
                  placeholder="https://images.unsplash.com/photo-... atau URL CDN"
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
                />
              </div>
            </div>

            {/* Live URL Preview */}
            {imageUrl && (
              <div className="relative aspect-[16/9] w-full rounded-[16px] overflow-hidden bg-[#fafafa] dark:bg-[#141416] border border-[#ececee] dark:border-[#27272a]">
                <img
                  src={imageUrl}
                  alt="Pratinjau URL"
                  onLoad={() => setIsUrlValid(true)}
                  onError={() => setIsUrlValid(false)}
                  className="w-full h-full object-cover"
                />
                {isUrlValid === false && (
                  <div className="absolute inset-0 bg-rose-950/80 text-rose-200 text-xs flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="w-6 h-6 mb-1 text-rose-400" />
                    <span>Gagal memuat gambar dari URL tersebut. Pastikan URL langsung menuju ke berkas gambar (JPG, PNG, WebP).</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                Deskripsi / Alt Text
              </label>
              <input
                type="text"
                value={urlAltText}
                onChange={(e) => setUrlAltText(e.target.value)}
                placeholder="Contoh: Tangkapan Layar Metrik Prometheus & Grafana"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                Keterangan Gambar / Caption (Opsional)
              </label>
              <input
                type="text"
                value={urlCaption}
                onChange={(e) => setUrlCaption(e.target.value)}
                placeholder="Contoh: Ilustrasi: Dashboard latensi sistem p99"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ececee] dark:border-[#27272a]">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] text-xs font-bold text-[#71717a] hover:text-[#09090b] dark:hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!imageUrl.trim() || isUrlValid === false}
                className="px-5 py-2.5 rounded-[12px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] text-xs font-extrabold hover:bg-[#18181b] dark:hover:bg-zinc-200 transition-all disabled:opacity-40 flex items-center gap-2 active:scale-95 shadow-xs"
              >
                <Link2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Sisipkan Tautan Gambar</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

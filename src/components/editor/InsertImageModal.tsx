'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  Link2,
  FileImage,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  isRenderableArticleImageSource,
  serializeInlineArticleImageBlock,
  validateArticleImageSource,
  validateExternalArticleImageUrl,
} from '@/lib/article-image-block';

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
  const [uploadSourceName, setUploadSourceName] = useState('');
  const [uploadSourceUrl, setUploadSourceUrl] = useState('');
  const [sourceType, setSourceType] = useState('SELF_SHOT');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // URL State
  const [imageUrl, setImageUrl] = useState('');
  const [urlAltText, setUrlAltText] = useState('');
  const [urlCaption, setUrlCaption] = useState('');
  const [urlSourceName, setUrlSourceName] = useState('');
  const [urlSourceUrl, setUrlSourceUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const uploadControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const isUploadingRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  const uploadStatusRef = useRef<HTMLDivElement>(null);

  const resetAndClose = useCallback((force = false) => {
    if (isUploadingRef.current && !force) return;
    setActiveTab('upload');
    setSelectedFile(null);
    setFilePreview(null);
    setUploadAltText('');
    setUploadCaption('');
    setUploadSourceName('');
    setUploadSourceUrl('');
    setSourceType('SELF_SHOT');
    setImageUrl('');
    setUrlAltText('');
    setUrlCaption('');
    setUrlSourceName('');
    setUrlSourceUrl('');
    setErrorMsg(null);
    setIsUrlValid(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }, [onClose]);

  const cancelUpload = () => {
    uploadControllerRef.current?.abort();
    uploadControllerRef.current = null;
    isUploadingRef.current = false;
    setIsUploading(false);
    resetAndClose(true);
  };

  useEffect(() => {
    isUploadingRef.current = isUploading;
    if (isUploading) uploadStatusRef.current?.focus();
  }, [isUploading]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      uploadControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        resetAndClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;
      const activeIsFocusable = Array.from(focusable).includes(activeElement as HTMLElement);
      if (!activeIsFocusable) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, resetAndClose]);

  useEffect(() => {
    if (isOpen) return;
    uploadControllerRef.current?.abort();
    uploadControllerRef.current = null;
    isUploadingRef.current = false;
  }, [isOpen]);

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
    const sourceError = validateArticleImageSource(uploadSourceName, uploadSourceUrl, sourceType === 'FREE_STOCK');
    if (sourceError) {
      setErrorMsg(sourceError);
      return;
    }

    isUploadingRef.current = true;
    setIsUploading(true);
    setErrorMsg(null);
    const controller = new AbortController();
    uploadControllerRef.current = controller;

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
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }
      if (typeof data.url !== 'string' || !isRenderableArticleImageSource(data.url)) {
        throw new Error('URL hasil unggahan tidak valid');
      }

      const alt = uploadAltText.trim() ? uploadAltText : data.altText || data.originalName || 'Gambar';
      const markdown = `\n\n${serializeInlineArticleImageBlock({
        src: data.url,
        alt,
        caption: uploadCaption.trim() ? uploadCaption : undefined,
        source: uploadSourceName.trim() && uploadSourceUrl.trim()
          ? { name: uploadSourceName, url: uploadSourceUrl }
          : undefined,
      })}\n`;

      if (
        controller.signal.aborted ||
        uploadControllerRef.current !== controller ||
        !mountedRef.current ||
        !isOpenRef.current
      ) return;
      onInsert(markdown);
      resetAndClose(true);
    } catch (err: unknown) {
      if (
        uploadControllerRef.current === controller &&
        !controller.signal.aborted &&
        mountedRef.current
      ) {
        setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah berkas');
      }
    } finally {
      if (uploadControllerRef.current === controller) {
        uploadControllerRef.current = null;
        isUploadingRef.current = false;
        if (mountedRef.current) setIsUploading(false);
      }
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrlError = validateExternalArticleImageUrl(imageUrl);
    if (imageUrlError) {
      setErrorMsg(imageUrlError);
      return;
    }
    if (isUrlValid !== true) {
      setErrorMsg('Tunggu hingga pratinjau gambar berhasil dimuat');
      return;
    }
    const sourceError = validateArticleImageSource(urlSourceName, urlSourceUrl);
    if (sourceError) {
      setErrorMsg(sourceError);
      return;
    }

    const alt = urlAltText.trim() ? urlAltText : articleTitle || 'Gambar';
    const markdown = `\n\n${serializeInlineArticleImageBlock({
      src: imageUrl.trim(),
      alt,
      caption: urlCaption.trim() ? urlCaption : undefined,
      source: urlSourceName.trim() && urlSourceUrl.trim()
        ? { name: urlSourceName, url: urlSourceUrl }
        : undefined,
    })}\n`;

    onInsert(markdown);
    resetAndClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => resetAndClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="insert-image-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-xl rounded-[32px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ececee] dark:border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[12px] bg-orange-50 dark:bg-orange-950/40 text-[#ff5a00]">
              <FileImage className="w-5 h-5" />
            </div>
            <div>
              <h3 id="insert-image-title" className="text-base font-extrabold text-[#09090b] dark:text-white">
                Sisipkan Gambar ke Konten
              </h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                Tambahkan ilustrasi, diagram, atau tangkapan layar langsung ke dalam naskah artikel.
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => resetAndClose()}
            disabled={isUploading}
            aria-label="Tutup dialog sisipkan gambar"
            className="p-2 rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#71717a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#f4f4f5] dark:bg-[#27272a] rounded-[16px]">
          <button
            type="button"
            disabled={isUploading}
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
            disabled={isUploading}
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

        {isUploading && (
          <div
            ref={uploadStatusRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-3 rounded-[12px] border border-[var(--border-color)] bg-[var(--bg-card-muted)] p-3 text-xs text-[var(--text-muted)]"
          >
            <span>Mengunggah gambar...</span>
            <button
              type="button"
              onClick={cancelUpload}
              className="shrink-0 rounded-[8px] border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1.5 font-bold text-[var(--text-primary)]"
            >
              Batalkan unggahan
            </button>
          </div>
        )}

        {/* TAB 1: UPLOAD FILE */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* File Drop / Picker Zone */}
            <input
              ref={fileInputRef}
              id="article-image-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {!filePreview ? (
              <label
                htmlFor="article-image-file"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className="border-2 border-dashed border-[#ececee] dark:border-[#3f3f46] hover:border-[#ff5a00] rounded-[20px] p-6 text-center cursor-pointer transition-colors bg-[#fafafa] dark:bg-[#141416]/50 space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff5a00] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#09090b] dark:text-white">
                    Pilih gambar dari perangkat
                  </p>
                  <p className="text-[11px] text-[#71717a]">
                    JPG, PNG, GIF, WebP, SVG • Otomatis dikonversi ke WebP modern
                  </p>
                </div>
              </label>
            ) : (
              <div className="relative rounded-[20px] overflow-hidden border border-[#ececee] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#141416] p-3 flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-[12px] overflow-hidden bg-black/5 shrink-0">
                  <Image
                    src={filePreview}
                    alt="Pratinjau"
                    fill
                    unoptimized
                    sizes="64px"
                    className="object-cover"
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
                <label htmlFor="upload-alt" className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                  Deskripsi / Alt Text (Aksesibilitas &amp; SEO)
                </label>
                <input
                  type="text"
                  id="upload-alt"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="Contoh: Diagram Alur Arsitektur Microservices"
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="upload-caption" className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                  Keterangan Gambar / Caption (Opsional)
                </label>
                <input
                  type="text"
                  id="upload-caption"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Contoh: Gambar 1: Topologi cluster database dengan 3 read-replica"
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="upload-source-type" className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                  Sumber Visual (Kepatuhan Editorial)
                </label>
                <select
                  id="upload-source-type"
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white focus:outline-none"
                >
                  <option value="SELF_SHOT">Dokumentasi / Screenshot Sendiri</option>
                  <option value="FREE_STOCK">Stok Bebas Royalti (Unsplash / Pexels)</option>
                  <option value="AI_GENERATED">Ilustrasi AI Berlabel</option>
                </select>
              </div>

              <SourceFields
                idPrefix="upload"
                name={uploadSourceName}
                url={uploadSourceUrl}
                required={sourceType === 'FREE_STOCK'}
                onNameChange={setUploadSourceName}
                onUrlChange={setUploadSourceUrl}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ececee] dark:border-[#27272a]">
              <button
                type="button"
                onClick={() => resetAndClose()}
                disabled={isUploading}
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
              <label htmlFor="image-url" className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                URL Gambar Langsung (Direct Image URL)
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="image-url"
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
            {validateExternalArticleImageUrl(imageUrl) === null && (
              <div className="relative aspect-[16/9] w-full rounded-[16px] overflow-hidden bg-[#fafafa] dark:bg-[#141416] border border-[#ececee] dark:border-[#27272a]">
                <Image
                  src={imageUrl}
                  alt="Pratinjau URL"
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 576px, 100vw"
                  onLoad={() => setIsUrlValid(true)}
                  onError={() => setIsUrlValid(false)}
                  className="object-cover"
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
              <label htmlFor="url-alt" className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                Deskripsi / Alt Text
              </label>
              <input
                type="text"
                id="url-alt"
                value={urlAltText}
                onChange={(e) => setUrlAltText(e.target.value)}
                placeholder="Contoh: Tangkapan Layar Metrik Prometheus & Grafana"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="url-caption" className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
                Keterangan Gambar / Caption (Opsional)
              </label>
              <input
                type="text"
                id="url-caption"
                value={urlCaption}
                onChange={(e) => setUrlCaption(e.target.value)}
                placeholder="Contoh: Ilustrasi: Dashboard latensi sistem p99"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <SourceFields
              idPrefix="url"
              name={urlSourceName}
              url={urlSourceUrl}
              onNameChange={setUrlSourceName}
              onUrlChange={setUrlSourceUrl}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ececee] dark:border-[#27272a]">
              <button
                type="button"
                onClick={() => resetAndClose()}
                className="px-4 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] text-xs font-bold text-[#71717a] hover:text-[#09090b] dark:hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUrlValid !== true}
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

interface SourceFieldsProps {
  idPrefix: string;
  name: string;
  url: string;
  required?: boolean;
  onNameChange: (value: string) => void;
  onUrlChange: (value: string) => void;
}

function SourceFields({
  idPrefix,
  name,
  url,
  required = false,
  onNameChange,
  onUrlChange,
}: SourceFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1">
        <label htmlFor={`${idPrefix}-source-name`} className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
          Nama Sumber {required ? '(Wajib)' : '(Opsional)'}
        </label>
        <input
          id={`${idPrefix}-source-name`}
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Contoh: Unsplash"
          className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor={`${idPrefix}-source-url`} className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
          URL Sumber {required ? '(Wajib)' : '(Opsional)'}
        </label>
        <input
          id={`${idPrefix}-source-url`}
          type="url"
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder="https://..."
          className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[#ff5a00]"
        />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { AdSlot } from '@prisma/client';
import { AD_SLOT_CONFIG, getDummyAdImage, type AdSlotName } from '@/lib/ad-slots';
import { ExternalLink, Image as ImageIcon, Layout, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SlotGroup {
  id: string;
  title: string;
  description: string;
  slots: AdSlotName[];
}

const SLOT_GROUPS: SlotGroup[] = [
  {
    id: 'billboard_home',
    title: 'Billboard & Banner Beranda',
    description: 'Format billboard utama di beranda dan header publik untuk visibilitas dan dampak visual maksimal.',
    slots: ['below_hero', 'leaderboard', 'top_banner'],
  },
  {
    id: 'home_stream',
    title: 'Sidebar & In-Feed Beranda',
    description: 'Penempatan di sela-sela daftar naskah dan rel referensi sidebar "Paling Banyak Dibaca".',
    slots: ['sidebar_rail', 'in_feed'],
  },
  {
    id: 'article_detail',
    title: 'Billboard & Sidebar Halaman Artikel',
    description: 'Format iklan terkurasi di tengah konten bacaan, di bawah naskah, dan sidebar vertikal halaman detail artikel /[slug].',
    slots: ['article_mid_content', 'article_in_feed', 'sidebar_sticky'],
  },
];

export function ManualAdsForm({ initialSlots }: { initialSlots: AdSlot[] }) {
  const [slots, setSlots] = useState<AdSlot[]>(initialSlots);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function configFor(slotName: string) {
    return AD_SLOT_CONFIG[slotName as AdSlotName] ?? AD_SLOT_CONFIG.leaderboard;
  }

  async function upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'ads');
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Upload gambar gagal');
    return String(data.url);
  }

  async function save(slot: AdSlot, form: HTMLFormElement) {
    setBusy(slot.slotName);
    setMessage(null);
    try {
      const data = new FormData(form);
      const file = data.get('image');
      const imageUrl = file instanceof File && file.size > 0 ? await upload(file) : slot.imageUrl;
      const response = await fetch('/api/admin/ad-slots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotName: slot.slotName,
          title: data.get('title'),
          description: data.get('description'),
          sponsorName: data.get('sponsorName'),
          targetUrl: data.get('targetUrl'),
          ctaLabel: 'Direct Billboard',
          imageUrl,
          isActive: data.get('isActive') === 'on',
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Penyimpanan iklan gagal');
      setSlots((current) => current.map((item) => item.slotName === slot.slotName ? result.slot : item));
      setMessage({
        type: 'success',
        text: `Slot "${configFor(slot.slotName).label}" berhasil diperbarui dan ditayangkan.`,
      });
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Penyimpanan iklan gagal',
      });
    } finally {
      setBusy(null);
    }
  }

  const slotMap = new Map(slots.map((s) => [s.slotName, s]));

  const filteredGroups = activeTab === 'all'
    ? SLOT_GROUPS
    : SLOT_GROUPS.filter((g) => g.id === activeTab);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="border-b border-[var(--border-color)] pb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] font-mono text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layout className="w-3 h-3" />
            System Control / Billboard &amp; Ad Placements
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Manajemen Billboard &amp; Iklan Mandiri
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)]">
          Atur materi kreatif billboard dan iklan direct-link untuk seluruh penempatan SlashJournal. Seluruh banner berformat direct click tanpa tombol CTA tambahan. Saat slot dinonaktifkan, sistem otomatis mengaktifkan fallback dummy sponsorship terkurasi atau fallback AdSense.
        </p>

        {/* Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'bg-[var(--bg-card-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            Semua Placement ({slots.length})
          </button>
          {SLOT_GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveTab(group.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === group.id
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--bg-card-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {group.title} ({group.slots.length})
            </button>
          ))}
        </div>
      </header>

      {/* Message Alert */}
      {message && (
        <div
          role="status"
          className={`flex items-center gap-3 p-4 rounded-[16px] border text-xs sm:text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grouped Placements */}
      <div className="space-y-12">
        {filteredGroups.map((group) => {
          const groupSlots = group.slots
            .map((slotName) => slotMap.get(slotName))
            .filter((s): s is AdSlot => Boolean(s));

          return (
            <section key={group.id} className="space-y-6">
              <div className="border-b border-[var(--border-color)] pb-3">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                  <span>{group.title}</span>
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{group.description}</p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {groupSlots.map((slot) => {
                  const config = configFor(slot.slotName);
                  const isSaving = busy === slot.slotName;

                  return (
                    <form
                      key={slot.slotName}
                      onSubmit={(event) => {
                        event.preventDefault();
                        void save(slot, event.currentTarget);
                      }}
                      className="flex flex-col justify-between rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-xs space-y-5 transition-all hover:border-[var(--accent)]/40"
                    >
                      <div className="space-y-4">
                        {/* Header card */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-card-muted)] text-[10px] font-mono font-bold text-[var(--accent)] border border-[var(--border-color)]">
                              {slot.slotName}
                            </span>
                            <h3 className="mt-1.5 text-base font-bold text-[var(--text-primary)]">
                              {config.label}
                            </h3>
                            <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-muted)]">
                              {config.placement}
                            </p>
                          </div>

                          <label className="flex shrink-0 items-center gap-2 text-xs font-semibold cursor-pointer select-none bg-[var(--bg-card-muted)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">
                            <input
                              name="isActive"
                              type="checkbox"
                              defaultChecked={slot.isActive}
                              className="rounded border-[var(--border-color)] text-[var(--accent)] focus:ring-[var(--accent)]"
                            />
                            <span>{slot.isActive ? 'Aktif' : 'Nonaktif'}</span>
                          </label>
                        </div>

                        {/* Creative Billboard Preview */}
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center justify-between">
                            <span>Pratinjau Full Image Billboard:</span>
                            <span className="font-mono text-[10px]">{config.creativeWidth}×{config.creativeHeight}px</span>
                          </p>
                          <div className={`relative overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card-muted)] ${config.aspectClass} ${config.roundedClass}`}>
                            <Image
                              src={slot.imageUrl || getDummyAdImage(slot.slotName)}
                              alt={slot.imageUrl ? slot.title : 'Dummy iklan'}
                              fill
                              sizes="(max-width: 1280px) 100vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-3 pt-2">
                          <label className="block text-xs font-semibold text-[var(--text-primary)]">
                            Unggah Gambar Billboard
                            <div className="mt-1.5 flex items-center gap-2">
                              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] bg-[var(--bg-card-muted)] border border-dashed border-[var(--border-color)] hover:border-[var(--accent)] text-xs text-[var(--text-muted)] transition-colors">
                                <ImageIcon className="w-4 h-4 text-[var(--accent)] shrink-0" />
                                <span className="truncate">Pilih file baru...</span>
                                <input name="image" type="file" accept="image/*" className="hidden" />
                              </label>
                            </div>
                            <span className="mt-1 block font-normal text-[10.5px] text-[var(--text-muted)]">
                              Rekomendasi: {config.creativeWidth}×{config.creativeHeight}px WebP/PNG ≤ 200KB. Area teks otomatis disesuaikan.
                            </span>
                          </label>

                          <label className="block text-xs font-semibold text-[var(--text-primary)]">
                            Judul Billboard
                            <input
                              name="title"
                              required
                              defaultValue={slot.title}
                              placeholder="Contoh: Platform Engineering Summit 2026"
                              className="mt-1 w-full rounded-[12px] border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            />
                          </label>

                          <label className="block text-xs font-semibold text-[var(--text-primary)]">
                            Deskripsi (Opsional)
                            <textarea
                              name="description"
                              defaultValue={slot.description || ''}
                              placeholder="Deskripsi singkat kampanye atau nilai tambah sponsor..."
                              className="mt-1 min-h-[60px] w-full rounded-[12px] border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-none"
                            />
                          </label>

                          <label className="block text-xs font-semibold text-[var(--text-primary)]">
                            Nama Brand / Sponsor
                            <input
                              name="sponsorName"
                              required
                              defaultValue={slot.sponsorName}
                              placeholder="Contoh: Cloud Architecture Institute"
                              className="mt-1 w-full rounded-[12px] border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            />
                          </label>

                          <label className="block text-xs font-semibold text-[var(--text-primary)]">
                            URL Tujuan Direct Link (HTTPS)
                            <div className="relative mt-1">
                              <input
                                name="targetUrl"
                                type="url"
                                required
                                defaultValue={slot.targetUrl}
                                placeholder="https://domain-sponsor.com/landing"
                                className="w-full rounded-[12px] border border-[var(--border-color)] bg-[var(--bg-primary)] pl-3.5 pr-8 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                              />
                              <ExternalLink className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 rounded-[14px] bg-[var(--accent)] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--accent-hover)] active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Menyimpan Slot...</span>
                          </>
                        ) : (
                          <span>Simpan &amp; Terapkan Billboard</span>
                        )}
                      </button>
                    </form>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

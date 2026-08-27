'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { AdSlot } from '@prisma/client';
import { AD_SLOT_CONFIG, getDummyAdImage, type AdSlotName } from '@/lib/ad-slots';

export function ManualAdsForm({ initialSlots }: { initialSlots: AdSlot[] }) {
  const [slots, setSlots] = useState(initialSlots);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
          ctaLabel: data.get('ctaLabel'),
          imageUrl,
          isActive: data.get('isActive') === 'on',
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Penyimpanan iklan gagal');
      setSlots((current) => current.map((item) => item.slotName === slot.slotName ? result.slot : item));
      setMessage(`Slot ${configFor(slot.slotName).label} berhasil disimpan.`);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Penyimpanan iklan gagal');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <header className="border-b border-[var(--border-color)] pb-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">System Control / Manual Ads</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Komponen Iklan Manual</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">Kelola creative brand untuk lima placement internal. Gambar diunggah menjadi latar penuh komponen iklan. Saat slot nonaktif, placement memakai dummy image dan mengarah ke kontak iklan (atau fallback AdSense bila dikonfigurasi).</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        {slots.map((slot) => {
          const config = configFor(slot.slotName);
          return (
            <form key={slot.slotName} onSubmit={(event) => { event.preventDefault(); void save(slot, event.currentTarget); }} className="space-y-4 border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{config.label}</h2>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{slot.slotName}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-muted)]">{config.placement}</p>
                </div>
                <label className="flex shrink-0 items-center gap-2 text-xs"><input name="isActive" type="checkbox" defaultChecked={slot.isActive} /> Aktif</label>
              </div>
              <div className={`relative overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card-muted)] ${config.aspectClass} ${config.roundedClass}`}>
                <Image src={slot.imageUrl || getDummyAdImage(slot.slotName)} alt={slot.imageUrl ? slot.title : 'Dummy iklan'} fill sizes="(max-width: 1280px) 100vw, 33vw" className="object-cover" />
              </div>
              <label className="block text-xs font-semibold">Gambar creative (latar penuh)
                <input name="image" type="file" accept="image/*" className="mt-1 block w-full text-xs" />
                <span className="mt-1 block font-normal text-[11px] text-[var(--text-muted)]">Kreatif ideal: {config.creativeWidth}×{config.creativeHeight}px, WebP, ≤ 150 KB. Area teks overlay berada di {config.contentLayout === 'bar' ? 'sisi kiri' : 'sisi bawah'} — jaga area tersebut bersih.</span>
              </label>
              <label className="block text-xs font-semibold">Judul<input name="title" required defaultValue={slot.title} className="mt-1 w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm" /></label>
              <label className="block text-xs font-semibold">Deskripsi<textarea name="description" defaultValue={slot.description || ''} className="mt-1 min-h-20 w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm" /></label>
              <label className="block text-xs font-semibold">Nama brand<input name="sponsorName" required defaultValue={slot.sponsorName} className="mt-1 w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm" /></label>
              <label className="block text-xs font-semibold">URL tujuan HTTPS<input name="targetUrl" type="url" required defaultValue={slot.targetUrl} className="mt-1 w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm" /></label>
              <label className="block text-xs font-semibold">Label CTA<input name="ctaLabel" required defaultValue={slot.ctaLabel || 'Kunjungi Situs'} className="mt-1 w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm" /></label>
              <button type="submit" disabled={busy !== null} className="w-full bg-[var(--text-primary)] px-4 py-2.5 text-xs font-bold text-[var(--bg-primary)] disabled:opacity-50">{busy === slot.slotName ? 'Menyimpan...' : 'Simpan slot'}</button>
            </form>
          );
        })}
      </div>
      {message && <p role="status" className="text-sm text-[var(--text-muted)]">{message}</p>}
    </div>
  );
}

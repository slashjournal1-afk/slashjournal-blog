/**
 * Gerbang persetujuan AdSense.
 *
 * Selama `NEXT_PUBLIC_ADSENSE_APPROVED !== 'true'`, SEMUA unit iklan
 * (script global, <ins>, multiplex, placeholder "Pasang Iklan") harus
 * me-render `null` agar reviewer AdSense melihat situs 100% konten
 * dan tidak menandai "Konten tanpa manfaat / site made for ads".
 *
 * Cara menyalakan setelah disetujui:
 *   NEXT_PUBLIC_ADSENSE_APPROVED="true"
 *   NEXT_PUBLIC_ADSENSE_PUBLISHER_ID="ca-pub-XXXX"
 *   + slot ID per penempatan.
 */
export function isAdSenseApproved(): boolean {
  return process.env.NEXT_PUBLIC_ADSENSE_APPROVED === 'true';
}

export function getAdSensePublisherId(): string {
  // Sengaja TANPA fallback ca-pub hardcoded agar pre-approval
  // tidak menembak inventory produksi yang belum disetujui.
  return (process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '').trim();
}

export function isAdSenseRunnable(args: {
  slot?: string | null;
  publisherId?: string | null;
}): boolean {
  if (!isAdSenseApproved()) return false;
  const slot = (args.slot || '').trim();
  const publisher = (args.publisherId ?? getAdSensePublisherId()).trim();
  return slot.length > 0 && publisher.length > 0;
}

export function getAdSenseVerificationMetadata(
  rawPublisherId: string | undefined,
): Record<string, string> {
  const publisherId = (rawPublisherId ?? '').trim();

  if (!/^ca-pub-\d{16}$/.test(publisherId)) {
    return {};
  }

  return {
    'google-adsense-account': publisherId,
  };
}

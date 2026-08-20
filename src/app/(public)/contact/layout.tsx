import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontak, Koreksi, dan Kemitraan',
  description: 'Kirim koreksi teknis, pertanyaan privasi, proposal kemitraan, atau permohonan kontribusi ke SlashJournal.',
  alternates: { canonical: absoluteUrl('/contact') },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

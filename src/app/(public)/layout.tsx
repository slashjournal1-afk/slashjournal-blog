import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getNavbarCategories } from '@/lib/content-loaders';
import { TopBanner } from '@/components/ads/TopBanner';
import { TopBannerGate } from '@/components/ads/TopBannerGate';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getNavbarCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>
      <TopBannerGate>
        <TopBanner />
      </TopBannerGate>
      <Navbar categories={categories} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

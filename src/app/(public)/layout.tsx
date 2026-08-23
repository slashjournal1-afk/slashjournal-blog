import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { prisma } from '@/lib/db';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    where: { isIndexable: true },
    orderBy: { name: 'asc' },
    take: 8,
    select: { name: true, slug: true, description: true },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>
      <Navbar categories={categories} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

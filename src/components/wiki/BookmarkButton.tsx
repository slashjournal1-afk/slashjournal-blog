'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface BookmarkButtonProps {
  articleId?: string;
  docId?: string;
}

export function BookmarkButton({ articleId, docId }: BookmarkButtonProps) {
  const targetId = articleId || docId;
  const { user, openAuthModal } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !targetId) {
      setIsBookmarked(false);
      return;
    }
    fetch(`/api/bookmarks?articleId=${targetId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bookmarked !== undefined) setIsBookmarked(data.bookmarked);
      })
      .catch(() => {});
  }, [user, targetId]);

  const handleToggle = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: targetId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsBookmarked(data.bookmarked);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-semibold border transition-all ${
        isBookmarked
          ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]'
          : 'border-[#ececee] dark:border-[#27272a] text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-white bg-white dark:bg-[#18181b]'
      }`}
      title={isBookmarked ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'}
    >
      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`} />
      <span>{isBookmarked ? 'Tersimpan' : 'Bookmark'}</span>
    </button>
  );
}

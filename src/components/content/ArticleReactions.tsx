'use client';

import React, { useEffect, useState } from 'react';
import { Award, BookOpen, Layers, Lightbulb, ThumbsUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { pushDataLayer } from '@/lib/data-layer';

interface ArticleReactionsProps {
  articleId: string;
  initialCounts?: Record<string, number>;
}

interface ReactionItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const REACTIONS: ReactionItem[] = [
  { id: 'helpful', label: 'Membantu', icon: ThumbsUp },
  { id: 'insight', label: 'Wawasan Baru', icon: Lightbulb },
  { id: 'solid', label: 'Arsitektur Solid', icon: Layers },
  { id: 'practical', label: 'Praktis & Relevan', icon: Award },
  { id: 'deep-dive', label: 'Perlu Pendalaman', icon: BookOpen },
];

export function ArticleReactions({ articleId, initialCounts }: ArticleReactionsProps) {
  const [counts, setCounts] = useState<{ [key: string]: number }>(() => ({
    helpful: 0,
    insight: 0,
    solid: 0,
    practical: 0,
    'deep-dive': 0,
    ...(initialCounts || {}),
  }));

  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/feedback?articleId=${encodeURIComponent(articleId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.counts) {
          setCounts((prev) => ({ ...prev, ...data.counts }));
        }
      })
      .catch(() => {
        // Abaikan kegagalan jaringan saat fetching counts
      });

    return () => {
      active = false;
    };
  }, [articleId]);

  const handleReact = async (id: string) => {
    // Single-vote toggle: clicking the active reaction removes it locally & synchronizes to API.
    if (selected === id) {
      setSelected(null);
      setCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 1) - 1) }));
      try {
        await fetch(`/api/feedback?articleId=${encodeURIComponent(articleId)}&reaction=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
      } catch {
        // Roll back if removal failed
        setSelected(id);
        setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      }
      return;
    }

    const previous = selected;
    setSelected(id);
    setCounts((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 };
      if (previous) next[previous] = Math.max(0, (next[previous] || 1) - 1);
      return next;
    });

    // Send to API
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          isHelpful: true,
          reaction: id,
        }),
      });
      if (!response.ok) throw new Error('Feedback gagal direkam');
      pushDataLayer('article_feedback', { article_id: articleId, reaction: id });
    } catch {
      // Roll back the optimistic update so the count stays truthful.
      setSelected(previous);
      setCounts((prev) => {
        const next = { ...prev, [id]: Math.max(0, (prev[id] || 1) - 1) };
        if (previous) next[previous] = (next[previous] || 0) + 1;
        return next;
      });
    }
  };

  return (
    <div className="my-8 p-6 rounded-[20px] bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Apresiasi &amp; Reaksi Pembaca
        </h4>
        <span className="text-[11px] text-[var(--text-muted)]">
          Pilih satu reaksi yang paling sesuai
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {REACTIONS.map((item) => {
          const count = counts[item.id] || 0;
          const isActive = selected === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleReact(item.id)}
              aria-pressed={isActive}
              aria-label={`${item.label}, ${count} suara`}
              title={item.label}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[12px] border text-xs font-semibold transition-all active:scale-95 ${
                isActive
                  ? 'bg-[var(--accent-soft)] border-[var(--accent-line)] text-[var(--accent)]'
                  : 'bg-transparent border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
              <span className="font-mono tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

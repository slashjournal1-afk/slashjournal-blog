'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { pushDataLayer } from '@/lib/data-layer';

interface ArticleReactionsProps {
  articleId: string;
}

const REACTIONS = [
  { emoji: '👏', label: 'Tepuk Tangan', id: 'clap' },
  { emoji: '🚀', label: 'Arsitektur Hebat', id: 'rocket' },
  { emoji: '💡', label: 'Ide Brilian', id: 'idea' },
  { emoji: '🔥', label: 'Krusial', id: 'fire' },
  { emoji: '🧠', label: 'Wawasan Mendalam', id: 'brain' },
];

export function ArticleReactions({ articleId }: ArticleReactionsProps) {
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    clap: 12,
    rocket: 8,
    idea: 15,
    fire: 6,
    brain: 11,
  });

  const [userReactions, setUserReactions] = useState<{ [key: string]: number }>({});
  const [activeReactionAnim, setActiveReactionAnim] = useState<string | null>(null);

  const handleReact = async (id: string, emoji: string) => {
    const currentCount = userReactions[id] || 0;
    if (currentCount >= 50) return; // max 50 per reader

    setUserReactions((prev) => ({ ...prev, [id]: currentCount + 1 }));
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setActiveReactionAnim(id);

    setTimeout(() => setActiveReactionAnim(null), 600);

    // Send to API
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          isHelpful: true,
          reaction: emoji,
        }),
      });
      if (response.ok) pushDataLayer('article_feedback', { article_id: articleId, reaction: emoji });
    } catch {}
  };

  return (
    <div className="my-8 p-6 rounded-[28px] bg-[#f4f4f5]/60 dark:bg-[#18181b]/60 border border-[#ececee] dark:border-[#27272a] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
            Apresiasi &amp; Reaksi Pembaca
          </h4>
        </div>
        <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa]">
          Klik untuk memberikan apresiasi
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {REACTIONS.map((item) => {
          const count = counts[item.id] || 0;
          const userHasReacted = (userReactions[item.id] || 0) > 0;
          const isAnimating = activeReactionAnim === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleReact(item.id, item.emoji)}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-[14px] border text-xs font-bold transition-all active:scale-95 ${
                userHasReacted
                  ? 'bg-[var(--accent-soft)] border-[var(--accent-line)] text-[var(--accent)]'
                  : 'bg-white dark:bg-[#121214] border-[#ececee] dark:border-[#27272a] text-[#09090b] dark:text-white hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
              title={`${item.label} (Klik untuk menambah)`}
            >
              <span
                className={`text-base transition-transform ${
                  isAnimating ? 'scale-150 -translate-y-1' : 'group-hover:scale-110'
                }`}
              >
                {item.emoji}
              </span>
              <span className="font-mono text-xs">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

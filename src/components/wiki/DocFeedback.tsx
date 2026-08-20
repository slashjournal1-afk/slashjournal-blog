'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DocFeedbackProps {
  articleId?: string;
  docId?: string;
  initialHelpfulVotes?: number;
  initialUnhelpfulVotes?: number;
  initialHelpful?: number;
  initialUnhelpful?: number;
}

const REACTIONS = ['🚀', '💡', '❤️', '🔥', '👏'];

export function DocFeedback({
  articleId,
  docId,
  initialHelpfulVotes,
  initialUnhelpfulVotes,
  initialHelpful = 0,
  initialUnhelpful = 0,
}: DocFeedbackProps) {
  const targetId = articleId || docId;
  const { user } = useAuth();
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulVotes ?? initialHelpful);
  const [unhelpfulCount, setUnhelpfulCount] = useState(initialUnhelpfulVotes ?? initialUnhelpful);
  const [submitting, setSubmitting] = useState(false);

  const handleVote = async (isHelpful: boolean) => {
    if (voted || !targetId) return;
    setSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: targetId, isHelpful }),
      });

      setVoted(isHelpful ? 'yes' : 'no');
      if (isHelpful) setHelpfulCount((c) => c + 1);
      else setUnhelpfulCount((c) => c + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (reaction: string) => {
    if (selectedReaction === reaction || !targetId) return;
    setSelectedReaction(reaction);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: targetId, reaction, isHelpful: true }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="my-10 p-6 rounded-[28px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#09090b] dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            Apakah tulisan arsitektur ini membantu?
          </h4>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] mt-0.5">
            Umpan balik Anda membantu kami menyempurnakan kualitas materi rekayasa sistem.
          </p>
        </div>

        {/* Yes / No Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleVote(true)}
            disabled={submitting || voted !== null}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] text-xs font-semibold border transition-all ${
              voted === 'yes'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 font-bold'
                : 'border-[#ececee] dark:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:border-emerald-500 hover:text-emerald-600 bg-[#f4f4f5] dark:bg-[#27272a]'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Ya ({helpfulCount})</span>
          </button>

          <button
            onClick={() => handleVote(false)}
            disabled={submitting || voted !== null}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] text-xs font-semibold border transition-all ${
              voted === 'no'
                ? 'bg-red-500/10 border-red-500 text-red-600 font-bold'
                : 'border-[#ececee] dark:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:border-red-500 hover:text-red-600 bg-[#f4f4f5] dark:bg-[#27272a]'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Tidak ({unhelpfulCount})</span>
          </button>
        </div>
      </div>

      {/* Emoji Reactions Bar */}
      <div className="pt-3 border-t border-[#ececee] dark:border-[#27272a] flex flex-wrap items-center justify-between gap-3 text-xs text-[#71717a] dark:text-[#a1a1aa]">
        <span>Berikan reaksi cepat:</span>
        <div className="flex items-center gap-1.5">
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className={`px-2.5 py-1 rounded-[10px] text-base border transition-transform hover:scale-110 active:scale-95 ${
                selectedReaction === emoji
                  ? 'bg-[var(--accent-soft)] border-[var(--accent)] scale-110'
                  : 'bg-[#f4f4f5] dark:bg-[#27272a] border-[#ececee] dark:border-[#3f3f46]'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

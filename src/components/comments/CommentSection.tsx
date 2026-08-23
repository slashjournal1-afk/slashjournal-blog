'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime } from '@/lib/utils';
import { MessageSquare, Send, Trash2, LogIn, AlertCircle } from 'lucide-react';
import { pushDataLayer } from '@/lib/data-layer';

interface CommentData {
  id: string;
  content: string;
  createdAt: string | Date;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    role: string;
  };
}

interface CommentSectionProps {
  articleId?: string;
  docId?: string;
  initialComments: CommentData[];
}

export function CommentSection({ articleId, docId, initialComments }: CommentSectionProps) {
  const targetId = articleId || docId;
  const { user, openAuthModal } = useAuth();
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!targetId) return;
    const controller = new AbortController();
    fetch(`/api/comments?articleId=${encodeURIComponent(targetId)}`, { signal: controller.signal })
      .then((res) => res.ok ? res.json() : { comments: [] })
      .then((data) => setComments(data.comments || []))
      .catch(() => {});
    return () => controller.abort();
  }, [targetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }

    if (!content.trim()) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: targetId, content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim komentar');

      if (data.comment) {
        setComments([data.comment, ...comments]);
        setContent('');
        pushDataLayer('comment_submit', { article_id: targetId });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Hapus komentar ini?')) return;

    try {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="my-12 space-y-8 pt-8 border-t border-[#ececee] dark:border-[#27272a]">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#09090b] dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--accent)]" />
          <span>Diskusi &amp; Catatan Teknis ({comments.length})</span>
        </h3>
        <span className="text-xs text-[#71717a] dark:text-[#a1a1aa] flex items-center gap-1">
          <LogIn className="w-3.5 h-3.5 text-emerald-500" />
          Login diperlukan
        </span>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-[14px] bg-[var(--danger-soft)] border border-[var(--danger)]/30 text-[var(--danger)] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="p-5 rounded-[24px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] shadow-sm">
          {user ? (
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#ececee] dark:border-[#27272a] text-xs text-[#71717a] dark:text-[#a1a1aa]">
              <span className="font-bold text-[#09090b] dark:text-white">{user.displayName}</span>
              <span>•</span>
              <span className="text-[var(--accent)] font-semibold">{user.role}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#ececee] dark:border-[#27272a] text-xs text-[#71717a] dark:text-[#a1a1aa]">
              <span>Masuk untuk mengirim catatan arsitektur</span>
              <button
                type="button"
                onClick={openAuthModal}
                className="text-[var(--accent)] font-bold hover:underline"
              >
                Masuk / Daftar
              </button>
            </div>
          )}

          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => {
              if (!user) openAuthModal();
            }}
            placeholder={
              user
                ? 'Bagikan tanggapan teknis, pertanyaan implementasi, atau studi kasus...'
                : 'Klik di sini dan masuk untuk berpartisipasi dalam diskusi...'
            }
            className="w-full border-none bg-transparent p-0 focus:outline-none text-xs leading-relaxed resize-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />

          <div className="flex items-center justify-between pt-3 border-t border-[#ececee] dark:border-[#27272a] mt-2">
            <span className="text-[11px] text-[var(--text-muted)]">
              Markdown format didukung
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-4 py-2 rounded-[12px] bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--text-secondary)] text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Mengirim...' : 'Kirim Catatan'}
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((c) => {
          const canDelete =
            user && (user.id === c.user.id || user.role === 'ADMIN' || user.role === 'EDITOR');

          return (
            <div
              key={c.id}
              className="p-5 rounded-[22px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] space-y-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs text-[#71717a]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center font-bold text-[10px]">
                    {c.user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-[#09090b] dark:text-white">
                    {c.user.displayName}
                  </span>
                  {c.user.role !== 'READER' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-soft)] text-[var(--accent)]">
                      {c.user.role}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <time>{formatDateTime(c.createdAt)}</time>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-[#71717a] hover:text-red-500 transition-colors p-1"
                      title="Hapus Komentar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-[#09090b] dark:text-white leading-relaxed whitespace-pre-wrap pl-8">
                {c.content}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

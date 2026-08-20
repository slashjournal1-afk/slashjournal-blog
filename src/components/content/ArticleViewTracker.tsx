'use client';

import { useEffect } from 'react';

export function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    const key = `slashjournal:view:${articleId}`;
    if (sessionStorage.getItem(key)) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/articles/${articleId}/view`, { method: 'POST', signal: controller.signal, keepalive: true })
        .then((response) => { if (response.ok) sessionStorage.setItem(key, '1'); })
        .catch(() => {});
    }, 2000);

    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [articleId]);

  return null;
}

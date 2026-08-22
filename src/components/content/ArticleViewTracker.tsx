'use client';

import { useEffect } from 'react';
import { pushDataLayer } from '@/lib/data-layer';

interface ArticleViewTrackerProps {
  articleId: string;
  articleSlug?: string;
  articleTitle?: string;
  articleCategory?: string;
  articleSeries?: string | null;
}

export function ArticleViewTracker({ articleId, articleSlug, articleTitle, articleCategory, articleSeries }: ArticleViewTrackerProps) {
  useEffect(() => {
    const key = `slashjournal:view:${articleId}`;
    if (sessionStorage.getItem(key)) return;

    const controller = new AbortController();
    let scrollTracked = false;
    const trackScrollDepth = () => {
      if (scrollTracked) return;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0 || window.scrollY / scrollableHeight < 0.9) return;
      scrollTracked = true;
      pushDataLayer('article_scroll_90', { article_id: articleId, article_slug: articleSlug, article_category: articleCategory });
      window.removeEventListener('scroll', trackScrollDepth);
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    const timer = window.setTimeout(() => {
      fetch(`/api/articles/${articleId}/view`, { method: 'POST', signal: controller.signal, keepalive: true })
        .then((response) => {
          if (!response.ok) return;
          sessionStorage.setItem(key, '1');
          pushDataLayer('article_view', { article_id: articleId, article_slug: articleSlug, article_title: articleTitle, article_category: articleCategory, article_series: articleSeries || undefined });
        })
        .catch(() => {});
    }, 2000);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
      window.removeEventListener('scroll', trackScrollDepth);
    };
  }, [articleId]);

  return null;
}

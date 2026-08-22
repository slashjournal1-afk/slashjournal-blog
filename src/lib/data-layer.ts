export type AnalyticsEvent =
  | 'article_view'
  | 'article_scroll_90'
  | 'site_search'
  | 'zero_result_search'
  | 'bookmark_add'
  | 'article_feedback'
  | 'comment_submit'
  | 'newsletter_subscribe'
  | 'login'
  | 'sign_up'
  | 'ad_impression';

export function pushDataLayer(event: AnalyticsEvent, parameters: Record<string, string | number | undefined> = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...Object.fromEntries(Object.entries(parameters).filter(([, value]) => value !== undefined && value !== '')),
  });
}

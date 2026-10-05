/**
 * Share & Deep-Linking Utility for EconMatrix Articles
 * Ensures that when an article is shared via WhatsApp, Twitter/X, or direct link:
 * 1. The link uniquely identifies THAT EXACT article.
 * 2. When the recipient clicks the link, EconMatrix immediately opens that exact article.
 * 3. Works seamlessly on both mobile (WhatsApp app) and desktop (WhatsApp Web).
 */

export interface ShareableArticle {
  article_id: number | string;
  slug?: string;
  title: string;
  deck?: string;
  featured_image_url?: string;
}

/**
 * Returns the canonical, direct share URL for an article.
 * Format: https://domain.com/?article=<slug_or_id>
 */
export const getArticleShareUrl = (article: { article_id: number | string; slug?: string }): string => {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const param = article.slug || String(article.article_id);
  return `${origin}/?article=${encodeURIComponent(param)}`;
};

/**
 * Returns a human-friendly direct path URL for an article (e.g. /story/:slug)
 */
export const getArticlePathUrl = (article: { article_id: number | string; slug?: string }): string => {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const param = article.slug || String(article.article_id);
  return `${origin}/story/${encodeURIComponent(param)}`;
};

/**
 * Builds the official WhatsApp share URL.
 * Includes clean title and direct article link on separate lines so WhatsApp displays
 * both the headline and unfurls the link preview card cleanly.
 */
export const getWhatsAppShareUrl = (article: ShareableArticle): string => {
  const shareUrl = getArticleShareUrl(article);
  const text = `${article.title}\n\nRead full story on EconMatrix:\n${shareUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
};

/**
 * Builds the X / Twitter share URL.
 */
export const getTwitterShareUrl = (article: ShareableArticle): string => {
  const shareUrl = getArticleShareUrl(article);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`;
};

/**
 * Copies the exact article link to clipboard.
 * Supports modern Clipboard API with legacy fallback.
 */
export const copyArticleShareUrl = async (article: { article_id: number | string; slug?: string }): Promise<boolean> => {
  const shareUrl = getArticleShareUrl(article);
  if (!shareUrl) return false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    }
  } catch {
    // continue to fallback
  }

  try {
    const el = document.createElement('textarea');
    el.value = shareUrl;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.top = '-9999px';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.focus();
    el.select();
    const success = document.execCommand('copy');
    document.body.removeChild(el);
    return success;
  } catch {
    return false;
  }
};

/**
 * Triggers native system share dialog (e.g. on mobile iOS / Android) if available,
 * falling back to copying link or opening WhatsApp directly.
 */
export const shareArticleNativeOrCopy = async (article: ShareableArticle): Promise<'shared' | 'copied' | 'failed'> => {
  const shareUrl = getArticleShareUrl(article);
  if (typeof navigator !== 'undefined' && (navigator as any).share) {
    try {
      await (navigator as any).share({
        title: article.title,
        text: article.title,
        url: shareUrl,
      });
      return 'shared';
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return 'failed';
      }
      // If native share fails or cancelled, fallback to copy
    }
  }

  const copied = await copyArticleShareUrl(article);
  return copied ? 'copied' : 'failed';
};

/**
 * Extracts the article identifier (slug or article_id) from the current window location.
 * Recognizes:
 * - Query params: ?article=..., ?story=..., ?id=...
 * - Pathnames: /story/:slug, /article/:id
 */
export const getArticleIdentifierFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Check query parameters (?article=..., ?story=..., ?id=...)
    const params = new URLSearchParams(window.location.search);
    const param = params.get('article') || params.get('story') || params.get('id');
    if (param && param.trim()) {
      return decodeURIComponent(param.trim());
    }

    // 2. Check pathnames (/story/:slug or /article/:id)
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/(?:story|article)\/([^/?#]+)/i);
    if (match && match[1]) {
      return decodeURIComponent(match[1].trim());
    }
  } catch {
    return null;
  }

  return null;
};

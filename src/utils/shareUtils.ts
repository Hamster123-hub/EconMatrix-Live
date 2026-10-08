/**
 * Share & Deep-Linking Utility for EconMatrix Articles
 * Ensures that when an article is shared via WhatsApp, Twitter/X, or direct link:
 * 1. The link uniquely identifies THAT EXACT article (both slug & immutable ID).
 * 2. When the recipient clicks the link, EconMatrix immediately opens that exact article.
 * 3. Works seamlessly on both mobile (WhatsApp native app) and desktop (WhatsApp Web).
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
 * Always includes both the SEO slug and the permanent immutable numeric ID
 * Format: https://domain.com/?article=<slug>&id=<article_id>
 */
export const getArticleShareUrl = (article: { article_id: number | string; slug?: string }): string => {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const idStr = String(article.article_id);
  const slugStr = article.slug ? article.slug.trim() : '';

  if (slugStr && slugStr !== idStr) {
    return `${origin}/?article=${encodeURIComponent(slugStr)}&id=${encodeURIComponent(idStr)}`;
  }
  return `${origin}/?article=${encodeURIComponent(idStr)}&id=${encodeURIComponent(idStr)}`;
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
 * Uses the universal 'https://wa.me/?text=...' standard, which automatically:
 * - Launches native WhatsApp on iOS and Android smartphones without extra dialogs.
 * - Opens WhatsApp Web or WhatsApp Desktop on desktop browsers.
 * Formats the headline in WhatsApp bold (*Title*) followed by the direct link on its own line
 * to ensure WhatsApp generates a full rich card preview with thumbnail.
 */
export const getWhatsAppShareUrl = (article: ShareableArticle): string => {
  const shareUrl = getArticleShareUrl(article);
  const title = (article.title || '').trim();
  const text = `*${title}*\n\nRead full story on EconMatrix:\n${shareUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

/**
 * Direct action to trigger WhatsApp sharing with mobile/desktop intelligence.
 * Prevents navigation bugs and handles app-switching smoothly.
 */
export const openWhatsAppShare = (article: ShareableArticle): void => {
  if (typeof window === 'undefined') return;
  const shareUrl = getArticleShareUrl(article);
  const title = (article.title || '').trim();
  const text = `*${title}*\n\nRead full story on EconMatrix:\n${shareUrl}`;
  const encodedText = encodeURIComponent(text);

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    // Open wa.me directly which mobile OS intercepts to open native WhatsApp app
    window.location.href = `https://wa.me/?text=${encodedText}`;
  } else {
    // Desktop: open WhatsApp Web in new tab
    window.open(`https://wa.me/?text=${encodedText}`, '_blank', 'noopener,noreferrer');
  }
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

export interface ArticleUrlIdentifiers {
  id?: string | null;
  slug?: string | null;
  primaryKey: string | null;
}

/**
 * Returns all potential article identifiers present in the current URL:
 * - Specific ID parameter (e.g. ?id=1791095288704)
 * - Specific Slug parameter (e.g. ?article=hambantota-port...)
 * - Pathnames and hashes
 */
export const getArticleUrlIdentifiers = (): ArticleUrlIdentifiers => {
  if (typeof window === 'undefined') {
    return { id: null, slug: null, primaryKey: null };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id') || params.get('article_id');
    const slugParam = params.get('article') || params.get('story') || params.get('slug') || params.get('news');

    let cleanId = idParam && idParam.trim() ? decodeURIComponent(idParam.trim()) : null;
    let cleanSlug = slugParam && slugParam.trim() ? decodeURIComponent(slugParam.trim()) : null;

    // Check hash (#article=... or #1791095288704 or #/story/slug)
    if (window.location.hash) {
      const hashStr = window.location.hash.replace(/^#\/?/, '');
      if (hashStr.includes('=') || hashStr.includes('?')) {
        const hashParams = new URLSearchParams(hashStr.includes('?') ? hashStr.split('?')[1] : hashStr);
        const hashId = hashParams.get('id') || hashParams.get('article_id');
        const hashSlug = hashParams.get('article') || hashParams.get('story') || hashParams.get('slug');
        if (hashId && !cleanId) cleanId = decodeURIComponent(hashId.trim());
        if (hashSlug && !cleanSlug) cleanSlug = decodeURIComponent(hashSlug.trim());
      }
      const hashMatch = hashStr.match(/^(?:story|article|news)\/([^/?#]+)/i);
      if (hashMatch && hashMatch[1] && !cleanSlug) {
        cleanSlug = decodeURIComponent(hashMatch[1].trim());
      }
      if (/^\d{3,20}$/.test(hashStr) && !cleanId) {
        cleanId = hashStr;
      }
    }

    // Check pathnames (/story/:slug or /article/:id or /news/:slug)
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/(?:story|article|news)\/([^/?#]+)/i);
    if (match && match[1] && !cleanSlug && !cleanId) {
      const pathParam = decodeURIComponent(match[1].trim());
      if (/^\d{3,20}$/.test(pathParam)) {
        cleanId = pathParam;
      } else {
        cleanSlug = pathParam;
      }
    }

    const primaryKey = cleanId || cleanSlug || null;
    return { id: cleanId, slug: cleanSlug, primaryKey };
  } catch {
    return { id: null, slug: null, primaryKey: null };
  }
};

/**
 * Extracts the single primary article identifier from current location.
 */
export const getArticleIdentifierFromUrl = (): string | null => {
  const ids = getArticleUrlIdentifiers();
  return ids.id || ids.slug || ids.primaryKey || null;
};

/**
 * Helper to match an article from an array using all URL keys.
 */
export const findMatchingArticle = <T extends { article_id: string | number; slug?: string; title?: string }>(
  articlesList: T[],
  identifiers: ArticleUrlIdentifiers
): T | null => {
  const { id, slug, primaryKey } = identifiers;
  if (!id && !slug && !primaryKey) return null;

  return articlesList.find((a) => {
    const aId = String(a.article_id);
    const aSlug = (a.slug || '').toLowerCase();
    const aSlugClean = aSlug.replace(/[^a-z0-9]/g, '');

    // 1. Exact numeric ID match
    if (id && aId === id) return true;

    // 2. Exact slug or slug-without-hyphens match
    if (slug) {
      const slugLower = slug.toLowerCase();
      const slugClean = slugLower.replace(/[^a-z0-9]/g, '');
      if (aSlug === slugLower || aId === slug) return true;
      if (slugClean && aSlugClean === slugClean) return true;
      if (a.title && a.title.toLowerCase() === slugLower) return true;
    }

    // 3. Fallback match with primaryKey
    if (primaryKey) {
      const pkLower = primaryKey.toLowerCase();
      const pkClean = pkLower.replace(/[^a-z0-9]/g, '');
      if (aId === primaryKey || aSlug === pkLower) return true;
      if (pkClean && aSlugClean === pkClean) return true;
      if (a.title && a.title.toLowerCase() === pkLower) return true;
    }

    return false;
  }) || null;
};

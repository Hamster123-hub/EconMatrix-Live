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
 * Production Cloud Run public URL used when running locally or in iframes
 * Ensures WhatsApp's external web scrapers (which cannot access localhost)
 * can crawl the OpenGraph tags and render the full article card with featured image.
 */
export const DEFAULT_PUBLIC_APP_URL = 'https://ais-dev-dhktrs3fzxd26b6vtickgs-381884245174.asia-east1.run.app';

/**
 * Returns the effective base origin for sharing.
 * If running on localhost or private network, guarantees a live publicly crawlable domain.
 */
export const getArticleShareOrigin = (): string => {
  if (typeof window === 'undefined') return DEFAULT_PUBLIC_APP_URL;
  const hostname = window.location.hostname;
  const isLocalOrPrivate =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local') ||
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);

  const envUrl = (import.meta as any).env?.VITE_APP_URL;
  if (isLocalOrPrivate) {
    if (envUrl && typeof envUrl === 'string' && envUrl.startsWith('http')) {
      return envUrl.replace(/\/+$/, '');
    }
    return DEFAULT_PUBLIC_APP_URL;
  }
  return window.location.origin;
};

/**
 * Returns the canonical, direct share URL for an article.
 * Always includes both the SEO slug and the permanent immutable numeric ID
 * Format: https://domain.com/story/<slug>
 */
export const getArticleShareUrl = (article: { article_id: number | string; slug?: string }): string => {
  if (typeof window === 'undefined') return '';
  const origin = getArticleShareOrigin();
  const param = article.slug ? article.slug.trim() : String(article.article_id);
  return `${origin}/story/${encodeURIComponent(param)}`;
};

/**
 * Returns a human-friendly direct path URL for an article (e.g. /story/:slug)
 */
export const getArticlePathUrl = (article: { article_id: number | string; slug?: string }): string => {
  if (typeof window === 'undefined') return '';
  const origin = getArticleShareOrigin();
  const param = article.slug ? article.slug.trim() : String(article.article_id);
  return `${origin}/story/${encodeURIComponent(param)}`;
};

/**
 * Robustly retrieves the article's featured image as a Blob and File object.
 * Handles:
 * 1. Base64 data URIs
 * 2. Uploaded / local server images
 * 3. Remote HTTP/HTTPS images (with proxy fallback to prevent CORS blocks)
 * 4. Dedicated server-side binary endpoint /api/articles/:id/og-image
 */
export const getArticleImageBlob = async (
  article: ShareableArticle
): Promise<{ blob: Blob; filename: string } | null> => {
  if (typeof window === 'undefined') return null;

  const rawUrl = (article.featured_image_url || '').trim();
  const slugOrId = article.slug || String(article.article_id);
  const fallbackEndpoint = `/api/articles/${encodeURIComponent(slugOrId)}/og-image`;

  // 1. Base64 Data URI
  if (rawUrl.startsWith('data:image/')) {
    try {
      const parts = rawUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
      const blob = new Blob([u8arr], { type: mime });
      return { blob, filename: `lankaecon-${article.article_id}.${ext}` };
    } catch (e) {
      console.warn('[ShareUtils] Failed to parse base64 image:', e);
    }
  }

  // 2. Fetch URLs to try
  const urlsToTry: string[] = [];
  if (rawUrl.startsWith('/uploads/') || rawUrl.startsWith('/')) {
    urlsToTry.push(rawUrl);
  } else if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    urlsToTry.push(rawUrl);
    urlsToTry.push(`/api/share/image-proxy?url=${encodeURIComponent(rawUrl)}`);
  }
  urlsToTry.push(fallbackEndpoint);

  for (const candidate of urlsToTry) {
    try {
      const res = await fetch(candidate, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 100) {
          const mime = blob.type || 'image/jpeg';
          const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
          return { blob, filename: `lankaecon-${article.article_id}.${ext}` };
        }
      }
    } catch {}
  }

  return null;
};

/**
 * Converts any image Blob to PNG format for system Clipboard API compatibility.
 */
export const convertBlobToPng = async (blob: Blob): Promise<Blob> => {
  if (blob.type === 'image/png') return blob;
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 630;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((b) => resolve(b || blob), 'image/png');
      } else {
        resolve(blob);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(blob);
    };
    img.src = url;
  });
};

/**
 * Copies the story image directly to the user's system clipboard (PNG format).
 */
export const copyArticleImageToClipboard = async (article: ShareableArticle): Promise<boolean> => {
  try {
    const imgData = await getArticleImageBlob(article);
    if (!imgData) return false;
    const pngBlob = await convertBlobToPng(imgData.blob);
    if (typeof navigator !== 'undefined' && navigator.clipboard && (navigator.clipboard as any).write) {
      await (navigator.clipboard as any).write([
        new ClipboardItem({ 'image/png': pngBlob }),
      ]);
      return true;
    }
  } catch (e) {
    console.warn('[ShareUtils] Clipboard image write notice:', e);
  }
  return false;
};

/**
 * Builds the official WhatsApp share URL.
 * Uses the universal 'https://wa.me/?text=...' standard.
 */
export const getWhatsAppShareUrl = (article: ShareableArticle): string => {
  const shareUrl = getArticlePathUrl(article);
  const title = (article.title || '').trim();
  const deck = (article.deck || '').trim();
  const text = `*${title}*${deck ? `\n\n_${deck}_` : ''}\n\n${shareUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

export interface WhatsAppShareNotification {
  article: ShareableArticle;
  shareUrl: string;
  hasCopiedImage: boolean;
  imageBlobUrl?: string;
  method: 'native_file_share' | 'clipboard_and_web';
}

/**
 * Complete WhatsApp Sharing Solution:
 * When the WhatsApp logo is clicked:
 * 1. Mobile (iOS Safari / Android Chrome): Launches native share sheet with the actual image File attached,
 *    so WhatsApp opens in image-sharing mode with the headline and link as the image caption.
 * 2. Desktop (WhatsApp Web): Copies the image directly to system clipboard, opens WhatsApp Web
 *    with the story text and public link, and shows an instant floating banner with image preview and 1-click controls.
 */
export const shareArticleToWhatsApp = async (article: ShareableArticle): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  const shareUrl = getArticlePathUrl(article);
  const title = (article.title || '').trim();
  const deck = (article.deck || '').trim();
  const caption = `*${title}*${deck ? `\n\n_${deck}_` : ''}\n\n📰 Read full story: ${shareUrl}`;
  const encodedText = encodeURIComponent(caption);
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Retrieve story image binary
  const imgData = await getArticleImageBlob(article);
  let file: File | null = null;
  if (imgData) {
    file = new File([imgData.blob], imgData.filename, { type: imgData.blob.type || 'image/jpeg' });
  }

  // 1. Native Web Share API with Files (Standard for mobile phones)
  if (file && typeof navigator !== 'undefined' && (navigator as any).share && (navigator as any).canShare) {
    try {
      if ((navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({
          title,
          text: caption,
          files: [file],
        });
        return true;
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // User dismissed the share sheet voluntarily
        return true;
      }
      console.warn('[ShareUtils] Native file share notice:', err);
    }
  }

  // 2. Desktop / WhatsApp Web workflow
  let hasCopiedImage = false;
  let imageBlobUrl: string | undefined;

  if (imgData) {
    imageBlobUrl = URL.createObjectURL(imgData.blob);
    try {
      const pngBlob = await convertBlobToPng(imgData.blob);
      if (typeof navigator !== 'undefined' && navigator.clipboard && (navigator.clipboard as any).write) {
        await (navigator.clipboard as any).write([
          new ClipboardItem({ 'image/png': pngBlob }),
        ]);
        hasCopiedImage = true;
      }
    } catch (clipErr) {
      console.warn('[ShareUtils] Clipboard copy image not allowed:', clipErr);
    }
  }

  // Open WhatsApp
  if (isMobile) {
    window.location.href = `https://wa.me/?text=${encodedText}`;
  } else {
    window.open(`https://web.whatsapp.com/send?text=${encodedText}`, '_blank', 'noopener,noreferrer');
  }

  // Trigger floating toast notification with image preview and paste instruction
  try {
    window.dispatchEvent(
      new CustomEvent('whatsapp-share-notify', {
        detail: {
          article,
          shareUrl,
          hasCopiedImage,
          imageBlobUrl,
          method: 'clipboard_and_web',
        } as WhatsAppShareNotification,
      })
    );
  } catch {}

  return true;
};

/**
 * Universal action when WhatsApp button or logo is clicked.
 * Guaranteed to share the image along with the article.
 */
export const openWhatsAppShare = (article: ShareableArticle): void => {
  shareArticleToWhatsApp(article);
};

/**
 * Direct file sharing helper (alias for shareArticleToWhatsApp)
 */
export const shareArticleImageDirect = async (article: ShareableArticle): Promise<boolean> => {
  return shareArticleToWhatsApp(article);
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

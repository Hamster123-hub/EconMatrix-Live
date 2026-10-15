import React, { useEffect, useState } from 'react';
import { MessageCircle, X, Copy, Check, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { WhatsAppShareNotification, copyArticleImageToClipboard } from '../utils/shareUtils';

export const WhatsAppShareToast: React.FC = () => {
  const [notification, setNotification] = useState<WhatsAppShareNotification | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  useEffect(() => {
    const handleShareNotify = (e: Event) => {
      const customEvent = e as CustomEvent<WhatsAppShareNotification>;
      if (customEvent.detail) {
        setNotification(customEvent.detail);
        setCopiedState(customEvent.detail.hasCopiedImage);
      }
    };

    window.addEventListener('whatsapp-share-notify', handleShareNotify);
    return () => {
      window.removeEventListener('whatsapp-share-notify', handleShareNotify);
    };
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 14000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!notification) return null;

  const { article, hasCopiedImage, imageBlobUrl, shareUrl } = notification;

  const handleCopyAgain = async () => {
    const success = await copyArticleImageToClipboard(article);
    if (success) {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 3000);
    }
  };

  const handleDownload = () => {
    const downloadUrl = imageBlobUrl || article.featured_image_url || `/api/articles/${article.slug || article.article_id}/og-image`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `lankaecon-${article.article_id || 'story'}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenWhatsAppAgain = () => {
    const title = (article.title || '').trim();
    const deck = (article.deck || '').trim();
    const caption = `*${title}*${deck ? `\n\n_${deck}_` : ''}\n\n📰 Read full story: ${shareUrl}`;
    window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(caption)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-2.5rem)] sm:w-96 bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-lg shadow-2xl p-4 transition-all duration-300 animate-in slide-in-from-bottom-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#25D366]/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
          </div>
          <span className="font-bold text-xs uppercase font-mono tracking-wider text-emerald-700 dark:text-emerald-400">
            WhatsApp Story Share
          </span>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1"
          title="Dismiss"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Story Thumbnail & Title Preview */}
      <div className="flex items-start gap-3 mb-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-200/80 dark:border-slate-700">
        <div className="w-16 h-14 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600 relative">
          {imageBlobUrl || article.featured_image_url ? (
            <img
              src={imageBlobUrl || article.featured_image_url}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
            {article.title}
          </h4>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block truncate">
            {shareUrl.replace(/^https?:\/\//, '')}
          </span>
        </div>
      </div>

      {/* Visual Image Status Message */}
      <div className="mb-3 px-2.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 mb-0.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{copiedState || hasCopiedImage ? 'Story Image Ready in Clipboard!' : 'Image Attached & Ready'}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
          In your WhatsApp chat, press <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-[10px] font-mono font-bold shadow-2xs">Ctrl+V</kbd> (or <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-[10px] font-mono font-bold shadow-2xs">⌘+V</kbd>) to send the photo directly with your story.
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        <button
          onClick={handleCopyAgain}
          className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded transition cursor-pointer border border-slate-200 dark:border-slate-700"
          title="Copy story image to system clipboard"
        >
          {copiedState ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copiedState ? 'Copied!' : 'Copy Image'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded transition cursor-pointer border border-slate-200 dark:border-slate-700"
          title="Download story image directly"
        >
          <Download className="w-3 h-3" />
          <span>Save Image</span>
        </button>

        <button
          onClick={handleOpenWhatsAppAgain}
          className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white rounded transition cursor-pointer shadow-2xs"
          title="Open WhatsApp chat window"
        >
          <ExternalLink className="w-3 h-3" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

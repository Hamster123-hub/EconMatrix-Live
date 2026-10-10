import React, { useState, useEffect, useRef } from 'react';
import { Link2, ExternalLink, FileText, Check, X, Newspaper, Search } from 'lucide-react';

interface HyperlinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  onInsert: (text: string, url: string) => void;
}

export const HyperlinkModal: React.FC<HyperlinkModalProps> = ({
  isOpen,
  onClose,
  initialText,
  onInsert,
}) => {
  const [displayText, setDisplayText] = useState(initialText);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'stories'>('url');
  const [publishedArticles, setPublishedArticles] = useState<Array<{ article_id: number | string; title: string; primary_category?: string }>>([]);
  const [detectedStory, setDetectedStory] = useState<{ article_id: number | string; title: string; primary_category?: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const urlInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayText(initialText || '');
      setUrl('');
      setError('');
      setDetectedStory(null);
      setActiveTab('url');
      setSearchTerm('');

      // Fetch published articles
      fetch('/api/articles')
        .then((r) => r.json())
        .then((data) => {
          const list = Array.isArray(data.articles) ? data.articles : Array.isArray(data) ? data : [];
          if (list.length > 0) setPublishedArticles(list);
        })
        .catch(() => {});

      // Focus URL if text already selected, else focus text input
      setTimeout(() => {
        if (initialText && initialText.trim().length > 0) {
          urlInputRef.current?.focus();
        } else {
          textInputRef.current?.focus();
        }
      }, 50);
    }
  }, [isOpen, initialText]);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (error) setError('');
    const clean = newUrl.trim();
    if (!clean) {
      setDetectedStory(null);
      return;
    }

    const storyMatch = clean.match(/(?:\/story\/|\/article\/|\/news\/|\?article=|\?story=|\?id=)([^/?#&\s]+)/i);
    const candidate = storyMatch ? decodeURIComponent(storyMatch[1].trim()) : clean.replace(/^https?:\/\/[^/]+\/?/i, '').replace(/^\/+/, '');
    const numPrefix = candidate.match(/^(\d{10,})/)?.[1];

    if (publishedArticles.length > 0) {
      const candLower = candidate.toLowerCase();
      const match = publishedArticles.find((a) => {
        const aId = String(a.article_id);
        return aId === candidate || (numPrefix && aId === numPrefix) || a.title.toLowerCase() === candLower || (candLower.length > 8 && a.title.toLowerCase().includes(candLower));
      });
      if (match) {
        setDetectedStory(match);
        if (!displayText.trim() || (detectedStory && displayText === detectedStory.title)) {
          setDisplayText(match.title);
        }
        return;
      }
    }
    setDetectedStory(null);
  };

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    const cleanText = displayText.trim();
    let cleanUrl = url.trim();

    if (!cleanUrl) {
      setError('Please provide a document or website URL, or select an article.');
      return;
    }

    const siteStoryMatch = cleanUrl.match(/(?:https?:\/\/[^/]+)?(\/(?:story|article|news)\/[^/?#\s]+)/i);
    const bareStoryMatch = cleanUrl.match(/^(?:story|article|news)\/([^/?#\s]+)/i);
    const numericIdMatch = cleanUrl.match(/^(\d{10,})$/);

    if (siteStoryMatch && siteStoryMatch[1]) {
      cleanUrl = siteStoryMatch[1];
    } else if (bareStoryMatch && bareStoryMatch[1]) {
      cleanUrl = `/story/${bareStoryMatch[1]}`;
    } else if (numericIdMatch && numericIdMatch[1]) {
      cleanUrl = `/story/${numericIdMatch[1]}`;
    } else if (detectedStory) {
      cleanUrl = `/story/${detectedStory.article_id}`;
    } else if (
      !cleanUrl.startsWith('http://') &&
      !cleanUrl.startsWith('https://') &&
      !cleanUrl.startsWith('#') &&
      !cleanUrl.startsWith('/') &&
      !cleanUrl.startsWith('mailto:') &&
      !cleanUrl.startsWith('tel:')
    ) {
      cleanUrl = 'https://' + cleanUrl;
    }

    const finalText = cleanText || (detectedStory ? detectedStory.title : cleanUrl);

    onInsert(finalText, cleanUrl);
    onClose();
  };

  const isDoc = url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('drive.google.com') || url.toLowerCase().includes('docs.google.com');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white border-2 border-slate-900 w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 rounded-sm"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B1E36] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide uppercase">
                Insert Document / Web Hyperlink
              </h3>
              <p className="text-[10px] text-slate-300 font-mono">
                Attach source reports, PDFs, external links, or published articles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-bold bg-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 text-center border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-[#0284C7] text-[#0284C7] bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Paste Link / URL</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stories')}
            className={`flex-1 py-2 text-center border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'stories'
                ? 'border-[#0284C7] text-[#0284C7] bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Link Another Story ({publishedArticles.length})</span>
          </button>
        </div>

        {/* Form Body Container (Div, NOT form tag) */}
        <div className="p-5 space-y-4 text-xs font-sans text-slate-800">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xs text-[11px] font-medium">
              ⚠️ {error}
            </div>
          )}

          {activeTab === 'url' ? (
            <>
              {/* Detected Article Banner */}
              {detectedStory && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-800 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Article Detected</span>
                    </span>
                    <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-1.5 py-0.2 rounded font-mono font-bold">
                      #{detectedStory.article_id}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {detectedStory.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>Category: <strong className="text-emerald-900">{detectedStory.primary_category || 'ECONOMY'}</strong></span>
                    {displayText !== detectedStory.title && (
                      <button
                        type="button"
                        onClick={() => setDisplayText(detectedStory.title)}
                        className="text-[#0284C7] hover:underline font-bold cursor-pointer"
                      >
                        Use Title as Anchor Text
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* URL / Document Link */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center justify-between">
                  <span>Document, Web Address or Article Link *</span>
                  <span className="text-slate-400 font-mono">e.g. /story/1791... or https://</span>
                </label>
                <div className="relative">
                  <input
                    ref={urlInputRef}
                    type="text"
                    required
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit();
                      }
                    }}
                    placeholder="https://... or paste /story/1791095288704"
                    className="w-full border border-slate-300 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] p-2.5 pr-8 text-xs text-slate-900 rounded-xs outline-none font-mono"
                  />
                  {isDoc && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-600" title="Document link detected">
                      <FileText className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Quick helper buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono text-slate-500">
                  <span className="text-slate-400">Quick:</span>
                  <button
                    type="button"
                    onClick={() => setUrl((prev) => prev.startsWith('https://') || prev.startsWith('/story/') ? prev : 'https://' + prev.replace(/^http:\/\//, ''))}
                    className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer"
                  >
                    https://
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('stories')}
                    className="px-1.5 py-0.5 bg-sky-50 text-[#0284C7] hover:bg-sky-100 border border-sky-300 rounded cursor-pointer"
                  >
                    Browse stories →
                  </button>
                  {url.trim().length > 6 && (
                    <a
                      href={url.startsWith('/') ? url : url.startsWith('http') ? url : `https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-1.5 py-0.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-300 rounded inline-flex items-center gap-0.5 cursor-pointer ml-auto"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Highlighted Word / Display Text */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center justify-between">
                  <span>Highlighted Word(s) / Anchor Text</span>
                  {initialText ? (
                    <span className="text-emerald-700 font-mono font-normal lowercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ✓ captured from selection
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono font-normal">will appear in story</span>
                  )}
                </label>
                <input
                  ref={textInputRef}
                  type="text"
                  value={displayText}
                  onChange={(e) => {
                    setDisplayText(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit();
                    }
                  }}
                  placeholder="e.g. Central Bank Monetary Report or Story Headline"
                  className="w-full border border-slate-300 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] p-2.5 text-xs text-slate-900 rounded-xs outline-none font-medium"
                />
              </div>

              {/* Live Preview Box */}
              {(displayText || url) && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    In-Article Appearance Preview:
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    ...readers will see{' '}
                    <span className="text-[#0284C7] font-semibold underline decoration-sky-300 underline-offset-2 inline-flex items-center gap-0.5">
                      {displayText || url}
                      <ExternalLink className="w-3 h-3 inline text-sky-500" />
                    </span>{' '}
                    linked in the article.
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Search Published Stories Tab */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Search by Title, Category, or ID:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search published stories..."
                    className="w-full bg-slate-50 border border-slate-300 pl-8 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#0284C7] outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xs bg-slate-50/50">
                {publishedArticles
                  .filter((a) => {
                    if (!searchTerm.trim()) return true;
                    const term = searchTerm.toLowerCase();
                    return (
                      a.title.toLowerCase().includes(term) ||
                      String(a.article_id).includes(term) ||
                      (a.primary_category || '').toLowerCase().includes(term)
                    );
                  })
                  .slice(0, 25)
                  .map((a) => (
                    <div
                      key={a.article_id}
                      className="p-2.5 hover:bg-sky-50 transition flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-200 text-slate-800 px-1 py-0.2 rounded font-mono">
                            {a.primary_category || 'ECONOMY'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            #{a.article_id}
                          </span>
                        </div>
                        <p className="font-bold text-xs text-slate-900 truncate">
                          {a.title}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUrl(`/story/${a.article_id}`);
                          if (!displayText.trim() || (detectedStory && displayText === detectedStory.title)) {
                            setDisplayText(a.title);
                          }
                          setDetectedStory(a);
                          setActiveTab('url');
                        }}
                        className="shrink-0 px-2 py-1 bg-[#0284C7] hover:bg-sky-600 text-white font-bold text-[10px] uppercase rounded-xs cursor-pointer shadow-2xs"
                      >
                        Select Story
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 font-bold uppercase text-[10px] tracking-wider transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!url.trim()}
              className="px-4 py-2 bg-[#0284C7] hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold uppercase text-[11px] tracking-wider transition cursor-pointer shadow-xs flex items-center gap-1.5 rounded-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Insert Hyperlink</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Link2, ExternalLink, FileText, Check, X } from 'lucide-react';

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
  const urlInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayText(initialText || '');
      setUrl('');
      setError('');
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = displayText.trim();
    let cleanUrl = url.trim();

    if (!cleanText) {
      setError('Please provide the text or word to link.');
      return;
    }
    if (!cleanUrl) {
      setError('Please provide a document or website URL.');
      return;
    }

    // Auto-prepend https:// if missing and not relative or mailto/tel
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('#') && !cleanUrl.startsWith('/')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    onInsert(cleanText, cleanUrl);
    onClose();
  };

  const isDoc = url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('drive.google.com') || url.toLowerCase().includes('docs.google.com');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border-2 border-slate-900 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 rounded-sm"
        role="dialog"
        aria-modal="true"
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
                Attach source reports, PDFs, or external references
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-sans text-slate-800">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xs text-[11px] font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Highlighted Word / Display Text */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center justify-between">
              <span>Highlighted Word(s) / Anchor Text *</span>
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
              required
              value={displayText}
              onChange={(e) => {
                setDisplayText(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Central Bank Monetary Report or Colombo Gazette"
              className="w-full border border-slate-300 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] p-2.5 text-xs text-slate-900 rounded-xs outline-none font-medium"
            />
          </div>

          {/* URL / Document Link */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center justify-between">
              <span>Document or Web Address (URL) *</span>
              <span className="text-slate-400 font-mono">opens in new tab</span>
            </label>
            <div className="relative">
              <input
                ref={urlInputRef}
                type="text"
                required
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                }}
                placeholder="https://www.cbsl.gov.lk/report.pdf or Google Docs link"
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
              <span className="text-slate-400">Quick prefix:</span>
              <button
                type="button"
                onClick={() => setUrl((prev) => prev.startsWith('https://') ? prev : 'https://' + prev.replace(/^http:\/\//, ''))}
                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 cursor-pointer"
              >
                https://
              </button>
              {url.trim().length > 6 && (
                <a
                  href={url.startsWith('http') ? url : `https://${url}`}
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

          {/* Live Preview Box */}
          {displayText && (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                In-Article Appearance Preview:
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">
                ...readers will see{' '}
                <span className="text-[#0284C7] font-semibold underline decoration-sky-300 underline-offset-2 inline-flex items-center gap-0.5">
                  {displayText}
                  <ExternalLink className="w-3 h-3 inline text-sky-500" />
                </span>{' '}
                linked to this document.
              </p>
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
              type="submit"
              className="px-4 py-2 bg-[#0284C7] hover:bg-sky-600 text-white font-extrabold uppercase text-[11px] tracking-wider transition cursor-pointer shadow-xs flex items-center gap-1.5 rounded-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Insert Hyperlink</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

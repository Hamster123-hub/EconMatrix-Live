import React, { useState, useEffect } from 'react';
import { Article, EmployeeRecord, MediaAsset } from '../types';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Globe,
  Eye,
  Loader2,
  Sparkles,
  Flame,
  Star,
  Lock,
  Clock,
  User,
  Tag,
  Layout,
  FileText,
  Quote,
  List,
  Heading,
  Smartphone,
  Monitor,
  ExternalLink,
  RotateCcw,
  UploadCloud
} from 'lucide-react';
import { FormattedText } from './FormattedText';

interface StoryEditorPageProps {
  article: any;
  currentUser: EmployeeRecord | null;
  onBack: () => void;
  onSaved: (updatedArticle: any) => void;
  stockImageGallery?: { title: string; url: string; tag: string }[];
  mediaAssets?: MediaAsset[];
}

export const StoryEditorPage: React.FC<StoryEditorPageProps> = ({
  article,
  currentUser,
  onBack,
  onSaved,
  stockImageGallery = [],
  mediaAssets = [],
}) => {
  // Form State
  const [title, setTitle] = useState(article.title || '');
  const [deck, setDeck] = useState(article.deck || '');
  const [category, setCategory] = useState(article.primary_category || 'ECONOMY');
  const [body, setBody] = useState(article.body || '');
  const [imageUrl, setImageUrl] = useState(article.featured_image_url || '');
  const [imageCaption, setImageCaption] = useState(article.image_caption || '');
  const [localMediaAssets, setLocalMediaAssets] = useState<MediaAsset[]>(mediaAssets || []);

  const fetchMediaAssets = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success && Array.isArray(data.media)) {
        setLocalMediaAssets(data.media);
      }
    } catch (err) {
      console.warn('Could not fetch media assets:', err);
    }
  };

  useEffect(() => {
    fetchMediaAssets();
  }, []);

  const initialAuthor = article.authors?.[0]?.first_name
    ? `${article.authors[0].first_name} ${article.authors[0].last_name}`
    : article.authorName || (currentUser?.fullName || currentUser?.name || 'LankaEcon Editorial Board');
  const [authorName, setAuthorName] = useState(initialAuthor);

  const [readingTime, setReadingTime] = useState(article.reading_time_minutes || 3);
  const initialPlacement = article.placement || (article.is_lead_story ? 'lead' : 'standard');
  const [placement, setPlacement] = useState<'standard' | 'notable' | 'spotlight' | 'lead'>(initialPlacement);
  const [isLeadStory, setIsLeadStory] = useState(Boolean(article.is_lead_story || initialPlacement === 'lead'));
  const [isBreaking, setIsBreaking] = useState(Boolean(article.is_breaking));
  const [isFeatured, setIsFeatured] = useState(Boolean(article.is_featured));
  const [isSubscriptionOnly, setIsSubscriptionOnly] = useState(Boolean(article.is_subscription_only || article.is_premium));

  // Multi-lingual Translations
  const [siTitle, setSiTitle] = useState(article.translations?.si?.title || '');
  const [siDeck, setSiDeck] = useState(article.translations?.si?.deck || '');
  const [siBody, setSiBody] = useState(article.translations?.si?.body || '');

  const [taTitle, setTaTitle] = useState(article.translations?.ta?.title || '');
  const [taDeck, setTaDeck] = useState(article.translations?.ta?.deck || '');
  const [taBody, setTaBody] = useState(article.translations?.ta?.body || '');

  // Workspace View State
  const [activeTab, setActiveTab] = useState<'editor' | 'translations' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleStoryImageFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, SVG, GIF).');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      alert('File size exceeds 30MB limit. Please select a smaller image.');
      return;
    }
    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64Data = ev.target?.result as string;
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title ? `${title} - Hero Photo` : file.name.replace(/\.[^/.]+$/, ''),
            fileName: file.name,
            imageData: base64Data,
            category: category || 'GENERAL',
            tags: [category, 'STORY_EDITOR_UPLOAD'],
            source: currentUser?.fullName || 'Story Editor',
          }),
        });
        const data = await res.json();
        if (data.success && data.media) {
          setLocalMediaAssets((prev) => [data.media, ...prev.filter((m) => m.id !== data.media.id)]);
          setImageUrl(data.media.url);
          setImageCaption(`Photo: ${data.media.title}`);
          setShowImagePicker(false);
        } else {
          alert(data.error || 'Failed to upload image file');
        }
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Network error while uploading image');
      setIsUploadingImage(false);
    }
  };

  // Mark dirty
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [title, deck, category, body, imageUrl, imageCaption, authorName, readingTime, placement, isLeadStory, isBreaking, isFeatured, isSubscriptionOnly, siTitle, siDeck, siBody, taTitle, taDeck, taBody]);

  // Word count & calculated reading time helper
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const suggestedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleInsertText = (prefix: string, suffix: string = '') => {
    setBody((prev) => prev + `\n\n${prefix}${suffix}`);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Story Headline / Title is required before saving.');
      setActiveTab('editor');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    const editorName = currentUser?.fullName || currentUser?.name || 'Company Employee';

    const translationsPayload: any = {};
    if (siTitle.trim() || siDeck.trim() || siBody.trim()) {
      translationsPayload.si = {
        title: siTitle.trim(),
        deck: siDeck.trim(),
        body: siBody.trim(),
        primary_category: category,
      };
    }
    if (taTitle.trim() || taDeck.trim() || taBody.trim()) {
      translationsPayload.ta = {
        title: taTitle.trim(),
        deck: taDeck.trim(),
        body: taBody.trim(),
        primary_category: category,
      };
    }

    try {
      const res = await fetch('/api/admin/update-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: article.article_id,
          title: title.trim(),
          deck: deck.trim(),
          body: body.trim(),
          primary_category: category,
          featured_image_url: imageUrl.trim(),
          image_caption: imageCaption.trim(),
          reading_time_minutes: readingTime || suggestedReadingTime,
          placement,
          is_lead_story: isLeadStory || placement === 'lead',
          is_breaking: isBreaking,
          is_featured: isFeatured,
          is_subscription_only: isSubscriptionOnly,
          is_premium: isSubscriptionOnly,
          author_name: authorName.trim(),
          translations: Object.keys(translationsPayload).length > 0 ? translationsPayload : undefined,
          editor_name: editorName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHasUnsavedChanges(false);
        setSuccessMessage(`Story #${article.article_id} successfully saved and published live by ${editorName}!`);
        if (data.article) {
          onSaved(data.article);
        }
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      } else {
        setErrorMessage(data.error || 'Failed to update story in backend database.');
      }
    } catch {
      setErrorMessage('Network error while communicating with editorial API.');
    } finally {
      setIsSaving(false);
    }
  };

  const allAvailableImages = [
    ...localMediaAssets.map((m) => ({ title: m.title, url: m.url, tag: m.category })),
    ...stockImageGallery,
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-slate-900 font-sans pb-16">
      {/* TOP CMS BAR */}
      <div className="sticky top-0 z-40 bg-[#091527] border-b-2 border-amber-400 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-xs border border-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Backend</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
              <span className="text-slate-500">/</span>
              <span className="font-mono text-amber-400 font-bold">Story #{article.article_id}</span>
              <span className="text-slate-500">/</span>
              <span className="font-bold text-slate-200 uppercase">{category}</span>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xs border border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('translations')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer ${
                activeTab === 'translations'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Languages (සිං / த)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Quick Status & Save Button */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-300">
              <span className="text-slate-400">Editor:</span>
              <span className="text-amber-300 font-bold">{currentUser?.fullName || currentUser?.name || 'Company Staff'}</span>
            </div>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#0284C7] hover:bg-sky-600 text-white font-black text-xs uppercase tracking-wider px-5 py-2 rounded-xs shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Live</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ALERT BANNERS */}
      {successMessage && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 shadow-md flex items-center justify-between max-w-7xl mx-auto mt-4 rounded-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-200 hover:text-white font-bold">✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-600 text-white text-xs font-bold px-4 py-3 shadow-md flex items-center justify-between max-w-7xl mx-auto mt-4 rounded-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-rose-200 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* MAIN FULL PAGE WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'editor' && (
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT MAIN CANVAS (8 Columns on desktop) */}
            <div className="lg:col-span-8 space-y-6">
              {/* HEADLINE & DECK CARD */}
              <div className="bg-white border border-[#E5E2DC] p-6 sm:p-8 shadow-xs space-y-5 rounded-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black uppercase text-[#0B1E36] tracking-wider flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Article Headline / Title *</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">{title.length} characters</span>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an authoritative, clear economic or market headline..."
                    className="w-full font-serif font-extrabold text-xl sm:text-2xl text-slate-900 border-2 border-slate-200 p-3.5 focus:border-[#0284C7] focus:bg-sky-50/20 outline-none leading-snug transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Sub-Headline / Deck (Executive Summary)
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">{deck.length} characters</span>
                  </div>
                  <textarea
                    rows={2}
                    value={deck}
                    onChange={(e) => setDeck(e.target.value)}
                    placeholder="Key executive takeaway, core macro finding, or dispatch briefing..."
                    className="w-full text-sm font-sans font-medium text-slate-700 border border-slate-300 p-3 focus:border-[#0284C7] focus:bg-sky-50/20 outline-none leading-relaxed transition"
                  />
                </div>
              </div>

              {/* ARTICLE BODY & JOURNALISTIC FORMATTING TOOLBAR */}
              <div className="bg-white border border-[#E5E2DC] p-6 sm:p-8 shadow-xs space-y-4 rounded-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <label className="text-xs font-black uppercase text-[#0B1E36] tracking-wider flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Article Body & Full Dispatch *</span>
                  </label>

                  {/* Formatting Quick Insert Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleInsertText('### Section Sub-Heading')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded-xs flex items-center gap-1 cursor-pointer"
                      title="Insert Subheading"
                    >
                      <Heading className="w-3 h-3 text-slate-600" />
                      <span>H3 Heading</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertText('> "Insert prominent expert quote or Central Bank statement here."')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded-xs flex items-center gap-1 cursor-pointer"
                      title="Insert Pull Quote"
                    >
                      <Quote className="w-3 h-3 text-sky-600" />
                      <span>Pull Quote</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertText('- **Indicator 1:** Value\n- **Indicator 2:** Value\n- **Indicator 3:** Value')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded-xs flex items-center gap-1 cursor-pointer"
                      title="Insert Bullet List"
                    >
                      <List className="w-3 h-3 text-amber-600" />
                      <span>Bullet Points</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={18}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Draft or edit the complete story analysis here. Use markdown formatting, separate paragraphs with double enters."
                  className="w-full text-sm font-serif leading-relaxed text-slate-900 border border-slate-300 p-4 focus:border-[#0284C7] focus:bg-sky-50/10 outline-none transition"
                />

                {/* Article Statistics Counter Bar */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100 font-mono">
                  <div className="flex items-center gap-4">
                    <span><strong>{wordCount}</strong> words</span>
                    <span>•</span>
                    <span><strong>{body.length}</strong> characters</span>
                    <span>•</span>
                    <span><strong>{body.split('\n\n').filter(Boolean).length}</strong> paragraphs</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>Est. reading time: {suggestedReadingTime} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR (4 Columns on desktop) */}
            <div className="lg:col-span-4 space-y-6">
              {/* PUBLISH & ACTIONS BOX */}
              <div className="bg-[#091527] text-white p-5 rounded-xs border-2 border-amber-400 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-extrabold text-xs uppercase tracking-wider text-white">Publishing Actions</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                    Live Story
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Story ID:</span>
                    <span className="font-mono text-amber-300 font-bold">#{article.article_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Published Date:</span>
                    <span className="font-mono text-slate-200">{new Date(article.published_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                  {article.last_edited_by && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Edited:</span>
                      <span className="text-slate-200">{article.last_edited_by}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-700 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-[#0284C7] hover:bg-sky-600 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Live Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save & Publish Changes</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase py-2 rounded-xs transition cursor-pointer text-center"
                  >
                    Cancel / Exit Editor
                  </button>
                </div>
              </div>

              {/* MEDIA & FEATURED HERO IMAGE */}
              <div className="bg-white border border-[#E5E2DC] p-5 shadow-xs space-y-3.5 rounded-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <label className="text-xs font-black uppercase text-[#0B1E36] tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Featured Hero Image</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] px-2 py-0.5 uppercase rounded-xs cursor-pointer flex items-center gap-1 transition shadow-2xs">
                      <UploadCloud className="w-3 h-3" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload PC'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingImage}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleStoryImageFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(true)}
                      className="text-[11px] font-bold text-[#0284C7] hover:text-sky-700 underline cursor-pointer"
                    >
                      Pick from DB
                    </button>
                  </div>
                </div>

                {imageUrl ? (
                  <div className="relative w-full h-40 bg-slate-100 overflow-hidden border border-slate-300 group">
                    <img
                      src={imageUrl}
                      alt="Story Featured Hero"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-rose-600 text-white text-[10px] px-2 py-1 rounded font-bold transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowImagePicker(true)}
                    className="h-32 border-2 border-dashed border-slate-300 hover:border-[#0284C7] bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer p-4 transition text-center"
                  >
                    <ImageIcon className="w-6 h-6 mb-1 opacity-60" />
                    <span className="text-xs font-bold">Click to Pick Hero Image</span>
                    <span className="text-[10px] text-slate-400">or enter image URL below</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 p-2 focus:bg-white focus:border-[#0284C7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Image Caption & Credit</label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="e.g. Photo: Central Bank of Sri Lanka Headquarters"
                    className="w-full text-xs bg-slate-50 border border-slate-300 p-2 focus:bg-white focus:border-[#0284C7] outline-none"
                  />
                </div>
              </div>

              {/* CATEGORY & BYLINE ATTRIBUTION */}
              <div className="bg-white border border-[#E5E2DC] p-5 shadow-xs space-y-4 rounded-xs">
                <h4 className="font-black text-xs uppercase text-[#0B1E36] tracking-wider border-b border-slate-200 pb-2">
                  Category & Attribution
                </h4>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Primary Desk</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 p-2 text-xs font-bold text-[#0B1E36] focus:bg-white focus:border-[#0284C7] outline-none cursor-pointer"
                  >
                    <option value="ECONOMY">ECONOMY</option>
                    <option value="MARKETS">MARKETS</option>
                    <option value="FINANCE">FINANCE</option>
                    <option value="SERVICES">SERVICES</option>
                    <option value="INDUSTRY">INDUSTRY</option>
                    <option value="GOVERNANCE">GOVERNANCE</option>
                    <option value="OPINION">OPINION</option>
                    <option value="WORLD">WORLD</option>
                    <option value="POLICY">POLICY</option>
                    <option value="BANKING">BANKING</option>
                    <option value="TRADE">TRADE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Author / Byline</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Ranul Seneviratne"
                    className="w-full bg-slate-50 border border-slate-300 p-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-[#0284C7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Reading Time (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readingTime}
                    onChange={(e) => setReadingTime(parseInt(e.target.value) || 3)}
                    className="w-full bg-slate-50 border border-slate-300 p-2 text-xs text-slate-800 focus:bg-white focus:border-[#0284C7] outline-none"
                  />
                </div>
              </div>

              {/* HOMEPAGE PLACEMENT & BADGES */}
              <div className="bg-white border border-[#E5E2DC] p-5 shadow-xs space-y-4 rounded-xs">
                <h4 className="font-black text-xs uppercase text-[#0B1E36] tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Homepage Placement & Badges</span>
                </h4>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Layout Section</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'standard', label: 'Standard Feed' },
                      { id: 'notable', label: 'Notable (Left)' },
                      { id: 'spotlight', label: 'Spotlight (Right)' },
                      { id: 'lead', label: '★ Lead Story' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPlacement(p.id as any);
                          if (p.id === 'lead') setIsLeadStory(true);
                        }}
                        className={`p-2 text-center text-xs font-bold uppercase border rounded-xs transition cursor-pointer ${
                          placement === p.id
                            ? 'bg-[#0B1E36] text-white border-[#0B1E36]'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isLeadStory}
                      onChange={(e) => {
                        setIsLeadStory(e.target.checked);
                        if (e.target.checked) setPlacement('lead');
                      }}
                      className="w-4 h-4 text-[#0284C7]"
                    />
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>Designate Front-Page Lead Story</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-rose-900 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isBreaking}
                      onChange={(e) => setIsBreaking(e.target.checked)}
                      className="w-4 h-4 text-rose-600"
                    />
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
                      <span>🚨 Breaking News Ticker</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-amber-900 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-amber-600"
                    />
                    <span>Featured Story Badge</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-indigo-900 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isSubscriptionOnly}
                      onChange={(e) => setIsSubscriptionOnly(e.target.checked)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>🔒 Subscriber Premium Lock</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TRANSLATIONS TAB (SINHALA & TAMIL FULL VIEW) */}
        {activeTab === 'translations' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-sky-50 border border-sky-300 p-4 text-xs text-sky-950 rounded-xs flex items-center gap-3">
              <Globe className="w-5 h-5 text-sky-700 shrink-0" />
              <div>
                <strong className="block text-sm">Multi-Lingual Reader Engine</strong>
                <span>
                  LankaEcon seamlessly presents articles in Sinhala (සිංහල) and Tamil (தமிழ்) when readers toggle language. Enter translated headlines, decks, and full journalistic bodies below.
                </span>
              </div>
            </div>

            {/* Sinhala Box */}
            <div className="bg-white border-2 border-amber-300 p-6 sm:p-8 space-y-5 rounded-xs shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-600" />
                  <span>Sinhala Translation (සිංහල භාෂාවෙන්)</span>
                </h3>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  සිංහල
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Sinhala Headline (ශීර්ෂ පාඨය)
                </label>
                <input
                  type="text"
                  value={siTitle}
                  onChange={(e) => setSiTitle(e.target.value)}
                  placeholder="උදා: ශ්‍රී ලංකා මහ බැංකුව ප්‍රතිපත්ති පොලී අනුපාතය සංශෝධනය කරයි..."
                  className="w-full bg-slate-50 border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Sinhala Deck / Executive Summary (සාරාංශය)
                </label>
                <input
                  type="text"
                  value={siDeck}
                  onChange={(e) => setSiDeck(e.target.value)}
                  placeholder="සාරාංශය..."
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Sinhala Full Body Text (සම්පූර්ණ පුවත් වාර්තාව)
                </label>
                <textarea
                  rows={8}
                  value={siBody}
                  onChange={(e) => setSiBody(e.target.value)}
                  placeholder="සම්පූර්ණ පුවත් වාර්තාව මෙහි ඇතුළත් කරන්න..."
                  className="w-full bg-slate-50 border border-slate-300 p-3 text-xs leading-relaxed text-slate-900 focus:bg-white focus:border-amber-600 outline-none font-serif"
                />
              </div>
            </div>

            {/* Tamil Box */}
            <div className="bg-white border-2 border-indigo-300 p-6 sm:p-8 space-y-5 rounded-xs shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <span>Tamil Translation (தமிழ் மொழியில்)</span>
                </h3>
                <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
                  தமிழ்
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Tamil Headline (தலைப்பு)
                </label>
                <input
                  type="text"
                  value={taTitle}
                  onChange={(e) => setTaTitle(e.target.value)}
                  placeholder="உதாரணம்: இலங்கை மத்திய வங்கி கொள்கை வட்டி விகிதங்களை திருத்தியுள்ளது..."
                  className="w-full bg-slate-50 border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Tamil Deck / Summary (சுருக்கம்)
                </label>
                <input
                  type="text"
                  value={taDeck}
                  onChange={(e) => setTaDeck(e.target.value)}
                  placeholder="சுருக்கம்..."
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Tamil Full Body Text (முழு கட்டுரை)
                </label>
                <textarea
                  rows={8}
                  value={taBody}
                  onChange={(e) => setTaBody(e.target.value)}
                  placeholder="முழு செய்தி அறிக்கையை இங்கே உள்ளிடவும்..."
                  className="w-full bg-slate-50 border border-slate-300 p-3 text-xs leading-relaxed text-slate-900 focus:bg-white focus:border-indigo-600 outline-none font-serif"
                />
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className="px-5 py-2.5 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 text-slate-800 transition rounded-xs cursor-pointer"
              >
                ← Back to Main Editor
              </button>
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={isSaving}
                className="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-[#0284C7] hover:bg-sky-600 text-white transition rounded-xs cursor-pointer flex items-center gap-2 shadow-sm"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Translations</span>
              </button>
            </div>
          </div>
        )}

        {/* LIVE READER PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Device Switcher */}
            <div className="flex items-center justify-between bg-white border border-[#E5E2DC] p-4 rounded-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-700">Preview Device:</span>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-xs transition cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-[#0B1E36] text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop Full Width</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-xs transition cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-[#0B1E36] text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile Phone (390px)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">Live preview of article layout</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
                >
                  Edit Story →
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-[420px] bg-slate-900 p-3 rounded-2xl shadow-2xl border-4 border-slate-800' : 'max-w-4xl'}`}>
              <div className="bg-white border border-[#E5E2DC] p-6 sm:p-10 shadow-md space-y-6">
                {/* Badges & Category */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0284C7] bg-sky-50 px-2.5 py-0.5 border border-sky-200">
                      {category}
                    </span>
                    {isBreaking && (
                      <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 border border-rose-200 animate-pulse">
                        🚨 Breaking
                      </span>
                    )}
                    {isLeadStory && (
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 border border-amber-300">
                        ★ Lead Story
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-500">{readingTime} MIN READ</span>
                </div>

                {/* Headline */}
                <h1 className="font-serif font-extrabold text-2xl sm:text-4xl text-slate-950 leading-tight">
                  {title || 'Untitled Story Headline'}
                </h1>

                {/* Deck */}
                {deck && (
                  <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                    {deck}
                  </p>
                )}

                {/* Author & Date Bar */}
                <div className="flex items-center gap-3 text-xs text-slate-600 border-t border-b border-slate-100 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{authorName}</div>
                    <div className="text-[11px] text-slate-500">LankaEcon Research Desk • {new Date().toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Hero Image */}
                {imageUrl && (
                  <div className="space-y-2">
                    <div className="w-full h-64 sm:h-96 bg-slate-100 overflow-hidden">
                      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    </div>
                    {imageCaption && (
                      <p className="text-xs text-slate-500 italic text-center">{imageCaption}</p>
                    )}
                  </div>
                )}

                {/* Article Body */}
                <div className="prose max-w-none text-slate-900 font-serif leading-relaxed text-sm sm:text-base space-y-4">
                  <FormattedText text={body || 'Story body content goes here...'} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STOCK IMAGE DATABASE MODAL */}
      {showImagePicker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-4xl shadow-2xl max-h-[85vh] flex flex-col p-6 rounded-none">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-extrabold text-base text-[#0B1E36] uppercase">
                  Select Hero Image from Database ({allAvailableImages.length} Available)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImagePicker(false)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            {/* Direct Upload Banner */}
            <div className="bg-sky-50 border border-sky-200 p-3 mb-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-xs text-sky-950">
                <span className="font-extrabold block">Need an image from your computer?</span>
                <span className="text-[11px] text-sky-700">Upload any image file directly to the backend database & apply immediately.</span>
              </div>
              <label className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 uppercase rounded-xs cursor-pointer flex items-center gap-1.5 transition shadow-xs">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isUploadingImage ? 'Uploading Image...' : 'Upload from Computer'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploadingImage}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleStoryImageFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
              {allAvailableImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setImageUrl(img.url);
                    setImageCaption(`Photo: ${img.title}`);
                    setShowImagePicker(false);
                  }}
                  className="group border border-slate-300 hover:border-[#0284C7] bg-slate-50 cursor-pointer overflow-hidden transition shadow-2xs hover:shadow-md"
                >
                  <div className="h-28 bg-slate-200 overflow-hidden relative">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1 py-0.5 font-bold">
                      {img.tag}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="font-bold text-[11px] text-slate-900 group-hover:text-[#0284C7] truncate">
                      {img.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowImagePicker(false)}
                className="px-4 py-1.5 text-xs font-bold uppercase bg-slate-200 hover:bg-slate-300 text-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

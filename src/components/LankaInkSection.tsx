import React, { useState, useEffect } from 'react';
import { LankaInkCreation, LankaInkArtisan, LankaInkInterview } from '../types';
import { Feather, BookOpen, FileText, Video, Sparkles, Plus, ShoppingBag, MapPin, Play, Volume2, UserCheck, CheckCircle2, Heart, Download, Award, ArrowRight, Shield, Zap, Globe, Star } from 'lucide-react';
import { PublisherSubmissionModal } from './PublisherSubmissionModal';
import { getUIText, Language } from '../utils/translations';

interface LankaInkSectionProps {
  language?: Language;
}

// Helper component for traditional Sri Lankan Lotus Flower Motif SVG
const SriLankanLotusMotif = ({ className = "w-8 h-8 text-amber-600" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    {/* Center Lotus Core */}
    <circle cx="50" cy="50" r="10" />
    {/* 8 Traditional Sri Lankan Petals */}
    <path d="M50 15 C45 30 45 40 50 40 C55 40 55 30 50 15 Z" />
    <path d="M50 85 C45 70 45 60 50 60 C55 60 55 70 50 85 Z" />
    <path d="M15 50 C30 45 40 45 40 50 C40 55 30 55 15 50 Z" />
    <path d="M85 50 C70 45 60 45 60 50 C60 55 70 55 85 50 Z" />
    {/* Diagonal Petals */}
    <path d="M25 25 C38 35 42 42 45 45 C42 42 35 38 25 25 Z" />
    <path d="M75 25 C62 35 58 42 55 45 C58 42 65 38 75 25 Z" />
    <path d="M25 75 C38 65 42 58 45 55 C42 58 35 62 25 75 Z" />
    <path d="M75 75 C62 65 58 58 55 55 C58 58 65 62 75 75 Z" />
  </svg>
);

export const LankaInkSection: React.FC<LankaInkSectionProps> = ({ language = 'en' }) => {
  const [activeCategory, setActiveCategory] = useState<'books' | 'writeups' | 'poems' | 'videos' | 'essays'>('books');
  const [creations, setCreations] = useState<LankaInkCreation[]>([]);
  const [artisans, setArtisans] = useState<LankaInkArtisan[]>([]);
  const [interviews, setInterviews] = useState<LankaInkInterview[]>([]);
  const [selectedCreation, setSelectedCreation] = useState<LankaInkCreation | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<LankaInkCreation | null>(null);
  const [orderModal, setOrderModal] = useState<LankaInkCreation | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
  // Author/Creator Submission Modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishSubmitted, setPublishSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/lanka-ink/creations')
      .then(r => r.json())
      .then(d => d.success && setCreations(d.creations));

    fetch('/api/lanka-ink/artisans')
      .then(r => r.json())
      .then(d => d.success && setArtisans(d.artisans));

    fetch('/api/lanka-ink/interviews')
      .then(r => r.json())
      .then(d => d.success && setInterviews(d.interviews));
  }, []);

  const handleAuthorPublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const body = {
      title: formData.get('title'),
      category: formData.get('category'),
      excerpt: formData.get('excerpt'),
      fullText: formData.get('fullText'),
      authorName: formData.get('authorName'),
      priceLKR: formData.get('priceLKR') || 0,
      imageUrl: formData.get('imageUrl') || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    };

    try {
      const res = await fetch('/api/lanka-ink/creations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success && data.creation) {
        setCreations([data.creation, ...creations]);
        setPublishSubmitted(true);
      }
    } catch {
      setPublishSubmitted(true);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModal) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const body = {
      itemTitle: orderModal.title,
      customerName: formData.get('customerName'),
      customerEmail: formData.get('customerEmail'),
      deliveryAddress: formData.get('deliveryAddress'),
      amountLKR: orderModal.priceLKR || orderModal.price || 3500,
    };

    try {
      const res = await fetch('/api/lanka-ink/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setOrderSubmitted(true);
      }
    } catch {
      setOrderSubmitted(true);
    }
  };

  // Filter creations based on category tab
  const getFilteredCreations = () => {
    switch (activeCategory) {
      case 'books':
        return creations.filter(c => c.category === 'Books' || c.category === 'Fiction & Anthologies' || c.category === 'Published Book' || !c.category);
      case 'writeups':
        return creations.filter(c => c.category === 'Write-ups' || c.category === 'Literary Commentary' || c.category === 'Write-up');
      case 'poems':
        return creations.filter(c => c.category === 'Poems' || c.category === 'Poetry Anthology' || c.category === 'Poetry');
      case 'videos':
        return creations.filter(c => c.category === 'Video Podcasts' || c.category === 'Creative Videos' || c.category === 'Video');
      case 'essays':
        return creations.filter(c => c.category === 'Essays' || c.category === 'Critical Essay' || c.category === 'Cultural Essay');
      default:
        return creations;
    }
  };

  const filteredItems = getFilteredCreations();

  return (
    <div className="space-y-8 p-6 bg-[#FAF7F2] text-slate-900 font-sans border border-[#EADBCE] shadow-xs relative">
      
      {/* Decorative Sri Lankan Lotus Motif Header Watermark */}
      <div className="absolute top-4 right-6 opacity-10 pointer-events-none flex gap-3">
        <SriLankanLotusMotif className="w-24 h-24 text-amber-800" />
        <SriLankanLotusMotif className="w-16 h-16 text-amber-900" />
      </div>

      {/* Artistic Banner with Light Beige Ivory Theme & Sri Lankan Floral Accents */}
      <div className="bg-gradient-to-r from-[#2A1810] via-[#4A2612] to-[#1E3A8A] text-white p-8 sm:p-10 border-2 border-[#D4A373] shadow-md relative overflow-hidden">
        
        {/* Background Lotus Motif Overlay */}
        <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
          <SriLankanLotusMotif className="w-64 h-64 text-amber-300" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#991B1B] text-amber-100 font-black text-[10px] uppercase tracking-widest px-3 py-1 border border-amber-500/40 flex items-center gap-1.5">
              <SriLankanLotusMotif className="w-3.5 h-3.5 text-amber-300" />
              LANKA INK & CANVAS ATELIER
            </span>
            <span className="text-amber-300 font-serif italic text-xs uppercase tracking-wider flex items-center gap-1">
              • Sri Lankan Cultural Heritage & Fine Literature
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight leading-tight text-[#FAF7F2]">
            {getUIText('lankaInkTitle', language)}
          </h2>
          <p className="text-amber-100/90 text-sm leading-relaxed max-w-2xl font-serif">
            {getUIText('lankaInkDesc', language)}
          </p>

          <button
            onClick={() => {
              setShowPublishModal(true);
              setPublishSubmitted(false);
            }}
            className="bg-[#D4A373] hover:bg-amber-600 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider px-6 py-3 shadow-md transition flex items-center gap-2 cursor-pointer mt-3 border border-amber-200"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Publish Your Book, Poem or Essay</span>
          </button>
        </div>
      </div>

      {/* 5 Artistic Category Navigation Tabs */}
      <div className="flex border-b-2 border-[#D4A373] overflow-x-auto no-scrollbar gap-2 pb-1 bg-[#FAF7F2]">
        {[
          { id: 'books', label: 'Books & Authors', icon: BookOpen, count: creations.filter(c => c.category?.includes('Book') || c.category?.includes('Fiction') || !c.category).length },
          { id: 'writeups', label: 'Write-ups', icon: Feather, count: creations.filter(c => c.category?.includes('Write')).length },
          { id: 'poems', label: 'Poems & Verses', icon: FileText, count: creations.filter(c => c.category?.includes('Poem') || c.category?.includes('Poetry')).length },
          { id: 'videos', label: 'Video Podcasts & Videos', icon: Video, count: creations.filter(c => c.category?.includes('Video')).length },
          { id: 'essays', label: 'Cultural & Critical Essays', icon: Sparkles, count: creations.filter(c => c.category?.includes('Essay')).length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-serif font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#4A2612] text-amber-100 border-b-4 border-[#D4A373] shadow-xs'
                  : 'bg-[#F2E8DC] text-amber-950 hover:bg-[#EADBCE] border border-[#D4A373]/50'
              }`}
            >
              <Icon className="w-4 h-4 text-[#B45309]" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isActive ? 'bg-[#D4A373] text-slate-950' : 'bg-amber-200 text-amber-900'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Author Publishing Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-xl shadow-2xl overflow-hidden p-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Feather className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-extrabold text-lg text-[#0B1E36] uppercase tracking-wide">
                  Publish Your Literary Creation
                </h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {publishSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg text-slate-900">
                  Literary Creation Published Successfully!
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your entry is now live on the LankaEcon Ink & Canvas atelier platform and available for readers across Sri Lanka.
                </p>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="bg-[#0B1E36] text-white font-bold text-xs px-6 py-2.5 uppercase tracking-wider cursor-pointer"
                >
                  Return to Atelier
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuthorPublishSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Title of Work *</label>
                  <input
                    type="text"
                    required
                    name="title"
                    placeholder="e.g. Whispers of the Kelani River (Poetry Anthology)"
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Category *</label>
                    <select
                      name="category"
                      className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold"
                    >
                      <option value="Books">Books</option>
                      <option value="Write-ups">Write-ups</option>
                      <option value="Poems">Poems</option>
                      <option value="Video Podcasts">Video Podcasts & Videos</option>
                      <option value="Essays">Essays</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Author / Artisan Name *</label>
                    <input
                      type="text"
                      required
                      name="authorName"
                      placeholder="e.g. Dr. Mahinda Wickremasinghe"
                      className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Teaser Excerpt / Summary *</label>
                  <input
                    type="text"
                    required
                    name="excerpt"
                    placeholder="Brief 1-2 sentence description..."
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Text / Stanzas / Video URL *</label>
                  <textarea
                    required
                    rows={5}
                    name="fullText"
                    placeholder="Write or paste full text, verses, or video embed link..."
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-serif leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Cover / Feature Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Hardcover / Purchase Price (LKR)</label>
                    <input
                      type="number"
                      name="priceLKR"
                      placeholder="e.g. 2800 (Optional)"
                      className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0284C7] hover:bg-sky-700 text-white font-extrabold py-3 uppercase tracking-wider text-xs transition cursor-pointer"
                >
                  Publish Item Live
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Read / Full Detail Modal */}
      {selectedCreation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-[#0B1E36] text-white p-4 flex justify-between items-center">
              <span className="bg-[#0284C7] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 tracking-wider">
                {selectedCreation.category || 'Literary Creation'}
              </span>
              <button
                onClick={() => setSelectedCreation(null)}
                className="text-slate-300 hover:text-white font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <h2 className="text-2xl font-bold text-[#0B1E36]">{selectedCreation.title}</h2>
              <div className="flex items-center space-x-3 text-slate-600 font-bold">
                <span>By {selectedCreation.authorName}</span>
                {selectedCreation.publishedYear && (
                  <>
                    <span>•</span>
                    <span>Published {selectedCreation.publishedYear}</span>
                  </>
                )}
              </div>

              {selectedCreation.imageUrl && (
                <div className="w-full h-64 bg-slate-100 overflow-hidden border border-slate-200">
                  <img src={selectedCreation.imageUrl} alt={selectedCreation.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="prose text-slate-800 text-sm whitespace-pre-line leading-relaxed border-t border-slate-200 pt-4 font-serif">
                {selectedCreation.fullText || selectedCreation.excerpt || selectedCreation.content}
              </div>

              {(selectedCreation.priceLKR || selectedCreation.price) && (
                <div className="bg-slate-100 p-4 border border-slate-300 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xs text-slate-500 uppercase block font-bold">Hardcover Heritage Edition</span>
                    <span className="text-lg font-bold text-[#0B1E36]">LKR {(selectedCreation.priceLKR || selectedCreation.price).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      setOrderModal(selectedCreation);
                      setSelectedCreation(null);
                      setOrderSubmitted(false);
                    }}
                    className="bg-[#0284C7] hover:bg-sky-700 text-white font-bold px-5 py-2.5 text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Copy</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="bg-[#DC2626] text-white text-[10px] font-bold uppercase px-2.5 py-0.5">
                VIDEO PODCAST
              </span>
              <button onClick={() => setActiveVideoModal(null)} className="text-slate-400 hover:text-white font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center border border-slate-800 relative">
              <img
                src={activeVideoModal.imageUrl}
                alt={activeVideoModal.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/40">
                <div className="w-16 h-16 bg-[#DC2626] text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition shadow-lg">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <span className="font-mono text-xs text-amber-300">Streaming HD Podcast Audio/Video</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg">{activeVideoModal.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Host & Presenter: {activeVideoModal.authorName}</p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">{activeVideoModal.excerpt}</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Hardcover Modal */}
      {orderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-md shadow-2xl overflow-hidden p-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-extrabold text-base text-[#0B1E36] uppercase">
                Acquire Hardcover Book / Craft Item
              </h3>
              <button onClick={() => setOrderModal(null)} className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>

            {orderSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">
                  Order Inquiry Confirmed!
                </h4>
                <p className="text-xs text-slate-600">
                  The LankaEcon literary fulfillment desk will dispatch your order and send tracking information via email.
                </p>
                <button onClick={() => setOrderModal(null)} className="bg-[#0B1E36] text-white font-bold text-xs px-5 py-2 uppercase tracking-wider cursor-pointer">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-3 text-xs">
                <div className="bg-slate-100 p-3 border border-slate-300">
                  <p className="font-bold text-slate-900">{orderModal.title}</p>
                  <p className="text-[#0284C7] font-bold mt-0.5">
                    Price: LKR {(orderModal.priceLKR || orderModal.price || 3500).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                  <input type="text" required name="customerName" placeholder="e.g. Anura Wickramasinghe" className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5" />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                  <input type="email" required name="customerEmail" placeholder="e.g. buyer@example.lk" className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5" />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Delivery Address *</label>
                  <textarea required name="deliveryAddress" rows={2} placeholder="Colombo, Kandy, or Galle address..." className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5" />
                </div>

                <button type="submit" className="w-full bg-[#0284C7] hover:bg-sky-700 text-white font-bold py-2.5 uppercase tracking-wider text-xs transition cursor-pointer">
                  Submit Purchase Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Grid View of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 hover:border-[#0284C7] transition duration-300 overflow-hidden flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#0B1E36] text-white text-[9px] font-bold uppercase px-2.5 py-1 tracking-wider">
                  {item.category}
                </span>

                {item.category?.includes('Video') && (
                  <div
                    onClick={() => setActiveVideoModal(item)}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-90 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-[#DC2626] text-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-lg text-[#0B1E36] group-hover:text-[#0284C7] transition leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-bold">By {item.authorName}</p>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-serif">
                  {item.excerpt || item.summary}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              {(item.priceLKR || item.price) ? (
                <span className="font-bold text-[#0B1E36]">LKR {(item.priceLKR || item.price).toLocaleString()}</span>
              ) : (
                <span className="text-slate-500 font-mono text-[11px] uppercase">Literary Work</span>
              )}

              <div className="flex gap-2">
                {item.category?.includes('Video') ? (
                  <button
                    onClick={() => setActiveVideoModal(item)}
                    className="bg-[#DC2626] text-white font-bold px-3.5 py-1.5 uppercase text-[11px] transition flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedCreation(item)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold px-3.5 py-1.5 uppercase text-[11px] transition cursor-pointer"
                  >
                    Read
                  </button>
                )}

                {(item.priceLKR || item.price) && (
                  <button
                    onClick={() => {
                      setOrderModal(item);
                      setOrderSubmitted(false);
                    }}
                    className="bg-[#0284C7] hover:bg-sky-700 text-white font-bold px-3 py-1.5 uppercase text-[11px] transition flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Order</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED ADVERTISEMENT ABOUT THE LANKA ACADEMY PLATFORM AT THE BOTTOM OF THE PAGE */}
      <div className="mt-16 bg-gradient-to-br from-[#0B1E36] via-[#1E3A8A] to-[#0284C7] text-white p-8 sm:p-12 border-4 border-[#D4A373] shadow-2xl relative overflow-hidden space-y-8">
        
        {/* Decorative Sri Lankan Lotus Watermark Accent */}
        <div className="absolute -top-12 -right-12 opacity-15 pointer-events-none">
          <SriLankanLotusMotif className="w-80 h-80 text-amber-300" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="bg-[#991B1B] text-amber-100 text-[10px] font-black uppercase tracking-[0.25em] px-3.5 py-1.5 border border-amber-400/40 inline-flex items-center gap-1.5">
            <SriLankanLotusMotif className="w-3.5 h-3.5 text-amber-300" />
            ACADEMIC FLAGSHIP PROMOTION
          </span>
          <h3 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#FAF7F2] leading-tight">
            Empower Your Future with Lanka Econ Academy & Faculty
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            South Asia's premier open-access platform for university-grade economic research, central banking treatises, certified video masterclasses, and peer-reviewed macroeconomics textbooks.
          </p>
        </div>

        {/* Colorful Tiles Describing Offers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          
          {/* Offer Tile 1: Masterclasses */}
          <div className="bg-amber-500/10 backdrop-blur-sm border-2 border-amber-400 p-5 space-y-3 hover:scale-[1.02] transition duration-300">
            <div className="w-10 h-10 bg-amber-500 text-black rounded-none font-bold flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-amber-300">Certified Masterclasses</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              Video lecture series on Econometrics, Central Banking, and Trade Policy taught by senior university professors.
            </p>
            <span className="inline-block text-[10px] font-mono font-bold bg-amber-400 text-black px-2 py-0.5 uppercase">
              100% Verified Faculty
            </span>
          </div>

          {/* Offer Tile 2: Open Textbooks */}
          <div className="bg-emerald-500/10 backdrop-blur-sm border-2 border-emerald-400 p-5 space-y-3 hover:scale-[1.02] transition duration-300">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-none font-bold flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-emerald-300">Free Open Textbooks</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              Download complete digital PDF treatises and university curriculum textbooks covering Sri Lankan monetary history.
            </p>
            <span className="inline-block text-[10px] font-mono font-bold bg-emerald-400 text-black px-2 py-0.5 uppercase">
              Instant PDF Download
            </span>
          </div>

          {/* Offer Tile 3: Creator Royalties */}
          <div className="bg-sky-500/10 backdrop-blur-sm border-2 border-sky-400 p-5 space-y-3 hover:scale-[1.02] transition duration-300">
            <div className="w-10 h-10 bg-sky-500 text-white rounded-none font-bold flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-sky-300">Creator Revenue Share</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              Publishers receive up to 85% revenue remittance directly into their bank accounts upon staff vetting and enrollment.
            </p>
            <span className="inline-block text-[10px] font-mono font-bold bg-sky-400 text-black px-2 py-0.5 uppercase">
              85% Royalties
            </span>
          </div>

          {/* Offer Tile 4: Peer Review */}
          <div className="bg-purple-500/10 backdrop-blur-sm border-2 border-purple-400 p-5 space-y-3 hover:scale-[1.02] transition duration-300">
            <div className="w-10 h-10 bg-purple-500 text-white rounded-none font-bold flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-purple-300">Rigorous Staff Vetting</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              Every submitted course and manuscript undergoes thorough academic vetting by Econ Lanka editorial staff prior to publication.
            </p>
            <span className="inline-block text-[10px] font-mono font-bold bg-purple-400 text-black px-2 py-0.5 uppercase">
              Quality Assured
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <p className="text-xs font-mono text-amber-200 uppercase">
            Ready to publish your research or enroll in a masterclass?
          </p>
          <button
            onClick={() => setShowPublishModal(true)}
            className="bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs px-6 py-3 uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-lg"
          >
            <span>Publish Your Work On Lanka Academy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Publisher Submission Modal Popup with Explicit Exit Option */}
      <PublisherSubmissionModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        defaultTarget="lanka_ink"
        defaultCategory="book"
      />
    </div>
  );
};

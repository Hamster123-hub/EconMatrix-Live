import React, { useState, useEffect } from 'react';
import { ScholarWriter, EconMediaContent, EconBook, EconScholarArticle, EconCourse } from '../types';
import { BookOpen, Video, FileText, Award, Download, Play, Users, Search, Plus, Sparkles, Send, Sliders, ChevronDown, ChevronUp, History, Printer, Copy, Check, X, Share2, ExternalLink, Bookmark, ArrowLeft } from 'lucide-react';
import { PublisherSubmissionModal } from './PublisherSubmissionModal';
import { BookDetailModal } from './BookDetailModal';
import { AdamSmithMonetarySection } from './AdamSmithMonetarySection';
import { EconomicThoughtSection } from './EconomicThoughtSection';
import { InteractiveBookReader } from './InteractiveBookReader';
import { FormattedText } from './FormattedText';
import { EconTutorWhiteboard } from './EconTutorWhiteboard';
import { exportBookToWordDocument } from '../utils/wordExporter';
import { INITIAL_ECON_COURSES } from '../data/econAcademyData';
import { getUIText } from '../utils/translations';
import { safeSetStorage, safeGetStorage } from '../utils/safeStorage';

interface EconAcademySectionProps {
  language?: 'en' | 'si' | 'ta';
}

export const EconAcademySection: React.FC<EconAcademySectionProps> = ({ language = 'en' }) => {
  const [subTab, setSubTab] = useState<'courses' | 'evolution' | 'articles' | 'media' | 'books' | 'writers'>('courses');
  const [writers, setWriters] = useState<ScholarWriter[]>([]);
  const [media, setMedia] = useState<EconMediaContent[]>([]);
  const [books, setBooks] = useState<EconBook[]>([]);
  const [articles, setArticles] = useState<EconScholarArticle[]>([]);
  const [courses, setCourses] = useState<EconCourse[]>([]);
  const [activeMedia, setActiveMedia] = useState<EconMediaContent | null>(null);
  const [showAdamSmithTreatise, setShowAdamSmithTreatise] = useState(true);
  const [showDesktopWhiteboard, setShowDesktopWhiteboard] = useState(false);

  // Masterclass Course Reader State
  const [selectedCourse, setSelectedCourse] = useState<EconCourse | null>(null);

  // Scholar Treatise Dedicated Reader State
  const [selectedTreatise, setSelectedTreatise] = useState<EconScholarArticle | null>(null);
  const [treatiseSearch, setTreatiseSearch] = useState('');
  const [treatiseCategory, setTreatiseCategory] = useState('all');
  const [copiedCitation, setCopiedCitation] = useState(false);

  // Textbook & Faculty Reader State
  const [selectedBook, setSelectedBook] = useState<EconBook | null>(null);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<EconBook | null>(null);
  const [showBookDetailModal, setShowBookDetailModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<ScholarWriter | null>(null);

  // Publisher Submission Modal State
  const [showPublisherModal, setShowPublisherModal] = useState(false);
  const [initialCategory, setInitialCategory] = useState<'masterclass' | 'book' | 'poem' | 'essay'>('masterclass');

  useEffect(() => {
    const sanitizeBookAuthor = (b: EconBook): EconBook => {
      const isTragic = b.id === 'book-ranul-001' || b.title?.toLowerCase().includes('tragic mis-fortune') || b.title?.toLowerCase().includes('story behind');
      if (isTragic || (b.author && b.author.toLowerCase().includes('ranul'))) {
        return { ...b, author: '' };
      }
      return b;
    };

    // 1. Initial hydration from local storage for instant display
    try {
      const cWriters = safeGetStorage('econ_writers', null);
      const cMedia = safeGetStorage('econ_media', null);
      const cBooks = safeGetStorage('econ_books', null);
      const cArticles = safeGetStorage('econ_articles', null);
      const cCourses = safeGetStorage('econ_courses', null);
      if (cWriters && Array.isArray(cWriters)) setWriters(cWriters);
      if (cMedia && Array.isArray(cMedia)) setMedia(cMedia);
      if (cBooks && Array.isArray(cBooks)) setBooks(cBooks.map(sanitizeBookAuthor));
      if (cArticles && Array.isArray(cArticles)) setArticles(cArticles);
      if (cCourses && Array.isArray(cCourses)) setCourses(cCourses);
    } catch (e) {
      console.warn('LocalStorage hydration non-fatal warning:', e);
    }

    // 2. Fetch fresh data from backend API disk database
    fetch('/api/econ-writers').then(r => r.json()).then(d => {
      if (d.success && Array.isArray(d.writers)) {
        setWriters(d.writers);
        safeSetStorage('econ_writers', d.writers);
      }
    }).catch(() => {});

    fetch('/api/econ-media').then(r => r.json()).then(d => {
      if (d.success && Array.isArray(d.media)) {
        setMedia(d.media);
        safeSetStorage('econ_media', d.media);
      }
    }).catch(() => {});

    fetch('/api/econ-books').then(r => r.json()).then(d => {
      if (d.success && Array.isArray(d.books)) {
        const cleaned = d.books.map(sanitizeBookAuthor);
        setBooks(cleaned);
        safeSetStorage('econ_books', cleaned);
      }
    }).catch(() => {});

    fetch('/api/econ-articles').then(r => r.json()).then(d => {
      if (d.success && Array.isArray(d.articles)) {
        setArticles(d.articles);
        safeSetStorage('econ_articles', d.articles);
      }
    }).catch(() => {});

    fetch('/api/econ-courses').then(r => r.json()).then(d => {
      if (d.success && Array.isArray(d.courses)) {
        setCourses(d.courses);
        safeSetStorage('econ_courses', d.courses);
      }
    }).catch(() => {});

    const handleBooksUpdate = () => {
      fetch('/api/econ-books').then(r => r.json()).then(d => {
        if (d.success && Array.isArray(d.books)) {
          const cleaned = d.books.map(sanitizeBookAuthor);
          setBooks(cleaned);
          safeSetStorage('econ_books', cleaned);
        }
      }).catch(() => {});
    };

    window.addEventListener('econ_books_updated', handleBooksUpdate);
    return () => {
      window.removeEventListener('econ_books_updated', handleBooksUpdate);
    };
  }, []);

  const openStandaloneWindow = (title: string, categoryTag: string, htmlContent: string) => {
    const newWin = window.open('', '_blank');
    if (newWin) {
      newWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title.replace(/"/g, '&quot;')} - LankaEcon Academy</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Merriweather', serif; background-color: #FCFBFA; color: #0f172a; margin: 0; padding: 2.5rem 1.5rem; }
              .font-mono { font-family: 'JetBrains Mono', monospace; }
              .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
            </style>
          </head>
          <body class="max-w-4xl mx-auto">
            <div class="border-b-2 border-slate-900 pb-4 mb-6 font-mono text-xs text-amber-900 font-bold uppercase tracking-wider flex flex-wrap justify-between gap-2">
              <span>LANKAECON ACADEMY • UNIVERSITY & POLICY RESEARCH HUB</span>
              <span>${categoryTag.replace(/"/g, '&quot;')}</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-black text-slate-950 mb-6 leading-tight font-serif">${title}</h1>
            <div class="prose max-w-none leading-relaxed text-slate-900 font-serif space-y-4">
              ${htmlContent}
            </div>
            <div class="mt-12 pt-6 border-t border-slate-300 font-sans text-xs text-slate-500 text-center">
              Published on LankaEcon Academy Journal & Faculty Desk • All Rights Reserved
            </div>
          </body>
        </html>
      `);
      newWin.document.close();
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner - Rich Colourful Interface matching EconLanka Theme */}
      <div className="bg-gradient-to-r from-[#0B1E36] via-[#091527] to-[#122b4f] text-white p-8 sm:p-10 rounded-xs border-2 border-amber-500/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Background Colorful Lighting Radiance */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 shadow-xs rounded-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span>LANKAECON ACADEMY & FACULTY</span>
            </span>
            <span className="bg-sky-950/80 text-sky-300 text-[10px] font-mono px-2.5 py-0.5 border border-sky-400/40 font-bold rounded-xs">
              UNIVERSITY & POLICY RESEARCH HUB
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-amber-300 leading-tight tracking-tight drop-shadow-sm">
            {getUIText('econAcademyTitle', language)}
          </h2>

          <p className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
            {getUIText('econAcademyDesc', language)}
          </p>
        </div>

        <div className="relative z-10 shrink-0 bg-[#071324]/85 backdrop-blur-md p-5 border-2 border-amber-400/50 max-w-xs space-y-3 rounded-xs shadow-xl">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Teach & Publish With Us</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            Earn up to <strong className="text-amber-300 font-mono">85% tuition revenue share</strong> by publishing masterclasses, textbooks, or research papers.
          </p>
          <button
            onClick={() => {
              setInitialCategory('masterclass');
              setShowPublisherModal(true);
            }}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs py-2.5 px-4 uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md rounded-xs border border-amber-300"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>Publish Masterclass / Book</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Prominent Square Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {(
          [
            {
              id: 'courses',
              label: 'Masterclass Courses',
              subtitle: 'Video & Certification',
              tag: 'COURSES',
              icon: Award,
              featured: true,
            },
            {
              id: 'evolution',
              label: 'Evolution of Economic Thought',
              subtitle: 'History of Economic Doctrines',
              tag: 'THOUGHT',
              icon: History,
            },
            {
              id: 'articles',
              label: 'Scholar Treatises',
              subtitle: 'Peer-Reviewed Research',
              tag: 'PAPERS',
              icon: FileText,
            },
            {
              id: 'media',
              label: 'Lectures & Podcasts',
              subtitle: 'Audio-Visual Policy Debates',
              tag: 'MULTIMEDIA',
              icon: Video,
            },
            {
              id: 'books',
              label: 'Free Textbooks',
              subtitle: 'Open-Access Tomes',
              tag: 'LIBRARY',
              icon: BookOpen,
            },
            {
              id: 'writers',
              label: 'Faculty Roster',
              subtitle: 'Economics Deans & Authors',
              tag: 'FACULTY',
              icon: Users,
            },
          ] as Array<{ id: string; label: string; subtitle: string; tag: string; icon: any; featured?: boolean }>
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`group relative p-3.5 sm:p-4 rounded-xs border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[115px] shadow-xs hover:shadow-md transform hover:-translate-y-0.5 ${
                isActive
                  ? tab.featured
                    ? 'bg-[#091527] border-amber-500 text-white ring-2 ring-amber-500/40 shadow-lg'
                    : 'bg-[#091527] border-[#091527] text-white shadow-lg'
                  : tab.featured
                  ? 'bg-gradient-to-br from-amber-50/90 to-amber-100/60 border-amber-500/80 text-slate-900 hover:border-amber-600'
                  : 'bg-white border-slate-900 text-slate-900 hover:bg-[#FDFBF7] hover:border-slate-900'
              }`}
            >
              {/* Top Accent Line on Active */}
              {isActive && (
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    tab.featured ? 'bg-amber-400' : 'bg-rose-600'
                  }`}
                />
              )}

              {/* Top Tag & Icon Row */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span
                  className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-xs ${
                    isActive
                      ? tab.featured
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-rose-600 text-white'
                      : tab.featured
                      ? 'bg-amber-500/20 text-amber-900 font-extrabold border border-amber-500/40'
                      : 'bg-slate-200 text-slate-800 font-extrabold'
                  }`}
                >
                  {tab.tag}
                </span>

                <div
                  className={`p-1.5 rounded-xs transition-colors ${
                    isActive
                      ? tab.featured
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-rose-600 text-white'
                      : tab.featured
                      ? 'bg-amber-500/20 text-amber-700'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-0.5 mt-auto">
                <h3
                  className={`font-serif font-black text-xs leading-tight uppercase tracking-tight ${
                    isActive
                      ? 'text-white'
                      : tab.featured
                      ? 'text-slate-950'
                      : 'text-slate-900'
                  }`}
                >
                  {tab.label}
                </h3>
                <p
                  className={`text-[10px] font-sans leading-tight line-clamp-1 ${
                    isActive
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {tab.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 1. DEDICATED FULL-PAGE SCREEN VIEW FOR LECTURES & PODCASTS (activeMedia) */}
      {activeMedia && (
        <div className="fixed inset-0 z-[100] bg-slate-950 text-white overflow-y-auto flex flex-col min-h-screen">
          {/* Sticky Header Nav */}
          <div className="sticky top-0 z-20 bg-[#071324]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveMedia(null)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xs transition cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Econ Academy Directory</span>
              </button>
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-700 pl-3">
                <span className="bg-rose-600 text-white font-mono font-black text-[9px] uppercase px-2 py-0.5 rounded-xs">
                  {activeMedia.type} BROADCAST
                </span>
                <span className="text-slate-300 text-xs font-mono line-clamp-1">{activeMedia.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openStandaloneWindow(activeMedia.title, `${activeMedia.type} BROADCAST`, `
                  <p><strong>Speaker:</strong> ${activeMedia.speaker}</p>
                  <p><strong>Duration:</strong> ${activeMedia.duration}</p>
                  <hr/>
                  <div style="aspect-ratio: 16/9; background:#000; margin:1rem 0;">
                    <iframe src="${activeMedia.embedUrl}" style="width:100%; height:100%; border:0;" allowfullscreen></iframe>
                  </div>
                  <p>${activeMedia.description || ''}</p>
                `)}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-3 py-2 rounded-xs border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                title="Open in New Browser Window / Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in New Tab</span>
              </button>
              <button
                onClick={() => setActiveMedia(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition cursor-pointer"
                title="Close Reader Page"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Page View Body */}
          <div className="max-w-5xl mx-auto px-4 py-8 sm:px-8 space-y-8 flex-1 w-full">
            <div className="bg-[#0B1E36] border-2 border-amber-500/50 rounded-xs p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 font-mono font-black text-[10px] uppercase px-2.5 py-0.5 rounded-xs">
                    {activeMedia.type}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">Broadcast Length: {activeMedia.duration}</span>
                </div>
                <span className="text-amber-300 font-mono text-xs font-bold">LankaEcon Audio-Visual Policy Series</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-amber-300 leading-tight">
                {activeMedia.title}
              </h1>

              <p className="text-slate-300 text-sm font-sans">
                <strong>Featured Speaker / Policy Scholar:</strong> {activeMedia.speaker}
              </p>

              {/* Responsive Video/Audio Theater Screen */}
              <div className="aspect-video w-full rounded-xs overflow-hidden bg-black border-2 border-slate-800 shadow-2xl relative">
                <iframe
                  src={activeMedia.embedUrl}
                  title={activeMedia.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>

              {activeMedia.description && (
                <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xs space-y-2 text-slate-200 text-sm font-sans leading-relaxed">
                  <h4 className="font-serif font-bold text-amber-400 text-sm uppercase tracking-wider">Broadcast Summary & Key Notes:</h4>
                  <p>{activeMedia.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. DEDICATED FULL-PAGE SCREEN VIEW FOR MASTERCLASS COURSES (selectedCourse) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] bg-[#071322] text-white overflow-y-auto flex flex-col min-h-screen font-sans">
          {/* Sticky Top Nav */}
          <div className="sticky top-0 z-20 bg-[#091527]/95 backdrop-blur-md border-b border-amber-500/40 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xs transition cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Econ Academy Directory</span>
              </button>
              <div className="hidden md:flex items-center gap-2 border-l border-slate-700 pl-3">
                <span className="bg-amber-400 text-slate-950 font-mono font-black text-[9px] uppercase px-2 py-0.5 rounded-xs">
                  {selectedCourse.level}
                </span>
                <span className="text-amber-300 text-xs font-mono line-clamp-1">{selectedCourse.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openStandaloneWindow(selectedCourse.title, `MASTERCLASS COURSE • ${selectedCourse.level}`, `
                  <p><strong>Instructor:</strong> ${selectedCourse.instructor} (${selectedCourse.affiliation})</p>
                  <hr/>
                  <p>${selectedCourse.description}</p>
                  ${selectedCourse.lessons ? `
                    <h2>Course Curriculum (${selectedCourse.lessons.length} Modules)</h2>
                    <ul>
                      ${selectedCourse.lessons.map((l, i) => `<li><strong>Module ${i+1}: ${l.title}</strong> (${l.duration})<p>${l.description}</p></li>`).join('')}
                    </ul>
                  ` : ''}
                `)}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-3 py-2 rounded-xs border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                title="Open Course Page in New Window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in New Tab</span>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xs border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Syllabus</span>
              </button>
              <button
                onClick={() => setSelectedCourse(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition cursor-pointer"
                title="Close Masterclass Screen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Page Body */}
          <div className="max-w-5xl mx-auto px-4 py-8 sm:px-8 space-y-8 flex-1 w-full">
            {/* Masterclass Hero Header */}
            <div className="bg-[#0B1E36] border-2 border-amber-500 rounded-xs p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 font-mono font-black text-[10px] uppercase px-2.5 py-1 rounded-xs">
                    {selectedCourse.level}
                  </span>
                  <span className="text-amber-300 font-mono text-xs font-bold uppercase">{selectedCourse.category}</span>
                </div>
                <span className="bg-sky-950 text-sky-300 text-[10px] font-mono px-2.5 py-1 border border-sky-400/40 rounded-xs font-bold">
                  ACADEMIC CERTIFICATION COURSE
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-amber-300 leading-tight">
                {selectedCourse.title}
              </h1>

              <div className="flex items-center gap-4 bg-[#071322] p-4 border border-slate-800 rounded-xs">
                <img src={selectedCourse.instructorAvatar} alt={selectedCourse.instructor} className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-white text-base">{selectedCourse.instructor}</h4>
                  <p className="text-amber-300 text-xs">{selectedCourse.affiliation}</p>
                  <p className="text-slate-400 text-[11px] font-mono mt-0.5">Faculty Dean & Research Chair</p>
                </div>
              </div>

              {/* Course Overview */}
              <div className="bg-white text-slate-950 p-6 sm:p-8 rounded-xs shadow-inner space-y-4">
                <h3 className="font-serif font-black text-lg text-slate-950 uppercase border-b border-slate-200 pb-2">
                  Course Syllabus & Overview
                </h3>
                <FormattedText content={selectedCourse.description} googleDocUrl={selectedCourse.googleDocUrl} />
              </div>

              {/* Lessons / Modules */}
              {selectedCourse.lessons && selectedCourse.lessons.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="font-serif font-bold text-amber-300 text-xl uppercase tracking-wider">
                    Course Modules & Video Curriculum ({selectedCourse.lessons.length}):
                  </h3>
                  <div className="space-y-4">
                    {selectedCourse.lessons.map((lesson, idx) => (
                      <div key={lesson.id} className="bg-slate-900 border-2 border-slate-800 p-5 rounded-xs space-y-3">
                        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                          <span className="font-bold text-amber-400 text-sm">Module {idx + 1}: {lesson.title}</span>
                          <span className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{lesson.duration}</span>
                        </div>
                        {lesson.videoUrl && (
                          <div className="aspect-video bg-black rounded-xs overflow-hidden border border-slate-800 my-2">
                            <iframe
                              src={lesson.videoUrl.includes('youtube.com/watch') ? lesson.videoUrl.replace('watch?v=', 'embed/') : lesson.videoUrl}
                              title={lesson.title}
                              className="w-full h-full border-0"
                              allowFullScreen
                            />
                          </div>
                        )}
                        <FormattedText content={lesson.description} googleDocUrl={lesson.googleDocUrl} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. DEDICATED FULL-PAGE SCREEN VIEW FOR SCHOLAR TREATISES (selectedTreatise) */}
      {selectedTreatise && (
        <div className="fixed inset-0 z-[100] bg-[#FCFBFA] text-slate-950 overflow-y-auto flex flex-col min-h-screen font-serif">
          {/* Sticky Top Header */}
          <div className="sticky top-0 z-20 bg-[#F4F1EA]/95 backdrop-blur-md border-b-2 border-amber-600/60 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 shadow-md font-sans">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTreatise(null)}
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-3.5 py-2 rounded-xs transition cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Econ Academy Directory</span>
              </button>
              <div className="hidden lg:flex items-center gap-2 border-l border-slate-300 pl-3">
                <span className="bg-sky-900 text-sky-100 font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded-xs">
                  JOURNAL ISSN 2783-9122
                </span>
                <span className="text-slate-700 text-xs font-serif line-clamp-1 italic">{selectedTreatise.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openStandaloneWindow(
                  selectedTreatise.title,
                  `ACADEMIC TREATISE • ${selectedTreatise.category}`,
                  `
                    <p><strong>Author:</strong> ${selectedTreatise.authorName} (${selectedTreatise.authorTitle}, ${selectedTreatise.authorAffiliation})</p>
                    <p><strong>Published Date:</strong> ${selectedTreatise.publishedAt.split('T')[0]}</p>
                    <blockquote style="background:#fef3c7; border-left:4px solid #d97706; padding:1rem; margin:1rem 0; italic;">
                      "${selectedTreatise.summary}"
                    </blockquote>
                    <hr/>
                    <div>${selectedTreatise.content}</div>
                  `
                )}
                className="bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold px-3 py-2 rounded-xs transition cursor-pointer flex items-center gap-1.5"
                title="Open Paper in New Browser Window / Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in New Tab</span>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
              <button
                onClick={() => setSelectedTreatise(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-full transition cursor-pointer shrink-0"
                title="Close Paper Reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Page Body */}
          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-8 space-y-8 flex-1 w-full">
            {/* Journal Header Banner */}
            <div className="border-b-2 border-slate-900 pb-4 space-y-1 font-mono">
              <div className="flex flex-wrap justify-between items-center text-xs text-amber-900 font-bold uppercase tracking-widest">
                <span>LANKAECON ACADEMY JOURNAL OF ECONOMIC POLICY</span>
                <span>ISSN 2783-9122</span>
              </div>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider">
                FACULTY OF ECONOMICS, UNIVERSITY OF COLOMBO & CENTRAL BANK RESEARCH DESK
              </p>
            </div>

            {/* Paper Title */}
            <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-slate-950 leading-tight">
              {selectedTreatise.title}
            </h1>

            {/* Author Credentials */}
            <div className="flex items-center gap-4 bg-[#F4F1EA] p-5 border border-[#E2DFD7] rounded-xs font-sans">
              <img
                src={selectedTreatise.authorAvatar}
                alt={selectedTreatise.authorName}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-600 shrink-0"
              />
              <div className="space-y-0.5 text-xs">
                <h4 className="font-bold text-slate-950 text-base font-serif">{selectedTreatise.authorName}</h4>
                <p className="text-amber-900 font-semibold">{selectedTreatise.authorTitle}</p>
                <p className="text-slate-600 text-[11px]">{selectedTreatise.authorAffiliation}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] font-mono text-slate-500">
                  <span>Published: {selectedTreatise.publishedAt.split('T')[0]}</span>
                  <span>•</span>
                  <span>Category: {selectedTreatise.category}</span>
                  <span>•</span>
                  <span>Reading Time: {selectedTreatise.readingTimeMinutes} mins</span>
                </div>
              </div>
            </div>

            {/* Executive Abstract */}
            <div className="bg-amber-50/80 border-l-4 border-amber-600 p-6 rounded-xs space-y-2">
              <div className="flex items-center justify-between font-sans">
                <span className="font-mono text-xs font-black text-amber-900 uppercase tracking-widest">
                  EXECUTIVE ABSTRACT
                </span>
                <span className="bg-amber-200/80 text-amber-950 text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold">
                  JEL Codes: E44, F31, F34
                </span>
              </div>
              <p className="text-base text-slate-900 italic leading-relaxed">
                "{selectedTreatise.summary}"
              </p>
            </div>

            {/* Full Paper Body */}
            <div className="prose max-w-none text-slate-900 font-serif leading-relaxed border-t border-b border-[#E2DFD7] py-8 text-base">
              <FormattedText content={selectedTreatise.content} googleDocUrl={selectedTreatise.googleDocUrl} />
            </div>

            {/* Takeaways */}
            {selectedTreatise.keyTakeaways && selectedTreatise.keyTakeaways.length > 0 && (
              <div className="bg-[#F4F1EA] border border-[#E2DFD7] p-6 rounded-xs space-y-3 font-sans">
                <h4 className="font-serif font-black text-sm uppercase text-amber-950 tracking-wider">
                  Policy Takeaways & Recommendations:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                  {selectedTreatise.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-3 border border-[#E2DFD7] rounded-xs">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Citation Box */}
            <div className="bg-slate-900 text-white p-5 rounded-xs border border-slate-800 space-y-2 font-sans text-xs">
              <p className="font-mono font-bold text-amber-400 uppercase text-[10px] tracking-wider">
                How to Cite This Treatise (APA Format):
              </p>
              <p className="font-mono text-slate-300 text-[11px] bg-slate-950 p-3 border border-slate-800 rounded-xs select-all">
                {selectedTreatise.authorName} ({selectedTreatise.publishedAt.split('-')[0]}). "{selectedTreatise.title}." <em className="text-amber-300">LankaEcon Academic Faculty Research Series</em>, University of Colombo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. DEDICATED FULL-PAGE SCREEN VIEW FOR FREE TEXTBOOKS (selectedBook) */}
      {selectedBook && (
        <InteractiveBookReader
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          language={language}
        />
      )}

      {/* 5. DEDICATED FULL-PAGE SCREEN VIEW FOR FACULTY MEMBER (selectedFaculty) */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-[100] bg-[#091527] text-white overflow-y-auto flex flex-col min-h-screen font-sans">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-[#071322]/95 backdrop-blur-md border-b border-amber-500/40 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xl">
            <button
              onClick={() => setSelectedFaculty(null)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xs transition cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Econ Academy Directory</span>
            </button>

            <button
              onClick={() => setSelectedFaculty(null)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-8 space-y-8 flex-1 w-full">
            <div className="bg-[#0B1E36] border-2 border-amber-500/60 p-8 rounded-xs shadow-2xl text-center space-y-4">
              <img src={selectedFaculty.avatarUrl} alt={selectedFaculty.name} className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-amber-400 shadow-xl" />
              <h1 className="font-serif font-black text-3xl text-amber-300">{selectedFaculty.name}</h1>
              <p className="text-base font-semibold text-slate-200">{selectedFaculty.title}</p>
              <p className="text-xs text-slate-400 font-mono">{selectedFaculty.affiliation}</p>
              <p className="text-sm text-slate-300 italic max-w-2xl mx-auto leading-relaxed font-serif pt-2">{selectedFaculty.bio}</p>

              <div className="flex flex-wrap gap-2 justify-center pt-3">
                {selectedFaculty.topics.map((t, idx) => (
                  <span key={idx} className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-xs border border-amber-500/40 font-mono font-bold">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content views */}
      {subTab === 'evolution' && <EconomicThoughtSection language={language} />}

      {subTab === 'courses' && (
        <div className="space-y-8">
          {/* Masterclass Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(courses.length > 0 ? courses : INITIAL_ECON_COURSES).map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  if (c.id === 'course-adam-smith' || c.title.includes('Adam Smith')) {
                    setShowAdamSmithTreatise(true);
                    const el = document.getElementById('adam-smith-masterclass-box');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setSelectedCourse(c);
                  }
                }}
                className="bg-white border border-[#E5E2DC] rounded-xl overflow-hidden shadow-2xs hover:border-amber-700 transition flex flex-col justify-between cursor-pointer group hover:shadow-lg"
              >
                <div>
                  <div className="relative h-48 bg-gray-900">
                    <img
                      src={c.thumbnailUrl}
                      alt={c.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                      {c.level}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-lg text-gray-900 mb-2 group-hover:text-amber-800 transition">{c.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-3 mb-4">{c.description}</p>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-700 border-t border-gray-100 pt-3">
                      <img src={c.instructorAvatar} alt={c.instructor} className="w-7 h-7 rounded-full object-cover border border-amber-500" />
                      <div>
                        <p className="font-bold">{c.instructor}</p>
                        <p className="text-[10px] text-gray-500">{c.affiliation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF9F6] border-t border-[#EAE7DF] flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900">{c.lessons.length} Module{c.lessons.length > 1 ? 's' : ''} Included</span>
                  <button className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-3.5 py-1.5 rounded transition cursor-pointer flex items-center gap-1">
                    <span>{c.id === 'course-adam-smith' || c.title.includes('Adam Smith') ? 'Read Unabridged Treatise' : 'Open Course Page'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DEDICATED ADAM SMITH MASTERCLASS & UNABRIDGED TREATISE BOX */}
          <div id="adam-smith-masterclass-box" className="bg-[#091527] text-white rounded-xs border-2 border-amber-500/60 shadow-2xl overflow-hidden p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-xs text-amber-300">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-slate-950 font-mono font-black text-[9px] uppercase px-2 py-0.5 rounded-xs">
                      CLASSICAL MASTERCLASS
                    </span>
                    <span className="text-slate-400 text-xs font-mono">1776 WEALTH OF NATIONS</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-amber-300 uppercase tracking-tight mt-1">
                    Adam Smith: Of Money & National Capital Maintenance
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowAdamSmithTreatise(!showAdamSmithTreatise)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xs border border-slate-700 transition cursor-pointer self-start sm:self-auto"
              >
                <span>{showAdamSmithTreatise ? 'Hide Treatise' : 'Show Full Treatise'}</span>
                {showAdamSmithTreatise ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showAdamSmithTreatise && (
              <div className="bg-white text-slate-900 rounded-xs p-2 sm:p-4 shadow-inner">
                <AdamSmithMonetarySection language={language} />
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'articles' && (
        <div className="space-y-6">
          {/* Header & Filter Bar for Scholar Treatises */}
          <div className="bg-[#091527] text-white p-5 rounded-xs border-2 border-amber-500/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-sky-500 text-slate-950 font-mono font-black text-[9px] uppercase px-2 py-0.5 rounded-xs">
                  ACADEMIC JOURNAL
                </span>
                <span className="text-slate-400 text-xs font-mono">PEER-REVIEWED RESEARCH TREATISES</span>
              </div>
              <h3 className="font-serif text-2xl font-black text-amber-300 uppercase tracking-tight mt-1">
                LankaEcon Faculty Scholar Treatises
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-0.5 max-w-2xl">
                Read full short papers, macroeconomic policy briefs, and econometric analyses authored by university professors and central bank fellows.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
              <div className="relative flex-1 md:flex-initial">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search treatises..."
                  value={treatiseSearch}
                  onChange={(e) => setTreatiseSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-700 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-amber-400 w-full md:w-56 rounded-xs"
                />
              </div>

              <select
                value={treatiseCategory}
                onChange={(e) => setTreatiseCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-amber-400 rounded-xs"
              >
                <option value="all">All Academic Categories</option>
                <option value="Monetary">Monetary Policy & Exchange Rates</option>
                <option value="Sovereign">Sovereign Debt & Restructuring</option>
                <option value="Inflation">Inflation & Price Stability</option>
              </select>

              <button
                onClick={() => {
                  setInitialCategory('essay');
                  setShowPublisherModal(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 rounded-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Paper</span>
              </button>
            </div>
          </div>

          {/* List of Scholar Treatises (Presented in Tile/Grid Format) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles
              .filter((art) => {
                const matchesQuery =
                  art.title.toLowerCase().includes(treatiseSearch.toLowerCase()) ||
                  art.summary.toLowerCase().includes(treatiseSearch.toLowerCase()) ||
                  art.authorName.toLowerCase().includes(treatiseSearch.toLowerCase());
                const matchesCat =
                  treatiseCategory === 'all' ||
                  art.category.toLowerCase().includes(treatiseCategory.toLowerCase());
                return matchesQuery && matchesCat;
              })
              .map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedTreatise(art)}
                  className="bg-white border border-[#E5E2DC] rounded-xl overflow-hidden shadow-2xs hover:border-amber-700 transition flex flex-col justify-between cursor-pointer group hover:shadow-lg"
                >
                  <div>
                    <div className="relative h-48 bg-gray-900">
                      <img
                        src={art.imageUrl || art.thumbnailUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'}
                        alt={art.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        {art.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        {art.readingTimeMinutes} min read
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-serif font-bold text-lg text-gray-900 mb-2 group-hover:text-amber-800 transition line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 mb-4">{art.summary}</p>

                      <div className="flex items-center space-x-3 text-xs text-gray-700 border-t border-gray-100 pt-3">
                        <img
                          src={art.authorAvatar}
                          alt={art.authorName}
                          className="w-7 h-7 rounded-full object-cover border border-amber-500"
                        />
                        <div>
                          <p className="font-bold">{art.authorName}</p>
                          <p className="text-[10px] text-gray-500">{art.authorTitle} • {art.authorAffiliation}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF9F6] border-t border-[#EAE7DF] flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 text-[11px] font-mono">
                      Published {art.publishedAt.split('T')[0]}
                    </span>
                    <button className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1">
                      <span>Read Paper Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {subTab === 'media' && (
        <div className="space-y-8">
          {/* INTERACTIVE WHITEBOARD FOR TUTORS & LIVE ONLINE CLASSES (BUILT SPECIFICALLY FOR MOBILE & TABLET) */}
          <div className="block lg:hidden space-y-3">
            <div className="bg-gradient-to-r from-[#091527] via-[#0F1E36] to-[#0A1728] text-white p-4 sm:p-5 rounded-2xl border-2 border-amber-500/70 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 font-mono font-black text-[10px] sm:text-xs uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>TUTOR LIVE WHITEBOARD</span>
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                    Stylus & Touch Ready
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-300 font-bold">
                  Mobile & Tablet Classroom
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <h3 className="text-base sm:text-lg font-serif font-extrabold text-white">
                  Interactive Economics Teaching Board
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interactive stylus whiteboard for tutors teaching degree-level or school economics during live online classes (Zoom, Google Meet, MS Teams). Supports pressure-sensitive electronic pens (Apple Pencil, S-Pen, active stylus), coordinate curves, live laser pointer, preset diagrams, and formula stamps.
                </p>
              </div>

              {/* Feature Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="bg-slate-800/90 text-slate-200 text-[9.5px] font-mono px-2 py-0.5 rounded border border-slate-700">
                  🎯 Laser Pointer for Demos
                </span>
                <span className="bg-slate-800/90 text-slate-200 text-[9.5px] font-mono px-2 py-0.5 rounded border border-slate-700">
                  📊 IS-LM / AD-AS / Monopoly Curves
                </span>
                <span className="bg-slate-800/90 text-slate-200 text-[9.5px] font-mono px-2 py-0.5 rounded border border-slate-700">
                  📑 Multi-Board Slides
                </span>
                <span className="bg-slate-800/90 text-slate-200 text-[9.5px] font-mono px-2 py-0.5 rounded border border-slate-700">
                  📥 PNG Notes Downloader
                </span>
              </div>
            </div>

            {/* Live Interactive Whiteboard on Mobile & Tablet */}
            <EconTutorWhiteboard />
          </div>

          {/* Desktop Tablet Notice */}
          <div className="hidden lg:block bg-gradient-to-r from-[#091527] to-[#1E293B] text-white p-5 rounded-2xl border border-amber-500/50 shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">
                    📱 Tutor Electronic Pen Whiteboard (Optimized for Tablet & Mobile Touchscreens)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    The interactive stylus whiteboard is specially calibrated for touch screens (iPads, Android tablets, and phones) with active pen tracking, pressure sensitivity, and live laser pointing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDesktopWhiteboard(!showDesktopWhiteboard)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition shrink-0 cursor-pointer shadow-md"
              >
                {showDesktopWhiteboard ? 'Hide Whiteboard Preview' : 'Open Whiteboard Canvas'}
              </button>
            </div>

            {showDesktopWhiteboard && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <EconTutorWhiteboard onClose={() => setShowDesktopWhiteboard(false)} />
              </div>
            )}
          </div>

          {/* Video Lectures & Podcasts Collection */}
          <div className="space-y-4 pt-2">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Recorded Video Lectures & Policy Debates
                </h3>
                <p className="text-xs text-slate-500">
                  Authoritative multimedia discussions with university faculty & central bankers
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                {media.length} Lectures Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {media.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setActiveMedia(m)}
                  className="bg-white border border-[#E5E2DC] rounded-xl overflow-hidden cursor-pointer hover:border-amber-700 transition group shadow-2xs hover:shadow-lg"
                >
                  <div className="relative h-40 bg-black">
                    <img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {m.duration}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <span className="text-[10px] font-bold text-amber-800 uppercase">{m.type}</span>
                    <h4 className="font-serif font-bold text-xs text-gray-900 group-hover:text-amber-800 line-clamp-2 mt-1">{m.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-2">Speaker: {m.speaker}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === 'books' && (() => {
        const featuredBook = books.find((b) => b.id === 'book-ranul-001' || b.title.toLowerCase().includes('story behind sri lanka')) || books[0];
        const otherBooks = books.filter((b) => b?.id !== featuredBook?.id);

        return (
          <div className="space-y-8">
            {/* BIG HERO FEATURED TILE FOR THE MONETARY TREATISE */}
            {featuredBook && (
              <div className="bg-gradient-to-br from-[#0B1320] via-[#0F1E36] to-[#0A1728] border-2 border-amber-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white space-y-6">
                {/* Background Glow Effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                      <span>FEATURED AUTHORITATIVE MONETARY TREATISE</span>
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                      191 Pages Complete • 2026 Edition
                    </span>
                  </div>

                  <div className="text-amber-400 font-mono text-xs font-bold flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                    <span>Digital License: LKR 2,500 (~$12.50 USD)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  {/* Book Cover Image */}
                  <div className="lg:col-span-4 flex justify-center">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => {
                        setSelectedBookForDetails(featuredBook);
                        setShowBookDetailModal(true);
                      }}
                    >
                      <img
                        src={featuredBook.coverUrl}
                        alt={featuredBook.title}
                        className="w-52 h-72 sm:w-60 sm:h-84 object-cover rounded-xl shadow-2xl border-2 border-amber-500/50 group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          <span>View Description & Chapter 1 Preview</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="space-y-2">
                      <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider block">
                        CENTRAL BANKING & MONETARY POLICY DISSECTION
                      </span>
                      <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight tracking-tight">
                        {featuredBook.title}
                      </h2>
                      <p className="font-serif text-lg text-amber-200/90 font-bold italic">
                        "A Nation Held at Ransom by Its Own Central Bank"
                      </p>
                      <p className="text-sm text-slate-300 font-mono">
                        {featuredBook.author && !featuredBook.author.toLowerCase().includes('ranul') ? (
                          <>Author: <strong className="text-white font-serif">{featuredBook.author}</strong> | </>
                        ) : null}Revised Edition: <strong className="text-amber-400">{featuredBook.publishedYear}</strong>
                      </p>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed font-serif line-clamp-3">
                      {featuredBook.description}
                    </p>

                    {/* Key Feature Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                      <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-center">
                        <span className="text-slate-400 text-[10px] uppercase block">Volume</span>
                        <strong className="text-amber-400 font-bold">191 Pages</strong>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-center">
                        <span className="text-slate-400 text-[10px] uppercase block">Structure</span>
                        <strong className="text-amber-400 font-bold">18 Chapters</strong>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-center">
                        <span className="text-slate-400 text-[10px] uppercase block">Format</span>
                        <strong className="text-amber-400 font-bold">3D FlipHTML5</strong>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-center">
                        <span className="text-slate-400 text-[10px] uppercase block">Access</span>
                        <strong className="text-emerald-400 font-bold">Online Reader</strong>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-3">
                      <button
                        onClick={() => {
                          setSelectedBookForDetails(featuredBook);
                          setShowBookDetailModal(true);
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-lg shadow-xl transition cursor-pointer flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-slate-950" />
                        <span>View Description & Read Free Chapter 1</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBookForDetails(featuredBook);
                          setShowBookDetailModal(true);
                        }}
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-lg border border-amber-400/40 shadow-xl transition cursor-pointer flex items-center gap-2"
                      >
                        <Award className="w-4 h-4 text-amber-300" />
                        <span>Purchase & Read Online (LKR 2,500)</span>
                      </button>

                      <button
                        onClick={() => {
                          const flipUrl = featuredBook.flipHtml5Url || (featuredBook.readOnlineUrl?.includes('fliphtml5.com') ? featuredBook.readOnlineUrl : 'https://online.fliphtml5.com/EconMatrix/kbcg/');
                          const newWin = window.open('', '_blank');
                          if (newWin) {
                            const sanitizedTitle = (featuredBook.title || 'Economics Book').replace(/"/g, '&quot;');
                            const sanitizedAuthor = (featuredBook.author ? ` • ${featuredBook.author}` : '').replace(/"/g, '&quot;');
                            const sanitizedDesc = (featuredBook.description || '').slice(0, 140).replace(/"/g, '&quot;');
                            newWin.document.write(`
                              <!DOCTYPE html>
                              <html lang="en">
                                <head>
                                  <meta charset="utf-8">
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                  <title>${sanitizedTitle} - Flipbook</title>
                                  <script src="https://cdn.tailwindcss.com"></script>
                                  <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
                                  <style>
                                    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0B1320; color: #F8FAFC; margin: 0; padding: 0; }
                                    .font-serif { font-family: 'Merriweather', serif; }
                                    .font-mono { font-family: 'JetBrains Mono', monospace; }
                                  </style>
                                </head>
                                <body class="min-h-screen flex flex-col bg-[#0B1320] text-slate-100">
                                  <nav class="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xl">
                                    <div class="flex items-center gap-3">
                                      <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md font-mono text-base">
                                        EM
                                      </div>
                                      <div>
                                        <span class="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">ECON MATRIX • MONETARY RESEARCH</span>
                                        <h1 class="font-serif font-bold text-sm sm:text-base text-white tracking-tight leading-none">${sanitizedTitle}</h1>
                                      </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                      <button onclick="document.getElementById('flipbook-frame-container').requestFullscreen ? document.getElementById('flipbook-frame-container').requestFullscreen() : null" class="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3.5 py-1.5 rounded text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer">
                                        <span>Fullscreen Mode</span>
                                      </button>
                                      <button onclick="window.close()" class="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 px-3 py-1.5 rounded text-xs font-mono font-bold transition cursor-pointer">
                                        Close
                                      </button>
                                    </div>
                                  </nav>

                                  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center">
                                    <section class="text-center max-w-4xl mx-auto space-y-3 mb-8">
                                      <div class="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-extrabold uppercase px-3.5 py-1 rounded-full shadow-xs">
                                        <span>📖 3D DIGITAL FLIPBOOK</span>
                                        <span>•</span>
                                        <span>${featuredBook.category || 'CENTRAL BANK MONETARY POLICY'}</span>
                                      </div>
                                      <h1 class="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                                        ${sanitizedTitle}
                                      </h1>
                                      ${sanitizedDesc ? `<p class="font-serif text-base sm:text-xl text-amber-200/90 font-bold italic">"${sanitizedDesc}"</p>` : ''}
                                      <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80 max-w-xl mx-auto">
                                        <span>Author: <strong class="text-white">${sanitizedAuthor}</strong></span>
                                        <span>•</span>
                                        <span>Volume: <strong class="text-white">${featuredBook.pagesCount || 191} Pages</strong></span>
                                        <span>•</span>
                                        <span>Edition: <strong class="text-white">${featuredBook.publishedYear || '2026'}</strong></span>
                                      </div>
                                    </section>

                                    <div id="flipbook-frame-container" class="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-xl p-2 sm:p-4 shadow-2xl space-y-3">
                                      <div class="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
                                        <div class="flex items-center gap-2 text-slate-300">
                                          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                          <span class="font-bold text-amber-400">Interactive 3D FlipHTML5 Reader</span>
                                        </div>
                                        <span class="text-slate-400 hidden sm:inline">Use corner drag, arrow keys or pinch to flip pages</span>
                                      </div>

                                      <div style="position:relative;padding-top:max(60%,324px);width:100%;height:0;">
                                        <iframe style="position:absolute;border:none;width:100%;height:100%;left:0;top:0;" src="${flipUrl}" title="${sanitizedTitle}" seamless="seamless" scrolling="no" frameborder="0" allowtransparency="true" allowfullscreen="true"></iframe>
                                      </div>
                                    </div>
                                  </main>

                                  <footer class="bg-[#0F172A] border-t border-slate-800 py-4 text-center text-xs font-mono text-slate-400">
                                    <p>Econ Matrix Research Publication • All Rights Reserved © ${featuredBook.publishedYear || '2026'}${sanitizedAuthor}</p>
                                  </footer>
                                </body>
                              </html>
                            `);
                            newWin.document.close();
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 text-xs font-bold px-4 py-3 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                        title="Open Standalone Window Reader"
                      >
                        <span>Standalone Window</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REST OF THE BOOKS LIST BELOW */}
            {otherBooks.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-800" />
                  <span>Classical & Modern Policy Literature Library</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {otherBooks.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        setSelectedBookForDetails(b);
                        setShowBookDetailModal(true);
                      }}
                      className="bg-white border border-[#E5E2DC] rounded-xl p-5 flex gap-4 shadow-2xs hover:border-amber-700 transition cursor-pointer group hover:shadow-lg"
                    >
                      <img src={b.coverUrl} alt={b.title} className="w-28 h-40 object-cover rounded shadow border shrink-0 group-hover:scale-105 transition" />
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase font-mono">
                            {b.category}
                          </span>
                          <h4 className="font-serif font-bold text-base text-gray-900 group-hover:text-amber-800 transition mt-1">{b.title}</h4>
                          <p className="text-xs text-gray-600 font-medium">{b.author && !b.author.toLowerCase().includes('ranul') ? `By ${b.author} ` : ''}({b.publishedYear})</p>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-2">{b.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedBookForDetails(b);
                              setShowBookDetailModal(true);
                            }}
                            className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Read & View Book</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {subTab === 'writers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {writers.map((w) => (
            <div
              key={w.id}
              onClick={() => setSelectedFaculty(w)}
              className="bg-white border border-[#E5E2DC] rounded-xl p-5 text-center shadow-2xs space-y-3 hover:border-amber-700 transition cursor-pointer group hover:shadow-lg"
            >
              <img src={w.avatarUrl} alt={w.name} className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-amber-600 group-hover:scale-105 transition" />
              <div>
                <h4 className="font-serif font-bold text-base text-gray-900 group-hover:text-amber-800 transition">{w.name}</h4>
                <p className="text-xs font-semibold text-amber-900">{w.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{w.affiliation}</p>
              </div>
              <p className="text-xs text-gray-600 line-clamp-3 italic">{w.bio}</p>
              <div className="flex flex-wrap gap-1 justify-center pt-1">
                {w.topics.map((t, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publisher Submission Popup Modal with Explicit Exit Option */}
      <PublisherSubmissionModal
        isOpen={showPublisherModal}
        onClose={() => setShowPublisherModal(false)}
        defaultTarget="econ_academy"
        defaultCategory={initialCategory}
      />

      {/* Book Detail, Chapter 1 Preview & Payment Checkout Modal */}
      <BookDetailModal
        book={selectedBookForDetails}
        isOpen={showBookDetailModal}
        onClose={() => setShowBookDetailModal(false)}
        onOpenFlipbook={(bookToOpen) => {
          setShowBookDetailModal(false);
          setSelectedBook(bookToOpen);
        }}
        language={language}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ScholarWriter, EconCourse, EconScholarArticle, EconBook, EconMediaContent, PublisherSubmission, TuitionReceipt, BookPage } from '../types';
import { processPasteData } from '../utils/wordPasteHandler';
import { autoSplitTextIntoBookPages } from '../data/book191Pages';
import { sanitizeAndFormatBookText } from '../utils/bookTextSanitizer';
import { safeSetStorage } from '../utils/safeStorage';
import { FormattedText } from './FormattedText';
import { 
  Award, 
  FileText, 
  Video, 
  BookOpen, 
  Users, 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Trash2, 
  Mail, 
  ShieldCheck, 
  DollarSign, 
  Send, 
  RefreshCw, 
  Search, 
  Sparkles,
  ExternalLink,
  UserPlus,
  CreditCard,
  Receipt,
  Download,
  Plus,
  Pencil,
  GraduationCap,
  Image as ImageIcon,
  Upload,
  Camera,
  Check,
  Eye
} from 'lucide-react';

export const EconAcademyBackendPortal: React.FC = () => {
  const [activeCategoryTile, setActiveCategoryTile] = useState<'courses' | 'articles' | 'media' | 'books' | 'faculty' | 'tuition'>('courses');

  // Database States
  const [courses, setCourses] = useState<EconCourse[]>([]);
  const [articles, setArticles] = useState<EconScholarArticle[]>([]);
  const [media, setMedia] = useState<EconMediaContent[]>([]);
  const [books, setBooks] = useState<EconBook[]>([]);
  const [faculty, setFaculty] = useState<ScholarWriter[]>([]);
  const [submissions, setSubmissions] = useState<PublisherSubmission[]>([]);
  const [tuitionReceipts, setTuitionReceipts] = useState<TuitionReceipt[]>([]);

  // Search & Loading
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pasteNotice, setPasteNotice] = useState('');

  // Modal / Add Individual Form States
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyEmail, setNewFacultyEmail] = useState('');
  const [newFacultyTitle, setNewFacultyTitle] = useState('Senior Macroeconomic Research Fellow');
  const [newFacultyUniversity, setNewFacultyUniversity] = useState('University of Colombo Faculty of Economics');
  const [newFacultyBio, setNewFacultyBio] = useState('');
  const [newFacultyAvatar, setNewFacultyAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  // Master Course Direct Upload Modal States
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [cTitle, setCTitle] = useState('');
  const [cInstructor, setCInstructor] = useState('Dr. Mahinda Wickramasinghe');
  const [cAffiliation, setCAffiliation] = useState('University of Colombo Faculty of Economics');
  const [cCategory, setCCategory] = useState('Central Banking & Monetary Policy');
  const [cLevel, setCLevel] = useState('ADVANCED FELLOWSHIP');
  const [cSummary, setCSummary] = useState('');
  const [cImageUrl, setCImageUrl] = useState('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80');
  const [cGoogleDocUrl, setCGoogleDocUrl] = useState('');
  const [cModule1Title, setCModule1Title] = useState('Module 1: Macro-Financial Framework');
  const [cModule1Url, setCModule1Url] = useState('');

  // Scholar Treatise Direct Upload Modal States
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [aTitle, setATitle] = useState('');
  const [aAuthorName, setAAuthorName] = useState('Disnaka');
  const [aAuthorTitle, setAAuthorTitle] = useState('Senior Macroeconomics Fellow');
  const [aAuthorAffiliation, setAAuthorAffiliation] = useState('University of Colombo & CBSL Research Desk');
  const [aCategory, setACategory] = useState('Monetary Policy & Exchange Rates');
  const [aImageUrl, setAImageUrl] = useState('');
  const [aSummary, setASummary] = useState('');
  const [aFullContent, setAFullContent] = useState('');
  const [aGoogleDocUrl, setAGoogleDocUrl] = useState('');
  const [aKeyTakeaways, setAKeyTakeaways] = useState('');

  // Video Lecture / Podcast Direct Upload Modal States
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mSpeaker, setMSpeaker] = useState('Dr. Mahinda Wickramasinghe');
  const [mType, setMType] = useState<'podcast' | 'short' | 'lecture' | 'webinar'>('lecture');
  const [mCategory, setMCategory] = useState('Central Banking & Policy');
  const [mDuration, setMDuration] = useState('45 mins');
  const [mVideoUrl, setMVideoUrl] = useState('');
  const [mDescription, setMDescription] = useState('');

  // Book / Textbook Direct Upload Modal States
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [bTitle, setBTitle] = useState('');
  const [bAuthor, setBAuthor] = useState('');
  const [bPublishedYear, setBPublishedYear] = useState('2025');
  const [bCategory, setBCategory] = useState('Central Banking & Monetary Policy');
  const [bCoverUrl, setBCoverUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
  const [bDownloadUrl, setBDownloadUrl] = useState('');
  const [bFlipHtml5Url, setBFlipHtml5Url] = useState('');
  const [bPagesCount, setBPagesCount] = useState('191');
  const [bDescription, setBDescription] = useState('');
  const [bWordContent, setBWordContent] = useState('');
  const [bPages, setBPages] = useState<BookPage[]>([]);
  const [bActivePreviewPage, setBActivePreviewPage] = useState<number>(1);
  const [bAutoSplitChars, setBAutoSplitChars] = useState<number>(1200);

  // Editing Item IDs
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);

  // Open Add vs Open Edit Modal helpers
  const openAddCourseModal = () => {
    setEditingCourseId(null);
    setCTitle('');
    setCSummary('');
    setCGoogleDocUrl('');
    setCModule1Url('');
    setShowAddCourseModal(true);
  };
  const openEditCourseModal = (c: EconCourse) => {
    setEditingCourseId(c.id);
    setCTitle(c.title);
    setCInstructor(c.instructor || '');
    setCAffiliation(c.affiliation || '');
    setCCategory(c.category || 'Central Banking & Monetary Policy');
    setCLevel(c.level || 'ADVANCED FELLOWSHIP');
    setCSummary(c.description || '');
    setCImageUrl(c.thumbnailUrl || '');
    setCGoogleDocUrl(c.googleDocUrl || '');
    if (c.lessons && c.lessons.length > 0) {
      setCModule1Title(c.lessons[0].title || '');
      setCModule1Url(c.lessons[0].videoUrl || c.lessons[0].embedUrl || '');
    }
    setShowAddCourseModal(true);
  };

  const openAddArticleModal = () => {
    setEditingArticleId(null);
    setATitle('');
    setAImageUrl('');
    setASummary('');
    setAFullContent('');
    setAGoogleDocUrl('');
    setAKeyTakeaways('');
    setShowAddArticleModal(true);
  };
  const openEditArticleModal = (a: EconScholarArticle) => {
    setEditingArticleId(a.id);
    setATitle(a.title);
    setAAuthorName(a.authorName || '');
    setAAuthorTitle(a.authorTitle || '');
    setAAuthorAffiliation(a.authorAffiliation || '');
    setACategory(a.category || 'Monetary Policy & Exchange Rates');
    setAImageUrl(a.imageUrl || a.thumbnailUrl || '');
    setASummary(a.summary || '');
    setAFullContent(a.content || '');
    setAGoogleDocUrl(a.googleDocUrl || '');
    setAKeyTakeaways(Array.isArray(a.keyTakeaways) ? a.keyTakeaways.join('\n') : '');
    setShowAddArticleModal(true);
  };

  const openAddMediaModal = () => {
    setEditingMediaId(null);
    setMTitle('');
    setMVideoUrl('');
    setMDescription('');
    setShowAddMediaModal(true);
  };
  const openEditMediaModal = (m: EconMediaContent) => {
    setEditingMediaId(m.id);
    setMTitle(m.title);
    setMSpeaker(m.speaker || '');
    setMType(m.type || 'lecture');
    setMCategory(m.category || 'Central Banking & Policy');
    setMDuration(m.duration || '45 mins');
    setMVideoUrl(m.url || m.embedUrl || '');
    setMDescription(m.description || '');
    setShowAddMediaModal(true);
  };

  const openAddBookModal = () => {
    setEditingBookId(null);
    setBTitle('');
    setBAuthor('');
    setBPublishedYear('2025');
    setBCategory('Central Banking & Monetary Policy');
    setBCoverUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
    setBDownloadUrl('');
    setBFlipHtml5Url('');
    setBDescription('');
    setBWordContent('');
    setBPages([]);
    setBPagesCount('0');
    setBActivePreviewPage(1);
    setShowAddBookModal(true);
  };

  const openEditBookModal = (b: EconBook) => {
    setEditingBookId(b.id);
    setBTitle(b.title);
    setBAuthor(b.author || '');
    setBPublishedYear(b.publishedYear || '2025');
    setBCategory(b.category || 'Central Banking & Monetary Policy');
    setBCoverUrl(b.coverUrl || '');
    setBDownloadUrl(b.downloadUrl || '');
    setBFlipHtml5Url(b.flipHtml5Url || (b.readOnlineUrl?.includes('fliphtml5.com') ? b.readOnlineUrl : ''));
    setBPagesCount(String(b.pagesCount || 191));
    setBDescription(b.description || '');
    setBWordContent(b.fullRawText || b.description || '');
    if (b.pages && b.pages.length > 0) {
      setBPages(b.pages);
    } else if (b.description || b.fullRawText) {
      setBPages(autoSplitTextIntoBookPages(b.fullRawText || b.description || '', 1200));
    } else {
      setBPages([]);
    }
    setBActivePreviewPage(1);
    setShowAddBookModal(true);
  };

  const openAddFacultyModal = () => {
    setEditingFacultyId(null);
    setNewFacultyName('');
    setNewFacultyEmail('');
    setNewFacultyBio('');
    setShowAddFacultyModal(true);
  };
  const openEditFacultyModal = (f: ScholarWriter) => {
    setEditingFacultyId(f.id);
    setNewFacultyName(f.name);
    setNewFacultyEmail(f.email || '');
    setNewFacultyTitle(f.title || '');
    setNewFacultyUniversity(f.affiliation || '');
    setNewFacultyBio(f.bio || '');
    setNewFacultyAvatar(f.avatarUrl || '');
    setShowAddFacultyModal(true);
  };

  // Dedicated Book Cover / Front Thumbnail Change Modal State
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [coverModalBook, setCoverModalBook] = useState<EconBook | null>(null);
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [isSavingCover, setIsSavingCover] = useState(false);
  const [coverUploadTab, setCoverUploadTab] = useState<'upload' | 'url' | 'presets'>('upload');

  const BOOK_COVER_PRESETS = [
    {
      label: "Ranul's Sovereign Debt & Monetary Plumb",
      url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
      description: "Financial Market Analytics & Debt Corridors",
    },
    {
      label: "Classical Leatherbound Academic Volume",
      url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      description: "Wealth of Nations / Vintage Scholarly Edition",
    },
    {
      label: "Central Banking Liquidity & Gold Reserves",
      url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
      description: "Money Market, Bullion & CBSL Operations",
    },
    {
      label: "Modern Macroeconomics & Keynesian Research",
      url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
      description: "Macroeconomic Policy, Employment & Growth",
    },
    {
      label: "International Trade & Maritime Commerce",
      url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
      description: "Comparative Advantage & Port Logistics",
    },
    {
      label: "Central Bank of Sri Lanka (CBSL) Heritage",
      url: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80",
      description: "Currency, Monetary Stance & Policy Framework",
    },
    {
      label: "Fiscal Law, Taxation & Treasury Corridors",
      url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
      description: "Constitutional & Institutional Fiscal Rules",
    },
    {
      label: "Sustainable Economics & Green Energy Transition",
      url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
      description: "Renewable Development & Environmental Economics",
    },
  ];

  const openChangeCoverModal = (book: EconBook) => {
    setCoverModalBook(book);
    setNewCoverUrl(book.coverUrl || '');
    setCoverUploadTab('upload');
    setShowCoverModal(true);
  };

  const compressCoverImage = (file: File, maxWidth = 800, maxHeight = 1200, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve('');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target?.result as string;
        if (!rawUrl) {
          resolve('');
          return;
        }
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(rawUrl);
        img.src = rawUrl;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleCoverFileSelected = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP, GIF, or SVG).');
      return;
    }
    const optimized = await compressCoverImage(file);
    if (optimized) {
      setNewCoverUrl(optimized);
    }
  };

  const handleSaveBookCover = async () => {
    if (!coverModalBook) return;
    if (!newCoverUrl.trim()) {
      alert('Please select an image, upload a file, or enter an image URL.');
      return;
    }
    setIsSavingCover(true);
    try {
      const res = await fetch(`/api/econ-books/${coverModalBook.id}/cover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverUrl: newCoverUrl }),
      });
      let data: any = {};
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(res.status === 413 ? 'Image is too large (exceeds web server limit).' : `Server returned status ${res.status}`);
      }
      if (res.ok && data.success) {
        alert(`✓ Front cover / thumbnail image updated successfully for "${coverModalBook.title}"!\nThe change is saved in the backend database.`);
        setShowCoverModal(false);
        setCoverModalBook(null);
        await loadAllData();
        window.dispatchEvent(new CustomEvent('econ_books_updated'));
      } else {
        alert('Error updating cover: ' + (data.error || data.message || 'Server error'));
      }
    } catch (err: any) {
      console.error('Failed to update book cover:', err);
      alert('Failed to update book cover: ' + (err.message || 'Network error'));
    } finally {
      setIsSavingCover(false);
    }
  };

  // Confirmation/Publish Modal
  const [selectedSubmission, setSelectedSubmission] = useState<PublisherSubmission | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [resC, resA, resM, resB, resF, resS, resT] = await Promise.all([
        fetch('/api/econ-courses').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/econ-articles').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/econ-media').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/econ-books').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/econ-writers').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/publishing/submissions').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/tuition/receipts').then(r => r.json()).catch(() => ({ success: false })),
      ]);

      if (resC?.success && Array.isArray(resC.courses)) {
        setCourses(resC.courses);
        safeSetStorage('econ_courses', resC.courses);
      }
      if (resA?.success && Array.isArray(resA.articles)) {
        setArticles(resA.articles);
        safeSetStorage('econ_articles', resA.articles);
      }
      if (resM?.success && Array.isArray(resM.media)) {
        setMedia(resM.media);
        safeSetStorage('econ_media', resM.media);
      }
      if (resB?.success && Array.isArray(resB.books)) {
        setBooks(resB.books);
        safeSetStorage('econ_books', resB.books);
      }
      if (resF?.success && Array.isArray(resF.writers)) {
        setFaculty(resF.writers);
        safeSetStorage('econ_writers', resF.writers);
      }
      if (resS?.success && Array.isArray(resS.submissions)) {
        setSubmissions(resS.submissions.filter((s: PublisherSubmission) => s.platformTarget === 'econ_academy'));
      }
      if (resT?.success && Array.isArray(resT.receipts)) {
        setTuitionReceipts(resT.receipts);
      }
    } catch (err) {
      console.error('Failed loading Econ Academy backend data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Staff Vetting Action: Approve Proposal & Dispatch Email
  const handleApproveProposal = async (sub: PublisherSubmission) => {
    try {
      const res = await fetch('/api/publishing/approve-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: sub.id,
          staffId: 'emp-owner-001',
          staffFeedback: 'Proposal vetted and approved by Econ Academy Editorial Board! Email sent to creator with payment instructions.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✓ Proposal Approved!\nAn automated approval notification email with tracking code ${sub.trackingId} has been dispatched to ${sub.creatorEmail}.\n\nNext step: Once payment is received, staff or author can publish live.`);
        loadAllData();
      }
    } catch {
      alert('Error approving proposal');
    }
  };

  // Staff Action: Confirm Payment & Publish Live
  const handleConfirmPaymentAndPublish = async (sub: PublisherSubmission) => {
    try {
      const res = await fetch('/api/publishing/upload-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: sub.id,
          trackingId: sub.trackingId,
          publishedPriceLKR: sub.proposedPriceLKR || 12500,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`🎉 Payment Confirmed & Published Live!\n"${sub.title}" is now LIVE on the public Econ Academy portal.`);
        loadAllData();
      }
    } catch {
      alert('Error publishing item live');
    }
  };

  // Direct Owner/Staff Upload or Edit: Master Course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle.trim()) return;

    try {
      const url = editingCourseId ? `/api/econ-courses/${editingCourseId}` : '/api/econ-courses/create';
      const method = editingCourseId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cTitle,
          instructor: cInstructor,
          affiliation: cAffiliation,
          category: cCategory,
          level: cLevel,
          summary: cSummary || cTitle,
          imageUrl: cImageUrl,
          googleDocUrl: cGoogleDocUrl,
          lessons: [
            { id: `l-${Date.now()}-1`, title: cModule1Title || 'Module 1: Core Framework', duration: '90m', videoUrl: cModule1Url, embedUrl: cModule1Url, googleDocUrl: cGoogleDocUrl, description: 'Foundational lecture material' }
          ]
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(editingCourseId ? `✓ Masterclass Course Updated!\n"${cTitle}" changes saved.` : `🎉 Masterclass Course Published Live!\n"${cTitle}" is now live on the Econ Academy portal.`);
        setShowAddCourseModal(false);
        setEditingCourseId(null);
        setCTitle('');
        setCSummary('');
        setCGoogleDocUrl('');
        setCModule1Url('');
        loadAllData();
      }
    } catch {
      alert('Error saving masterclass course.');
    }
  };

  // Direct Owner/Staff Upload or Edit: Scholar Treatise
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTitle.trim()) return;

    try {
      const url = editingArticleId ? `/api/econ-articles/${editingArticleId}` : '/api/econ-articles/publish';
      const method = editingArticleId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aTitle,
          authorName: aAuthorName,
          authorTitle: aAuthorTitle,
          authorAffiliation: aAuthorAffiliation,
          category: aCategory,
          imageUrl: aImageUrl,
          thumbnailUrl: aImageUrl,
          summary: aSummary || aTitle,
          fullContent: aFullContent || aSummary || aTitle,
          googleDocUrl: aGoogleDocUrl,
          keyTakeaways: aKeyTakeaways ? aKeyTakeaways.split('\n').filter(Boolean) : [
            'Empirical analysis of monetary transmission mechanism',
            'Central Bank balance sheet and exchange rate stability'
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(editingArticleId ? `✓ Scholar Treatise Updated!\n"${aTitle}" changes saved.` : `🎉 Scholar Treatise Published Live!\n"${aTitle}" is now live in the academic research hub.`);
        setShowAddArticleModal(false);
        setEditingArticleId(null);
        setATitle('');
        setAImageUrl('');
        setASummary('');
        setAFullContent('');
        setAGoogleDocUrl('');
        setAKeyTakeaways('');
        loadAllData();
      }
    } catch {
      alert('Error saving scholar treatise.');
    }
  };

  // Direct Owner/Staff Upload or Edit: Video Lecture / Podcast
  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim()) return;

    try {
      const url = editingMediaId ? `/api/econ-media/${editingMediaId}` : '/api/econ-media/publish';
      const method = editingMediaId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mTitle,
          speaker: mSpeaker,
          type: mType,
          category: mCategory,
          duration: mDuration,
          videoUrl: mVideoUrl,
          description: mDescription || mTitle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(editingMediaId ? `✓ Video Lecture / Podcast Updated!\n"${mTitle}" changes saved.` : `🎉 Video Lecture / Podcast Broadcast Live!\n"${mTitle}" is now active in the lectures hub.`);
        setShowAddMediaModal(false);
        setEditingMediaId(null);
        setMTitle('');
        setMVideoUrl('');
        setMDescription('');
        loadAllData();
      }
    } catch {
      alert('Error saving video lecture.');
    }
  };

  // Direct Owner/Staff Upload or Edit: Book / Textbook
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim()) {
      alert('Please enter a Title for the book.');
      return;
    }

    // Ensure pages are generated if word content is present
    let finalPages = bPages;
    if ((!finalPages || finalPages.length === 0) && bWordContent.trim().length > 0) {
      finalPages = autoSplitTextIntoBookPages(bWordContent, bAutoSplitChars);
    }

    const calculatedCount = finalPages.length > 0 ? finalPages.length : (Number(bPagesCount) || 191);

    try {
      const url = '/api/econ-books/publish';
      const method = 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingBookId || undefined,
          title: bTitle,
          author: bAuthor || 'LankaEcon Faculty Press',
          publishedYear: bPublishedYear || '2026',
          category: bCategory || 'Monetary Economics',
          coverUrl: bCoverUrl,
          downloadUrl: bDownloadUrl,
          flipHtml5Url: bFlipHtml5Url.trim() || undefined,
          readOnlineUrl: bFlipHtml5Url.trim() || bDownloadUrl || '#',
          pagesCount: calculatedCount,
          description: bDescription || bTitle,
          pages: finalPages,
          fullRawText: bWordContent,
        }),
      });
      let data: any = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        if (res.status === 413 || text.includes('413 Request Entity Too Large')) {
          throw new Error('The uploaded cover image or text is too large for the web server limit (HTTP 413). Please increase Nginx client_max_body_size or optimize the image.');
        }
        throw new Error(`Server returned unexpected response (status ${res.status}): ${text.replace(/<[^>]+>/g, '').trim().slice(0, 150)}`);
      }
      if (res.ok && data.success) {
        alert(editingBookId ? `✓ Book / Textbook Updated!\n"${bTitle}" (${calculatedCount} Pages) changes saved successfully.` : `🎉 Book / Textbook Published Live!\n"${bTitle}" (${calculatedCount} Pages) is now readable in book flipbook format!`);
        setShowAddBookModal(false);
        setEditingBookId(null);
        setBTitle('');
        setBDownloadUrl('');
        setBFlipHtml5Url('');
        setBDescription('');
        setBWordContent('');
        setBPages([]);
        loadAllData();
      } else {
        alert('Error publishing book: ' + (data.error || data.message || `Server error (${res.status})`));
      }
    } catch (err: any) {
      console.error('Failed to save book:', err);
      alert('Error saving book: ' + (err.message || 'Network error'));
    }
  };

  // Word Copy/Paste & File Upload Handlers for Books
  const handleAutoCleanBookText = () => {
    if (!bWordContent.trim()) {
      alert('Please paste or enter some text first.');
      return;
    }
    const cleaned = sanitizeAndFormatBookText(bWordContent);
    setBWordContent(cleaned);
    const generated = autoSplitTextIntoBookPages(cleaned, bAutoSplitChars);
    setBPages(generated);
    setBPagesCount(String(generated.length));
    setBActivePreviewPage(1);
    setPasteNotice(`✨ Book text sanitized & auto-formatted! Headings separated, equations formatted, paragraph gaps removed (${generated.length} pages).`);
    setTimeout(() => setPasteNotice(''), 5000);
  };

  const handleWordPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const result = processPasteData(e.clipboardData);
    let pasted = '';
    if (result && result.formattedContent && result.formattedContent.trim()) {
      pasted = result.formattedContent;
    } else {
      pasted = e.clipboardData.getData('text/plain') || '';
    }

    if (pasted.trim()) {
      const sanitized = sanitizeAndFormatBookText(pasted);
      setBWordContent(sanitized);
      const generated = autoSplitTextIntoBookPages(sanitized, bAutoSplitChars);
      setBPages(generated);
      setBPagesCount(String(generated.length));
      setBActivePreviewPage(1);
      setPasteNotice(`✓ Pasted & formatted ${generated.length} pages from Word document! (Headings separated, equations formatted)`);
      setTimeout(() => setPasteNotice(''), 4000);
    }
  };

  const handleWordTextChange = (text: string) => {
    setBWordContent(text);
    if (text.trim().length > 0) {
      const generated = autoSplitTextIntoBookPages(text, bAutoSplitChars);
      setBPages(generated);
      setBPagesCount(String(generated.length));
    } else {
      setBPages([]);
      setBPagesCount('0');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isDocx = file.name.toLowerCase().endsWith('.docx') || file.type.includes('wordprocessingml');
    const reader = new FileReader();

    if (isDocx) {
      reader.onload = (evt) => {
        try {
          const buffer = evt.target?.result as ArrayBuffer;
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const rawString = decoder.decode(buffer);

          const wtRegex = /<w:t[^>]*>(.*?)<\/w:t>/gi;
          let match;
          let extractedText = '';
          while ((match = wtRegex.exec(rawString)) !== null) {
            extractedText += match[1] + ' ';
          }

          if (extractedText.trim().length > 20) {
            const clean = extractedText
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'")
              .trim();
            
            setBWordContent(clean);
            const generated = autoSplitTextIntoBookPages(clean, bAutoSplitChars);
            setBPages(generated);
            setBPagesCount(String(generated.length));
            setBActivePreviewPage(1);
            setPasteNotice(`✓ Extracted ${generated.length} pages from Word .docx file!`);
            setTimeout(() => setPasteNotice(''), 4000);
            return;
          }
        } catch (err) {
          console.warn('Docx fast parse fallback:', err);
        }

        // Fallback text read
        const textReader = new FileReader();
        textReader.onload = (e2) => {
          const fileText = (e2.target?.result as string) || '';
          if (fileText) {
            setBWordContent(fileText);
            const generated = autoSplitTextIntoBookPages(fileText, bAutoSplitChars);
            setBPages(generated);
            setBPagesCount(String(generated.length));
            setBActivePreviewPage(1);
          }
        };
        textReader.readAsText(file);
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (evt) => {
        const fileText = evt.target?.result as string;
        if (fileText) {
          setBWordContent(fileText);
          const generated = autoSplitTextIntoBookPages(fileText, bAutoSplitChars);
          setBPages(generated);
          setBPagesCount(String(generated.length));
          setBActivePreviewPage(1);
          setPasteNotice(`✓ Loaded ${generated.length} pages from uploaded text file!`);
          setTimeout(() => setPasteNotice(''), 4000);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReSplitPages = () => {
    if (!bWordContent.trim()) return;
    const generated = autoSplitTextIntoBookPages(bWordContent, bAutoSplitChars);
    setBPages(generated);
    setBPagesCount(String(generated.length));
    setBActivePreviewPage(1);
  };

  // Faculty Management: Add or Edit Faculty
  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyName || !newFacultyEmail) return;

    try {
      const url = editingFacultyId ? `/api/econ-writers/${editingFacultyId}` : '/api/econ-writers/register';
      const method = editingFacultyId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFacultyName,
          email: newFacultyEmail,
          title: newFacultyTitle,
          university: newFacultyUniversity,
          bio: newFacultyBio,
          avatarUrl: newFacultyAvatar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(editingFacultyId ? `Faculty Member "${newFacultyName}" updated successfully!` : `Faculty Member "${newFacultyName}" added to directory database!`);
        setShowAddFacultyModal(false);
        setEditingFacultyId(null);
        setNewFacultyName('');
        setNewFacultyEmail('');
        setNewFacultyBio('');
        loadAllData();
      }
    } catch {
      alert('Failed saving faculty member');
    }
  };

  // Faculty Management: Delete Faculty
  const handleDeleteFaculty = async (id: string, _name: string) => {
    try {
      const res = await fetch(`/api/econ-writers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadAllData();
      }
    } catch (err) {
      console.error('Error removing faculty member', err);
    }
  };

  // Content Management: Delete Item
  const handleDeleteContent = async (category: 'courses' | 'articles' | 'books' | 'media', id: string, _title: string) => {
    const endpoint = category === 'courses' ? `/api/econ-courses/${id}`
      : category === 'articles' ? `/api/econ-articles/${id}`
      : category === 'books' ? `/api/econ-books/${id}`
      : `/api/econ-media/${id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadAllData();
      }
    } catch (err) {
      console.error('Error deleting content', err);
    }
  };

  // Filtered lists
  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.authorName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMedia = media.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.speaker.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFaculty = faculty.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.affiliation.toLowerCase().includes(searchQuery.toLowerCase()));

  // Stats
  const totalTuition = tuitionReceipts.reduce((acc, r) => acc + r.tuitionFeeLKR, 0);
  const totalInstructorPay = tuitionReceipts.reduce((acc, r) => acc + r.instructorShareLKR, 0);

  return (
    <div className="bg-[#0B1E36] text-white border-2 border-[#D4A373]/50 rounded-none p-6 font-sans space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-700 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-white font-serif">
              LankaEcon Academy Backend & Faculty Operations
            </h2>
            <span className="bg-[#DC2626] text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
              ACADEMIC VETTING & TUITION ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Dedicated backend category tiles for vetting publications, reviewing faculty profiles, managing course tuition fees (85% instructor payout), and issuing student payment receipts.
          </p>
        </div>

        <button
          onClick={loadAllData}
          disabled={isLoading}
          className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Category Tiles Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveCategoryTile('courses')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'courses'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold bg-slate-800 px-1.5 py-0.5">{courses.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Master Courses</p>
        </button>

        <button
          onClick={() => setActiveCategoryTile('articles')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'articles'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <FileText className="w-5 h-5 text-sky-400" />
            <span className="text-[10px] font-mono font-bold bg-slate-800 px-1.5 py-0.5">{articles.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Scholar Treatises</p>
        </button>

        <button
          onClick={() => setActiveCategoryTile('media')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'media'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <Video className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold bg-slate-800 px-1.5 py-0.5">{media.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Lectures & Podcasts</p>
        </button>

        <button
          onClick={() => setActiveCategoryTile('books')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'books'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span className="text-[10px] font-mono font-bold bg-slate-800 px-1.5 py-0.5">{books.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Books & Manuscripts</p>
        </button>

        <button
          onClick={() => setActiveCategoryTile('faculty')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'faculty'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <Users className="w-5 h-5 text-rose-400" />
            <span className="text-[10px] font-mono font-bold bg-slate-800 px-1.5 py-0.5">{faculty.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Faculty Directory</p>
        </button>

        <button
          onClick={() => setActiveCategoryTile('tuition')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'tuition'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <Calculator className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold bg-slate-800 px-1.5 py-0.5">{tuitionReceipts.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Tuition Remittance</p>
        </button>
      </div>

      {/* TILE 1: MASTER COURSES BACKEND */}
      {activeCategoryTile === 'courses' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-amber-300">Masterclass Courses Database</h3>
              <p className="text-xs text-slate-400">Review pending submissions, approve proposals, verify payment, and upload live active courses.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={openAddCourseModal}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Master Course</span>
              </button>
              <input
                type="text"
                placeholder="Filter courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 p-2 text-xs text-white outline-none w-full sm:w-56"
              />
            </div>
          </div>

          {/* Pending Submissions Queue for Courses */}
          {submissions.filter(s => (s.category === 'masterclass' || s.category === 'course') && s.status !== 'full_published').length > 0 && (
            <div className="bg-amber-950/40 border border-amber-500/50 p-4 space-y-3">
              <h4 className="font-extrabold text-xs uppercase text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Pending Masterclass Proposals to Vet ({submissions.filter(s => (s.category === 'masterclass' || s.category === 'course') && s.status !== 'full_published').length})</span>
              </h4>

              <div className="space-y-2">
                {submissions.filter(s => (s.category === 'masterclass' || s.category === 'course') && s.status !== 'full_published').map((sub) => (
                  <div key={sub.id} className="bg-slate-900 border border-slate-700 p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{sub.title}</p>
                      <p className="text-slate-300 font-mono text-[11px]">Submitted by: <strong className="text-amber-300">{sub.creatorName}</strong> ({sub.creatorEmail}) • {sub.affiliation}</p>
                      <p className="text-slate-400 text-[11px]">{sub.topicDescription}</p>
                      {sub.sampleVideoUrl && (
                        <p className="text-sky-300 font-mono text-[10px]">
                          Video Link: <a href={sub.sampleVideoUrl} target="_blank" rel="noreferrer" className="underline font-bold">{sub.sampleVideoUrl}</a>
                        </p>
                      )}
                      <span className="inline-block bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-amber-300">Tracking Code: {sub.trackingId} • Proposed Price: LKR {sub.proposedPriceLKR.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {sub.status === 'pending_vetting' && (
                        <button
                          onClick={() => handleApproveProposal(sub)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Email Notification</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleConfirmPaymentAndPublish(sub)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Confirm Payment & Publish Live</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Courses Table */}
          <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Instructor & Affiliation</th>
                  <th className="p-3">Level / Category</th>
                  <th className="p-3 text-center">Modules</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">{c.title}</td>
                    <td className="p-3">
                      <p className="text-amber-300 font-bold">{c.instructor}</p>
                      <p className="text-[10px] text-slate-400">{c.affiliation}</p>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-300">{c.category}</td>
                    <td className="p-3 text-center font-mono">{c.lessons ? c.lessons.length : 0}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase px-2 py-0.5">Live</span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditCourseModal(c)}
                          className="bg-amber-600/80 hover:bg-amber-500 text-white border border-amber-400/50 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteContent('courses', c.id, c.title)}
                          className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TILE 2: SCHOLAR TREATISES BACKEND */}
      {activeCategoryTile === 'articles' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-sky-300">Scholar Treatises & Macro Papers</h3>
              <p className="text-xs text-slate-400">Manage peer-reviewed articles, research notes, and policy briefs.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={openAddArticleModal}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Scholar Treatise</span>
              </button>
              <input
                type="text"
                placeholder="Search treatises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 p-2 text-xs text-white outline-none w-full sm:w-56"
              />
            </div>
          </div>

          {/* Pending Submissions Queue for Scholar Treatises */}
          {submissions.filter(s => (s.category === 'scholar_treatise' || s.category === 'treatise' || s.category === 'essay') && s.status !== 'full_published').length > 0 && (
            <div className="bg-sky-950/40 border border-sky-500/50 p-4 space-y-3">
              <h4 className="font-extrabold text-xs uppercase text-sky-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Pending Scholar Treatise Proposals to Vet ({submissions.filter(s => (s.category === 'scholar_treatise' || s.category === 'treatise' || s.category === 'essay') && s.status !== 'full_published').length})</span>
              </h4>

              <div className="space-y-2">
                {submissions.filter(s => (s.category === 'scholar_treatise' || s.category === 'treatise' || s.category === 'essay') && s.status !== 'full_published').map((sub) => (
                  <div key={sub.id} className="bg-slate-900 border border-slate-700 p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{sub.title}</p>
                      <p className="text-slate-300 font-mono text-[11px]">Submitted by: <strong className="text-sky-300">{sub.creatorName}</strong> ({sub.creatorEmail}) • {sub.affiliation}</p>
                      <p className="text-slate-400 text-[11px]">{sub.topicDescription}</p>
                      {sub.sampleDocumentUrl && (
                        <p className="text-sky-300 font-mono text-[10px]">
                          Draft Document: <a href={sub.sampleDocumentUrl} target="_blank" rel="noreferrer" className="underline font-bold">{sub.sampleDocumentUrl}</a>
                        </p>
                      )}
                      <span className="inline-block bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-sky-300">Tracking Code: {sub.trackingId} • Proposed Price: LKR {sub.proposedPriceLKR.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {sub.status === 'pending_vetting' && (
                        <button
                          onClick={() => handleApproveProposal(sub)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Email Notification</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleConfirmPaymentAndPublish(sub)}
                        className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Confirm Payment & Publish Live</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3">Paper Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Reading Time</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredArticles.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">{a.title}</td>
                    <td className="p-3 text-sky-300 font-bold">{a.authorName}</td>
                    <td className="p-3 font-mono text-[10px] text-slate-300">{a.category}</td>
                    <td className="p-3 text-center font-mono">{a.readingTimeMinutes} mins</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditArticleModal(a)}
                          className="bg-sky-600/80 hover:bg-sky-500 text-white border border-sky-400/50 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteContent('articles', a.id, a.title)}
                          className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TILE 3: LECTURES & PODCASTS BACKEND */}
      {activeCategoryTile === 'media' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-emerald-300">Lectures & Audio/Video Podcasts</h3>
              <p className="text-xs text-slate-400">Broadcast lectures, central bank keynotes, and macro discussions.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={openAddMediaModal}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Video / Podcast</span>
              </button>
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 p-2 text-xs text-white outline-none w-full sm:w-56"
              />
            </div>
          </div>

          {/* Pending Submissions Queue for Lectures & Podcasts */}
          {submissions.filter(s => (s.category === 'lecture' || s.category === 'podcast') && s.status !== 'full_published').length > 0 && (
            <div className="bg-emerald-950/40 border border-emerald-500/50 p-4 space-y-3">
              <h4 className="font-extrabold text-xs uppercase text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Pending Lecture / Podcast Proposals to Vet ({submissions.filter(s => (s.category === 'lecture' || s.category === 'podcast') && s.status !== 'full_published').length})</span>
              </h4>

              <div className="space-y-2">
                {submissions.filter(s => (s.category === 'lecture' || s.category === 'podcast') && s.status !== 'full_published').map((sub) => (
                  <div key={sub.id} className="bg-slate-900 border border-slate-700 p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{sub.title}</p>
                      <p className="text-slate-300 font-mono text-[11px]">Speaker / Creator: <strong className="text-emerald-300">{sub.creatorName}</strong> ({sub.creatorEmail}) • {sub.affiliation}</p>
                      <p className="text-slate-400 text-[11px]">{sub.topicDescription}</p>
                      {sub.sampleVideoUrl && (
                        <p className="text-emerald-300 font-mono text-[10px]">
                          Media / YouTube Stream: <a href={sub.sampleVideoUrl} target="_blank" rel="noreferrer" className="underline font-bold">{sub.sampleVideoUrl}</a>
                        </p>
                      )}
                      <span className="inline-block bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300">Tracking Code: {sub.trackingId} • Proposed Price: LKR {sub.proposedPriceLKR.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {sub.status === 'pending_vetting' && (
                        <button
                          onClick={() => handleApproveProposal(sub)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Email Notification</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleConfirmPaymentAndPublish(sub)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Confirm Payment & Publish Live</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Speaker</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-center">Duration</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredMedia.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">{m.title}</td>
                    <td className="p-3 text-emerald-300 font-bold">{m.speaker}</td>
                    <td className="p-3 font-mono text-[10px] uppercase text-slate-300">{m.type}</td>
                    <td className="p-3 text-center font-mono">{m.duration}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditMediaModal(m)}
                          className="bg-emerald-600/80 hover:bg-emerald-500 text-white border border-emerald-400/50 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteContent('media', m.id, m.title)}
                          className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TILE 4: BOOKS & MANUSCRIPTS BACKEND */}
      {activeCategoryTile === 'books' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-purple-300">Books & University Textbooks</h3>
              <p className="text-xs text-slate-400">Open-access economic textbooks and digital manuscripts repository.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={openAddBookModal}
                className="bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Book / Textbook</span>
              </button>
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 p-2 text-xs text-white outline-none w-full sm:w-56"
              />
            </div>
          </div>

          {/* Pending Submissions Queue for Books & Manuscripts */}
          {submissions.filter(s => s.category === 'book' && s.status !== 'full_published').length > 0 && (
            <div className="bg-purple-950/40 border border-purple-500/50 p-4 space-y-3">
              <h4 className="font-extrabold text-xs uppercase text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Pending Book / Manuscript Proposals to Vet ({submissions.filter(s => s.category === 'book' && s.status !== 'full_published').length})</span>
              </h4>

              <div className="space-y-2">
                {submissions.filter(s => s.category === 'book' && s.status !== 'full_published').map((sub) => (
                  <div key={sub.id} className="bg-slate-900 border border-slate-700 p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{sub.title}</p>
                      <p className="text-slate-300 font-mono text-[11px]">Author: <strong className="text-purple-300">{sub.creatorName}</strong> ({sub.creatorEmail}) • {sub.affiliation}</p>
                      <p className="text-slate-400 text-[11px]">{sub.topicDescription}</p>
                      {sub.sampleDocumentUrl && (
                        <p className="text-purple-300 font-mono text-[10px]">
                          Sample PDF / Draft: <a href={sub.sampleDocumentUrl} target="_blank" rel="noreferrer" className="underline font-bold">{sub.sampleDocumentUrl}</a>
                        </p>
                      )}
                      <span className="inline-block bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-purple-300">Tracking Code: {sub.trackingId} • Proposed Price: LKR {sub.proposedPriceLKR.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {sub.status === 'pending_vetting' && (
                        <button
                          onClick={() => handleApproveProposal(sub)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Email Notification</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleConfirmPaymentAndPublish(sub)}
                        className="bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Confirm Payment & Publish Live</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3 w-20 text-center">Cover</th>
                  <th className="p-3">Book Treatise / Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Pages</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredBooks.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/50 transition">
                    {/* Cover Thumbnail Preview */}
                    <td className="p-3 text-center">
                      <div 
                        onClick={() => openChangeCoverModal(b)}
                        className="relative group cursor-pointer inline-block mx-auto"
                        title="Click to change book cover / thumbnail"
                      >
                        <img 
                          src={b.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'} 
                          alt={b.title} 
                          className="w-12 h-16 object-cover rounded shadow-md border border-purple-500/40 group-hover:border-purple-300 group-hover:scale-105 transition shrink-0" 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-950/70 rounded opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Camera className="w-4 h-4 text-purple-300" />
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="font-bold text-white text-sm hover:text-purple-300 transition">{b.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {b.id} • {b.publishedYear || '2026'} • {b.fileFormat || 'PDF'}</p>
                    </td>

                    <td className="p-3 text-purple-300 font-bold">{b.author}</td>
                    <td className="p-3 font-mono text-[10px] text-slate-300">
                      <span className="bg-purple-950/60 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded">
                        {b.category}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-amber-300">{b.pagesCount}</td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Dedicated Change Cover Button */}
                        <button
                          onClick={() => openChangeCoverModal(b)}
                          className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/50 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Change front cover image / thumbnail for this book"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Change Cover</span>
                        </button>

                        <button
                          onClick={() => openEditBookModal(b)}
                          className="bg-purple-600/80 hover:bg-purple-500 text-white border border-purple-400/50 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteContent('books', b.id, b.title)}
                          className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TILE 5: FACULTY & SCHOLAR ROSTER (INDIVIDUAL DATABASE) */}
      {activeCategoryTile === 'faculty' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-rose-300">Faculty & Scholar Directory Database</h3>
              <p className="text-xs text-slate-400">List of registered professors, fellows, and researchers. Review, add, or remove individuals.</p>
            </div>

            <button
              onClick={openAddFacultyModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Scholar / Faculty</span>
            </button>
          </div>

          {/* Add Faculty Modal */}
          {showAddFacultyModal && (
            <div className="bg-slate-950 border-2 border-amber-400 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-sm uppercase text-amber-300">
                  {editingFacultyId ? 'Edit Faculty Member Profile' : 'Register Individual Faculty Member'}
                </h4>
                <button onClick={() => setShowAddFacultyModal(false)} className="text-slate-400 hover:text-white text-xs font-bold uppercase">Cancel [X]</button>
              </div>

              <form onSubmit={handleAddFaculty} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newFacultyName}
                    onChange={(e) => setNewFacultyName(e.target.value)}
                    placeholder="e.g. Dr. Mahinda Wickramasinghe"
                    className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Academic Email *</label>
                  <input
                    type="email"
                    required
                    value={newFacultyEmail}
                    onChange={(e) => setNewFacultyEmail(e.target.value)}
                    placeholder="e.g. m.wickrama@uoc.lk"
                    className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Academic Title</label>
                  <input
                    type="text"
                    value={newFacultyTitle}
                    onChange={(e) => setNewFacultyTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">University / Affiliation</label>
                  <input
                    type="text"
                    value={newFacultyUniversity}
                    onChange={(e) => setNewFacultyUniversity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Profile Photo URL (Picture) *</label>
                  <input
                    type="url"
                    required
                    value={newFacultyAvatar}
                    onChange={(e) => setNewFacultyAvatar(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-amber-400 font-mono text-xs"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Bio / Research Focus</label>
                  <textarea
                    rows={2}
                    value={newFacultyBio}
                    onChange={(e) => setNewFacultyBio(e.target.value)}
                    placeholder="Key research fields, publications, and background..."
                    className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 uppercase tracking-wider transition cursor-pointer"
                  >
                    {editingFacultyId ? 'Save Changes to Faculty Profile' : 'Save & Add Faculty Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Faculty Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFaculty.map((f) => (
              <div key={f.id} className="bg-slate-900 border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  <img
                    src={f.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={f.name}
                    className="w-14 h-14 object-cover border border-amber-400 shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-extrabold text-sm text-white truncate">{f.name}</h4>
                    <p className="text-[11px] font-bold text-amber-300">{f.title}</p>
                    <p className="text-[10px] text-slate-400">{f.affiliation}</p>
                    <p className="text-[10px] text-sky-300 font-mono">{f.email || 'scholar@uoc.lk'}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{f.bio}</p>

                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase px-2 py-0.5">
                    Verified Faculty
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditFacultyModal(f)}
                      className="bg-amber-600/80 hover:bg-amber-500 text-white border border-amber-400/50 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFaculty(f.id, f.name)}
                      className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TILE 6: TUITION & REMITTANCE ENGINE */}
      {activeCategoryTile === 'tuition' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-700 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">TOTAL STUDENT TUITION COLLECTED</span>
              <p className="text-xl font-black text-amber-300 font-mono">Rs. {totalTuition.toLocaleString()}</p>
              <span className="text-[9px] text-slate-400">Live student course fees</span>
            </div>

            <div className="bg-slate-900 border border-emerald-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">INSTRUCTOR TUITION SHARE (85%)</span>
              <p className="text-xl font-black text-emerald-300 font-mono">Rs. {totalInstructorPay.toLocaleString()}</p>
              <span className="text-[9px] text-emerald-400/80">Remitted via SLIPS to faculty</span>
            </div>

            <div className="bg-slate-900 border border-sky-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-sky-400 block font-bold">PLATFORM COMMISSION (15%)</span>
              <p className="text-xl font-black text-sky-300 font-mono">Rs. {(totalTuition - totalInstructorPay).toLocaleString()}</p>
              <span className="text-[9px] text-slate-400">Econ Academy infrastructure</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 space-y-2">
            <h3 className="font-extrabold text-sm uppercase text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>Student Tuition Payment Receipts & Instructor Remittances</span>
            </h3>
            <p className="text-xs text-slate-400">Every student tuition payment automatically generates an official receipt and credits the lecturer's bank remittance ledger.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3">Receipt #</th>
                  <th className="p-3">Student & Email</th>
                  <th className="p-3">Course & Instructor</th>
                  <th className="p-3 text-right">Tuition Fee LKR</th>
                  <th className="p-3 text-right text-emerald-400">Instructor 85%</th>
                  <th className="p-3 text-center">Certificate Code</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {tuitionReceipts.map((r) => (
                  <tr key={r.receiptNumber} className="hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-amber-300">{r.receiptNumber}</td>
                    <td className="p-3">
                      <p className="font-bold text-white">{r.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{r.studentEmail}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-slate-200">{r.courseTitle}</p>
                      <p className="text-[10px] text-sky-300 font-mono">Lecturer: {r.instructorName}</p>
                    </td>
                    <td className="p-3 text-right font-mono font-bold">Rs. {r.tuitionFeeLKR.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-300">Rs. {r.instructorShareLKR.toLocaleString()}</td>
                    <td className="p-3 text-center font-mono text-[10px] text-amber-300">{r.certificateCode}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase px-2 py-0.5">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: UPLOAD MASTER COURSE */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-6 flex items-start justify-center">
          <div className="bg-slate-900 border-2 border-amber-400 max-w-2xl w-full my-4 sm:my-8 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh] text-xs font-sans relative">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 flex justify-between items-center shrink-0">
              <h3 className="font-black text-sm uppercase text-amber-300 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span>{editingCourseId ? 'Edit Masterclass Course' : 'Direct Upload / Publish New Masterclass Course'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCourseModal(false)}
                className="text-slate-400 hover:text-white font-bold p-1 hover:bg-slate-800 rounded transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateCourse} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={cTitle}
                    onChange={(e) => setCTitle(e.target.value)}
                    placeholder="e.g. Advanced Central Banking & Interest Rate Corridor Strategy"
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Instructor Name *</label>
                    <input
                      type="text"
                      required
                      value={cInstructor}
                      onChange={(e) => setCInstructor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Affiliation / Institution</label>
                    <input
                      type="text"
                      value={cAffiliation}
                      onChange={(e) => setCAffiliation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Category</label>
                    <select
                      value={cCategory}
                      onChange={(e) => setCCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                    >
                      <option value="Central Banking & Monetary Policy">Central Banking & Monetary Policy</option>
                      <option value="Sovereign Debt & Restructuring">Sovereign Debt & Restructuring</option>
                      <option value="Applied Econometrics & Trade">Applied Econometrics & Trade</option>
                      <option value="Macro-Financial Risk Management">Macro-Financial Risk Management</option>
                      <option value="Development Economics">Development Economics</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Course Level</label>
                    <select
                      value={cLevel}
                      onChange={(e) => setCLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-amber-400 font-mono text-[11px]"
                    >
                      <option value="ADVANCED FELLOWSHIP">ADVANCED FELLOWSHIP</option>
                      <option value="EXECUTIVE DIPLOMA">EXECUTIVE DIPLOMA</option>
                      <option value="UNIVERSITY CERTIFICATE">UNIVERSITY CERTIFICATE</option>
                      <option value="MASTERCLASS">MASTERCLASS</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Thumbnail Cover Image URL</label>
                  <input
                    type="url"
                    value={cImageUrl}
                    onChange={(e) => setCImageUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-amber-400 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-amber-300 uppercase flex items-center gap-1">
                    <span>Google Doc URL (Live Embedded Course / Lecture Material)</span>
                  </label>
                  <input
                    type="url"
                    value={cGoogleDocUrl}
                    onChange={(e) => setCGoogleDocUrl(e.target.value)}
                    placeholder="e.g. https://docs.google.com/document/d/.../edit"
                    className="w-full bg-slate-950 border border-amber-500/80 p-2 text-white outline-none focus:border-amber-400 font-mono text-xs"
                  />
                  <p className="text-[10px] text-amber-400">✨ Paste a Google Doc URL to automatically embed the live document with 100% original tables, equations, headings, bold & italics preserved!</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Course Overview & Syllabus Summary</label>
                  <textarea
                    rows={3}
                    value={cSummary}
                    onChange={(e) => setCSummary(e.target.value)}
                    placeholder="Detailed breakdown of theoretical models, empirical datasets, and policy transmission..."
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 space-y-2 rounded-xs">
                  <p className="font-extrabold text-amber-300 text-[11px] uppercase">Module 1 Video Lecture Setup</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cModule1Title}
                      onChange={(e) => setCModule1Title(e.target.value)}
                      placeholder="Module Title"
                      className="bg-slate-900 border border-slate-700 p-2 text-white outline-none"
                    />
                    <input
                      type="url"
                      value={cModule1Url}
                      onChange={(e) => setCModule1Url(e.target.value)}
                      placeholder="Video / YouTube / Embed Link URL"
                      className="bg-slate-900 border border-slate-700 p-2 text-white outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 uppercase rounded-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2 uppercase tracking-wider transition cursor-pointer rounded-xs shadow-md"
                >
                  {editingCourseId ? 'Save Course Changes' : 'Publish Course Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD SCHOLAR TREATISE */}
      {showAddArticleModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-6 flex items-start justify-center">
          <div className="bg-slate-900 border-2 border-sky-400 max-w-2xl w-full my-4 sm:my-8 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh] text-xs font-sans relative">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 flex justify-between items-center shrink-0">
              <h3 className="font-black text-sm uppercase text-sky-300 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <span>{editingArticleId ? 'Edit Scholar Treatise' : 'Direct Upload / Publish New Scholar Treatise'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddArticleModal(false)}
                className="text-slate-400 hover:text-white font-bold p-1 hover:bg-slate-800 rounded transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateArticle} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Paper Title *</label>
                  <input
                    type="text"
                    required
                    value={aTitle}
                    onChange={(e) => setATitle(e.target.value)}
                    placeholder="e.g. Empirical Transmission of Domestic Bank FX Swaps on External Reserves"
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-sky-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Author Name *</label>
                    <input
                      type="text"
                      required
                      value={aAuthorName}
                      onChange={(e) => setAAuthorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Author Academic Title</label>
                    <input
                      type="text"
                      value={aAuthorTitle}
                      onChange={(e) => setAAuthorTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">University / Affiliation</label>
                    <input
                      type="text"
                      value={aAuthorAffiliation}
                      onChange={(e) => setAAuthorAffiliation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Category</label>
                    <select
                      value={aCategory}
                      onChange={(e) => setACategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-sky-400"
                    >
                      <option value="Monetary Policy & Exchange Rates">Monetary Policy & Exchange Rates</option>
                      <option value="Sovereign Debt & Fiscal Deficits">Sovereign Debt & Fiscal Deficits</option>
                      <option value="International Trade & Balance of Payments font-bold">International Trade & Balance of Payments</option>
                      <option value="Inflation & Price Stability">Inflation & Price Stability</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Thumbnail Cover Image URL</label>
                  <input
                    type="url"
                    value={aImageUrl}
                    onChange={(e) => setAImageUrl(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-sky-400 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Abstract / Executive Summary *</label>
                  <textarea
                    rows={2}
                    required
                    value={aSummary}
                    onChange={(e) => setASummary(e.target.value)}
                    placeholder="Key research findings and macroeconomic policy implications..."
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sky-300 uppercase flex items-center gap-1">
                    <span>Google Doc URL (Live Embedded Treatise / Research Paper)</span>
                  </label>
                  <input
                    type="url"
                    value={aGoogleDocUrl}
                    onChange={(e) => setAGoogleDocUrl(e.target.value)}
                    placeholder="e.g. https://docs.google.com/document/d/.../edit"
                    className="w-full bg-slate-950 border border-sky-400 p-2 text-white outline-none focus:border-sky-300 font-mono text-xs"
                  />
                  <p className="text-[10px] text-sky-300">✨ Directly link your Google Doc to embed the full live paper with 100% tables, equations, headings, bold & italics preserved!</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="font-bold text-slate-300 uppercase">Full Research Content / Text</label>
                    <span className="text-[10px] bg-sky-950 border border-sky-400/50 text-sky-300 font-bold px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                      <span>📋 Direct Word Paste Supported</span>
                    </span>
                  </div>

                  {pasteNotice && (
                    <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs p-2 rounded font-bold animate-pulse">
                      {pasteNotice}
                    </div>
                  )}

                  <textarea
                    rows={8}
                    value={aFullContent}
                    onPaste={(e) => {
                      const res = processPasteData(e.clipboardData);
                      if (res && res.formattedContent) {
                        e.preventDefault();
                        setAFullContent(res.formattedContent);
                        setPasteNotice('✓ Word document content pasted! Tables, headings, and bullet points preserved.');
                        setTimeout(() => setPasteNotice(''), 6000);
                      }
                    }}
                    onChange={(e) => setAFullContent(e.target.value)}
                    placeholder="Paste directly from MS Word or Google Docs here. Tables, headings, bold text, and bullet lists will be converted and preserved automatically..."
                    className="w-full bg-slate-950 border border-slate-700 p-2.5 text-white outline-none focus:border-sky-400 font-mono text-xs leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-400">💡 Tip: You can copy directly from Microsoft Word or Google Docs and paste (Ctrl+V / Cmd+V) above! Tables, headings, and bullet points are auto-formatted.</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Key Takeaways (One per line)</label>
                  <textarea
                    rows={2}
                    value={aKeyTakeaways}
                    onChange={(e) => setAKeyTakeaways(e.target.value)}
                    placeholder="Analysis of central bank liquidity&#10;Exchange rate stability mechanisms"
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddArticleModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 uppercase rounded-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-6 py-2 uppercase tracking-wider transition cursor-pointer rounded-xs shadow-md"
                >
                  {editingArticleId ? 'Save Treatise Changes' : 'Publish Treatise Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: UPLOAD VIDEO LECTURE / PODCAST */}
      {showAddMediaModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-6 flex items-start justify-center">
          <div className="bg-slate-900 border-2 border-emerald-400 max-w-2xl w-full my-4 sm:my-8 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh] text-xs font-sans relative">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 flex justify-between items-center shrink-0">
              <h3 className="font-black text-sm uppercase text-emerald-300 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-400" />
                <span>{editingMediaId ? 'Edit Video Lecture / Podcast' : 'Direct Upload / Broadcast Video Lecture or Podcast'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMediaModal(false)}
                className="text-slate-400 hover:text-white font-bold p-1 hover:bg-slate-800 rounded transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateMedia} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Lecture / Podcast Title *</label>
                  <input
                    type="text"
                    required
                    value={mTitle}
                    onChange={(e) => setMTitle(e.target.value)}
                    placeholder="e.g. Central Bank Policy Rate Transmission & Liquidity Injections"
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Speaker / Lecturer Name *</label>
                    <input
                      type="text"
                      required
                      value={mSpeaker}
                      onChange={(e) => setMSpeaker(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Media Format</label>
                    <select
                      value={mType}
                      onChange={(e) => setMType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-emerald-400 uppercase font-mono"
                    >
                      <option value="lecture">Lecture Masterclass</option>
                      <option value="podcast font-bold">Audio / Video Podcast</option>
                      <option value="webinar">Live Keynote / Webinar</option>
                      <option value="short">Macro Short Brief</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Category</label>
                    <input
                      type="text"
                      value={mCategory}
                      onChange={(e) => setMCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase">Duration (e.g. 45 mins)</label>
                    <input
                      type="text"
                      value={mDuration}
                      onChange={(e) => setMDuration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Video / YouTube / Embed Stream URL *</label>
                  <input
                    type="url"
                    required
                    value={mVideoUrl}
                    onChange={(e) => setMVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-emerald-400 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Description / Key Lecture Notes</label>
                  <textarea
                    rows={3}
                    value={mDescription}
                    onChange={(e) => setMDescription(e.target.value)}
                    placeholder="Summary of topics covered, timestamps, and reading materials..."
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 uppercase rounded-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2 uppercase tracking-wider transition cursor-pointer rounded-xs shadow-md"
                >
                  {editingMediaId ? 'Save Media Changes' : 'Broadcast Media Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: UPLOAD BOOK / TEXTBOOK WITH WORD COPY/PASTE BOX */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-6 flex items-start justify-center">
          <div className="bg-slate-900 border-2 border-purple-400 max-w-4xl w-full my-4 sm:my-8 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-xs font-sans relative">
            {/* Header */}
            <div className="bg-slate-950 border-b border-purple-500/30 p-4 sm:p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="font-black text-sm uppercase text-purple-200">
                  {editingBookId ? 'Edit Book / Manuscript Treatise' : 'Backend Publishing: Free Books & Textbooks (Word Copy / Paste Box)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBookModal(false)}
                className="text-slate-400 hover:text-white font-bold p-1 hover:bg-slate-800 rounded transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateBook} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
                {/* Book Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950 p-4 border border-slate-800 rounded">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-300 uppercase text-[10px]">Book / Treatise Title *</label>
                    <input
                      type="text"
                      required
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                      placeholder="e.g. Modern Macroeconomics & Sri Lanka Debt Restructuring"
                      className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-purple-400 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase text-[10px]">Author Name *</label>
                    <input
                      type="text"
                      required
                      value={bAuthor}
                      onChange={(e) => setBAuthor(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-purple-400 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase text-[10px]">Category</label>
                    <input
                      type="text"
                      value={bCategory}
                      onChange={(e) => setBCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-purple-400 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase text-[10px]">Published Year</label>
                    <input
                      type="text"
                      value={bPublishedYear}
                      onChange={(e) => setBPublishedYear(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-purple-400 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-300 uppercase text-[10px] flex items-center justify-between">
                      <span>Book Front Cover / Thumbnail Image</span>
                      <span className="text-purple-300 font-mono text-[9px]">URL, File Upload, or Preset</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <div className="relative shrink-0">
                        <img
                          src={bCoverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                          alt="Cover"
                          className="w-10 h-14 object-cover rounded border border-purple-400/50 shadow shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        value={bCoverUrl}
                        onChange={(e) => setBCoverUrl(e.target.value)}
                        placeholder="https://.../cover.jpg or paste Base64"
                        className="flex-1 bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-purple-400 font-mono text-[11px]"
                      />
                      <label className="bg-purple-600/80 hover:bg-purple-500 text-white px-2.5 py-2 font-bold uppercase tracking-wider text-[10px] cursor-pointer flex items-center gap-1 border border-purple-400/40 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const optimized = await compressCoverImage(file);
                              if (optimized) setBCoverUrl(optimized);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-300 uppercase text-[10px]">PDF Download Link (Optional)</label>
                    <input
                      type="url"
                      value={bDownloadUrl}
                      onChange={(e) => setBDownloadUrl(e.target.value)}
                      placeholder="https://.../textbook.pdf (Optional direct PDF download link)"
                      className="w-full bg-slate-900 border border-slate-700 p-2 text-white outline-none focus:border-purple-400 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2 bg-purple-950/40 border border-purple-500/40 p-3 rounded">
                    <label className="font-bold text-purple-200 uppercase text-[10px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>FlipHTML5 3D Interactive Flipbook Link (Recommended)</span>
                      </span>
                      <span className="text-amber-400 font-mono text-[9px] font-bold">online.fliphtml5.com</span>
                    </label>
                    <input
                      type="text"
                      value={bFlipHtml5Url}
                      onChange={(e) => {
                        let val = e.target.value;
                        const match = val.match(/src=["']([^"']+)["']/i);
                        if (match && match[1]) {
                          val = match[1];
                        }
                        setBFlipHtml5Url(val);
                      }}
                      placeholder="https://online.fliphtml5.com/your-username/book-code/ (or paste entire FlipHTML5 embed code)"
                      className="w-full bg-slate-900 border border-purple-500/50 p-2 text-white outline-none focus:border-amber-400 font-mono text-xs rounded-xs"
                    />
                    <p className="text-[10px] text-purple-300/80 leading-relaxed">
                      💡 <strong>How to get this:</strong> Upload your PDF on <a href="https://fliphtml5.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">FlipHTML5.com</a>, click <em>Share</em> or <em>Embed</em>, copy the link (e.g., <code>https://online.fliphtml5.com/.../...</code>) and paste it here. Your readers will immediately be able to read this book in full 3D flipbook mode!
                    </p>
                  </div>
                </div>

                {/* WORD DOCUMENT COPY / PASTE BOX */}
                <div className="bg-purple-950/30 border-2 border-purple-500/50 p-4 rounded space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-purple-500/30 pb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-purple-200 flex items-center gap-2 uppercase tracking-wide">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>📋 Free Book Word Document Input Box</span>
                      </h4>
                      <p className="text-[11px] text-purple-300/80">
                        Copy every page from your Word document or Google Docs and paste here. Tables, equations, graphs, highlights, bold headings, and italicized words are aligned automatically into book flipbook pages.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="bg-purple-900/80 text-purple-200 text-[11px] font-mono font-bold px-2.5 py-1 border border-purple-400/40 rounded">
                        {bPages.length} Pages Generated
                      </span>
                    </div>
                  </div>

                  {/* Paste Textarea */}
                  <div className="space-y-2">
                    <textarea
                      rows={10}
                      value={bWordContent}
                      onPaste={handleWordPaste}
                      onChange={(e) => handleWordTextChange(e.target.value)}
                      placeholder="📄 COPY AND PASTE YOUR ENTIRE WORD DOCUMENT HERE (Press Ctrl+V / Cmd+V)...&#10;&#10;Supports:&#10;• Full Book Text & Chapters&#10;• Tables with row/column headers&#10;• Equations & Mathematical Formulas&#10;• Diagrams & Inline Visual Graphs&#10;• Underlined, Highlighted, and Italicized Words"
                      className="w-full bg-slate-950 border border-purple-500/40 p-3 text-slate-100 font-mono text-xs outline-none focus:border-purple-400 rounded leading-relaxed"
                    />

                    {/* Auto-Paginator Controls & File Upload */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 border border-slate-800 rounded">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <label className="text-slate-300 font-bold uppercase text-[10px]">Target Chars / Page:</label>
                        <input
                          type="number"
                          value={bAutoSplitChars}
                          onChange={(e) => setBAutoSplitChars(Number(e.target.value) || 1200)}
                          className="w-16 bg-slate-900 border border-slate-700 p-1 text-center text-purple-300 font-mono font-bold outline-none text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleReSplitPages}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer rounded flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Split Pages</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleAutoCleanBookText}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer rounded flex items-center gap-1 shadow-sm"
                          title="Auto-separates headings, formats math equations into cards, and removes excessive paragraph blank lines"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>✨ Auto-Format Book Layout (Fix Headings & Equations)</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-slate-400 text-[11px] uppercase font-bold">Or Upload File:</label>
                        <input
                          type="file"
                          accept=".txt,.md,.html,.docx"
                          onChange={handleFileUpload}
                          className="text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-slate-800 file:text-purple-300 hover:file:bg-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAGE INSPECTOR & RENDER PREVIEW */}
                {bPages.length > 0 && (
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-2">
                      <h4 className="font-extrabold text-xs uppercase text-slate-300 flex items-center gap-2">
                        <Search className="w-4 h-4 text-purple-400" />
                        <span>Live Page Inspector & Reader Preview</span>
                      </h4>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={bActivePreviewPage <= 1}
                          onClick={() => setBActivePreviewPage(p => Math.max(1, p - 1))}
                          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white px-2 py-1 text-xs font-mono font-bold transition cursor-pointer"
                        >
                          ◀ Prev
                        </button>

                        <span className="font-mono text-purple-300 text-xs font-bold px-2">
                          Page {bActivePreviewPage} of {bPages.length}
                        </span>

                        <button
                          type="button"
                          disabled={bActivePreviewPage >= bPages.length}
                          onClick={() => setBActivePreviewPage(p => Math.min(bPages.length, p + 1))}
                          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white px-2 py-1 text-xs font-mono font-bold transition cursor-pointer"
                        >
                          Next ▶
                        </button>
                      </div>
                    </div>

                    {/* Page Content Rendered Preview Box */}
                    {bPages[bActivePreviewPage - 1] && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                          <span>Chapter Title: <strong className="text-purple-300">{bPages[bActivePreviewPage - 1].chapterTitle || `Page ${bActivePreviewPage}`}</strong></span>
                          <span>Length: {bPages[bActivePreviewPage - 1].content.length} characters</span>
                        </div>

                        <div className="p-4 bg-[#FAF8F3] text-slate-900 border-2 border-amber-800/20 rounded max-h-60 overflow-y-auto font-serif leading-relaxed text-xs shadow-inner">
                          <FormattedText content={bPages[bActivePreviewPage - 1].content} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Description Excerpt */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase text-[10px]">Short Overview / Description for Search</label>
                  <textarea
                    rows={2}
                    value={bDescription}
                    onChange={(e) => setBDescription(e.target.value)}
                    placeholder="Brief overview of the book's topics and chapters for catalog search..."
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white outline-none focus:border-purple-400 text-xs"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
                <div className="text-purple-300/80 font-mono text-[11px]">
                  {bPages.length > 0 ? `Ready to publish ${bPages.length} book pages live` : 'Paste Word content above to build book pages'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBookModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 uppercase rounded-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-400 text-slate-950 font-black px-6 py-2 uppercase tracking-wider transition cursor-pointer rounded-xs shadow-md flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{editingBookId ? 'Save Book Changes' : 'Publish Book Live'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: CHANGE FRONT COVER / THUMBNAIL IMAGE FOR FREE TEXTBOOKS */}
      {showCoverModal && coverModalBook && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="bg-slate-900 border-2 border-amber-500/80 max-w-2xl w-full rounded-xl shadow-2xl overflow-hidden flex flex-col text-xs font-sans relative">
            {/* Header */}
            <div className="bg-slate-950 border-b border-amber-500/30 p-4 sm:p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/40 rounded-lg text-amber-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-amber-200 tracking-wide">
                    Change Book Front Cover / Thumbnail
                  </h3>
                  <p className="text-[11px] text-slate-400 font-serif line-clamp-1">
                    Book: <strong className="text-white">{coverModalBook.title}</strong> ({coverModalBook.author})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCoverModal(false);
                  setCoverModalBook(null);
                }}
                className="text-slate-400 hover:text-white font-bold p-1 hover:bg-slate-800 rounded transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Live Preview Side-by-Side Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 border border-slate-800 rounded-lg">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Current Live Cover</span>
                  <div className="flex justify-center sm:justify-start">
                    <img
                      src={coverModalBook.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt="Current Cover"
                      className="w-24 h-36 object-cover rounded-lg shadow border border-slate-700"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block flex items-center justify-center sm:justify-start gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>New Selected Cover Preview</span>
                  </span>
                  <div className="flex justify-center sm:justify-start">
                    {newCoverUrl ? (
                      <img
                        src={newCoverUrl}
                        alt="New Cover Preview"
                        className="w-24 h-36 object-cover rounded-lg shadow-xl border-2 border-amber-400"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-24 h-36 rounded-lg border-2 border-dashed border-slate-700 bg-slate-900 flex flex-col items-center justify-center text-slate-500 text-[10px] p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                        <span>No image selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selection Tabs: Upload File / Custom URL / Curated Presets */}
              <div className="flex border-b border-slate-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setCoverUploadTab('upload')}
                  className={`px-4 py-2 font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    coverUploadTab === 'upload'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoverUploadTab('url')}
                  className={`px-4 py-2 font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    coverUploadTab === 'url'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Paste Image URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoverUploadTab('presets')}
                  className={`px-4 py-2 font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 border-b-2 ${
                    coverUploadTab === 'presets'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Economic Presets</span>
                </button>
              </div>

              {/* TAB 1: UPLOAD FILE FROM DISK */}
              {coverUploadTab === 'upload' && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-slate-950 p-6 rounded-lg text-center cursor-pointer transition relative group">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCoverFileSelected(file);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <div className="p-3 bg-amber-500/20 rounded-full text-amber-300 group-hover:scale-110 transition">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-white text-xs">
                        Click to browse or drag & drop book cover image here
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Supports PNG, JPG, JPEG, WEBP (Max 25MB • Auto Base64 conversion)
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-serif italic">
                    💡 Tip: Upload high-resolution vertical book covers (optimal ratio 2:3 or 3:4, e.g. 800x1200 px) for best quality in the 3D flipbook & library shelf.
                  </p>
                </div>
              )}

              {/* TAB 2: PASTE DIRECT IMAGE URL */}
              {coverUploadTab === 'url' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 uppercase text-[10px]">
                      Direct Cover Image URL (HTTPS link)
                    </label>
                    <input
                      type="url"
                      value={newCoverUrl}
                      onChange={(e) => setNewCoverUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or https://domain.com/cover.jpg"
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 text-white font-mono text-xs outline-none focus:border-amber-400 rounded"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Enter any direct web image link hosted on Unsplash, Wikimedia, AWS S3, or your server.
                  </p>
                </div>
              )}

              {/* TAB 3: CURATED PRESETS */}
              {coverUploadTab === 'presets' && (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    Choose from curated academic & economic cover themes:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BOOK_COVER_PRESETS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setNewCoverUrl(preset.url)}
                        className={`bg-slate-950 border rounded-lg p-2 flex flex-col items-center text-center cursor-pointer transition hover:border-amber-400 group ${
                          newCoverUrl === preset.url ? 'border-amber-400 ring-2 ring-amber-400/50 bg-amber-950/20' : 'border-slate-800'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-24 object-cover rounded mb-1.5 group-hover:scale-105 transition shadow"
                        />
                        <span className="font-bold text-white text-[11px] line-clamp-1 group-hover:text-amber-300">
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                          {preset.description}
                        </span>
                        {newCoverUrl === preset.url && (
                          <span className="mt-1 bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Selected
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-slate-400 font-mono text-[11px] hidden sm:inline-block">
                Backend API: <code className="text-amber-400 font-bold">/api/econ-books/{coverModalBook.id}/cover</code>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCoverModal(false);
                    setCoverModalBook(null);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 uppercase rounded-xs transition cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingCover || !newCoverUrl.trim()}
                  onClick={handleSaveBookCover}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black px-5 py-2 uppercase tracking-wider transition cursor-pointer rounded-xs shadow-lg flex items-center gap-1.5 text-xs"
                >
                  {isSavingCover ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Backend...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save New Cover to Backend</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

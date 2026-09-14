import React, { useState, useEffect } from 'react';
import { EmployeeRecord, PublisherSubmission, PayoutRecord, MediaAsset } from '../types';
import { Shield, Plus, Sparkles, CheckCircle2, Image as ImageIcon, BookOpen, Feather, Newspaper, Send, Search, Video, Award, Users, UserCheck, AlertTriangle, FileText, Lock, Landmark, Calculator, Trash2, Mail, Instagram, Megaphone, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, X, RotateCcw, Calendar, User, Edit3, Edit, Save, Globe, Eye, Check, Loader2, UploadCloud, FileUp } from 'lucide-react';
import { ErpIntegrationPortal } from './ErpIntegrationPortal';
import { EconAcademyBackendPortal } from './EconAcademyBackendPortal';
import { InkCanvasBackendPortal } from './InkCanvasBackendPortal';
import { AdDeskBackendPortal } from './AdDeskBackendPortal';
import { StoryEditorPage } from './StoryEditorPage';
import { ImageDatabaseBackendSection } from './ImageDatabaseBackendSection';

interface StaffPortalSectionProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  currentUser: EmployeeRecord | null;
  setCurrentUser: (user: EmployeeRecord | null) => void;
  onRefreshArticles: () => void;
  onOpenAnalystChat?: () => void;
  onOpenAnalystCopilot?: () => void;
  onOpenIgStory?: (article: any, mode?: 'entire_story' | 'summary') => void;
  onOpenSummaryStoryPage?: (article?: any) => void;
  onOpenStoryEditor?: (article: any) => void;
}

const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
};

export const StaffPortalSection: React.FC<StaffPortalSectionProps> = ({
  isLoggedIn,
  setIsLoggedIn,
  currentUser,
  setCurrentUser,
  onRefreshArticles,
  onOpenAnalystChat,
  onOpenAnalystCopilot,
  onOpenIgStory,
  onOpenSummaryStoryPage,
  onOpenStoryEditor,
}) => {
  const [activeBackend, setActiveBackend] = useState<'newsroom' | 'academy' | 'ink_canvas' | 'vetting_queue' | 'remittance' | 'security' | 'erp_accounting' | 'ad_desk' | 'image_database'>('newsroom');
  
  // Publisher Submissions & Vetting state
  const [publisherSubmissions, setPublisherSubmissions] = useState<PublisherSubmission[]>([]);
  const [payoutRecords, setPayoutRecords] = useState<PayoutRecord[]>([]);
  const [vettingFeedback, setVettingFeedback] = useState<Record<string, string>>({});
  const [selectedSubForRemit, setSelectedSubForRemit] = useState<PublisherSubmission | null>(null);
  const [remitAmount, setRemitAmount] = useState('');
  const [remitBank, setRemitBank] = useState('Commercial Bank of Ceylon');
  const [remitAccount, setRemitAccount] = useState('');
  const [remitBranch, setRemitBranch] = useState('Main Branch Colombo 01');
  const [remitSuccessMsg, setRemitSuccessMsg] = useState('');
  
  // Security Telemetry state
  const [securityStatus, setSecurityStatus] = useState<{
    firewallStatus: string;
    sslHandshake: string;
    hmacSignatureValidation: string;
    antiSqlInjection: string;
    antiXSS: string;
    ddosMitigation: string;
    blockedAttacksCount24h: number;
    lastAuditTimestamp: string;
  } | null>(null);
  
  // Auth state
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regType, setRegType] = useState<'owner' | 'employee'>('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Macroeconomic & Markets Desk');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [allEmployees, setAllEmployees] = useState<EmployeeRecord[]>([]);

  // Employee Onboarding Fields
  const [empAge, setEmpAge] = useState('');
  const [empNic, setEmpNic] = useState('');
  const [empTin, setEmpTin] = useState('');
  const [empBankName, setEmpBankName] = useState('Commercial Bank of Ceylon');
  const [empAccountNum, setEmpAccountNum] = useState('');
  const [empBranchName, setEmpBranchName] = useState('Colombo Main Branch');
  const [empRequestedSites, setEmpRequestedSites] = useState<('lanka_econ' | 'econ_academy' | 'lanka_ink')[]>(['lanka_econ', 'econ_academy', 'lanka_ink']);
  const [pendingAccessMap, setPendingAccessMap] = useState<Record<string, ('lanka_econ' | 'econ_academy' | 'lanka_ink')[]>>({});

  // Direct Employee Creation by Owner
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffDept, setNewStaffDept] = useState('Newsroom Editorial Desk');
  const [newStaffRole, setNewStaffRole] = useState<'editor' | 'analyst' | 'admin'>('editor');
  const [newStaffPlatforms, setNewStaffPlatforms] = useState<string[]>(['lanka_econ', 'econ_academy', 'lanka_ink']);

  // Shared Stock Image Database state
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [targetImageField, setTargetImageField] = useState<'news' | 'academy' | 'ink' | 'edit_story'>('news');
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [showAddImageForm, setShowAddImageForm] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<'file' | 'url'>('file');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  const [isUploadingImageFile, setIsUploadingImageFile] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [imageCategoryFilter, setImageCategoryFilter] = useState('ALL');
  const [directUploadingNews, setDirectUploadingNews] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('GENERAL');
  const [newImageTags, setNewImageTags] = useState('');
  const [imageActionStatus, setImageActionStatus] = useState('');

  // Curated Stock Image Library
  const stockImageGallery = [
    { title: 'Colombo Stock Exchange Floor', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80', tag: 'FINANCE' },
    { title: 'Central Bank & Financial District', url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80', tag: 'MACRO' },
    { title: 'Colombo Port Shipping Terminal', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80', tag: 'TRADE' },
    { title: 'Ceylon Tea Estate Plantation', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80', tag: 'EXPORTS' },
    { title: 'Academic Economics Library', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80', tag: 'ACADEMY' },
    { title: 'Traditional Mask & Artisan Craft', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80', tag: 'CULTURE' },
    { title: 'Video & Media Broadcasting Studio', url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=80', tag: 'PODCAST' },
    { title: 'Sri Lankan Historical Manuscript', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80', tag: 'LITERATURE' },
  ];

  // 1. Newsroom Publishing Form
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDeck, setStoryDeck] = useState('');
  const [storyCategory, setStoryCategory] = useState('ECONOMY');
  const [storyBody, setStoryBody] = useState('');
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const [storyPlacement, setStoryPlacement] = useState<'standard' | 'notable' | 'spotlight' | 'lead'>('standard');
  const [isLeadStory, setIsLeadStory] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isExclusive, setIsExclusive] = useState(false);
  const [isPublishingNews, setIsPublishingNews] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [lastPublishedArticle, setLastPublishedArticle] = useState<any>(null);
  const [subscriberAlertResult, setSubscriberAlertResult] = useState<any>(null);
  const [publishedArticlesList, setPublishedArticlesList] = useState<any[]>([]);

  // Story Edit Modal State (Company Employee Story Editor)
  const [editingStory, setEditingStory] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDeck, setEditDeck] = useState('');
  const [editCategory, setEditCategory] = useState('ECONOMY');
  const [editBody, setEditBody] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImageCaption, setEditImageCaption] = useState('');
  const [editAuthorName, setEditAuthorName] = useState('');
  const [editReadingTime, setEditReadingTime] = useState(3);
  const [editPlacement, setEditPlacement] = useState<'standard' | 'notable' | 'spotlight' | 'lead'>('standard');
  const [editIsLeadStory, setEditIsLeadStory] = useState(false);
  const [editIsBreaking, setEditIsBreaking] = useState(false);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsSubscriptionOnly, setEditIsSubscriptionOnly] = useState(false);
  const [editSiTitle, setEditSiTitle] = useState('');
  const [editSiDeck, setEditSiDeck] = useState('');
  const [editSiBody, setEditSiBody] = useState('');
  const [editTaTitle, setEditTaTitle] = useState('');
  const [editTaDeck, setEditTaDeck] = useState('');
  const [editTaBody, setEditTaBody] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editSuccessAlert, setEditSuccessAlert] = useState('');
  const [editErrorAlert, setEditErrorAlert] = useState('');
  const [showEditTranslations, setShowEditTranslations] = useState(false);
  const [editActiveTab, setEditActiveTab] = useState<'content' | 'media' | 'placement' | 'translations'>('content');

  // 3-Year Historical Search, Multi-Filter & Page Sifter (Pagination) State
  const [storySearchInput, setStorySearchInput] = useState('');
  const [activeStorySearch, setActiveStorySearch] = useState('');
  const [storyAuthorFilter, setStoryAuthorFilter] = useState('ALL');
  const [storyCategoryFilter, setStoryCategoryFilter] = useState('ALL');
  const [storyYearFilter, setStoryYearFilter] = useState('ALL');
  const [storyPlacementFilter, setStoryPlacementFilter] = useState('ALL');
  const [storyCurrentPage, setStoryCurrentPage] = useState(1);
  const [storyPageSize, setStoryPageSize] = useState(10);
  const [storyJumpInput, setStoryJumpInput] = useState('1');

  useEffect(() => {
    if (isLoggedIn) {
      fetchPublishedArticles();
    }
  }, [isLoggedIn]);

  const fetchPublishedArticles = async () => {
    try {
      const res = await fetch(`/api/articles?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setPublishedArticlesList(data.articles);
      }
    } catch {}
  };

  // Extract all distinct writers/authors from published articles and known staff
  const availableWriters = React.useMemo(() => {
    const writersSet = new Set<string>();
    writersSet.add('Prof. Anura Senanayake');
    writersSet.add('Dr. Nalin Bandara');
    writersSet.add('Dilshan Perera');
    writersSet.add('Ranul Seneviratne');
    writersSet.add('W.A. Wijewardena');
    writersSet.add('Kavindi Jayawardena');
    writersSet.add('LankaEcon Editorial Board');

    publishedArticlesList.forEach((art) => {
      if (Array.isArray(art.authors)) {
        art.authors.forEach((a: any) => {
          if (a?.first_name || a?.last_name) {
            writersSet.add(`${a.first_name || ''} ${a.last_name || ''}`.trim());
          }
        });
      }
      if (art.authorName) writersSet.add(art.authorName.trim());
    });
    return Array.from(writersSet).filter(Boolean);
  }, [publishedArticlesList]);

  // Filtered published articles based on search keyword, author/writer, category, year (past 3 years), and placement
  const filteredArticlesList = React.useMemo(() => {
    return publishedArticlesList.filter((art) => {
      // 1. Keyword search (Headline, Deck, Body, ID, Author)
      if (activeStorySearch.trim()) {
        const q = activeStorySearch.toLowerCase().trim();
        const titleMatch = (art.title || '').toLowerCase().includes(q);
        const deckMatch = (art.deck || '').toLowerCase().includes(q);
        const bodyMatch = (art.body || '').toLowerCase().includes(q);
        const idMatch = String(art.article_id).includes(q);
        const catMatch = (art.primary_category || '').toLowerCase().includes(q);
        const authorMatch = (art.authors || []).some((a: any) =>
          `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase().includes(q)
        ) || (art.authorName || '').toLowerCase().includes(q);

        if (!titleMatch && !deckMatch && !bodyMatch && !idMatch && !catMatch && !authorMatch) {
          return false;
        }
      }

      // 2. Writer / Author Filter
      if (storyAuthorFilter !== 'ALL') {
        const targetAuthor = storyAuthorFilter.toLowerCase();
        const matchesAuthor = (art.authors || []).some((a: any) =>
          `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase().includes(targetAuthor)
        ) || (art.authorName || '').toLowerCase().includes(targetAuthor);

        if (!matchesAuthor) return false;
      }

      // 3. Category Filter
      if (storyCategoryFilter !== 'ALL') {
        if ((art.primary_category || '').toUpperCase() !== storyCategoryFilter.toUpperCase()) {
          return false;
        }
      }

      // 4. Year Filter (Spanning 3 Years: 2026, 2025, 2024, 2023)
      if (storyYearFilter !== 'ALL') {
        const pubYear = new Date(art.published_at || art.created_at || Date.now()).getFullYear().toString();
        if (pubYear !== storyYearFilter) {
          return false;
        }
      }

      // 5. Placement Filter
      if (storyPlacementFilter !== 'ALL') {
        if (storyPlacementFilter === 'lead' && !art.is_lead_story && art.placement !== 'lead') return false;
        if (storyPlacementFilter === 'breaking' && !art.is_breaking) return false;
        if (storyPlacementFilter === 'notable' && art.placement !== 'notable' && !art.is_notable) return false;
        if (storyPlacementFilter === 'spotlight' && art.placement !== 'spotlight' && !art.is_spotlight) return false;
        if (storyPlacementFilter === 'standard') {
          if (art.is_lead_story || art.is_breaking || art.placement === 'notable' || art.placement === 'spotlight' || art.placement === 'lead') {
            return false;
          }
        }
      }

      return true;
    });
  }, [publishedArticlesList, activeStorySearch, storyAuthorFilter, storyCategoryFilter, storyYearFilter, storyPlacementFilter]);

  const totalArticlePages = Math.max(1, Math.ceil(filteredArticlesList.length / storyPageSize));

  // Sync jump input with current page
  useEffect(() => {
    setStoryJumpInput(String(storyCurrentPage));
  }, [storyCurrentPage]);

  // Bound check page number
  useEffect(() => {
    if (storyCurrentPage > totalArticlePages) {
      setStoryCurrentPage(1);
    }
  }, [totalArticlePages, storyCurrentPage]);

  const paginatedArticlesList = React.useMemo(() => {
    const startIdx = (storyCurrentPage - 1) * storyPageSize;
    return filteredArticlesList.slice(startIdx, startIdx + storyPageSize);
  }, [filteredArticlesList, storyCurrentPage, storyPageSize]);

  const handleApplyStorySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveStorySearch(storySearchInput.trim());
    setStoryCurrentPage(1);
  };

  const handleResetStoryFilters = () => {
    setStorySearchInput('');
    setActiveStorySearch('');
    setStoryAuthorFilter('ALL');
    setStoryCategoryFilter('ALL');
    setStoryYearFilter('ALL');
    setStoryPlacementFilter('ALL');
    setStoryCurrentPage(1);
  };

  const handleUpdatePlacement = async (articleId: number | string, placement: string) => {
    try {
      const res = await fetch('/api/admin/set-placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, placement }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.articles) {
          setPublishedArticlesList(data.articles);
        } else {
          fetchPublishedArticles();
        }
        onRefreshArticles();
      } else {
        alert(data.error || 'Failed to update story placement');
      }
    } catch {
      alert('Error updating article placement');
    }
  };

  const handleSetLeadStory = async (articleId: number | string) => {
    try {
      const res = await fetch('/api/admin/set-lead-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.articles) {
          setPublishedArticlesList(data.articles);
        } else {
          fetchPublishedArticles();
        }
        onRefreshArticles();
      } else {
        alert(data.error || 'Failed to update lead story');
      }
    } catch {
      alert('Error setting lead story');
    }
  };

  const handleUpdateCategory = async (articleId: number | string, category: string) => {
    try {
      const res = await fetch('/api/admin/set-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, category }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.articles) {
          setPublishedArticlesList(data.articles);
        } else {
          fetchPublishedArticles();
        }
        onRefreshArticles();
      } else {
        alert(data.error || 'Failed to update article category');
      }
    } catch {
      alert('Error updating article category');
    }
  };

  const handleToggleBreaking = async (articleId: number | string) => {
    try {
      const res = await fetch('/api/admin/toggle-breaking-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.articles) {
          setPublishedArticlesList(data.articles);
        } else {
          fetchPublishedArticles();
        }
        onRefreshArticles();
      } else {
        alert(data.error || 'Failed to update breaking status');
      }
    } catch {
      alert('Error updating breaking news status');
    }
  };

  const handleDeleteArticle = async (articleId: number | string, title?: string) => {
    try {
      const res = await fetch(`/api/admin/posts/${articleId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        if (data.articles) {
          setPublishedArticlesList(data.articles);
        } else {
          fetchPublishedArticles();
        }
        onRefreshArticles();
      } else {
        console.error(data.error || 'Failed to delete article');
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  // 2. Econ Academy Form
  const [courseTitle, setCourseTitle] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [courseCategory, setCourseCategory] = useState('Central Banking & Monetary Policy');
  const [courseLevel, setCourseLevel] = useState('ADVANCED FELLOWSHIP');
  const [courseSummary, setCourseSummary] = useState('');
  const [courseImageUrl, setCourseImageUrl] = useState('');
  const [isPublishingAcademy, setIsPublishingAcademy] = useState(false);
  const [academySuccess, setAcademySuccess] = useState(false);

  // 3. Ink & Canvas Form
  const [inkTitle, setInkTitle] = useState('');
  const [inkAuthor, setInkAuthor] = useState('');
  const [inkCategory, setInkCategory] = useState('Books');
  const [inkExcerpt, setInkExcerpt] = useState('');
  const [inkFullText, setInkFullText] = useState('');
  const [inkImageUrl, setInkImageUrl] = useState('');
  const [inkPriceLKR, setInkPriceLKR] = useState('');
  const [isPublishingInk, setIsPublishingInk] = useState(false);
  const [inkSuccess, setInkSuccess] = useState(false);

  useEffect(() => {
    fetchMediaAssets();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployees();
      fetchPublisherSubmissions();
      fetchPayoutRecords();
      fetchSecurityStatus();
      fetchMediaAssets();
    }
  }, [isLoggedIn]);

  const fetchMediaAssets = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success && Array.isArray(data.media)) {
        setMediaAssets(data.media);
      }
    } catch (err) {
      console.error('Error fetching media assets:', err);
    }
  };

  const handleLocalImageFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP, SVG, GIF).');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      alert('The selected image is larger than 30MB. Please choose a smaller image.');
      return;
    }
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFilePreviewUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (!newImageTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setNewImageTitle(cleanName.replace(/\b\w/g, (c) => c.toUpperCase()));
    }
  };

  const handleUploadMediaAssetFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImageFile || !filePreviewUrl) {
      alert('Please choose an image file from your computer.');
      return;
    }

    setIsUploadingImageFile(true);
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newImageTitle.trim() || selectedImageFile.name,
          fileName: selectedImageFile.name,
          imageData: filePreviewUrl,
          category: newImageCategory,
          tags: newImageTags ? newImageTags.split(',').map((t) => t.trim()) : [newImageCategory, 'UPLOAD'],
          source: currentUser?.fullName || 'Staff Member',
        }),
      });

      const data = await res.json();
      if (data.success && data.media) {
        setImageActionStatus(`✓ "${data.media.title}" uploaded from computer & saved to database!`);
        setSelectedImageFile(null);
        setFilePreviewUrl('');
        setNewImageTitle('');
        setNewImageTags('');
        setShowAddImageForm(false);
        fetchMediaAssets();

        // If target field is active, automatically select this image!
        if (targetImageField === 'news') {
          setStoryImageUrl(data.media.url);
        } else if (targetImageField === 'academy') {
          setCourseImageUrl(data.media.url);
        } else if (targetImageField === 'ink') {
          setInkImageUrl(data.media.url);
        } else if (targetImageField === 'edit_story') {
          setEditImageUrl(data.media.url);
        }
      } else {
        alert(data.error || 'Failed to upload image file.');
      }
    } catch (err: any) {
      alert('Error uploading image file: ' + (err?.message || err));
    } finally {
      setIsUploadingImageFile(false);
    }
  };

  const handleDirectStoryImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP, SVG, GIF).');
      return;
    }
    setDirectUploadingNews(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64Data = ev.target?.result as string;
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: storyTitle ? `${storyTitle} - Hero` : file.name.replace(/\.[^/.]+$/, ''),
            fileName: file.name,
            imageData: base64Data,
            category: storyCategory || 'GENERAL',
            tags: [storyCategory, 'NEWSROOM_UPLOAD'],
            source: currentUser?.fullName || 'Story Editor',
          }),
        });
        const data = await res.json();
        if (data.success && data.media) {
          setStoryImageUrl(data.media.url);
          setImageActionStatus(`✓ Photo uploaded from computer & saved to image database!`);
          fetchMediaAssets();
        } else {
          alert(data.error || 'Upload failed');
        }
        setDirectUploadingNews(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Failed to upload image from computer.');
      setDirectUploadingNews(false);
    }
  };

  const handleAddMediaAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageTitle.trim() || !newImageUrl.trim()) return;

    try {
      const res = await fetch('/api/media/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newImageTitle,
          url: newImageUrl,
          category: newImageCategory,
          tags: newImageTags ? newImageTags.split(',').map((t) => t.trim()) : [newImageCategory],
          source: currentUser?.fullName || 'Staff Asset Upload',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setImageActionStatus(`Image "${newImageTitle}" successfully saved to image database!`);
        setNewImageTitle('');
        setNewImageUrl('');
        setNewImageTags('');
        setShowAddImageForm(false);
        fetchMediaAssets();
      } else {
        alert(data.error || 'Failed to save image asset.');
      }
    } catch {
      alert('Error saving image asset to backend database.');
    }
  };

  const handleDeleteMediaAsset = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the image database?`)) return;

    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setImageActionStatus(`Image "${title}" deleted from database.`);
        fetchMediaAssets();
      } else {
        alert(data.error || 'Failed to delete image asset.');
      }
    } catch {
      alert('Error deleting image asset.');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employee/list');
      const data = await res.json();
      if (data.success) {
        setAllEmployees(data.employees);
      }
    } catch {}
  };

  const fetchPublisherSubmissions = async () => {
    try {
      const res = await fetch('/api/publishing/submissions');
      const data = await res.json();
      if (data.success) {
        setPublisherSubmissions(data.submissions);
      }
    } catch {}
  };

  const fetchPayoutRecords = async () => {
    try {
      const res = await fetch('/api/publishing/payouts');
      const data = await res.json();
      if (data.success) {
        setPayoutRecords(data.payouts);
      }
    } catch {}
  };

  const fetchSecurityStatus = async () => {
    try {
      const res = await fetch('/api/security/status');
      const data = await res.json();
      if (data.success) {
        setSecurityStatus(data);
      }
    } catch {}
  };

  const handleApproveSubmission = async (submissionId: string) => {
    const feedback = vettingFeedback[submissionId] || 'Sample work vetted and approved by LankaEcon Staff.';
    try {
      const res = await fetch('/api/publishing/approve-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          staffId: currentUser?.id || 'emp-owner-001',
          staffFeedback: feedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchPublisherSubmissions();
      } else {
        alert(data.message || 'Approval failed.');
      }
    } catch {
      alert('Error approving submission.');
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    const feedback = vettingFeedback[submissionId] || 'Sample work did not meet LankaEcon editorial guidelines.';
    try {
      const res = await fetch('/api/publishing/reject-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          staffFeedback: feedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchPublisherSubmissions();
      } else {
        alert(data.message || 'Rejection failed.');
      }
    } catch {
      alert('Error updating submission.');
    }
  };

  const handleDeleteSubmission = async (submissionId: string, _title: string) => {
    try {
      const res = await fetch(`/api/publishing/submissions/${submissionId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchPublisherSubmissions();
      }
    } catch (err) {
      console.error('Error connecting to backend:', err);
    }
  };

  const handlePublishImmediately = async (submissionId: string) => {
    try {
      const res = await fetch(`/api/publishing/submissions/${submissionId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationCode: 'PAY-STAFF-OVERRIDE' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Work successfully approved and published live across LankaEcon network!');
        fetchPublisherSubmissions();
        onRefreshArticles();
      } else {
        alert(data.message || 'Publishing failed.');
      }
    } catch {
      alert('Error publishing submission.');
    }
  };

  const handleProcessRemittance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubForRemit) return;

    try {
      const res = await fetch('/api/publishing/remit-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubForRemit.id,
          bankName: remitBank,
          accountNumber: remitAccount,
          branchName: remitBranch,
          amountLKR: Number(remitAmount) || (selectedSubForRemit.creatorEarnedLKR - selectedSubForRemit.remittedLKR),
          staffName: currentUser?.fullName || 'Company Owner',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRemitSuccessMsg(data.message);
        setSelectedSubForRemit(null);
        setRemitAmount('');
        setRemitAccount('');
        fetchPublisherSubmissions();
        fetchPayoutRecords();
      } else {
        alert(data.message || 'Remittance failed.');
      }
    } catch {
      alert('Error dispatching wire payout.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/employee/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.employee) {
        setIsLoggedIn(true);
        setCurrentUser(data.employee);
      } else {
        setAuthError(data.message || 'Login failed.');
      }
    } catch {
      setAuthError('Connection error.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const isOwner = regType === 'owner' || email.toLowerCase().includes('owner') || email.toLowerCase().includes('ranul');

    if (!isOwner && (!empNic || !empTin || !empAccountNum)) {
      setAuthError('Please fill in all mandatory Sri Lankan registration fields (National ID, TIN, and Bank Account).');
      return;
    }

    try {
      const res = await fetch('/api/employee/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          department: isOwner ? 'Publisher & Executive Owner Desk' : department,
          isOwnerRequested: isOwner,
          age: isOwner ? undefined : (empAge ? Number(empAge) : undefined),
          nicNumber: isOwner ? undefined : empNic,
          tinNumber: isOwner ? undefined : empTin,
          bankName: isOwner ? undefined : empBankName,
          accountNumber: isOwner ? undefined : empAccountNum,
          branchName: isOwner ? undefined : empBranchName,
          requestedSites: isOwner ? ['lanka_econ', 'econ_academy', 'lanka_ink'] : empRequestedSites,
        }),
      });
      const data = await res.json();
      if (data.success && data.employee) {
        setAuthSuccess(data.message);
        if (data.employee.status === 'authorized') {
          setIsLoggedIn(true);
          setCurrentUser(data.employee);
        }
        fetchEmployees();
      } else {
        setAuthError(data.message || 'Registration failed.');
      }
    } catch {
      setAuthError('Server error.');
    }
  };

  // Owner Function: Approve or Reject Pending Employee
  const handleAuthorizeEmployee = async (employeeId: string, status: 'authorized' | 'revoked', accessibleSites?: string[]) => {
    try {
      const res = await fetch('/api/employee/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          status,
          accessibleSites,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEmployees();
      } else {
        alert(data.message || 'Failed to update employee authorization.');
      }
    } catch {
      alert('Error communicating with backend.');
    }
  };

  // Owner Function: Remove Employee from Business System
  const handleDeleteEmployee = async (employeeId: string, _employeeName: string) => {
    try {
      const res = await fetch(`/api/employee/${employeeId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchEmployees();
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  // Owner Function: Add Employee Directly
  const handleAddDirectStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffName) return;

    try {
      const res = await fetch('/api/employee/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newStaffName,
          email: newStaffEmail,
          password: 'LankaStaff2026!',
          department: newStaffDept,
          isOwnerRequested: false,
        }),
      });
      const data = await res.json();
      if (data.success && data.employee) {
        // Automatically authorize and set platform desks
        await handleAuthorizeEmployee(data.employee.id, 'authorized', newStaffPlatforms);
        setShowAddStaffModal(false);
        setNewStaffName('');
        setNewStaffEmail('');
      } else {
        alert(data.message || 'Error adding staff member.');
      }
    } catch {
      alert('Failed to create staff record.');
    }
  };

  // Submit News Story
  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim()) return;
    setIsPublishingNews(true);
    setNewsSuccess(false);

    const submittedTitle = storyTitle;
    const submittedDeck = storyDeck;
    const submittedBody = storyBody;
    const submittedCategory = storyCategory;
    const submittedImg = storyImageUrl || stockImageGallery[0].url;

    try {
      const res = await fetch('/api/admin/publish-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: storyTitle,
          deck: storyDeck,
          category: storyCategory,
          body: storyBody,
          imageUrl: storyImageUrl || stockImageGallery[0].url,
          isLeadStory,
          isBreaking,
          isFeatured,
          placement: storyPlacement,
          isSubscriptionOnly: isExclusive,
          authorName: currentUser?.fullName || 'LankaEcon Newsroom Desk',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewsSuccess(true);
        const publishedArt = data.article || {
          article_id: data.article_id || Date.now(),
          title: submittedTitle,
          deck: submittedDeck,
          body: submittedBody,
          primary_category: submittedCategory,
          featured_image_url: submittedImg,
          published_at: new Date().toISOString(),
          reading_time_minutes: 3,
          authors: [{ first_name: currentUser?.fullName || 'LankaEcon', last_name: 'Desk' }],
        };
        setLastPublishedArticle(publishedArt);

        if (data.subscriberAlerts) {
          setSubscriberAlertResult(data.subscriberAlerts);
        } else {
          setSubscriberAlertResult(null);
        }
        setStoryTitle('');
        setStoryDeck('');
        setStoryBody('');
        setStoryImageUrl('');
        setIsLeadStory(false);
        fetchPublishedArticles();
        onRefreshArticles();
      }
    } catch {
      alert('Error publishing story.');
    } finally {
      setIsPublishingNews(false);
    }
  };

  // Submit Academy Masterclass
  const handlePublishAcademy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    setIsPublishingAcademy(true);
    setAcademySuccess(false);

    try {
      const res = await fetch('/api/econ-courses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseTitle,
          instructor: courseInstructor || 'Dr. Mahinda Wickramasinghe',
          category: courseCategory,
          level: courseLevel,
          summary: courseSummary,
          imageUrl: courseImageUrl || stockImageGallery[4].url,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAcademySuccess(true);
        setCourseTitle('');
        setCourseInstructor('');
        setCourseSummary('');
        setCourseImageUrl('');
      }
    } catch {
      setAcademySuccess(true);
    } finally {
      setIsPublishingAcademy(false);
    }
  };

  // Submit Ink & Canvas Creation
  const handlePublishInk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inkTitle.trim()) return;
    setIsPublishingInk(true);
    setInkSuccess(false);

    try {
      const res = await fetch('/api/lanka-ink/creations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: inkTitle,
          authorName: inkAuthor || currentUser?.fullName || 'Master Artisan',
          category: inkCategory,
          excerpt: inkExcerpt,
          fullText: inkFullText,
          priceLKR: Number(inkPriceLKR) || 0,
          imageUrl: inkImageUrl || stockImageGallery[5].url,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInkSuccess(true);
        setInkTitle('');
        setInkAuthor('');
        setInkExcerpt('');
        setInkFullText('');
        setInkImageUrl('');
        setInkPriceLKR('');
      }
    } catch {
      setInkSuccess(true);
    } finally {
      setIsPublishingInk(false);
    }
  };

  const selectStockImage = (url: string) => {
    if (targetImageField === 'news') setStoryImageUrl(url);
    if (targetImageField === 'academy') setCourseImageUrl(url);
    if (targetImageField === 'ink') setInkImageUrl(url);
    if (targetImageField === 'edit_story') setEditImageUrl(url);
    setShowImageLibrary(false);
  };

  const handleOpenEditModal = (article: any) => {
    if (onOpenStoryEditor) {
      onOpenStoryEditor(article);
      return;
    }
    setEditingStory(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseEditModal = () => {
    setEditingStory(null);
    setEditSuccessAlert('');
    setEditErrorAlert('');
  };

  const handleSaveEditedStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    if (!editTitle.trim()) {
      setEditErrorAlert('Story headline cannot be empty.');
      return;
    }

    setIsSavingEdit(true);
    setEditSuccessAlert('');
    setEditErrorAlert('');

    const editorName = currentUser?.fullName || currentUser?.name || 'Company Employee';

    const translationsPayload: any = {};
    if (editSiTitle.trim() || editSiDeck.trim() || editSiBody.trim()) {
      translationsPayload.si = {
        title: editSiTitle.trim(),
        deck: editSiDeck.trim(),
        body: editSiBody.trim(),
        primary_category: editCategory,
      };
    }
    if (editTaTitle.trim() || editTaDeck.trim() || editTaBody.trim()) {
      translationsPayload.ta = {
        title: editTaTitle.trim(),
        deck: editTaDeck.trim(),
        body: editTaBody.trim(),
        primary_category: editCategory,
      };
    }

    try {
      const res = await fetch('/api/admin/update-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: editingStory.article_id,
          title: editTitle,
          deck: editDeck,
          body: editBody,
          primary_category: editCategory,
          featured_image_url: editImageUrl,
          image_caption: editImageCaption,
          reading_time_minutes: editReadingTime,
          placement: editPlacement,
          is_lead_story: editIsLeadStory || editPlacement === 'lead',
          is_breaking: editIsBreaking,
          is_featured: editIsFeatured,
          is_subscription_only: editIsSubscriptionOnly,
          is_premium: editIsSubscriptionOnly,
          author_name: editAuthorName,
          translations: Object.keys(translationsPayload).length > 0 ? translationsPayload : undefined,
          editor_name: editorName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.articles) {
          setPublishedArticlesList(data.articles);
        } else {
          fetchPublishedArticles();
        }
        onRefreshArticles();
        setEditSuccessAlert(`Story #${editingStory.article_id} successfully saved by ${editorName}! Changes are live across all news feeds.`);
        setTimeout(() => {
          setEditingStory(null);
          setEditSuccessAlert('');
        }, 1200);
      } else {
        setEditErrorAlert(data.error || 'Failed to update story.');
      }
    } catch {
      setEditErrorAlert('Network error while saving story changes.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border-2 border-[#0B1E36] p-8 shadow-xl space-y-6 text-slate-900 font-sans">
        <div className="text-center space-y-2">
          <Shield className="w-12 h-12 text-[#0284C7] mx-auto" />
          <h2 className="font-extrabold text-2xl text-[#0B1E36] uppercase">
            {mode === 'login' ? 'Staff Corporate Portal' : 'Register New Staff'}
          </h2>
          <p className="text-xs text-slate-600">
            LankaEcon Central CMS Engine & Operations Desk
          </p>
        </div>

        {authError && (
          <div className="bg-rose-50 border border-rose-300 text-rose-900 text-xs p-3 font-bold">
            {authError}
          </div>
        )}

        {authSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs p-3 font-bold">
            {authSuccess}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. owner@lankaecon.lk"
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Security Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0B1E36] hover:bg-slate-900 text-white font-extrabold py-3 uppercase tracking-wider text-xs transition cursor-pointer"
            >
              Authenticate & Access Backends
            </button>

            <p className="text-center text-[11px] text-slate-500 pt-2">
              New employee or owner?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#0284C7] font-bold hover:underline cursor-pointer"
              >
                Register Account
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="bg-slate-100 p-2 border border-slate-300 flex gap-2">
              <button
                type="button"
                onClick={() => setRegType('owner')}
                className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase transition ${
                  regType === 'owner'
                    ? 'bg-[#0B1E36] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                1. Owner Sign-in / Create
              </button>
              <button
                type="button"
                onClick={() => setRegType('employee')}
                className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase transition ${
                  regType === 'employee'
                    ? 'bg-[#0B1E36] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                2. Employee Register Account
              </button>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {regType === 'owner' ? 'Owner Full Name *' : 'Name of Employee *'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={regType === 'owner' ? "e.g. Ranul (Business Owner)" : "e.g. Kanishka Perera"}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Corporate Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={regType === 'owner' ? "owner@lankaecon.lk" : "kanishka@lankaecon.lk"}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            {regType === 'employee' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      value={empAge}
                      onChange={(e) => setEmpAge(e.target.value)}
                      placeholder="e.g. 29"
                      className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">National ID (NIC) *</label>
                    <input
                      type="text"
                      required
                      value={empNic}
                      onChange={(e) => setEmpNic(e.target.value)}
                      placeholder="e.g. 199518200382"
                      className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">TIN / Sri Lanka Tax Number *</label>
                  <input
                    type="text"
                    required
                    value={empTin}
                    onChange={(e) => setEmpTin(e.target.value)}
                    placeholder="e.g. TIN-981029381"
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-extrabold text-[#0B1E36] block text-[11px] uppercase">
                    Salary Remittance Bank Account Details *
                  </span>
                  
                  <div>
                    <label className="block text-slate-600 font-bold mb-0.5 text-[10px]">Bank Name</label>
                    <select
                      value={empBankName}
                      onChange={(e) => setEmpBankName(e.target.value)}
                      className="w-full bg-white border border-slate-300 px-2 py-1.5 text-xs font-bold"
                    >
                      <option value="Commercial Bank of Ceylon">Commercial Bank of Ceylon</option>
                      <option value="Sampath Bank PLC">Sampath Bank PLC</option>
                      <option value="Bank of Ceylon (BOC)">Bank of Ceylon (BOC)</option>
                      <option value="Hatton National Bank (HNB)">Hatton National Bank (HNB)</option>
                      <option value="NDB Bank PLC">NDB Bank PLC</option>
                      <option value="DFCC Bank">DFCC Bank</option>
                      <option value="Nations Trust Bank (NTB)">Nations Trust Bank (NTB)</option>
                      <option value="Seylan Bank PLC">Seylan Bank PLC</option>
                      <option value="People's Bank Sri Lanka">People's Bank Sri Lanka</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-bold mb-0.5 text-[10px]">Account Number *</label>
                      <input
                        type="text"
                        required
                        value={empAccountNum}
                        onChange={(e) => setEmpAccountNum(e.target.value)}
                        placeholder="1000392810"
                        className="w-full bg-white border border-slate-300 px-2 py-1.5 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-0.5 text-[10px]">Branch Name</label>
                      <input
                        type="text"
                        value={empBranchName}
                        onChange={(e) => setEmpBranchName(e.target.value)}
                        placeholder="Colombo Main"
                        className="w-full bg-white border border-slate-300 px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Primary Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                  >
                    <option value="Macroeconomic & Markets Desk (LankaEcon)">Macroeconomic & Markets Desk (LankaEcon)</option>
                    <option value="Econ Academy Faculty Desk">Econ Academy Faculty Desk</option>
                    <option value="Ink & Canvas Atelier Desk">Ink & Canvas Atelier Desk</option>
                    <option value="Advertising & Enterprise Operations">Advertising & Enterprise Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Requested Business Areas (Select 1, 2, or all 3)</label>
                  <div className="space-y-1.5 bg-slate-50 p-2.5 border border-slate-200">
                    {[
                      { id: 'lanka_econ', label: '1. LankaEcon (Macroeconomics & Newsroom)' },
                      { id: 'econ_academy', label: '2. Econ Academy (Masterclasses & Courses)' },
                      { id: 'lanka_ink', label: '3. Ink and Canvas (Literature & Atelier)' },
                    ].map((area) => (
                      <label key={area.id} className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-[11px]">
                        <input
                          type="checkbox"
                          checked={empRequestedSites.includes(area.id as any)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEmpRequestedSites([...empRequestedSites, area.id as any]);
                            } else {
                              setEmpRequestedSites(empRequestedSites.filter(x => x !== area.id));
                            }
                          }}
                        />
                        <span>{area.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">Security Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0284C7] hover:bg-sky-700 text-white font-extrabold py-3 uppercase tracking-wider text-xs transition cursor-pointer"
            >
              {regType === 'owner' ? 'Register Business Owner Account' : 'Submit Employee Onboarding Record'}
            </button>

            <p className="text-center text-[11px] text-slate-500 pt-2">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#0284C7] font-bold hover:underline cursor-pointer"
              >
                Back to Login
              </button>
            </p>
          </form>
        )}
      </div>
    );
  }

  if (editingStory) {
    return (
      <StoryEditorPage
        article={editingStory}
        currentUser={currentUser}
        onBack={() => {
          setEditingStory(null);
          fetchPublishedArticles();
        }}
        onSaved={(updatedArticle) => {
          setEditingStory(updatedArticle);
          fetchPublishedArticles();
          onRefreshArticles();
        }}
        stockImageGallery={stockImageGallery}
        mediaAssets={mediaAssets}
      />
    );
  }

  return (
    <div className="space-y-8 py-4 bg-white text-slate-900 font-sans">
      
      {/* Console Header */}
      <div className="bg-[#0B1E36] text-white p-6 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-[#DC2626] text-white font-black text-[10px] uppercase px-3 py-1 tracking-widest">
            INTERLINKED BACKEND OPERATIONAL CONSOLE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
            Welcome, {currentUser?.fullName}
          </h2>
          <p className="font-mono text-xs text-slate-300 uppercase tracking-wider mt-0.5">
            {currentUser?.department} • Access Level: {currentUser?.role}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenAnalystChat && (
            <button
              onClick={onOpenAnalystChat}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 uppercase tracking-wider transition cursor-pointer border border-indigo-400/80 shadow-md rounded-xs"
              title="Launch Executive AI Analyst & Reader Intelligence Engine"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>AI ANALYST ENGINE</span>
            </button>
          )}

          {onOpenAnalystCopilot && (
            <button
              onClick={onOpenAnalystCopilot}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs px-3.5 py-2.5 uppercase tracking-wider transition cursor-pointer border border-amber-500/50 shadow-md rounded-xs"
              title="Launch AI Financial Analyst Copilot Chat"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI COPILOT</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentUser(null);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 uppercase tracking-wider transition cursor-pointer"
          >
            Exit Console
          </button>
        </div>
      </div>

      {/* INTERLINKED BACKEND TABS */}
      <div className="bg-slate-100 p-2 border-2 border-[#0B1E36] flex flex-wrap gap-2">
        {onOpenAnalystChat && (
          <button
            onClick={onOpenAnalystChat}
            className="flex-1 min-w-[140px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 hover:from-indigo-900 hover:to-slate-800 text-amber-300 border-2 border-indigo-500/80 hover:border-amber-400 shadow-md"
            title="Open Executive AI Analyst Dashboard"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI ANALYST</span>
          </button>
        )}
        <button
          onClick={() => setActiveBackend('newsroom')}
          className={`flex-1 min-w-[130px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeBackend === 'newsroom'
              ? 'bg-[#0B1E36] text-white shadow-md'
              : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Newspaper className="w-4 h-4 text-[#0284C7]" />
          <span>Backend 1: Newsroom</span>
        </button>

        <button
          onClick={() => setActiveBackend('academy')}
          className={`flex-1 min-w-[130px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeBackend === 'academy'
              ? 'bg-[#0B1E36] text-white shadow-md'
              : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#0284C7]" />
          <span>Backend 2: Academy</span>
        </button>

        <button
          onClick={() => setActiveBackend('ink_canvas')}
          className={`flex-1 min-w-[130px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeBackend === 'ink_canvas'
              ? 'bg-[#0B1E36] text-white shadow-md'
              : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Feather className="w-4 h-4 text-[#0284C7]" />
          <span>Backend 3: Ink & Canvas</span>
        </button>

        <button
          onClick={() => setActiveBackend('vetting_queue')}
          className={`flex-1 min-w-[130px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeBackend === 'vetting_queue'
              ? 'bg-[#0B1E36] text-white shadow-md'
              : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Publisher Vetting</span>
        </button>

        <button
          onClick={() => setActiveBackend('remittance')}
          className={`flex-1 min-w-[130px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeBackend === 'remittance'
              ? 'bg-[#0B1E36] text-white shadow-md'
              : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Send className="w-4 h-4 text-emerald-500" />
          <span>Tuition Payouts</span>
        </button>

        <button
          onClick={() => setActiveBackend('erp_accounting')}
          className={`flex-1 min-w-[130px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeBackend === 'erp_accounting'
              ? 'bg-[#0B1E36] text-white shadow-md'
              : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Landmark className="w-4 h-4 text-amber-500" />
          <span>ERP Accounting & HR</span>
        </button>

        <button
          onClick={() => setActiveBackend('ad_desk')}
          className={`flex-1 min-w-[130px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeBackend === 'ad_desk'
              ? 'bg-[#0B1E36] text-white shadow-md'
              : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>Commercial Ad Desk</span>
        </button>

        <button
          onClick={() => setActiveBackend('security')}
          className={`flex-1 min-w-[130px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeBackend === 'security'
              ? 'bg-[#0B1E36] text-white shadow-md'
              : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <Shield className="w-4 h-4 text-sky-400" />
          <span>Security Shield</span>
        </button>

        <button
          onClick={() => {
            setActiveBackend('image_database');
            fetchMediaAssets();
          }}
          className={`flex-1 min-w-[130px] py-3 px-3 text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeBackend === 'image_database'
              ? 'bg-[#0B1E36] text-white shadow-md border-b-2 border-emerald-400'
              : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-emerald-600" />
          <span>Image Database</span>
        </button>
      </div>

      {/* Shared Stock Image Asset Library Modal */}
      {showImageLibrary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-4xl shadow-2xl overflow-hidden p-6 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-extrabold text-lg text-[#0B1E36] uppercase">
                  Image Database & Media Asset Management ({mediaAssets.length > 0 ? mediaAssets.length : stockImageGallery.length} Items)
                </h3>
              </div>
              <button onClick={() => setShowImageLibrary(false)} className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>

            {imageActionStatus && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs p-2.5 mb-3 font-bold flex justify-between items-center">
                <span>{imageActionStatus}</span>
                <button onClick={() => setImageActionStatus('')} className="text-emerald-700 hover:text-emerald-900">✕</button>
              </div>
            )}

            {/* Header controls & action bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mb-3 bg-slate-100 p-2.5 border border-slate-200">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={imageSearchQuery}
                    onChange={(e) => setImageSearchQuery(e.target.value)}
                    placeholder="Search database by title or tags..."
                    className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400"
                  />
                </div>
                <select
                  value={imageCategoryFilter}
                  onChange={(e) => setImageCategoryFilter(e.target.value)}
                  className="bg-white border border-slate-300 px-2 py-1.5 text-xs text-slate-800 font-bold"
                >
                  <option value="ALL">All Categories</option>
                  <option value="MACRO">MACRO</option>
                  <option value="MARKETS">MARKETS</option>
                  <option value="FINANCE">FINANCE</option>
                  <option value="TRADE">TRADE</option>
                  <option value="EXPORTS">EXPORTS</option>
                  <option value="ACADEMY">ACADEMY</option>
                  <option value="CULTURE">CULTURE</option>
                  <option value="PODCAST">PODCAST</option>
                  <option value="LITERATURE">LITERATURE</option>
                  <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                  <option value="GENERAL">GENERAL</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowAddImageForm(!showAddImageForm);
                    setImageUploadMode('file');
                  }}
                  className="bg-[#0284C7] hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 uppercase flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{showAddImageForm ? 'Close Upload' : 'Upload from Computer'}</span>
                </button>
              </div>
            </div>

            {/* Upload or Add Image Panel */}
            {showAddImageForm && (
              <div className="bg-slate-50 border-2 border-[#0284C7] p-4 mb-4 space-y-3 text-xs">
                {/* Mode tabs */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('file')}
                      className={`px-3 py-1 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer border ${
                        imageUploadMode === 'file'
                          ? 'bg-[#0284C7] text-white border-[#0284C7]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload from Computer (Local File)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      className={`px-3 py-1 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer border ${
                        imageUploadMode === 'url'
                          ? 'bg-[#0284C7] text-white border-[#0284C7]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Register Web URL</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddImageForm(false)}
                    className="text-slate-400 hover:text-slate-700 font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Option 1: Upload from Computer */}
                {imageUploadMode === 'file' ? (
                  <form onSubmit={handleUploadMediaAssetFile} className="space-y-3">
                    <div className="border-2 border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-50 p-4 text-center transition">
                      {selectedImageFile && filePreviewUrl ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                          <img
                            src={filePreviewUrl}
                            alt="Selected local file"
                            className="w-28 h-20 object-cover border border-sky-400 shadow-sm"
                          />
                          <div className="text-left">
                            <p className="font-bold text-slate-900 text-xs truncate max-w-xs">{selectedImageFile.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {(selectedImageFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedImageFile.type || 'Image File'}
                            </p>
                            <label className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#0284C7] font-bold hover:underline cursor-pointer">
                              <FileUp className="w-3.5 h-3.5" />
                              <span>Select a different image file</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleLocalImageFileSelect(e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer py-2">
                          <UploadCloud className="w-8 h-8 text-[#0284C7] mb-1.5" />
                          <span className="font-extrabold text-xs text-slate-900 uppercase">
                            Click to Browse Image from Your Computer
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5">
                            Supports PNG, JPG, WebP, GIF, SVG (up to 30MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            required
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleLocalImageFileSelect(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Image Title *</label>
                        <input
                          type="text"
                          required
                          value={newImageTitle}
                          onChange={(e) => setNewImageTitle(e.target.value)}
                          placeholder="e.g. CBSL Monetary Policy Press Briefing"
                          className="w-full bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Category</label>
                        <select
                          value={newImageCategory}
                          onChange={(e) => setNewImageCategory(e.target.value)}
                          className="w-full bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 font-bold"
                        >
                          <option value="ECONOMY">ECONOMY</option>
                          <option value="MACRO">MACRO</option>
                          <option value="MARKETS">MARKETS</option>
                          <option value="FINANCE">FINANCE</option>
                          <option value="TRADE">TRADE</option>
                          <option value="EXPORTS">EXPORTS</option>
                          <option value="ACADEMY">ACADEMY</option>
                          <option value="CULTURE">CULTURE</option>
                          <option value="PODCAST">PODCAST</option>
                          <option value="LITERATURE">LITERATURE</option>
                          <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                          <option value="GENERAL">GENERAL</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={newImageTags}
                          onChange={(e) => setNewImageTags(e.target.value)}
                          placeholder="e.g. Story, Inflation, Fort"
                          className="w-full bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImageFile(null);
                          setFilePreviewUrl('');
                          setShowAddImageForm(false);
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 uppercase text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!selectedImageFile || isUploadingImageFile}
                        className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold px-4 py-1.5 uppercase tracking-wider text-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        {isUploadingImageFile ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading to Database...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload & Save to Image Database</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Option 2: Register via Web URL */
                  <form onSubmit={handleAddMediaAsset} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Image Title *</label>
                        <input
                          type="text"
                          required
                          value={newImageTitle}
                          onChange={(e) => setNewImageTitle(e.target.value)}
                          placeholder="e.g. Central Bank Fort Building Colombo"
                          className="w-full bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                        <input
                          type="url"
                          required
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Category</label>
                        <select
                          value={newImageCategory}
                          onChange={(e) => setNewImageCategory(e.target.value)}
                          className="w-full bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 font-bold"
                        >
                          <option value="MACRO">MACRO</option>
                          <option value="MARKETS">MARKETS</option>
                          <option value="FINANCE">FINANCE</option>
                          <option value="TRADE">TRADE</option>
                          <option value="EXPORTS">EXPORTS</option>
                          <option value="ACADEMY">ACADEMY</option>
                          <option value="CULTURE">CULTURE</option>
                          <option value="PODCAST">PODCAST</option>
                          <option value="LITERATURE">LITERATURE</option>
                          <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                          <option value="GENERAL">GENERAL</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={newImageTags}
                          onChange={(e) => setNewImageTags(e.target.value)}
                          placeholder="e.g. CBSL, Fort, Banking"
                          className="w-full bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddImageForm(false)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 uppercase text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-1.5 uppercase tracking-wider text-xs transition cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Save Image Entry</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Gallery Grid with search/filter applied */}
            {(() => {
              const stockItems = stockImageGallery
                .filter((s) => !mediaAssets.some((m) => m.url === s.url))
                .map((img, i) => ({
                  id: `stock-${i}`,
                  title: img.title,
                  url: img.url,
                  category: img.tag,
                  tags: [img.tag],
                  uploaded_at: new Date().toISOString(),
                  source: 'Curated Stock Library',
                }));
              const allItems = [...mediaAssets, ...stockItems];

              const filteredItems = allItems.filter((img) => {
                const matchesCategory = imageCategoryFilter === 'ALL' || (img.category && img.category.toUpperCase() === imageCategoryFilter.toUpperCase());
                const query = imageSearchQuery.trim().toLowerCase();
                if (!query) return matchesCategory;
                const matchesQuery = (
                  img.title.toLowerCase().includes(query) ||
                  (img.category && img.category.toLowerCase().includes(query)) ||
                  (img.tags && img.tags.some((t: string) => t.toLowerCase().includes(query)))
                );
                return matchesCategory && matchesQuery;
              });

              if (filteredItems.length === 0) {
                return (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-50 border border-slate-200">
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="font-bold text-sm text-slate-700">No images found matching your search</p>
                    <p className="text-xs text-slate-400 mt-1">Try changing your category filter or upload an image from your computer.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-y-auto p-1 flex-1">
                  {filteredItems.map((img) => {
                    const isLocalUpload = img.url?.startsWith('/uploads/') || img.source?.includes('Computer') || img.source?.includes('Local');
                    return (
                      <div
                        key={img.id}
                        className="group relative bg-slate-100 border border-slate-200 hover:border-[#0284C7] overflow-hidden transition flex flex-col"
                      >
                        <div className="relative h-28 overflow-hidden bg-slate-200">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition cursor-pointer"
                            onClick={() => selectStockImage(img.url)}
                            onError={(e: any) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="absolute top-1 left-1 flex flex-col gap-1 pointer-events-none">
                            <span className="bg-[#0B1E36] text-white text-[8px] font-bold px-1.5 py-0.5 uppercase">
                              {img.category || 'IMAGE'}
                            </span>
                            {isLocalUpload && (
                              <span className="bg-emerald-700 text-white text-[7px] font-extrabold px-1 py-0.2 rounded-xs uppercase tracking-tight">
                                Computer File
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMediaAsset(img.id, img.title);
                            }}
                            className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-700 text-white p-1 rounded-xs transition cursor-pointer shadow-xs"
                            title="Delete Image from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-2 flex-1 flex flex-col justify-between bg-white">
                          <div>
                            <p
                              className="text-[11px] font-bold text-slate-900 group-hover:text-[#0284C7] line-clamp-1 cursor-pointer"
                              onClick={() => selectStockImage(img.url)}
                              title={img.title}
                            >
                              {img.title}
                            </p>
                            {img.file_size && (
                              <p className="text-[9px] text-slate-400 font-mono mt-0.5">{img.file_size}</p>
                            )}
                          </div>
                          <button
                            onClick={() => selectStockImage(img.url)}
                            className="mt-2 w-full bg-[#0B1E36] hover:bg-[#0284C7] text-white text-[9px] font-bold py-1 uppercase tracking-wider cursor-pointer transition flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Use in Story</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* BACKEND 1: NEWSROOM CMS */}
      {activeBackend === 'newsroom' && (
        <div className="bg-white border-2 border-[#0B1E36] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#0284C7]" />
              <h3 className="font-extrabold text-xl text-[#0B1E36] uppercase">
                Newsroom Story Publishing Desk
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {onOpenSummaryStoryPage && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenSummaryStoryPage({
                      title: storyTitle || 'Sri Lanka Economic Brief',
                      body: storyBody || '',
                      primary_category: storyCategory || 'ECONOMY',
                    })
                  }
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-400 font-extrabold text-xs px-3 py-1.5 uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                  title="Open dedicated Summary Story Creator Studio page to write custom text & download story to computer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Summary Story Creator (Studio Page)</span>
                </button>
              )}
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 uppercase font-mono">
                STATUS: READY
              </span>
            </div>
          </div>

          {newsSuccess && (
            <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-4 font-bold text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-black">Story published live to LankaEcon News Feed!</span>
                </div>

                {onOpenIgStory && lastPublishedArticle && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenIgStory(lastPublishedArticle, 'entire_story')}
                      className="bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-xs shadow-md border border-rose-300"
                      title="Publish entire story across sequential Instagram Story slides"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Publish Entire Story to IG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenIgStory(lastPublishedArticle, 'summary')}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-xs shadow-md border border-amber-400"
                      title="Make an executive summary of long stories and upload to Instagram"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Make Summary & Upload to IG</span>
                    </button>
                  </div>
                )}
              </div>

              {subscriberAlertResult && (
                <div className="text-[11px] text-emerald-800 bg-emerald-100/70 p-2 rounded-xs border border-emerald-200">
                  <span className="font-extrabold uppercase">⚡ Subscriber Notification Alert Engine:</span>{' '}
                  {subscriberAlertResult.dispatched > 0
                    ? `Successfully sent email alerts to ${subscriberAlertResult.dispatched} opted-in subscriber(s) for this exclusive content!`
                    : `Notification scan complete (0 subscribers opted-in or available for email dispatch).`}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handlePublishNews} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="e.g. Central Bank Injects Capital to Stabilize Liquidity"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Category (Matches Header Tabs)</label>
                <select
                  value={storyCategory}
                  onChange={(e) => setStoryCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold"
                >
                  <option value="ECONOMY">ECONOMY</option>
                  <option value="MARKETS">MARKETS & CSE</option>
                  <option value="FINANCE">FINANCE</option>
                  <option value="SERVICES">SERVICES</option>
                  <option value="INDUSTRY">INDUSTRY</option>
                  <option value="GOVERNANCE">GOVERNANCE</option>
                  <option value="OPINION">OPINION & EDITORIAL</option>
                  <option value="WORLD">WORLD</option>
                  <option value="POLICY">MACRO POLICY</option>
                  <option value="BANKING">BANKING</option>
                  <option value="TRADE">TRADE & EXPORTS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Layout Placement / Side Panel Pocket</label>
              <select
                value={storyPlacement}
                onChange={(e: any) => setStoryPlacement(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold text-[#0B1E36]"
              >
                <option value="standard">Standard Main Feed</option>
                <option value="notable">Notable Panel (Left Column)</option>
                <option value="spotlight">Spotlight Panel (Right Column)</option>
                <option value="lead">Top Lead Story</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Deck / Subtitle Teaser</label>
              <input
                type="text"
                value={storyDeck}
                onChange={(e) => setStoryDeck(e.target.value)}
                placeholder="e.g. CBSL monetary policy committee releases official communique."
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label className="text-slate-800 font-extrabold text-sm flex items-center gap-1.5">
                  <span>Full Article Body *</span>
                  <span className="text-xs text-slate-400 font-normal">(Editorial Writing Area)</span>
                </label>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-xs border border-slate-300 font-bold">
                    {storyBody ? `${storyBody.trim().split(/\s+/).filter(Boolean).length} words` : '0 words'}
                  </span>
                  <span className="text-slate-400">
                    {storyBody ? `${storyBody.length} chars` : '0 chars'}
                  </span>
                  {storyBody && storyBody.trim().split(/\s+/).filter(Boolean).length > 100 && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-xs font-bold border border-amber-300">
                      Long Story • Summary Option Available for IG
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  required
                  rows={15}
                  value={storyBody}
                  onChange={(e) => setStoryBody(e.target.value)}
                  placeholder="Write or paste full news text here... Use multiple paragraphs for clear journalistic structure."
                  className="w-full min-h-[360px] md:min-h-[460px] bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-[#0284C7] p-4 text-sm leading-relaxed text-slate-900 rounded-xs shadow-inner outline-none transition font-sans resize-y selection:bg-sky-200"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5 text-xs text-slate-500">
                <p className="flex items-center gap-1">
                  <span>💡 Tip: Drag the bottom-right corner of the writing box to expand it even further.</span>
                </p>
                {storyBody && storyBody.trim().split(/\s+/).filter(Boolean).length > 100 && (
                  <p className="italic text-amber-800 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
                    <strong>Instagram Notice:</strong> Can publish sequentially across slides, or click <em>"Summary Story Creator"</em> to generate a single-slide executive summary graphic.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                <label className="text-slate-700 font-bold">Featured Story Image</label>
                <div className="flex items-center gap-2">
                  <label className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-2.5 py-1 uppercase rounded-xs cursor-pointer flex items-center gap-1 shadow-xs transition">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{directUploadingNews ? 'Uploading File...' : 'Upload from Computer'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={directUploadingNews}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleDirectStoryImageUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetImageField('news');
                      setShowImageLibrary(true);
                    }}
                    className="text-[#0284C7] font-bold hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Browse Image Database</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={storyImageUrl}
                  onChange={(e) => setStoryImageUrl(e.target.value)}
                  placeholder="https://... or click 'Upload from Computer' above"
                  className="flex-1 bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                />
                {storyImageUrl && (
                  <button
                    type="button"
                    onClick={() => setStoryImageUrl('')}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 cursor-pointer border border-rose-200 bg-rose-50"
                  >
                    Clear
                  </button>
                )}
              </div>

              {storyImageUrl && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-slate-100 border border-slate-200">
                  <img
                    src={storyImageUrl}
                    alt="Story Thumbnail Preview"
                    className="w-16 h-12 object-cover border border-slate-300 shadow-2xs"
                    onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="text-[11px] text-slate-700 truncate flex-1">
                    <span className="font-bold text-slate-900 block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Hero Image Attached
                    </span>
                    <span className="text-slate-500 font-mono text-[10px] truncate block">{storyImageUrl}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center space-x-2 font-bold text-sky-900 bg-sky-50 px-2.5 py-1 border border-sky-200 rounded-xs">
                <input
                  type="checkbox"
                  checked={isLeadStory}
                  onChange={(e) => setIsLeadStory(e.target.checked)}
                  className="rounded text-[#0284C7]"
                />
                <span>Set as Home Page Lead Story 🌟</span>
              </label>

              <label className="flex items-center space-x-2 font-bold text-amber-900 bg-amber-50 px-2.5 py-1 border border-amber-200 rounded-xs">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-[#0284C7]"
                />
                <span>Breaking Report 🚨</span>
              </label>

              <label className="flex items-center space-x-2 font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[#0284C7]"
                />
                <span>Highlight Banner</span>
              </label>

              <label className="flex items-center space-x-2 font-bold text-rose-900">
                <input
                  type="checkbox"
                  checked={isExclusive}
                  onChange={(e) => setIsExclusive(e.target.checked)}
                  className="rounded text-[#DC2626]"
                />
                <span>Subscriber Pro Exclusive (Paywall)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isPublishingNews}
              className="w-full bg-[#0B1E36] hover:bg-slate-900 text-white font-extrabold py-3 uppercase tracking-wider text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#0284C7]" />
              <span>{isPublishingNews ? 'Publishing...' : 'Publish Story Live'}</span>
            </button>
          </form>

          {/* EDITORIAL MANAGEMENT TABLE FOR SETTING LEAD STORY & BREAKING NEWS WITH 3-YEAR ARCHIVE, SEARCH, WRITER FILTER & PAGE SIFTER */}
          <div className="pt-8 border-t-2 border-[#0B1E36] space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="font-extrabold text-base text-[#0B1E36] uppercase tracking-wide flex items-center gap-2">
                  <span>Published Stories & Lead Story / Breaking News Controls</span>
                  <span className="text-[10px] font-mono font-bold bg-[#0284C7]/10 text-[#0284C7] px-2 py-0.5 border border-[#0284C7]/30 rounded-xs">
                    3-Year Archive
                  </span>
                </h4>
                <p className="text-xs text-slate-500">
                  Search by keyword, filter by writer/period, and page through all historical and active dispatches (2023 – 2026).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 border border-slate-300 rounded-xs">
                  {filteredArticlesList.length} {filteredArticlesList.length === 1 ? 'Dispatch' : 'Dispatches'} Shown
                </span>
                {publishedArticlesList.length !== filteredArticlesList.length && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    (of {publishedArticlesList.length} total)
                  </span>
                )}
              </div>
            </div>

            {/* TOP SEARCH & MULTI-FILTER BAR */}
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-3">
              {/* Row 1: Search Box & Search Button */}
              <form onSubmit={handleApplyStorySearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={storySearchInput}
                    onChange={(e) => setStorySearchInput(e.target.value)}
                    placeholder="Search published stories by keyword, headline, deck, body, author, or ID..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-[#0284C7] focus:border-[#0284C7] bg-white font-medium text-slate-900 shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {storySearchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setStorySearchInput('');
                        setActiveStorySearch('');
                        setStoryCurrentPage(1);
                      }}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                      title="Clear text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0B1E36] hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    title="Execute search"
                  >
                    <Search className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Search</span>
                  </button>

                  {(activeStorySearch || storyAuthorFilter !== 'ALL' || storyCategoryFilter !== 'ALL' || storyYearFilter !== 'ALL' || storyPlacementFilter !== 'ALL') && (
                    <button
                      type="button"
                      onClick={handleResetStoryFilters}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Reset all filters"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Row 2: Filter Dropdowns (Writer, Category, Year, Placement, Items Per Page) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 pt-1 border-t border-slate-200">
                {/* 1. Filter by Writer */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#0284C7]" />
                    <span>Writer / Author</span>
                  </label>
                  <select
                    value={storyAuthorFilter}
                    onChange={(e) => {
                      setStoryAuthorFilter(e.target.value);
                      setStoryCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xs text-slate-800 focus:ring-1 focus:ring-[#0284C7] cursor-pointer"
                  >
                    <option value="ALL">All Writers ({availableWriters.length})</option>
                    {availableWriters.map((writer) => (
                      <option key={writer} value={writer}>
                        {writer}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Filter by Category */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-[#0284C7]" />
                    <span>Category</span>
                  </label>
                  <select
                    value={storyCategoryFilter}
                    onChange={(e) => {
                      setStoryCategoryFilter(e.target.value);
                      setStoryCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xs text-slate-800 focus:ring-1 focus:ring-[#0284C7] cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="ECONOMY">Economy</option>
                    <option value="MARKETS">Markets</option>
                    <option value="FINANCE">Finance</option>
                    <option value="SERVICES">Services</option>
                    <option value="INDUSTRY">Industry</option>
                    <option value="GOVERNANCE">Governance</option>
                    <option value="OPINION">Opinion</option>
                    <option value="WORLD">World</option>
                    <option value="POLICY">Policy</option>
                    <option value="BANKING">Banking</option>
                    <option value="TRADE">Trade</option>
                  </select>
                </div>

                {/* 3. Filter by Year (Past 3 Years: 2023 - 2026) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#0284C7]" />
                    <span>Year (3-Yr Range)</span>
                  </label>
                  <select
                    value={storyYearFilter}
                    onChange={(e) => {
                      setStoryYearFilter(e.target.value);
                      setStoryCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xs text-slate-800 focus:ring-1 focus:ring-[#0284C7] cursor-pointer"
                  >
                    <option value="ALL">All Years (2023 – 2026)</option>
                    <option value="2026">2026 Dispatches</option>
                    <option value="2025">2025 Dispatches</option>
                    <option value="2024">2024 Dispatches</option>
                    <option value="2023">2023 Dispatches</option>
                  </select>
                </div>

                {/* 4. Filter by Placement Status */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                    <Award className="w-3 h-3 text-[#0284C7]" />
                    <span>Placement / Status</span>
                  </label>
                  <select
                    value={storyPlacementFilter}
                    onChange={(e) => {
                      setStoryPlacementFilter(e.target.value);
                      setStoryCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xs text-slate-800 focus:ring-1 focus:ring-[#0284C7] cursor-pointer"
                  >
                    <option value="ALL">All Placements</option>
                    <option value="lead">★ Lead Story</option>
                    <option value="breaking">🚨 Breaking News</option>
                    <option value="notable">Notable (Left Panel)</option>
                    <option value="spotlight">Spotlight (Right Panel)</option>
                    <option value="standard">Standard Feed</option>
                  </select>
                </div>

                {/* 5. Per Page Size */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Stories Per Page
                  </label>
                  <select
                    value={storyPageSize}
                    onChange={(e) => {
                      setStoryPageSize(Number(e.target.value));
                      setStoryCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xs text-slate-800 focus:ring-1 focus:ring-[#0284C7] cursor-pointer"
                  >
                    <option value={10}>10 items</option>
                    <option value={15}>15 items</option>
                    <option value={25}>25 items</option>
                    <option value={50}>50 items</option>
                    <option value={100}>100 items</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Pills Indicator */}
              {(activeStorySearch || storyAuthorFilter !== 'ALL' || storyCategoryFilter !== 'ALL' || storyYearFilter !== 'ALL' || storyPlacementFilter !== 'ALL') && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700">Active Filters:</span>
                  {activeStorySearch && (
                    <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-xs font-medium border border-sky-200 flex items-center gap-1">
                      Keyword: "{activeStorySearch}"
                      <button onClick={() => { setActiveStorySearch(''); setStorySearchInput(''); setStoryCurrentPage(1); }} className="hover:text-sky-950 font-bold">×</button>
                    </span>
                  )}
                  {storyAuthorFilter !== 'ALL' && (
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-xs font-medium border border-indigo-200 flex items-center gap-1">
                      Writer: {storyAuthorFilter}
                      <button onClick={() => { setStoryAuthorFilter('ALL'); setStoryCurrentPage(1); }} className="hover:text-indigo-950 font-bold">×</button>
                    </span>
                  )}
                  {storyCategoryFilter !== 'ALL' && (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-xs font-medium border border-emerald-200 flex items-center gap-1">
                      Category: {storyCategoryFilter}
                      <button onClick={() => { setStoryCategoryFilter('ALL'); setStoryCurrentPage(1); }} className="hover:text-emerald-950 font-bold">×</button>
                    </span>
                  )}
                  {storyYearFilter !== 'ALL' && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-xs font-medium border border-amber-200 flex items-center gap-1">
                      Year: {storyYearFilter}
                      <button onClick={() => { setStoryYearFilter('ALL'); setStoryCurrentPage(1); }} className="hover:text-amber-950 font-bold">×</button>
                    </span>
                  )}
                  {storyPlacementFilter !== 'ALL' && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-xs font-medium border border-purple-200 flex items-center gap-1">
                      Placement: {storyPlacementFilter}
                      <button onClick={() => { setStoryPlacementFilter('ALL'); setStoryCurrentPage(1); }} className="hover:text-purple-950 font-bold">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ARTICLES DATA TABLE */}
            <div className="overflow-x-auto border border-slate-200 rounded-xs bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0B1E36] text-white uppercase text-[10px] tracking-wider">
                    <th className="p-3 w-16">ID</th>
                    <th className="p-3">Story Headline & Writer</th>
                    <th className="p-3 w-28">Date / Year</th>
                    <th className="p-3 w-28">Category</th>
                    <th className="p-3 w-32">Badges</th>
                    <th className="p-3 text-right w-72">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedArticlesList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 bg-slate-50">
                        <div className="max-w-md mx-auto space-y-2">
                          <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
                          <p className="font-bold text-slate-800 text-sm">No stories found matching your filter criteria</p>
                          <p className="text-xs text-slate-500">
                            Try adjusting your search keyword, writer selection, year period, or placement filters.
                          </p>
                          <button
                            type="button"
                            onClick={handleResetStoryFilters}
                            className="mt-2 px-3 py-1.5 bg-[#0B1E36] text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset All Filters</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedArticlesList.map((art) => {
                      const authorName = art.authors?.[0]?.first_name
                        ? `${art.authors[0].first_name} ${art.authors[0].last_name}`
                        : art.authorName || 'LankaEcon Editorial Board';

                      const pubDateObj = new Date(art.published_at || art.created_at || Date.now());
                      const formattedDate = !isNaN(pubDateObj.getTime())
                        ? pubDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : 'Recent';

                      return (
                        <tr key={art.article_id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-500 align-top">
                            #{art.article_id}
                          </td>
                          <td className="p-3 align-top max-w-md">
                            <div className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                              {art.title}
                            </div>
                            {art.deck && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {art.deck}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-600">
                              <span className="font-semibold text-slate-700 flex items-center gap-0.5">
                                <User className="w-2.5 h-2.5 text-[#0284C7]" />
                                {authorName}
                              </span>
                              {art.reading_time_minutes && (
                                <span className="text-slate-400">• {art.reading_time_minutes} min read</span>
                              )}
                              {art.view_count !== undefined && (
                                <span className="text-slate-400">• {art.view_count.toLocaleString()} views</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 align-top font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            <div className="font-semibold text-slate-800">{formattedDate}</div>
                            <div className="text-[10px] text-slate-400">{pubDateObj.getFullYear()}</div>
                          </td>
                          <td className="p-3 align-top">
                            <select
                              value={art.primary_category || 'ECONOMY'}
                              onChange={(e) => handleUpdateCategory(art.article_id, e.target.value)}
                              className="px-2 py-1 font-mono text-[10px] font-extrabold uppercase bg-sky-50 text-[#0284C7] border border-sky-300 rounded-xs cursor-pointer hover:bg-sky-100 transition"
                              title="Change story category tab"
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
                          </td>
                          <td className="p-3 align-top">
                            <div className="flex gap-1 flex-wrap">
                              {art.placement === 'notable' && (
                                <span className="bg-amber-600 text-white font-black text-[9px] px-2 py-0.5 uppercase tracking-widest rounded-xs shadow-2xs">
                                  NOTABLE
                                </span>
                              )}
                              {art.placement === 'spotlight' && (
                                <span className="bg-indigo-600 text-white font-black text-[9px] px-2 py-0.5 uppercase tracking-widest rounded-xs shadow-2xs">
                                  SPOTLIGHT
                                </span>
                              )}
                              {art.is_lead_story && (
                                <span className="bg-sky-600 text-white font-black text-[9px] px-2 py-0.5 uppercase tracking-widest rounded-xs shadow-2xs">
                                  LEAD STORY
                                </span>
                              )}
                              {art.is_breaking && (
                                <span className="bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 uppercase tracking-widest rounded-xs shadow-2xs">
                                  BREAKING
                                </span>
                              )}
                              {(!art.placement || art.placement === 'standard') && !art.is_lead_story && !art.is_breaking && (
                                <span className="text-slate-400 text-[10px] font-mono">Standard</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right align-top">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(art)}
                                className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-slate-950 transition rounded-xs cursor-pointer flex items-center gap-1 shadow-2xs"
                                title="Edit story headline, deck, body, image, placement and metadata"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>

                              {onOpenIgStory && (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => onOpenIgStory(art, 'entire_story')}
                                    className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-rose-600 hover:opacity-90 text-white transition rounded-xs cursor-pointer flex items-center gap-1 shadow-2xs"
                                    title="Publish entire story across multi-slide carousel"
                                  >
                                    <Instagram className="w-3 h-3" />
                                    <span>Entire Story</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onOpenIgStory(art, 'summary')}
                                    className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white transition rounded-xs cursor-pointer flex items-center gap-1 shadow-2xs"
                                    title="Make a summary of long stories and upload to Instagram"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span>Summary & Upload</span>
                                  </button>
                                </div>
                              )}

                              <select
                                value={art.placement || (art.is_lead_story ? 'lead' : 'standard')}
                                onChange={(e) => handleUpdatePlacement(art.article_id, e.target.value)}
                                className="px-2 py-1 text-[10px] font-extrabold uppercase bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xs cursor-pointer text-[#0B1E36]"
                                title="Assign layout placement (Notable Left, Spotlight Right, Lead, or Standard Feed)"
                              >
                                <option value="standard">Standard Feed</option>
                                <option value="notable">Notable (Left)</option>
                                <option value="spotlight">Spotlight (Right)</option>
                                <option value="lead">Lead Story</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => handleSetLeadStory(art.article_id)}
                                className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition rounded-xs cursor-pointer flex items-center gap-1 ${
                                  art.is_lead_story
                                    ? 'bg-[#0B1E36] text-amber-300 border border-amber-400 shadow-2xs'
                                    : 'bg-sky-100 hover:bg-sky-200 text-[#0284C7] border border-sky-300'
                                }`}
                                title="Designate or Un-set Home Page Lead Story (Click to toggle)"
                              >
                                {art.is_lead_story ? '★ LEAD' : 'Set Lead'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleBreaking(art.article_id)}
                                className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition rounded-xs cursor-pointer flex items-center gap-1 ${
                                  art.is_breaking
                                    ? 'bg-rose-900 text-white border border-rose-400 shadow-2xs'
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                }`}
                                title="Toggle Breaking News Alert (Click to toggle)"
                              >
                                {art.is_breaking ? '🚨 BREAKING' : 'Breaking'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteArticle(art.article_id, art.title)}
                                className="px-2 py-1 text-[10px] font-black uppercase tracking-wider bg-rose-50 hover:bg-rose-700 text-rose-700 hover:text-white border border-rose-300 transition rounded-xs cursor-pointer flex items-center gap-1"
                                title="Delete story completely from newsroom database"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGE SIFTER & PAGINATION CONTROLS (MATCHING SCREENSHOT) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 pb-1 border-t border-slate-200 text-xs">
              {/* Left Item Count Indicator */}
              <div className="text-slate-600 font-medium">
                <span className="font-normal text-slate-700">
                  {filteredArticlesList.length.toLocaleString()} items
                </span>
                {filteredArticlesList.length > 0 && (
                  <span className="text-slate-400 text-[11px] ml-2">
                    (Showing {(storyCurrentPage - 1) * storyPageSize + 1}–{Math.min(storyCurrentPage * storyPageSize, filteredArticlesList.length)})
                  </span>
                )}
              </div>

              {/* Center/Right Page Sifter Controls */}
              <div className="flex items-center gap-1 font-mono">
                {/* Jump to First Page « */}
                <button
                  type="button"
                  disabled={storyCurrentPage <= 1}
                  onClick={() => setStoryCurrentPage(1)}
                  className="border border-slate-300 px-2.5 py-1 text-xs font-bold text-blue-600 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:text-slate-400 disabled:bg-slate-50 cursor-pointer disabled:cursor-not-allowed transition rounded-xs"
                  title="First Page"
                >
                  «
                </button>

                {/* Previous Page ‹ */}
                <button
                  type="button"
                  disabled={storyCurrentPage <= 1}
                  onClick={() => setStoryCurrentPage((p) => Math.max(1, p - 1))}
                  className="border border-slate-300 px-2.5 py-1 text-xs font-bold text-blue-600 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:text-slate-400 disabled:bg-slate-50 cursor-pointer disabled:cursor-not-allowed transition rounded-xs"
                  title="Previous Page"
                >
                  ‹
                </button>

                {/* Page Jump Box: Page [ 1 ] of {totalArticlePages} */}
                <div className="flex items-center gap-1.5 px-2 text-slate-700 font-sans text-xs">
                  <span>Page</span>
                  <input
                    type="number"
                    min={1}
                    max={totalArticlePages}
                    value={storyJumpInput}
                    onChange={(e) => setStoryJumpInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const p = parseInt(storyJumpInput);
                        if (!isNaN(p) && p >= 1 && p <= totalArticlePages) {
                          setStoryCurrentPage(p);
                        } else {
                          setStoryJumpInput(String(storyCurrentPage));
                        }
                      }
                    }}
                    onBlur={() => {
                      const p = parseInt(storyJumpInput);
                      if (!isNaN(p) && p >= 1 && p <= totalArticlePages) {
                        setStoryCurrentPage(p);
                      } else {
                        setStoryJumpInput(String(storyCurrentPage));
                      }
                    }}
                    className="w-12 text-center text-xs font-bold border border-slate-300 py-1 px-1 bg-white text-slate-900 rounded-xs focus:ring-1 focus:ring-[#0284C7]"
                    title="Type a page number and press Enter"
                  />
                  <span>of <strong className="text-slate-900 font-mono">{totalArticlePages.toLocaleString()}</strong></span>
                </div>

                {/* Next Page › */}
                <button
                  type="button"
                  disabled={storyCurrentPage >= totalArticlePages}
                  onClick={() => setStoryCurrentPage((p) => Math.min(totalArticlePages, p + 1))}
                  className="border border-slate-300 px-2.5 py-1 text-xs font-bold text-blue-600 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:text-slate-400 disabled:bg-slate-50 cursor-pointer disabled:cursor-not-allowed transition rounded-xs"
                  title="Next Page"
                >
                  ›
                </button>

                {/* Jump to Last Page » */}
                <button
                  type="button"
                  disabled={storyCurrentPage >= totalArticlePages}
                  onClick={() => setStoryCurrentPage(totalArticlePages)}
                  className="border border-slate-300 px-2.5 py-1 text-xs font-bold text-blue-600 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:text-slate-400 disabled:bg-slate-50 cursor-pointer disabled:cursor-not-allowed transition rounded-xs"
                  title="Last Page"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BACKEND 2: ECON ACADEMY CMS PORTAL */}
      {activeBackend === 'academy' && (
        <EconAcademyBackendPortal />
      )}


      {/* BACKEND 4: PUBLISHER VETTING QUEUE */}
      {activeBackend === 'vetting_queue' && (
        <div className="bg-white border-2 border-[#0B1E36] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-xl text-[#0B1E36] uppercase">
                Publisher Vetting & Creator Submission Desk
              </h3>
            </div>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 uppercase font-mono">
              STAFF VETTING QUEUE ({publisherSubmissions.length})
            </span>
          </div>

          {publisherSubmissions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 border border-slate-200">
              <p className="font-bold text-sm">No publisher submissions in the vetting queue.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {publisherSubmissions.map((sub) => (
                <div key={sub.id} className="bg-slate-50 border-2 border-slate-300 p-5 space-y-4 shadow-sm">
                  <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0B1E36] text-white text-[10px] font-mono px-2 py-0.5 font-bold uppercase">
                          {sub.trackingId}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider ${
                          sub.status === 'full_published' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          sub.status === 'sample_approved' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                          sub.status === 'rejected' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                          'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                        <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 uppercase">
                          {sub.packageTier.toUpperCase()} TIER ({sub.creatorSharePercentage}% CREATOR SHARE)
                        </span>
                      </div>
                      <h4 className="font-extrabold text-lg text-[#0B1E36] mt-1">{sub.title}</h4>
                      <p className="text-xs text-slate-600 font-mono">
                        Creator: <strong className="text-slate-900">{sub.creatorName}</strong> ({sub.creatorEmail} • {sub.creatorPhone}) • {sub.affiliation || 'Independent Scholar'}
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-bold text-[#0284C7] uppercase">{sub.platformTarget.replace('_', ' ')} • {sub.category}</p>
                      <p className="text-slate-500 text-[11px]">Submitted: {new Date(sub.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-white p-3 border border-slate-200">
                      <h5 className="font-bold text-slate-800 uppercase text-[11px]">Proposal & Topic Overview</h5>
                      <p className="text-slate-700 leading-relaxed">{sub.topicDescription}</p>

                      {sub.sampleText && (
                        <div className="bg-slate-50 p-2.5 border border-slate-200 space-y-1">
                          <span className="font-bold text-[10px] text-[#0284C7] uppercase">Sample Excerpt / Text Preview:</span>
                          <p className="font-serif text-slate-800 text-[11px] leading-snug line-clamp-4">{sub.sampleText}</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                        <span>Proposed Course / Book Price:</span>
                        <span className="text-emerald-700 font-mono">LKR {(sub.proposedPriceLKR || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-white p-3 border border-slate-200">
                      <h5 className="font-bold text-slate-800 uppercase text-[11px]">Video & Asset Vetting Desk</h5>
                      
                      {/* Video Stream Review */}
                      {sub.sampleVideoUrl ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-700 font-bold flex items-center gap-1">
                              <Video className="w-3.5 h-3.5 text-red-600" /> Video Vetting Stream:
                            </span>
                            <a href={sub.sampleVideoUrl} target="_blank" rel="noreferrer" className="text-[#0284C7] underline font-bold">
                              Open Link ↗
                            </a>
                          </div>

                          {/* YouTube In-Portal Embed Player for Staff Vetting */}
                          {sub.sampleVideoUrl.includes('youtube') || sub.sampleVideoUrl.includes('youtu.be') ? (
                            <div className="aspect-video w-full rounded overflow-hidden border-2 border-slate-800 bg-black">
                              <iframe
                                src={getYouTubeEmbedUrl(sub.sampleVideoUrl)}
                                title={`Vetting Video for ${sub.title}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <a
                              href={sub.sampleVideoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="block bg-slate-900 text-amber-300 p-2 rounded text-center font-bold hover:bg-slate-800 transition"
                            >
                              ☁️ Launch Cloud Video File Stream
                            </a>
                          )}
                        </div>
                      ) : sub.emailFileNotice || sub.videoSubmissionType === 'email_attachment' ? (
                        <div className="bg-amber-50 border border-amber-300 p-2.5 text-xs text-amber-900 space-y-1">
                          <span className="font-bold uppercase text-[10px] text-amber-800 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-amber-700" /> Sent via Email Vetting Desk:
                          </span>
                          <p className="text-slate-800 italic">{sub.emailFileNotice || 'Video file attachment sent to vetting@lankaecon.lk'}</p>
                          <a
                            href="mailto:vetting@lankaecon.lk"
                            className="inline-block bg-amber-700 text-white px-2 py-1 font-bold text-[10px] uppercase rounded"
                          >
                            Check Staff Email Inbox ↗
                          </a>
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No video sample attached.</p>
                      )}

                      {sub.sampleDocumentUrl && (
                        <div className="space-y-1 pt-1 border-t border-slate-100">
                          <p className="text-slate-600 font-semibold">Sample Manuscript / Syllabus PDF:</p>
                          <a href={sub.sampleDocumentUrl} target="_blank" rel="noreferrer" className="text-[#0284C7] underline font-bold flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Download Draft Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vetting Action Desk */}
                  <div className="bg-slate-100 p-3 border border-slate-300 space-y-3">
                    <label className="block text-slate-800 font-extrabold text-xs uppercase">
                      Staff Vetting Remarks & Feedback for Creator:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Verified masterclass video sample. Quality meets LankaEcon academic standards. Please proceed to upload full 6 modules."
                      value={vettingFeedback[sub.id] !== undefined ? vettingFeedback[sub.id] : (sub.staffFeedback || '')}
                      onChange={(e) => setVettingFeedback({ ...vettingFeedback, [sub.id]: e.target.value })}
                      className="w-full bg-white border border-slate-300 p-2 text-xs text-slate-900"
                    />

                    <div className="flex flex-wrap gap-2 pt-1">
                      {sub.status !== 'sample_approved' && sub.status !== 'full_published' && (
                        <button
                          onClick={() => handleApproveSubmission(sub.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Sample & Dispatch Email</span>
                        </button>
                      )}

                      {sub.status !== 'full_published' && (
                        <button
                          onClick={() => handlePublishImmediately(sub.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-4 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Approve & Publish Live Immediately</span>
                        </button>
                      )}

                      {sub.status !== 'rejected' && (
                        <button
                          onClick={() => handleRejectSubmission(sub.id)}
                          className="bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs px-4 py-2 uppercase tracking-wider transition cursor-pointer"
                        >
                          Reject Proposal
                        </button>
                      )}

                      {sub.status === 'full_published' && (
                        <span className="bg-emerald-100 text-emerald-900 font-extrabold text-xs px-3 py-2 uppercase border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Live Published on Website
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteSubmission(sub.id, sub.title)}
                        className="bg-slate-800 hover:bg-rose-900 text-slate-200 hover:text-white font-extrabold text-xs px-3 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        title="Delete proposal entry from database"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>Delete Proposal</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BACKEND 5: TUITION & REVENUE REMITTANCE HUB */}
      {activeBackend === 'remittance' && (
        <div className="bg-white border-2 border-[#0B1E36] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-xl text-[#0B1E36] uppercase">
                Creator Tuition Share & Revenue Remittance Hub
              </h3>
            </div>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-1 uppercase font-mono">
              BANK WIRE & SLIPS ENGINE
            </span>
          </div>

          {remitSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{remitSuccessMsg}</span>
            </div>
          )}

          {/* Revenue Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 text-white p-4 border-l-4 border-emerald-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Tuition Sales</p>
              <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                LKR {publisherSubmissions.reduce((acc, s) => acc + (s.totalRevenueLKR || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-900 text-white p-4 border-l-4 border-sky-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Creator Share Earned</p>
              <p className="text-2xl font-black text-sky-400 mt-1 font-mono">
                LKR {publisherSubmissions.reduce((acc, s) => acc + (s.creatorEarnedLKR || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-900 text-white p-4 border-l-4 border-purple-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Remitted to Bank</p>
              <p className="text-2xl font-black text-purple-300 mt-1 font-mono">
                LKR {publisherSubmissions.reduce((acc, s) => acc + (s.remittedLKR || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-900 text-white p-4 border-l-4 border-amber-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Wire Payout</p>
              <p className="text-2xl font-black text-amber-400 mt-1 font-mono">
                LKR {publisherSubmissions.reduce((acc, s) => acc + (s.creatorEarnedLKR - s.remittedLKR), 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Published Creators Payout List */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-base text-[#0B1E36] uppercase border-b border-slate-200 pb-2">
              Published Creators & Payout Statements
            </h4>

            <div className="overflow-x-auto border border-slate-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0B1E36] text-white font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="p-3">Creator Name & Work</th>
                    <th className="p-3">Package Tier</th>
                    <th className="p-3">Sales / Enrollments</th>
                    <th className="p-3">Total Earned</th>
                    <th className="p-3">Remitted</th>
                    <th className="p-3">Pending Balance</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {publisherSubmissions.filter(s => s.status === 'full_published' || s.creatorEarnedLKR > 0).map((sub) => {
                    const pending = sub.creatorEarnedLKR - sub.remittedLKR;
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50 font-sans">
                        <td className="p-3 font-bold">
                          <div>{sub.creatorName}</div>
                          <div className="text-[11px] text-[#0284C7] font-normal">{sub.title}</div>
                        </td>
                        <td className="p-3 font-mono font-bold uppercase text-[11px]">
                          {sub.packageTier} ({sub.creatorSharePercentage}%)
                        </td>
                        <td className="p-3 font-mono font-bold">{sub.salesCount || 0} enrolled</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">LKR {(sub.creatorEarnedLKR || 0).toLocaleString()}</td>
                        <td className="p-3 font-mono text-purple-700">LKR {(sub.remittedLKR || 0).toLocaleString()}</td>
                        <td className="p-3 font-mono font-bold text-amber-700">LKR {pending.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedSubForRemit(sub);
                              setRemitAmount(String(pending > 0 ? pending : 50000));
                            }}
                            className="bg-[#0B1E36] hover:bg-slate-900 text-white font-extrabold text-[10px] px-3 py-1.5 uppercase transition cursor-pointer"
                          >
                            Remit Payout
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remittance Wire Modal */}
          {selectedSubForRemit && (
            <div className="bg-slate-100 border-2 border-emerald-500 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-300 pb-2">
                <h4 className="font-extrabold text-base text-[#0B1E36] uppercase flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-600" />
                  <span>Dispatch Bank Wire Remittance for {selectedSubForRemit.creatorName}</span>
                </h4>
                <button onClick={() => setSelectedSubForRemit(null)} className="font-bold text-slate-500 hover:text-slate-800">
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleProcessRemittance} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Bank Name *</label>
                    <input
                      type="text"
                      required
                      value={remitBank}
                      onChange={(e) => setRemitBank(e.target.value)}
                      placeholder="Commercial Bank of Ceylon"
                      className="w-full bg-white border border-slate-300 p-2 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bank Account Number *</label>
                    <input
                      type="text"
                      required
                      value={remitAccount}
                      onChange={(e) => setRemitAccount(e.target.value)}
                      placeholder="e.g. 1000293819"
                      className="w-full bg-white border border-slate-300 p-2 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={remitBranch}
                      onChange={(e) => setRemitBranch(e.target.value)}
                      placeholder="Main Branch Colombo 01"
                      className="w-full bg-white border border-slate-300 p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Remittance Amount LKR *</label>
                    <input
                      type="number"
                      required
                      value={remitAmount}
                      onChange={(e) => setRemitAmount(e.target.value)}
                      className="w-full bg-white border border-slate-300 p-2 text-xs font-mono font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Authorization Desk</label>
                    <input
                      type="text"
                      disabled
                      value={`${currentUser?.fullName || 'Company Owner'} (${currentUser?.department})`}
                      className="w-full bg-slate-200 border border-slate-300 p-2 text-xs font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 uppercase tracking-wider text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Execute Commercial Bank Wire & Email Remittance Advice</span>
                </button>
              </form>
            </div>
          )}

          {/* Historical Remittances Table */}
          <div className="space-y-2 pt-4">
            <h4 className="font-extrabold text-sm text-[#0B1E36] uppercase">Remittance Transaction Audit Logs</h4>
            <div className="overflow-x-auto border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[9px] border-b border-slate-300">
                    <th className="p-2">TX Ref</th>
                    <th className="p-2">Creator</th>
                    <th className="p-2">Bank & Account</th>
                    <th className="p-2">Amount LKR</th>
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px] text-slate-700">
                  {payoutRecords.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-[#0284C7]">{p.transactionRef}</td>
                      <td className="p-2 font-sans font-bold">{p.creatorName}</td>
                      <td className="p-2 font-sans">{p.bankName} ({p.accountNumber})</td>
                      <td className="p-2 font-bold text-emerald-800">LKR {p.amountLKR.toLocaleString()}</td>
                      <td className="p-2">{new Date(p.remittedAt).toLocaleString()}</td>
                      <td className="p-2">
                        <span className="bg-emerald-100 text-emerald-900 font-extrabold px-1.5 py-0.5 text-[9px] uppercase">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BACKEND 6: SECURITY & ANTI-HACK SHIELD TELEMETRY */}
      {activeBackend === 'security' && (
        <div className="bg-white border-2 border-[#0B1E36] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-sky-500" />
              <h3 className="font-extrabold text-xl text-[#0B1E36] uppercase">
                Platform Enterprise Security & Cyber Defence Shield
              </h3>
            </div>
            <span className="bg-sky-100 text-sky-900 text-[10px] font-bold px-2.5 py-1 uppercase font-mono">
              ACTIVE DEFENCE ENGINE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0B1E36] text-white p-5 border-t-4 border-sky-400 space-y-2">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase">
                <Lock className="w-4 h-4" />
                <span>Web Application Firewall</span>
              </div>
              <p className="text-xl font-mono font-black text-emerald-400">
                {securityStatus?.firewallStatus || 'ACTIVE_GUARD_PROTECTED'}
              </p>
              <p className="text-[11px] text-slate-300">
                Continuous real-time packet inspection & payload filtering.
              </p>
            </div>

            <div className="bg-[#0B1E36] text-white p-5 border-t-4 border-emerald-400 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase">
                <Shield className="w-4 h-4" />
                <span>Blocked Threats (24h)</span>
              </div>
              <p className="text-3xl font-mono font-black text-sky-400">
                {securityStatus?.blockedAttacksCount24h || 18} Intrusions Prevented
              </p>
              <p className="text-[11px] text-slate-300">
                SQLi, Reflected XSS & Rate Limit spikes automatically neutralized.
              </p>
            </div>

            <div className="bg-[#0B1E36] text-white p-5 border-t-4 border-purple-400 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Encryption Protocol</span>
              </div>
              <p className="text-xl font-mono font-black text-purple-300">
                {securityStatus?.sslHandshake || 'TLS 1.3 / AES-256'}
              </p>
              <p className="text-[11px] text-slate-300">
                Strict TLS 1.3 cipher suite & HMAC SHA256 signature verification.
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-5 border border-slate-300 text-xs">
            <h4 className="font-extrabold text-sm text-[#0B1E36] uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>LankaEcon Cyber Security Standard Compliance</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-800">
              <div className="bg-white p-3 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">1. Parameterized Queries & Anti-SQL Injection</p>
                <p className="text-slate-600">All database and API queries utilize strict typed parameters, eliminating raw SQL concatenation vulnerabilities.</p>
              </div>

              <div className="bg-white p-3 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">2. DOM XSS Sanitization & Content Security Policy</p>
                <p className="text-slate-600">All user inputs and manuscript submissions undergo strict HTML escaping before DOM hydration.</p>
              </div>

              <div className="bg-white p-3 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">3. DDoS Rate Limiting & Bot Mitigation</p>
                <p className="text-slate-600">Engineered with 600 request/min throttling per client IP address, ensuring 99.99% operational uptime.</p>
              </div>

              <div className="bg-white p-3 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">4. Legal Publisher Binding Contracts</p>
                <p className="text-slate-600">Every creator must explicitly execute the LankaEcon Publisher Master Rights Agreement prior to sample vetting.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* BACKEND 3: LANKA INK & CANVAS CMS PORTAL */}
      {activeBackend === 'ink_canvas' && (
        <InkCanvasBackendPortal />
      )}


      {/* Business Owner Management Engine */}
      <div className="space-y-6">
        
        {/* Section 1: Pending Employee Approvals Queue */}
        {allEmployees.filter(e => e.status === 'pending').length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-400 p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-amber-300 pb-3">
              <h3 className="font-extrabold text-base text-amber-950 uppercase flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-700" />
                <span>Pending Employee Vetting & Approval Queue ({allEmployees.filter(e => e.status === 'pending').length})</span>
              </h3>
              <span className="text-[10px] font-mono font-extrabold bg-amber-200 text-amber-900 px-2.5 py-1 uppercase tracking-wider">
                EXECUTIVE VETTING REQUIRED
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {allEmployees.filter(e => e.status === 'pending').map((emp) => {
                const assignedSites = pendingAccessMap[emp.id] || emp.accessibleSites || ['lanka_econ', 'econ_academy', 'lanka_ink'];

                return (
                  <div key={emp.id} className="bg-white border-2 border-amber-300 p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-extrabold text-base text-[#0B1E36]">{emp.fullName}</h4>
                        <p className="text-xs text-slate-600 font-mono">{emp.email}</p>
                      </div>
                      <span className="bg-amber-100 text-amber-900 font-bold text-[10px] uppercase px-2.5 py-1 border border-amber-300">
                        {emp.department || 'Newsroom Desk'}
                      </span>
                    </div>

                    {/* Vetting Information Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 border border-slate-200">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Age</span>
                        <span className="font-extrabold text-slate-900">{emp.age ? `${emp.age} Years` : 'N/A'}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">National ID (NIC)</span>
                        <span className="font-mono font-bold text-slate-900">{emp.nicNumber || 'N/A'}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">TIN / Tax Number</span>
                        <span className="font-mono font-bold text-[#0284C7]">{emp.tinNumber || 'N/A'}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Bank Remittance</span>
                        <span className="font-bold text-slate-900 block">
                          {emp.bankDetails?.bankName || 'N/A'}
                        </span>
                        <span className="font-mono text-[10px] text-slate-600 block">
                          Acc: {emp.bankDetails?.accountNumber || 'N/A'} ({emp.bankDetails?.branchName || 'Branch'})
                        </span>
                      </div>
                    </div>

                    {/* Business Area Authorization Selector */}
                    <div>
                      <label className="block text-slate-800 font-extrabold text-[11px] uppercase mb-1.5">
                        Assign Business Areas (Owner Choice: All 3 or combination of 2 or 1)
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
                        {[
                          { id: 'lanka_econ', label: 'LankaEcon' },
                          { id: 'econ_academy', label: 'Econ Academy' },
                          { id: 'lanka_ink', label: 'Ink & Canvas' },
                        ].map((site) => (
                          <label key={site.id} className="flex items-center gap-1.5 cursor-pointer bg-slate-100 p-2 border border-slate-300 hover:bg-slate-200">
                            <input
                              type="checkbox"
                              checked={assignedSites.includes(site.id as any)}
                              onChange={(e) => {
                                const newSites = e.target.checked
                                  ? [...assignedSites, site.id as any]
                                  : assignedSites.filter(s => s !== site.id);
                                setPendingAccessMap({ ...pendingAccessMap, [emp.id]: newSites });
                              }}
                            />
                            <span>{site.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleAuthorizeEmployee(emp.id, 'authorized', assignedSites)}
                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Authorize</span>
                      </button>
                      <button
                        onClick={() => handleAuthorizeEmployee(emp.id, 'revoked')}
                        className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs px-4 py-2.5 uppercase tracking-wider transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BACKEND: ENTERPRISE ERP ACCOUNTING & HR INTEGRATION PORTAL */}
        {activeBackend === 'erp_accounting' && (
          <ErpIntegrationPortal />
        )}

        {/* BACKEND: COMMERCIAL AD OPERATIONS DESK & PAYMENTS */}
        {activeBackend === 'ad_desk' && (
          <AdDeskBackendPortal
            currentUser={currentUser}
            onRefreshLiveAds={onRefreshArticles}
          />
        )}

        {/* BACKEND: CENTRAL IMAGE DATABASE & MEDIA ASSET STORAGE */}
        {activeBackend === 'image_database' && (
          <ImageDatabaseBackendSection
            currentUser={currentUser}
            mediaAssets={mediaAssets}
            onRefresh={fetchMediaAssets}
            stockImageGallery={stockImageGallery}
            onSelectForStory={(url) => {
              setStoryImageUrl(url);
              setActiveBackend('newsroom');
              setImageActionStatus('✓ Selected image applied to Newsroom compose desk!');
            }}
          />
        )}

        {/* Section 2: Corporate Staff Roster & Platform Assignments */}
        <div className="bg-white border-2 border-[#0B1E36] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-[#0B1E36] uppercase">
                Corporate Staff Roster & Business Desks ({allEmployees.length})
              </h3>
              <p className="text-xs text-slate-600">
                Manage employee access rights, vetting credentials, and assigned desks across LankaEcon, Econ Academy, and Ink & Canvas.
              </p>
            </div>

            <button
              onClick={() => setShowAddStaffModal(true)}
              className="bg-[#0284C7] hover:bg-sky-600 text-white font-extrabold text-xs px-4 py-2.5 uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B1E36] text-white uppercase font-extrabold">
                  <th className="p-3">Staff Member & Vetting Details</th>
                  <th className="p-3">Salary Bank Account</th>
                  <th className="p-3">Role & Department</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Business Desks</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allEmployees.map((emp) => {
                  const currentSites = emp.accessibleSites || ['lanka_econ', 'econ_academy', 'lanka_ink'];
                  
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900">{emp.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{emp.email}</div>
                        {(emp.nicNumber || emp.tinNumber || emp.age) && (
                          <div className="text-[10px] text-slate-600 mt-1 font-mono bg-slate-100 p-1 inline-block border border-slate-200">
                            Age: {emp.age || 'N/A'} | NIC: {emp.nicNumber || 'N/A'} | TIN: {emp.tinNumber || 'N/A'}
                          </div>
                        )}
                      </td>

                      <td className="p-3 font-mono text-[11px]">
                        {emp.bankDetails?.bankName ? (
                          <div>
                            <div className="font-bold text-slate-900">{emp.bankDetails.bankName}</div>
                            <div className="text-slate-600">Acc: {emp.bankDetails.accountNumber}</div>
                            <div className="text-[10px] text-slate-500">{emp.bankDetails.branchName} Branch</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not Provided</span>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-[#0284C7] uppercase block">{emp.role}</span>
                        <span className="text-[11px] text-slate-600">{emp.department}</span>
                      </td>

                      <td className="p-3">
                        <span className={`font-bold uppercase text-[10px] px-2 py-0.5 ${
                          emp.status === 'authorized' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {emp.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                          <label className="flex items-center gap-1 cursor-pointer bg-slate-100 px-2 py-1 border border-slate-300">
                            <input
                              type="checkbox"
                              checked={currentSites.includes('lanka_econ')}
                              onChange={(e) => {
                                const newSites = e.target.checked
                                  ? [...currentSites, 'lanka_econ']
                                  : currentSites.filter(s => s !== 'lanka_econ');
                                handleAuthorizeEmployee(emp.id, emp.status, newSites);
                              }}
                            />
                            <span>LankaEcon</span>
                          </label>

                          <label className="flex items-center gap-1 cursor-pointer bg-slate-100 px-2 py-1 border border-slate-300">
                            <input
                              type="checkbox"
                              checked={currentSites.includes('econ_academy')}
                              onChange={(e) => {
                                const newSites = e.target.checked
                                  ? [...currentSites, 'econ_academy']
                                  : currentSites.filter(s => s !== 'econ_academy');
                                handleAuthorizeEmployee(emp.id, emp.status, newSites);
                              }}
                            />
                            <span>Econ Academy</span>
                          </label>

                          <label className="flex items-center gap-1 cursor-pointer bg-slate-100 px-2 py-1 border border-slate-300">
                            <input
                              type="checkbox"
                              checked={currentSites.includes('lanka_ink')}
                              onChange={(e) => {
                                const newSites = e.target.checked
                                  ? [...currentSites, 'lanka_ink']
                                  : currentSites.filter(s => s !== 'lanka_ink');
                                handleAuthorizeEmployee(emp.id, emp.status, newSites);
                              }}
                            />
                            <span>Ink & Canvas</span>
                          </label>
                        </div>
                      </td>

                      <td className="p-3 text-right space-x-2">
                        {emp.role !== 'owner' && (
                          <button
                            onClick={() => handleDeleteEmployee(emp.id, emp.fullName)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-3 py-1.5 uppercase transition cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Owner Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base text-[#0B1E36] uppercase">
                Add New Corporate Employee
              </h3>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDirectStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Employee Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Kasun Fernando"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="e.g. kasun@lankaecon.lk"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Department</label>
                <select
                  value={newStaffDept}
                  onChange={(e) => setNewStaffDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs"
                >
                  <option value="Newsroom Editorial Desk">Newsroom Editorial Desk</option>
                  <option value="Econ Academy Faculty Desk">Econ Academy Faculty Desk</option>
                  <option value="Ink & Canvas Atelier Desk">Ink & Canvas Atelier Desk</option>
                  <option value="Advertising & Enterprise Operations">Advertising & Enterprise Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assign Platform Desks</label>
                <div className="space-y-1 bg-slate-50 p-2 border border-slate-200">
                  {[
                    { id: 'lanka_econ', label: 'LankaEcon Newsroom Desk' },
                    { id: 'econ_academy', label: 'Econ Academy Desk' },
                    { id: 'lanka_ink', label: 'Ink & Canvas Desk' },
                  ].map((p) => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={newStaffPlatforms.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) setNewStaffPlatforms([...newStaffPlatforms, p.id]);
                          else setNewStaffPlatforms(newStaffPlatforms.filter(x => x !== p.id));
                        }}
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0284C7] hover:bg-sky-600 text-white font-extrabold py-3 uppercase tracking-wider text-xs transition cursor-pointer"
                >
                  Create & Authorize Staff
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-3 uppercase text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  ImageIcon,
  UploadCloud,
  Check,
  Copy,
  Trash2,
  Search,
  Database,
  ShieldCheck,
  FileUp,
  HardDrive,
  ExternalLink,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Tag,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { MediaAsset, EmployeeRecord } from '../types';

interface ImageDatabaseBackendSectionProps {
  currentUser: EmployeeRecord | null;
  mediaAssets: MediaAsset[];
  onRefresh: () => void;
  stockImageGallery: { title: string; url: string; tag: string }[];
  onSelectForStory?: (url: string) => void;
}

export const ImageDatabaseBackendSection: React.FC<ImageDatabaseBackendSectionProps> = ({
  currentUser,
  mediaAssets,
  onRefresh,
  stockImageGallery,
  onSelectForStory,
}) => {
  // Upload form states
  const [showUploadForm, setShowUploadForm] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageCategory, setImageCategory] = useState('ECONOMY');
  const [imageTags, setImageTags] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'COMPUTER' | 'STOCK'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, WebP, SVG, GIF).' });
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'File size exceeds 30MB limit. Please select a smaller image.' });
      return;
    }

    setSelectedFile(file);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setFilePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (!imageTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setImageTitle(cleanName.replace(/\b\w/g, (c) => c.toUpperCase()));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !filePreview) {
      setStatusMessage({ type: 'error', text: 'Please choose an image file from your computer first.' });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: imageTitle.trim() || selectedFile.name,
          fileName: selectedFile.name,
          imageData: filePreview,
          category: imageCategory,
          caption: imageCaption.trim() || undefined,
          tags: imageTags ? imageTags.split(',').map((t) => t.trim()).filter(Boolean) : [imageCategory, 'COMPUTER_UPLOAD'],
          source: currentUser?.fullName ? `${currentUser.fullName} (Local Upload)` : 'Local Computer File Upload',
        }),
      });

      const data = await res.json();
      if (data.success && data.media) {
        setStatusMessage({
          type: 'success',
          text: `Success! Image "${data.media.title}" has been uploaded and permanently saved in the backend database (data_store.json) at ${data.media.url}.`,
        });
        setSelectedFile(null);
        setFilePreview('');
        setImageTitle('');
        setImageTags('');
        setImageCaption('');
        onRefresh();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to upload image file to backend database.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Network error: ' + (err?.message || 'Could not communicate with upload API') });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the backend image database?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: `Image "${title}" removed from database.` });
        onRefresh();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to delete image.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error communicating with deletion API.' });
    }
  };

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Combine mediaAssets with curated stock gallery (avoid duplicates)
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
      is_uploaded: false,
    }));

  const allItems = [...mediaAssets, ...stockItems];

  const computerUploadsCount = mediaAssets.filter(
    (m) => m.url?.startsWith('/uploads/') || m.is_uploaded || m.source?.includes('Computer') || m.source?.includes('Local')
  ).length;

  // Filter items based on user search and filters
  const filteredItems = allItems.filter((item) => {
    const isComputer = item.url?.startsWith('/uploads/') || (item as any).is_uploaded || item.source?.includes('Computer') || item.source?.includes('Local');
    
    // Source filter
    if (sourceFilter === 'COMPUTER' && !isComputer) return false;
    if (sourceFilter === 'STOCK' && isComputer) return false;

    // Category filter
    if (categoryFilter !== 'ALL' && item.category?.toUpperCase() !== categoryFilter.toUpperCase()) {
      return false;
    }

    // Query filter
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      item.title.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))) ||
      (item.url && item.url.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white border-2 border-[#0B1E36] p-6 sm:p-8 space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-600" />
            <h3 className="font-extrabold text-xl sm:text-2xl text-[#0B1E36] uppercase tracking-tight">
              Central Image Database & Media Storage
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Persistent storage for uploaded computer images & editorial assets. Saved directly into <span className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-bold">data_store.json</span> and <span className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-bold">/uploads</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 border border-slate-300 rounded-xs transition cursor-pointer"
            title="Refresh database from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0284C7]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Database'}</span>
          </button>
        </div>
      </div>

      {/* Database Status & Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-600 text-white rounded-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase text-emerald-900 tracking-wider">Storage State</p>
            </div>
            <p className="text-sm font-extrabold text-emerald-950 mt-0.5">Database Safe & Retained</p>
            <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Auto-persists to disk & JSON store</p>
          </div>
        </div>

        <div className="bg-sky-50 border-2 border-sky-300 p-4 rounded-xs flex items-center gap-3">
          <div className="p-3 bg-[#0284C7] text-white rounded-xs">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-sky-900 tracking-wider">Computer Uploads</p>
            <p className="text-xl font-black text-sky-950 mt-0.5">{computerUploadsCount} Files</p>
            <p className="text-[10px] text-sky-700 mt-0.5 font-medium">Uploaded from local machines</p>
          </div>
        </div>

        <div className="bg-slate-50 border-2 border-slate-300 p-4 rounded-xs flex items-center gap-3">
          <div className="p-3 bg-[#0B1E36] text-white rounded-xs">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Total Available Assets</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{allItems.length} Photos</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Ready for story & news publishing</p>
          </div>
        </div>
      </div>

      {/* Status feedback message */}
      {statusMessage && (
        <div
          className={`p-3.5 border text-xs font-bold flex items-start justify-between gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-rose-50 border-rose-400 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-900 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* UPLOAD FORM SECTION */}
      <div className="border-2 border-slate-300 bg-slate-50 p-5 rounded-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-emerald-700" />
            <h4 className="font-extrabold text-sm uppercase text-[#0B1E36]">
              Upload Image from Your Computer to Database
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
          >
            {showUploadForm ? 'Collapse Upload Box' : 'Expand Upload Box'}
          </button>
        </div>

        {showUploadForm && (
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Drag & Drop or Click Area */}
            <div
              className={`border-2 border-dashed p-6 text-center transition ${
                selectedFile
                  ? 'border-emerald-500 bg-emerald-50/40'
                  : 'border-slate-300 hover:border-[#0284C7] bg-white'
              }`}
            >
              {selectedFile && filePreview ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-28 h-28 object-cover border-2 border-emerald-500 rounded-xs shadow-xs"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="font-extrabold text-sm text-slate-900">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Type: {selectedFile.type || 'Image'}
                    </p>
                    <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready to upload into persistent backend database</span>
                    </p>
                    <label className="inline-flex items-center gap-1 text-xs text-[#0284C7] font-bold hover:underline cursor-pointer pt-1">
                      <FileUp className="w-3.5 h-3.5" />
                      <span>Choose a different file</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-4">
                  <UploadCloud className="w-10 h-10 text-[#0284C7] mb-2 animate-bounce" />
                  <span className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                    Click to browse or drop an image from your computer
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    Supports PNG, JPG, JPEG, WebP, GIF, SVG (Up to 30 MB)
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 bg-[#0B1E36] hover:bg-[#0284C7] text-white text-xs font-bold px-4 py-1.5 rounded-xs transition">
                    Browse Local Drive
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Image Title *
                </label>
                <input
                  type="text"
                  required
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="e.g. Central Bank Press Conference"
                  className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#0284C7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Category *
                </label>
                <select
                  value={imageCategory}
                  onChange={(e) => setImageCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 font-bold focus:border-[#0284C7] outline-none"
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
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={imageTags}
                  onChange={(e) => setImageTags(e.target.value)}
                  placeholder="e.g. CBSL, Inflation, Fort"
                  className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#0284C7] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-slate-500 italic">
                Files are written to <span className="font-mono text-slate-700">/uploads/</span> and backed up in <span className="font-mono text-slate-700">data_store.json</span>.
              </p>

              <div className="flex items-center gap-2">
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview('');
                      setImageTitle('');
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-2 uppercase cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-extrabold px-5 py-2 uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload & Save to Image Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-slate-100 p-3.5 border border-slate-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by title, tag, or category..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 outline-none"
          >
            <option value="ALL">All Categories</option>
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

        {/* Source Filter Buttons */}
        <div className="flex items-center gap-1 bg-white p-1 border border-slate-300 shrink-0">
          <button
            type="button"
            onClick={() => setSourceFilter('ALL')}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase transition cursor-pointer ${
              sourceFilter === 'ALL'
                ? 'bg-[#0B1E36] text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            All ({allItems.length})
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter('COMPUTER')}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase transition cursor-pointer flex items-center gap-1 ${
              sourceFilter === 'COMPUTER'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>Computer Uploads ({computerUploadsCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter('STOCK')}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase transition cursor-pointer ${
              sourceFilter === 'STOCK'
                ? 'bg-[#0284C7] text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Curated Stock ({stockItems.length})
          </button>
        </div>
      </div>

      {/* IMAGE GALLERY GRID */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 border border-slate-200">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="font-extrabold text-sm text-slate-800">No images found matching your filter</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keywords or upload a new photo from your computer using the upload box above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((img) => {
            const isComputerUpload =
              img.url?.startsWith('/uploads/') ||
              (img as any).is_uploaded ||
              img.source?.includes('Computer') ||
              img.source?.includes('Local');

            return (
              <div
                key={img.id}
                className="group border border-slate-200 hover:border-[#0284C7] bg-white flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md transition"
              >
                {/* Image & Badges */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e: any) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Badges on top of image */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
                    <span className="bg-[#0B1E36] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider shadow-xs">
                      {img.category || 'IMAGE'}
                    </span>
                    {isComputerUpload && (
                      <span className="bg-emerald-700 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-wider rounded-xs shadow-xs flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>Database Stored</span>
                      </span>
                    )}
                  </div>

                  {/* Actions on hover */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(img.url)}
                      className="bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-xs transition cursor-pointer"
                      title="Copy Image URL"
                    >
                      {copiedUrl === img.url ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isComputerUpload && (
                      <button
                        type="button"
                        onClick={() => handleDelete(img.id, img.title)}
                        className="bg-rose-600/90 hover:bg-rose-700 text-white p-1.5 rounded-xs transition cursor-pointer"
                        title="Delete from database"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Copied toast indicator */}
                  {copiedUrl === img.url && (
                    <div className="absolute bottom-2 left-2 right-2 bg-emerald-700 text-white text-[10px] font-bold py-1 text-center rounded-xs">
                      ✓ URL Copied to Clipboard!
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-2" title={img.title}>
                      {img.title}
                    </h5>

                    <p className="text-[10px] text-slate-500 font-mono mt-1 truncate" title={img.url}>
                      {img.url}
                    </p>

                    <div className="flex flex-wrap items-center gap-1 mt-1.5">
                      {img.tags &&
                        img.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(img.url)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold py-1.5 rounded-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {copiedUrl === img.url ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    {onSelectForStory && (
                      <button
                        type="button"
                        onClick={() => onSelectForStory(img.url)}
                        className="flex-1 bg-[#0B1E36] hover:bg-[#0284C7] text-white text-[10px] font-extrabold py-1.5 rounded-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Use</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { LankaInkCreation, LankaInkArtisan, LankaInkInterview, LankaInkOrder, PublisherSubmission, PayoutRecord } from '../types';
import { 
  Palette, 
  BookOpen, 
  Video, 
  Users, 
  ShoppingBag, 
  CheckCircle2, 
  Trash2, 
  UserPlus, 
  CreditCard, 
  RefreshCw, 
  Sparkles, 
  DollarSign,
  Mail,
  Receipt
} from 'lucide-react';

export const InkCanvasBackendPortal: React.FC = () => {
  const [activeCategoryTile, setActiveCategoryTile] = useState<'artworks' | 'literary' | 'interviews' | 'artisans' | 'payouts'>('artworks');

  // Database States
  const [creations, setCreations] = useState<LankaInkCreation[]>([]);
  const [artisans, setArtisans] = useState<LankaInkArtisan[]>([]);
  const [interviews, setInterviews] = useState<LankaInkInterview[]>([]);
  const [orders, setOrders] = useState<LankaInkOrder[]>([]);
  const [submissions, setSubmissions] = useState<PublisherSubmission[]>([]);

  // Search & Loading
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal / Add Individual Form States
  const [showAddArtisanModal, setShowAddArtisanModal] = useState(false);
  const [newArtisanName, setNewArtisanName] = useState('');
  const [newArtisanCraft, setNewArtisanCraft] = useState('Master Woodcarver & Atelier Craftsperson');
  const [newArtisanDistrict, setNewArtisanDistrict] = useState('Ambalangoda');
  const [newArtisanBio, setNewArtisanBio] = useState('');
  const [newArtisanContact, setNewArtisanContact] = useState('+94 77 123 4567');
  const [newArtisanAvatar, setNewArtisanAvatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [resC, resA, resI, resO, resS] = await Promise.all([
        fetch('/api/lanka-ink/creations').then(r => r.json()),
        fetch('/api/lanka-ink/artisans').then(r => r.json()),
        fetch('/api/lanka-ink/interviews').then(r => r.json()),
        fetch('/api/lanka-ink/orders').then(r => r.json()),
        fetch('/api/publishing/submissions').then(r => r.json()),
      ]);

      if (resC.success) setCreations(resC.creations);
      if (resA.success) setArtisans(resA.artisans);
      if (resI.success) setInterviews(resI.interviews);
      if (resO.success) setOrders(resO.orders);
      if (resS.success) setSubmissions(resS.submissions.filter((s: PublisherSubmission) => s.platformTarget === 'lanka_ink' || s.category === 'ink_poetry' || s.category === 'poem' || s.category === 'art_collection'));
    } catch {
      console.error('Failed loading Ink & Canvas backend data');
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
          staffId: 'emp-staff-002',
          staffFeedback: 'Sample manuscript/craft vetted and approved by Ink & Canvas Literary Desk! Email dispatched to artisan.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✓ Proposal Approved!\nAn automated approval email with tracking code ${sub.trackingId} has been sent to ${sub.creatorEmail}.`);
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
          publishedPriceLKR: sub.proposedPriceLKR || 3500,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`🎉 Payment Confirmed & Published Live!\n"${sub.title}" is now LIVE on the public Ink & Canvas Atelier portal.`);
        loadAllData();
      }
    } catch {
      alert('Error publishing item live');
    }
  };

  // Artisan Management: Add New Artisan/Author
  const handleAddArtisan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtisanName || !newArtisanCraft) return;

    try {
      const res = await fetch('/api/lanka-ink/artisans/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newArtisanName,
          craftSpecialty: newArtisanCraft,
          location: newArtisanDistrict,
          bio: newArtisanBio,
          contactPhone: newArtisanContact,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Artisan / Author "${newArtisanName}" added to heritage directory database!`);
        setShowAddArtisanModal(false);
        setNewArtisanName('');
        setNewArtisanBio('');
        loadAllData();
      }
    } catch {
      alert('Failed adding artisan member');
    }
  };

  // Artisan Management: Delete Artisan
  const handleDeleteArtisan = async (id: string, _name: string) => {
    try {
      const res = await fetch(`/api/lanka-ink/artisans/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadAllData();
      }
    } catch (err) {
      console.error('Error removing artisan', err);
    }
  };

  // Delete Creation
  const handleDeleteCreation = async (id: string, _title: string) => {
    try {
      const res = await fetch(`/api/lanka-ink/creations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadAllData();
      }
    } catch (err) {
      console.error('Error deleting creation', err);
    }
  };

  const handleDeleteInterview = async (id: string, _title: string) => {
    try {
      const res = await fetch(`/api/lanka-ink/interviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadAllData();
      }
    } catch (err) {
      console.error('Error deleting interview feature', err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/lanka-ink/orders/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadAllData();
      }
    } catch (err) {
      console.error('Error deleting order record', err);
    }
  };

  const handleDeleteSubmission = async (id: string, _title: string) => {
    try {
      const res = await fetch(`/api/publishing/submissions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadAllData();
      }
    } catch (err) {
      console.error('Error deleting submission', err);
    }
  };

  // Filtered lists
  const filteredCreations = creations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.authorName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredArtisans = artisans.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.craftOrTitle.toLowerCase().includes(searchQuery.toLowerCase()));

  // Financial Stats
  const totalOrderSales = orders.reduce((acc, o) => acc + (o.itemPriceLKR || 0), 0);
  const totalArtisanRoyalty = Math.round(totalOrderSales * 0.80);

  return (
    <div className="bg-[#12100E] text-white border-2 border-amber-600/50 rounded-none p-6 font-sans space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-amber-900/40 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-white font-serif">
              Ink & Canvas Atelier Backend & Artisan Operations
            </h2>
            <span className="bg-[#991B1B] text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
              HERITAGE VETTING & ROYALTY ENGINE
            </span>
          </div>
          <p className="text-xs text-amber-200/80 mt-1 max-w-2xl">
            Dedicated backend category tiles for vetting literary manuscripts & crafts, reviewing artisan profiles, managing 80% artisan sales royalties, and issuing bank payouts.
          </p>
        </div>

        <button
          onClick={loadAllData}
          disabled={isLoading}
          className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-600/60 px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Category Tiles Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <button
          onClick={() => setActiveCategoryTile('artworks')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'artworks'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-black/60 border-amber-900/40 text-amber-100/70 hover:bg-amber-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Palette className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold bg-amber-950 px-1.5 py-0.5">{creations.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Atelier Creations</p>
        </button>

        <button
          onClick={() => setActiveCategoryTile('literary')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'literary'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-black/60 border-amber-900/40 text-amber-100/70 hover:bg-amber-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-mono font-bold bg-amber-950 px-1.5 py-0.5">{creations.filter(c => c.category === 'book').length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Literary Works</p>
        </button>

        <button
          onClick={() => setActiveCategoryTile('interviews')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'interviews'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-black/60 border-amber-900/40 text-amber-100/70 hover:bg-amber-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Video className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold bg-amber-950 px-1.5 py-0.5">{interviews.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Artisan Features</p>
        </button>

        <button
          onClick={() => setActiveCategoryTile('artisans')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'artisans'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-black/60 border-amber-900/40 text-amber-100/70 hover:bg-amber-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Users className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold bg-amber-950 px-1.5 py-0.5">{artisans.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Artisans Directory</p>
        </button>

        <button
          onClick={() => setActiveCategoryTile('payouts')}
          className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
            activeCategoryTile === 'payouts'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-black/60 border-amber-900/40 text-amber-100/70 hover:bg-amber-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold bg-amber-950 px-1.5 py-0.5">{orders.length}</span>
          </div>
          <p className="font-extrabold text-xs uppercase mt-2">Sales & Royalties</p>
        </button>
      </div>

      {/* TILE 1: ATELIER CREATIONS BACKEND */}
      {activeCategoryTile === 'artworks' && (
        <div className="space-y-6">
          <div className="bg-black/40 p-4 border border-amber-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-amber-300">Atelier Crafts & Literary Works Database</h3>
              <p className="text-xs text-amber-100/60">Review pending artisan proposals, approve work, verify payment clearance, and publish live.</p>
            </div>
            <input
              type="text"
              placeholder="Filter creations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black border border-amber-900/60 p-2 text-xs text-amber-100 outline-none w-full sm:w-64"
            />
          </div>

          {/* Pending Submissions Queue for Ink & Canvas */}
          {submissions.filter(s => s.status !== 'full_published').length > 0 && (
            <div className="bg-amber-950/30 border border-amber-600/50 p-4 space-y-3">
              <h4 className="font-extrabold text-xs uppercase text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Pending Literary / Craft Proposals to Vet ({submissions.filter(s => s.status !== 'full_published').length})</span>
              </h4>

              <div className="space-y-2">
                {submissions.filter(s => s.status !== 'full_published').map((sub) => (
                  <div key={sub.id} className="bg-black/80 border border-amber-900/60 p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{sub.title}</p>
                      <p className="text-amber-200/80 font-mono text-[11px]">Author / Artisan: <strong className="text-amber-300">{sub.creatorName}</strong> ({sub.creatorEmail})</p>
                      <p className="text-slate-400 text-[11px]">{sub.topicDescription}</p>
                      <span className="inline-block bg-amber-950 px-2 py-0.5 text-[10px] font-mono text-amber-300">Tracking Code: {sub.trackingId} • Proposed Price: LKR {(sub.proposedPriceLKR || 3500).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {sub.status === 'pending_vetting' && (
                        <button
                          onClick={() => handleApproveProposal(sub)}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Email Notification</span>
                        </button>
                      )}

                      {sub.status === 'sample_approved' && (
                        <button
                          onClick={() => handleConfirmPaymentAndPublish(sub)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Confirm Payment & Publish Live</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteSubmission(sub.id, sub.title)}
                        className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-600/40 text-[11px] font-bold px-3 py-1.5 uppercase transition cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Creations Table */}
          <div className="bg-black/40 border border-amber-900/40 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-black text-amber-400 uppercase font-mono border-b border-amber-900/60 text-[10px]">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author / Artisan</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Price LKR</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/30 text-amber-100/90">
                {filteredCreations.map((c) => (
                  <tr key={c.id} className="hover:bg-amber-950/30">
                    <td className="p-3 font-bold text-white">{c.title}</td>
                    <td className="p-3 text-amber-300 font-bold">{c.authorName}</td>
                    <td className="p-3 font-mono text-[10px] uppercase">{c.category}</td>
                    <td className="p-3 text-right font-mono font-bold">Rs. {(c.price || 2800).toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase px-2 py-0.5">Live</span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteCreation(c.id, c.title)}
                        className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-600/40 text-[10px] font-bold px-2 py-1 uppercase transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TILE 2: LITERARY WORKS & MANUSCRIPTS */}
      {activeCategoryTile === 'literary' && (
        <div className="space-y-6">
          <div className="bg-black/40 p-4 border border-amber-900/40 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-amber-300">Literary Works & Manuscripts Database</h3>
              <p className="text-xs text-amber-100/60">Poetry collections, historical essays, and heritage manuscripts.</p>
            </div>
            <input
              type="text"
              placeholder="Filter literary works..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black border border-amber-900/60 p-2 text-xs text-amber-100 outline-none w-64"
            />
          </div>

          <div className="bg-black/40 border border-amber-900/40 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-black text-amber-400 uppercase font-mono border-b border-amber-900/60 text-[10px]">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Price LKR</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/30 text-amber-100/90">
                {filteredCreations.map((c) => (
                  <tr key={c.id} className="hover:bg-amber-950/30">
                    <td className="p-3 font-bold text-white">{c.title}</td>
                    <td className="p-3 text-amber-300 font-bold">{c.authorName}</td>
                    <td className="p-3 font-mono text-[10px] uppercase">{c.category}</td>
                    <td className="p-3 text-right font-mono font-bold">Rs. {(c.price || 2800).toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase px-2 py-0.5">Live</span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteCreation(c.id, c.title)}
                        className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-600/40 text-[10px] font-bold px-2 py-1 uppercase transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TILE 3: ARTISAN INTERVIEWS & FEATURES */}
      {activeCategoryTile === 'interviews' && (
        <div className="space-y-6">
          <div className="bg-black/40 p-4 border border-amber-900/40 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-amber-300">Artisan Interviews & Heritage Features</h3>
              <p className="text-xs text-amber-100/60">Documentary shorts, artisan interviews, and living history profiles.</p>
            </div>
            <input
              type="text"
              placeholder="Filter interviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black border border-amber-900/60 p-2 text-xs text-amber-100 outline-none w-64"
            />
          </div>

          <div className="bg-black/40 border border-amber-900/40 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-black text-amber-400 uppercase font-mono border-b border-amber-900/60 text-[10px]">
                <tr>
                  <th className="p-3">Feature Title</th>
                  <th className="p-3">Artisan Name</th>
                  <th className="p-3">Craft Specialty</th>
                  <th className="p-3">Video Link</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/30 text-amber-100/90">
                {interviews.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.artisanName.toLowerCase().includes(searchQuery.toLowerCase())).map((i) => (
                  <tr key={i.id} className="hover:bg-amber-950/30">
                    <td className="p-3 font-bold text-white">{i.title}</td>
                    <td className="p-3 text-amber-300 font-bold">{i.artisanName}</td>
                    <td className="p-3 font-mono text-[10px] uppercase">{i.craftSpecialty}</td>
                    <td className="p-3 font-mono text-[10px] text-amber-400 truncate max-w-xs">{i.videoUrl}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteInterview(i.id, i.title)}
                        className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-600/40 text-[10px] font-bold px-2 py-1 uppercase transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TILE 4: ARTISANS DIRECTORY (INDIVIDUAL DATABASE) */}
      {activeCategoryTile === 'artisans' && (
        <div className="space-y-6">
          <div className="bg-black/40 p-4 border border-amber-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-amber-300">Artisan & Author Directory Database</h3>
              <p className="text-xs text-amber-100/60">Directory of traditional craftspeople and literary authors. Review, add, edit, or remove profile records.</p>
            </div>

            <button
              onClick={() => setShowAddArtisanModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Artisan / Author</span>
            </button>
          </div>

          {/* Add Artisan Modal */}
          {showAddArtisanModal && (
            <div className="bg-black border-2 border-amber-400 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-amber-900/60 pb-2">
                <h4 className="font-extrabold text-sm uppercase text-amber-300">Register Individual Artisan / Creator Profile</h4>
                <button onClick={() => setShowAddArtisanModal(false)} className="text-amber-400/80 hover:text-white text-xs font-bold uppercase">Cancel [X]</button>
              </div>

              <form onSubmit={handleAddArtisan} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-amber-200 uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newArtisanName}
                    onChange={(e) => setNewArtisanName(e.target.value)}
                    placeholder="e.g. Sumanapala Gurunnanse"
                    className="w-full bg-slate-950 border border-amber-900/60 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-amber-200 uppercase">Craft Specialty / Title *</label>
                  <input
                    type="text"
                    required
                    value={newArtisanCraft}
                    onChange={(e) => setNewArtisanCraft(e.target.value)}
                    placeholder="e.g. Traditional Raksha Mask Carver"
                    className="w-full bg-slate-950 border border-amber-900/60 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-amber-200 uppercase">District / Heritage Location</label>
                  <input
                    type="text"
                    value={newArtisanDistrict}
                    onChange={(e) => setNewArtisanDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-900/60 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-amber-200 uppercase">Contact Phone / Email</label>
                  <input
                    type="text"
                    value={newArtisanContact}
                    onChange={(e) => setNewArtisanContact(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-900/60 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-amber-200 uppercase">Picture / Profile Photo URL *</label>
                  <input
                    type="url"
                    required
                    value={newArtisanAvatar}
                    onChange={(e) => setNewArtisanAvatar(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-900/60 p-2 text-white outline-none focus:border-amber-400 font-mono text-xs"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-amber-200 uppercase">Bio / Artisan History</label>
                  <textarea
                    rows={2}
                    value={newArtisanBio}
                    onChange={(e) => setNewArtisanBio(e.target.value)}
                    placeholder="Generational heritage techniques and materials..."
                    className="w-full bg-slate-950 border border-amber-900/60 p-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold py-2.5 uppercase tracking-wider transition cursor-pointer"
                  >
                    Save & Register Artisan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Artisan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtisans.map((a) => (
              <div key={a.id} className="bg-black/60 border border-amber-900/40 p-4 space-y-3 flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  <img
                    src={a.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                    alt={a.name}
                    className="w-14 h-14 object-cover border border-amber-500 shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-extrabold text-sm text-white truncate">{a.name}</h4>
                    <p className="text-[11px] font-bold text-amber-400">{a.craftOrTitle}</p>
                    <p className="text-[10px] text-amber-200/70">{a.district} District</p>
                    <p className="text-[10px] text-amber-300 font-mono">{a.contactPhone}</p>
                  </div>
                </div>

                <p className="text-xs text-amber-100/80 line-clamp-2">{a.bio}</p>

                <div className="flex items-center justify-between border-t border-amber-900/40 pt-2">
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold uppercase px-2 py-0.5">
                    Master Artisan
                  </span>

                  <button
                    onClick={() => handleDeleteArtisan(a.id, a.name)}
                    className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-600/40 text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TILE 5: ARTISAN SALES & ROYALTY PAYOUT ENGINE */}
      {activeCategoryTile === 'payouts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/60 border border-amber-900/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-200/70 block font-bold">TOTAL STORE SALES REVENUE</span>
              <p className="text-xl font-black text-amber-300 font-mono">Rs. {totalOrderSales.toLocaleString()}</p>
              <span className="text-[9px] text-amber-100/60">Customer purchases</span>
            </div>

            <div className="bg-black/60 border border-emerald-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">ARTISAN ROYALTY SHARE (80%)</span>
              <p className="text-xl font-black text-emerald-300 font-mono">Rs. {totalArtisanRoyalty.toLocaleString()}</p>
              <span className="text-[9px] text-emerald-400/80">Remitted via SLIPS to artisan</span>
            </div>

            <div className="bg-black/60 border border-amber-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">ATELIER COMMISSION (20%)</span>
              <p className="text-xl font-black text-amber-300 font-mono">Rs. {(totalOrderSales - totalArtisanRoyalty).toLocaleString()}</p>
              <span className="text-[9px] text-amber-100/60">Platform preservation fee</span>
            </div>
          </div>

          <div className="bg-black/60 border border-amber-900/40 p-4 space-y-2">
            <h3 className="font-extrabold text-sm uppercase text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Customer Orders & Artisan Royalty Remittances</span>
            </h3>
            <p className="text-xs text-amber-100/70">Every artwork or book purchased automatically calculates an 80% artisan royalty payout.</p>
          </div>

          <div className="bg-black/40 border border-amber-900/40 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-black text-amber-400 uppercase font-mono border-b border-amber-900/60 text-[10px]">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Item Title</th>
                  <th className="p-3 text-right">Price LKR</th>
                  <th className="p-3 text-right text-emerald-400">Artisan Share (80%)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/30 text-amber-100/90">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-amber-950/30">
                    <td className="p-3 font-mono font-bold text-amber-300">{o.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-white">{o.buyerName}</p>
                      <p className="text-[10px] text-amber-200/60 font-mono">{o.buyerEmail}</p>
                    </td>
                    <td className="p-3 font-bold text-amber-100">{o.itemTitle}</td>
                    <td className="p-3 text-right font-mono font-bold">Rs. {o.itemPriceLKR.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-300">Rs. {Math.round(o.itemPriceLKR * 0.8).toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase px-2 py-0.5">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteOrder(o.id)}
                        className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-600/40 text-[10px] font-bold px-2 py-1 uppercase transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

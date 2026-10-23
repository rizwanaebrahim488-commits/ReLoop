import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Package,
  Flag,
  HelpCircle,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  ExternalLink,
  Lock,
  Clock,
  Sparkles,
  RefreshCw,
  XCircle,
  MapPin,
  Check,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getAdminMetrics,
  getReportedListings,
  getSupportRequests,
  updateSupportTicket,
  deleteSupportTicket,
  getAllListings,
  updateListingModeration,
  deleteListing,
  getAllUsers,
  updateUserVerification,
  updateUserAdmin,
  takeModerationAction
} from '../services/adminService';
import { Badge } from '../components/Badge';

export function AdminDashboardPage() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'support', 'listings', 'reports', 'users'

  // Data states
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeListings: 0,
    reportedListings: 0,
    openSupportRequests: 0,
    completedExchanges: 0
  });

  // Support tickets
  const [tickets, setTickets] = useState([]);
  const [supportFilter, setSupportFilter] = useState('all'); // 'all', 'open', 'in_progress', 'resolved'
  const [supportSearch, setSupportSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketStatusVal, setTicketStatusVal] = useState('');
  const [ticketNotesVal, setTicketNotesVal] = useState('');

  // Listings moderation (OLX Style)
  const [listings, setListings] = useState([]);
  const [listingSearch, setListingSearch] = useState('');
  const [listingFilter, setListingFilter] = useState('all'); // 'all', 'active', 'unavailable'

  // Safety & Reports
  const [reports, setReports] = useState([]);
  const [reportFilter, setReportFilter] = useState('all');

  // Users management
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!profile?.is_admin) return;

    async function loadAllAdminData() {
      setLoading(true);
      try {
        const [stats, supp, reps, list, usersList] = await Promise.all([
          getAdminMetrics(),
          getSupportRequests(),
          getReportedListings(),
          getAllListings(),
          getAllUsers()
        ]);
        setMetrics(stats);
        setTickets(supp || []);
        setReports(reps || []);
        setListings(list || []);
        setAllUsers(usersList || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAllAdminData();
  }, [profile?.is_admin, refreshKey]);

  // Support Ticket Actions
  const handleOpenTicketModal = (t) => {
    setSelectedTicket(t);
    setTicketStatusVal(t.status || 'open');
    setTicketNotesVal(t.admin_notes || '');
  };

  const handleSaveTicketStatus = async () => {
    if (!selectedTicket) return;
    try {
      await updateSupportTicket(selectedTicket.id, ticketStatusVal, ticketNotesVal);
      setSelectedTicket(null);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this support inquiry?')) return;
    try {
      await deleteSupportTicket(ticketId);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  // Listings Actions (OLX Style)
  const handleToggleListingVisibility = async (listing) => {
    const newStatus = listing.status === 'active' ? 'unavailable' : 'active';
    try {
      await updateListingModeration(listing.id, { status: newStatus });
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Permanently delete this resource listing from the platform?')) return;
    try {
      await deleteListing(listingId);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  // Reports Actions
  const handleReportAction = async (reportId, resourceId, action) => {
    try {
      await takeModerationAction({
        reportId,
        resourceId,
        action,
        notes: `Handled via Admin Portal by ${profile?.full_name || 'Admin'}`,
        adminId: user?.id || 'admin'
      });
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  // User Actions
  const handleToggleVerifyUser = async (u) => {
    try {
      await updateUserVerification(u.id, !u.is_verified, user?.id);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleAdminRole = async (u) => {
    try {
      await updateUserAdmin(u.id, !u.is_admin);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered Support Tickets
  const filteredTickets = tickets.filter(t => {
    const matchesFilter = supportFilter === 'all' || t.status === supportFilter;
    const matchesSearch =
      !supportSearch.trim() ||
      t.name?.toLowerCase().includes(supportSearch.toLowerCase()) ||
      t.email?.toLowerCase().includes(supportSearch.toLowerCase()) ||
      t.subject?.toLowerCase().includes(supportSearch.toLowerCase()) ||
      t.message?.toLowerCase().includes(supportSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Listings
  const filteredListings = listings.filter(l => {
    const matchesFilter = listingFilter === 'all' || l.status === listingFilter;
    const matchesSearch =
      !listingSearch.trim() ||
      l.title?.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.category?.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.location_name?.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.seller?.full_name?.toLowerCase().includes(listingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Users
  const filteredUsers = allUsers.filter(u => {
    return (
      !userSearch.trim() ||
      u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.city?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.account_type?.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  // Security Gate: Administrator Privileges Required
  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-charcoal-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
              Admin Access Required
            </h1>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              This area is restricted to verified platform administrators. Your account does not have administrative permissions.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm transition shadow-md"
            >
              Return to Member Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>OLX-Style Moderation Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
              ReLoop Administration Center
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500">
              Manage incoming support tickets, review listings, moderate reported content, and verify users.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 text-xs font-bold transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-charcoal-200/80 text-xs font-bold text-charcoal-600 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'hover:bg-forest-50 hover:text-forest-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Overview & Metrics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'support'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'hover:bg-forest-50 hover:text-forest-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support Center ({tickets.filter(t => t.status === 'open').length} Open)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'hover:bg-forest-50 hover:text-forest-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Listings Moderation ({listings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'hover:bg-forest-50 hover:text-forest-800'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>Safety Reports ({reports.filter(r => r.status === 'pending').length} Pending)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'hover:bg-forest-50 hover:text-forest-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management ({allUsers.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div
                onClick={() => setActiveTab('users')}
                className="bg-white rounded-3xl p-5 border border-charcoal-100 shadow-xs hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-forest-50 text-forest-700">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-charcoal-900">
                    {metrics.totalUsers}
                  </span>
                </div>
                <span className="text-xs font-semibold text-charcoal-600 block">
                  Registered Members
                </span>
              </div>

              <div
                onClick={() => setActiveTab('listings')}
                className="bg-white rounded-3xl p-5 border border-charcoal-100 shadow-xs hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-charcoal-900">
                    {metrics.activeListings}
                  </span>
                </div>
                <span className="text-xs font-semibold text-charcoal-600 block">
                  Active Listings
                </span>
              </div>

              <div
                onClick={() => setActiveTab('support')}
                className="bg-white rounded-3xl p-5 border border-charcoal-100 shadow-xs hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-charcoal-900">
                    {metrics.openSupportRequests}
                  </span>
                </div>
                <span className="text-xs font-semibold text-charcoal-600 block">
                  Open Support Tickets
                </span>
              </div>

              <div
                onClick={() => setActiveTab('reports')}
                className="bg-white rounded-3xl p-5 border border-charcoal-100 shadow-xs hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-700">
                    <Flag className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-charcoal-900">
                    {metrics.reportedListings}
                  </span>
                </div>
                <span className="text-xs font-semibold text-charcoal-600 block">
                  Pending Reports
                </span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-charcoal-100 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-charcoal-900">
                    {metrics.completedExchanges}
                  </span>
                </div>
                <span className="text-xs font-semibold text-charcoal-600 block">
                  Completed Exchanges
                </span>
              </div>
            </div>

            {/* Quick Action Queues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Support Requests */}
              <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Recent Support Inquiries</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('support')}
                    className="text-xs font-bold text-forest-700 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-charcoal-100 text-xs">
                  {tickets.slice(0, 4).map(ticket => (
                    <div key={ticket.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-bold text-charcoal-900 block truncate">
                          {ticket.subject}
                        </span>
                        <span className="text-[11px] text-charcoal-400 block truncate">
                          From: {ticket.name} ({ticket.email})
                        </span>
                      </div>
                      <Badge
                        variant={ticket.status === 'open' ? 'warning' : ticket.status === 'resolved' ? 'success' : 'default'}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                  ))}
                  {tickets.length === 0 && (
                    <p className="text-xs text-charcoal-400 py-4 text-center">No support tickets found.</p>
                  )}
                </div>
              </div>

              {/* Pending Safety Reports */}
              <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-rose-600" />
                    <span>Flagged Listings & Reports</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="text-xs font-bold text-forest-700 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-charcoal-100 text-xs">
                  {reports.slice(0, 4).map(rep => (
                    <div key={rep.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-bold text-charcoal-900 block truncate capitalize">
                          {rep.reason?.replace('_', ' ') || 'Report'}
                        </span>
                        <span className="text-[11px] text-charcoal-400 block truncate">
                          Item: {rep.resource?.title || 'Unknown listing'}
                        </span>
                      </div>
                      <Badge variant={rep.status === 'pending' ? 'danger' : 'default'}>
                        {rep.status}
                      </Badge>
                    </div>
                  ))}
                  {reports.length === 0 && (
                    <p className="text-xs text-charcoal-400 py-4 text-center">Zero pending safety reports.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUPPORT TICKETS MANAGEMENT */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-100">
              <div>
                <h2 className="text-lg font-bold text-charcoal-900">
                  Customer Support & Help Requests
                </h2>
                <p className="text-xs text-charcoal-500">
                  Review and resolve inquiries submitted by community users from the Contact & Support form.
                </p>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={supportSearch}
                    onChange={(e) => setSupportSearch(e.target.value)}
                    placeholder="Search name, email, subject..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-charcoal-200 text-xs focus:ring-1 focus:ring-forest-600 focus:outline-none w-52 sm:w-64"
                  />
                </div>

                <div className="flex bg-charcoal-100 p-1 rounded-xl text-[11px] font-bold text-charcoal-600">
                  {['all', 'open', 'in_progress', 'resolved'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSupportFilter(st)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition ${
                        supportFilter === st ? 'bg-white text-charcoal-900 shadow-2xs' : 'hover:text-charcoal-900'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Support Tickets List */}
            <div className="divide-y divide-charcoal-100">
              {filteredTickets.map(t => (
                <div key={t.id} className="py-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-charcoal-900">
                          {t.subject}
                        </span>
                        <Badge
                          variant={t.status === 'open' ? 'warning' : t.status === 'resolved' ? 'success' : 'default'}
                          className="capitalize text-[10px]"
                        >
                          {t.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="text-xs text-charcoal-500">
                        From: <strong>{t.name}</strong> • Email: <a href={`mailto:${t.email}`} className="text-forest-700 hover:underline">{t.email}</a> • {new Date(t.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenTicketModal(t)}
                        className="px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-bold transition flex items-center gap-1.5 border border-forest-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Manage Ticket</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTicket(t.id)}
                        className="p-1.5 rounded-xl text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="bg-offwhite p-3.5 rounded-2xl border border-charcoal-100 text-xs text-charcoal-700 leading-relaxed">
                    <p className="whitespace-pre-line">{t.message}</p>
                    {t.admin_notes && (
                      <div className="mt-2 pt-2 border-t border-charcoal-200/60 text-[11px] text-amber-800">
                        <strong>Admin Notes:</strong> {t.admin_notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredTickets.length === 0 && (
                <div className="py-12 text-center text-xs text-charcoal-400">
                  No support inquiries match the filter criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LISTINGS MODERATION (OLX STYLE) */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-100">
              <div>
                <h2 className="text-lg font-bold text-charcoal-900">
                  Listings Moderation Queue (OLX Model)
                </h2>
                <p className="text-xs text-charcoal-500">
                  Approve, unlist, hide, or remove resources to keep the marketplace safe from prohibited items.
                </p>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    placeholder="Search title, category, seller..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-charcoal-200 text-xs focus:ring-1 focus:ring-forest-600 focus:outline-none w-52 sm:w-64"
                  />
                </div>

                <div className="flex bg-charcoal-100 p-1 rounded-xl text-[11px] font-bold text-charcoal-600">
                  {['all', 'active', 'unavailable'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setListingFilter(st)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition ${
                        listingFilter === st ? 'bg-white text-charcoal-900 shadow-2xs' : 'hover:text-charcoal-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="divide-y divide-charcoal-100">
              {filteredListings.map(item => (
                <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=150&q=80'}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-charcoal-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-charcoal-900 truncate">
                          {item.title}
                        </span>
                        <Badge
                          variant={item.status === 'active' ? 'success' : 'default'}
                          className="capitalize text-[10px]"
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-charcoal-500 mt-1">
                        <span>🏷️ {item.category}</span>
                        <span>💰 {item.price === 0 || item.listing_type === 'giveaway' ? 'FREE' : `$${item.price}`}</span>
                        <span>📍 {item.city || item.location_name || 'Location set'}</span>
                        <span>👤 {item.seller?.full_name || 'Seller'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/resources/${item.id}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-xl bg-charcoal-50 hover:bg-charcoal-100 text-charcoal-700 text-xs font-bold transition flex items-center gap-1 border border-charcoal-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleToggleListingVisibility(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                        item.status === 'active'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {item.status === 'active' ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Unlist / Hide</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve / Activate</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteListing(item.id)}
                      className="p-2 rounded-xl text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                      title="Permanently Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredListings.length === 0 && (
                <div className="py-12 text-center text-xs text-charcoal-400">
                  No resource listings match the search criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SAFETY REPORTS & FLAGGED ITEMS */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-charcoal-100">
              <h2 className="text-lg font-bold text-charcoal-900">
                Safety & Prohibited Item Reports
              </h2>
              <p className="text-xs text-charcoal-500">
                Reports submitted by community members regarding spoiled food, hazardous chemicals, or safety guideline violations.
              </p>
            </div>

            <div className="space-y-4">
              {reports.map(rep => {
                const res = rep.resource;
                return (
                  <div
                    key={rep.id}
                    className="p-5 rounded-2xl border border-charcoal-200 bg-offwhite space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-rose-900 capitalize">
                          ⚠️ {rep.reason?.replace('_', ' ')}
                        </span>
                        <Badge variant={rep.status === 'pending' ? 'danger' : 'default'} className="text-[10px]">
                          {rep.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-charcoal-400">
                        Reported on: {new Date(rep.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-700 bg-white p-3 rounded-xl border border-charcoal-200">
                      <strong>Report Details:</strong> {rep.description || 'No description provided.'}
                    </p>

                    {res && (
                      <div className="flex items-center justify-between text-xs text-charcoal-600 bg-white p-3 rounded-xl border border-charcoal-200">
                        <div className="truncate">
                          <strong>Target Resource:</strong> {res.title} ({res.category})
                        </div>
                        <Link
                          to={`/resources/${res.id}`}
                          target="_blank"
                          className="text-forest-700 hover:underline font-bold shrink-0 ml-2"
                        >
                          View Item
                        </Link>
                      </div>
                    )}

                    {/* Moderation Action Buttons */}
                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleReportAction(rep.id, rep.reported_resource_id, 'hide_listing')}
                          className="px-3 py-1.5 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 transition shadow-xs"
                        >
                          Take Down Listing
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReportAction(rep.id, rep.reported_resource_id, 'dismiss')}
                          className="px-3 py-1.5 rounded-xl bg-charcoal-200 text-charcoal-800 text-xs font-bold hover:bg-charcoal-300 transition"
                        >
                          Dismiss Report
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {reports.length === 0 && (
                <div className="py-12 text-center text-xs text-charcoal-400">
                  Zero reports currently in the moderation queue.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: USER MANAGEMENT & VERIFICATION */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-100">
              <div>
                <h2 className="text-lg font-bold text-charcoal-900">
                  User & Seller Directory
                </h2>
                <p className="text-xs text-charcoal-500">
                  Manage accounts, grant verified badges to trusted community workshops, or manage administrator privileges.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or email..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-charcoal-200 text-xs focus:ring-1 focus:ring-forest-600 focus:outline-none w-52 sm:w-64"
                />
              </div>
            </div>

            <div className="divide-y divide-charcoal-100">
              {filteredUsers.map(u => (
                <div key={u.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${u.email}`}
                      alt={u.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-charcoal-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-charcoal-900">
                          {u.full_name || 'Member'}
                        </span>
                        {u.is_verified && (
                          <Badge variant="success" className="text-[10px] px-1.5 py-0.2">
                            ✓ Verified
                          </Badge>
                        )}
                        {u.is_admin && (
                          <Badge variant="warning" className="text-[10px] px-1.5 py-0.2">
                            🛡️ Admin
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-charcoal-400 block">
                        {u.email} • {u.account_type || 'User'} • {u.city || 'Local'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVerifyUser(u)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        u.is_verified
                          ? 'bg-charcoal-100 text-charcoal-700 border-charcoal-200 hover:bg-charcoal-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {u.is_verified ? 'Remove Verification' : 'Verify Seller'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleAdminRole(u)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        u.is_admin
                          ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {u.is_admin ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="py-12 text-center text-xs text-charcoal-400">
                  No users found matching your search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Ticket Edit / Management Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-charcoal-100">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
              <h3 className="font-bold text-base text-charcoal-900">
                Update Support Ticket #{selectedTicket.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-charcoal-400 hover:text-charcoal-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-charcoal-400 block mb-0.5">Requester:</span>
                <span className="font-bold text-charcoal-900 text-sm">{selectedTicket.name} ({selectedTicket.email})</span>
              </div>

              <div>
                <span className="text-charcoal-400 block mb-0.5">Subject:</span>
                <span className="font-bold text-charcoal-800">{selectedTicket.subject}</span>
              </div>

              <div className="p-3 bg-offwhite rounded-xl border border-charcoal-100 text-charcoal-700">
                <span className="text-charcoal-400 block mb-0.5 font-bold">User Message:</span>
                <p className="whitespace-pre-line">{selectedTicket.message}</p>
              </div>

              <div>
                <label className="block text-charcoal-700 font-bold mb-1">Ticket Status:</label>
                <select
                  value={ticketStatusVal}
                  onChange={(e) => setTicketStatusVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-forest-500 font-semibold"
                >
                  <option value="open">Open (Needs Attention)</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved (Completed)</option>
                  <option value="closed">Closed / Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-charcoal-700 font-bold mb-1">Internal Admin Resolution Notes:</label>
                <textarea
                  rows={3}
                  value={ticketNotesVal}
                  onChange={(e) => setTicketNotesVal(e.target.value)}
                  placeholder="Record what action was taken or note reply sent to user..."
                  className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-charcoal-100">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-charcoal-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTicketStatus}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-forest-700 hover:bg-forest-800 text-white shadow-xs"
              >
                Save Ticket Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

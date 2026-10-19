import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Archive,
  Search
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getUserResources, updateResource } from '../services/resourceService';
import { Badge } from '../components/Badge';

export function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'reserved', 'unavailable', 'completed'

  useEffect(() => {
    if (user?.id) loadUserListings();
  }, [user?.id]);

  const loadUserListings = async () => {
    setLoading(true);
    try {
      const data = await getUserResources(user.id);
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (resourceId, newStatus) => {
    try {
      await updateResource(resourceId, { status: newStatus });
      loadUserListings();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredListings = listings.filter(item => {
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'reserved') return item.status === 'reserved';
    if (activeTab === 'unavailable') return item.status === 'unavailable';
    if (activeTab === 'completed') return item.status === 'completed';
    return true;
  });

  const tabCounts = {
    active: listings.filter(l => l.status === 'active').length,
    reserved: listings.filter(l => l.status === 'reserved').length,
    unavailable: listings.filter(l => l.status === 'unavailable').length,
    completed: listings.filter(l => l.status === 'completed').length,
  };

  return (
    <DashboardLayout
      title="My Resource Listings"
      subtitle="Track your published surplus materials, update remaining inventory, and manage status."
      action={
        <Link
          to="/resources/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition shadow-xs"
        >
          <PlusCircle className="w-4 h-4 text-fresh-300" />
          <span>Publish New Listing</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex border-b border-charcoal-200 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'border-forest-700 text-forest-800 font-bold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <span>Active Listings</span>
            <span className="px-1.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px]">
              {tabCounts.active}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reserved')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'reserved'
                ? 'border-forest-700 text-forest-800 font-bold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <span>Reserved</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">
              {tabCounts.reserved}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('unavailable')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'unavailable'
                ? 'border-forest-700 text-forest-800 font-bold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <span>Unavailable / Inactive</span>
            <span className="px-1.5 py-0.5 rounded-full bg-charcoal-100 text-charcoal-700 text-[10px]">
              {tabCounts.unavailable}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'border-forest-700 text-forest-800 font-bold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <span>Completed Handoffs</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              {tabCounts.completed}
            </span>
          </button>
        </div>

        {/* Listings Content */}
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-400">
            Loading your listings...
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredListings.map(res => (
              <div
                key={res.id}
                className="bg-white rounded-2xl p-5 border border-charcoal-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4 overflow-hidden">
                  <img
                    src={res.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80'}
                    alt={res.title}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-charcoal-100 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wider">
                        {res.category}
                      </span>
                      <Badge variant={res.status === 'active' ? 'success' : res.status === 'reserved' ? 'warning' : 'default'}>
                        {res.status}
                      </Badge>
                    </div>
                    <Link
                      to={`/resources/${res.id}`}
                      className="font-bold text-sm text-charcoal-900 hover:text-forest-700 transition block truncate"
                    >
                      {res.title}
                    </Link>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      Available: <strong className="text-charcoal-800">{res.available_quantity ?? res.quantity} of {res.quantity} {res.unit}</strong> • {res.city || 'Local pickup'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal-100">
                  <Link
                    to={`/resources/${res.id}`}
                    className="p-2 rounded-xl border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50 text-xs font-semibold"
                    title="View Public Listing"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/resources/${res.id}/edit`}
                    className="inline-flex items-center gap-1 py-2 px-3 rounded-xl border border-charcoal-200 text-charcoal-800 hover:bg-charcoal-50 text-xs font-semibold transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {res.status === 'active' ? (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(res.id, 'unavailable')}
                      className="py-2 px-3 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 text-xs font-semibold transition"
                    >
                      Deactivate
                    </button>
                  ) : res.status === 'unavailable' ? (
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(res.id, 'active')}
                      className="py-2 px-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold transition"
                    >
                      Reactivate
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 space-y-3">
            <Package className="w-12 h-12 text-charcoal-300 mx-auto" />
            <h3 className="font-bold text-charcoal-800 text-base">No listings in "{activeTab}"</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              You currently have no resource listings in this category.
            </p>
            {activeTab !== 'active' && (
              <button
                onClick={() => setActiveTab('active')}
                className="text-xs text-forest-700 font-bold hover:underline"
              >
                View Active Listings
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

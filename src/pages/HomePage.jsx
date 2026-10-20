import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Package,
  MapPin,
  RefreshCw,
  Gift,
  Heart,
  DollarSign,
  Repeat,
  Clock,
  Layers,
  CheckCircle2,
  Cpu,
  Armchair,
  Shirt,
  Wrench,
  BookOpen,
  Apple,
  Scissors,
  LayoutGrid,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { CATEGORIES, CONDITIONS, LISTING_TYPES, matchesCategory } from '../utils/categories';
import { ResourceCard } from '../components/ResourceCard';
import { getResources } from '../services/resourceService';
import { getAdminMetrics } from '../services/adminService';

const ICON_MAP = {
  Cpu,
  Armchair,
  Shirt,
  Wrench,
  BookOpen,
  Apple,
  Scissors,
  Gift
};

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Resource state
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(12);

  // Filter States from URL or defaults
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedQuantityType, setSelectedQuantityType] = useState(searchParams.get('quantity') || 'all');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Search & Location from URL (synced with Navbar)
  const searchQuery = searchParams.get('search') || '';
  const locationQuery = searchParams.get('location') || '';

  // Stats
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeListings: 0,
    completedExchanges: 0
  });

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
    const typ = searchParams.get('type') || 'all';
    setSelectedType(typ);
    const qty = searchParams.get('quantity') || 'all';
    setSelectedQuantityType(qty);
    const cond = searchParams.get('condition') || 'all';
    setSelectedCondition(cond);
    const srt = searchParams.get('sort') || 'newest';
    setSortBy(srt);
  }, [searchParams]);

  // Load resources based on filters
  useEffect(() => {
    loadResources();
  }, [selectedCategory, selectedType, selectedQuantityType, selectedCondition, sortBy, searchQuery, locationQuery]);

  // Load platform metrics once
  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await getAdminMetrics();
        setMetrics(stats);
      } catch (e) {
        // ignore
      }
    }
    loadStats();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getResources({
        category: selectedCategory,
        listingType: selectedType,
        quantityType: selectedQuantityType,
        condition: selectedCondition,
        search: searchQuery,
        locationQuery: locationQuery === 'All Locations' ? '' : locationQuery,
        sort: sortBy
      });
      setResources(data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  // Category filter handler
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams(searchParams);
    if (categoryName === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryName);
    }
    setSearchParams(params);
  };

  // Listing type filter handler
  const handleTypeSelect = (typeValue) => {
    setSelectedType(typeValue);
    const params = new URLSearchParams(searchParams);
    if (typeValue === 'all') {
      params.delete('type');
    } else {
      params.set('type', typeValue);
    }
    setSearchParams(params);
  };

  // Quantity mode filter handler
  const handleQuantitySelect = (qtyValue) => {
    setSelectedQuantityType(qtyValue);
    const params = new URLSearchParams(searchParams);
    if (qtyValue === 'all') {
      params.delete('quantity');
    } else {
      params.set('quantity', qtyValue);
    }
    setSearchParams(params);
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedQuantityType('all');
    setSelectedCondition('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    selectedQuantityType !== 'all' ||
    selectedCondition !== 'all' ||
    searchQuery ||
    (locationQuery && locationQuery !== 'All Locations');

  const visibleResources = resources.slice(0, itemsToShow);

  return (
    <div className="min-h-screen bg-offwhite">
      {/* 1. OLX STYLE: HORIZONTAL CATEGORIES STRIP */}
      <nav aria-label="Resource Categories" className="bg-white border-b border-charcoal-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 overflow-x-auto py-3 scrollbar-none">
            {/* All Categories Button */}
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedCategory === 'all'
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'text-charcoal-700 hover:bg-forest-50 hover:text-forest-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Items</span>
            </button>

            {/* Category Buttons with Icons */}
            {CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Package;
              const isSelected = matchesCategory(cat.name, selectedCategory);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                    isSelected
                      ? 'bg-forest-700 text-white shadow-xs'
                      : 'text-charcoal-700 hover:bg-forest-50 hover:text-forest-800'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-fresh-300' : 'text-charcoal-500'}`} />
                  <span>{cat.shortName || cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. OLX STYLE: FILTER STRIP (In Front of Categories) */}
      <section aria-label="Resource Filters" className="bg-white/80 backdrop-blur-xs border-b border-charcoal-200/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2.5">
          {/* Top Row: Quick Listing Type Buttons & Quantity Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-charcoal-500 uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-forest-700" />
                Filter:
              </span>

              {/* Free Stuff / Giveaway Button */}
              <button
                type="button"
                onClick={() => handleTypeSelect(selectedType === 'giveaway' ? 'all' : 'giveaway')}
                className={`px-3 py-1.5 rounded-full font-bold border transition flex items-center gap-1.5 ${
                  selectedType === 'giveaway'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Gift className="w-3 h-3" />
                <span>Free Stuff / Giveaway</span>
              </button>

              {/* Donation Button */}
              <button
                type="button"
                onClick={() => handleTypeSelect(selectedType === 'donation' ? 'all' : 'donation')}
                className={`px-3 py-1.5 rounded-full font-bold border transition flex items-center gap-1.5 ${
                  selectedType === 'donation'
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100'
                }`}
              >
                <Heart className="w-3 h-3" />
                <span>Donation</span>
              </button>

              {/* Bulk Items Filter */}
              <button
                type="button"
                onClick={() => handleQuantitySelect(selectedQuantityType === 'bulk' ? 'all' : 'bulk')}
                className={`px-3 py-1.5 rounded-full font-bold border transition flex items-center gap-1.5 ${
                  selectedQuantityType === 'bulk'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Package className="w-3 h-3" />
                <span>Bulk / Surplus Lots</span>
              </button>

              {/* Single Items Filter */}
              <button
                type="button"
                onClick={() => handleQuantitySelect(selectedQuantityType === 'single' ? 'all' : 'single')}
                className={`px-3 py-1.5 rounded-full font-bold border transition flex items-center gap-1.5 ${
                  selectedQuantityType === 'single'
                    ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                    : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <span>Single Items</span>
              </button>

              {/* For Sale Filter */}
              <button
                type="button"
                onClick={() => handleTypeSelect(selectedType === 'sale' ? 'all' : 'sale')}
                className={`px-3 py-1.5 rounded-full font-bold border transition flex items-center gap-1.5 ${
                  selectedType === 'sale'
                    ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <DollarSign className="w-3 h-3" />
                <span>For Sale</span>
              </button>
            </div>

            {/* Right: Sort and Reset */}
            <div className="flex items-center gap-3 text-xs ml-auto">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              )}

              <div className="flex items-center gap-1.5">
                <span className="text-charcoal-400 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    const params = new URLSearchParams(searchParams);
                    params.set('sort', e.target.value);
                    setSearchParams(params);
                  }}
                  className="bg-white border border-charcoal-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN OLX FEED / MARKETPLACE GRID */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Feed Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-charcoal-200/80 gap-3">
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight flex items-center gap-2">
              <span>Fresh Recommendations</span>
              {locationQuery && locationQuery !== 'All Locations' && (
                <span className="text-xs font-bold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-forest-600" />
                  {locationQuery}
                </span>
              )}
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Browse available timber, electronics, furniture, books, and surplus materials ready for direct collection.
            </p>
          </div>

          <div className="text-xs font-semibold text-charcoal-500 shrink-0">
            {resources.length} {resources.length === 1 ? 'item available' : 'items available'}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-2">
            <RefreshCw className="w-8 h-8 text-forest-700 animate-spin mx-auto" />
            <p className="text-xs text-charcoal-500 font-medium">Searching marketplace listings...</p>
          </div>
        ) : resources.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Load More Button */}
            {itemsToShow < resources.length && (
              <div className="text-center mt-12">
                <button
                  type="button"
                  onClick={() => setItemsToShow((prev) => prev + 12)}
                  className="px-6 py-3 rounded-2xl bg-white border-2 border-charcoal-300 hover:border-forest-700 text-xs sm:text-sm font-bold text-charcoal-800 hover:text-forest-800 transition shadow-xs"
                >
                  Load More Items ({resources.length - itemsToShow} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-charcoal-200/80 p-8 shadow-xs max-w-lg mx-auto space-y-4">
            <Package className="w-12 h-12 text-charcoal-300 mx-auto" />
            <h2 className="text-lg font-bold text-charcoal-900">No Items Found Matching Filters</h2>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              Try adjusting or resetting your category, location, or listing type filters to discover more resources.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-800 text-xs font-bold transition"
              >
                Reset All Filters
              </button>
              <Link
                to="/resources/create"
                className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition"
              >
                List First Item
              </Link>
            </div>
          </div>
        )}

        {/* 4. OLX STYLE: HOW IT WORKS 4-STEP STRIP */}
        <div className="mt-20 pt-12 border-t border-charcoal-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl font-black text-charcoal-900 tracking-tight">
              How ReLoop Works
            </h2>
            <p className="text-xs text-charcoal-500 mt-1">
              Give unused materials a useful second life in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-charcoal-200/90 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-black text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-charcoal-900">Post Item or Need</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                List surplus materials, furniture, or books with photos, quantity, and location. Or publish what you need.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-charcoal-200/90 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-black text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-charcoal-900">Smart Match</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Rule-based recommendations automatically connect resource owners with nearby projects.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-charcoal-200/90 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-black text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-charcoal-900">Chat with Seller</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Message directly through in-app chat to confirm item details, quantities, and meeting arrangements.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-charcoal-200/90 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-black text-xs">
                4
              </div>
              <h3 className="font-bold text-sm text-charcoal-900">Pick Up & Reuse</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Navigate via Google Maps directions, verify items in person, and give them a useful second life.
              </p>
            </div>
          </div>
        </div>

        {/* 5. METRICS STRIP */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-charcoal-200/80 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-forest-700">
                {metrics.activeListings}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 mt-0.5">
                Active Listings
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-forest-700">
                {metrics.totalUsers}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 mt-0.5">
                Registered Members
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-forest-700">
                {metrics.completedExchanges}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 mt-0.5">
                Completed Exchanges
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

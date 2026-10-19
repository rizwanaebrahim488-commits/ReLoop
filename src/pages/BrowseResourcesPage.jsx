import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Package,
  MapPin,
  RefreshCw,
  Sparkles,
  Cpu,
  Armchair,
  Shirt,
  Wrench,
  BookOpen,
  Apple,
  Scissors,
  Gift,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES, CONDITIONS, LISTING_TYPES, matchesCategory } from '../utils/categories';
import { ResourceCard } from '../components/ResourceCard';
import { getResources } from '../services/resourceService';
import { useAuth } from '../context/AuthContext';

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

export function BrowseResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [listingTypeFilter, setListingTypeFilter] = useState(searchParams.get('type') || 'all');
  const [conditionFilter, setConditionFilter] = useState(searchParams.get('condition') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [itemsToShow, setItemsToShow] = useState(8);

  // Sync state if URL query param changes
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) setCategoryFilter(urlCategory);
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearchQuery(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    loadResources();
  }, [categoryFilter, listingTypeFilter, conditionFilter, sortBy]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getResources({
        search: searchQuery,
        category: categoryFilter,
        listingType: listingTypeFilter,
        condition: conditionFilter,
        sort: sortBy
      });
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadResources();
  };

  const handleCategoryClick = (catName) => {
    setCategoryFilter(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setListingTypeFilter('all');
    setConditionFilter('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const visibleResources = resources.slice(0, itemsToShow);

  return (
    <div className="min-h-screen bg-offwhite py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-charcoal-200 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Explore Available Resources
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
              Find electronics, furniture, textiles, tools, and surplus items ready for direct local pickup.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, materials, cities..."
              className="w-full pl-9 pr-16 py-2.5 rounded-xl border border-charcoal-200 bg-white text-xs sm:text-sm text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-500 shadow-xs"
            />
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  loadResources();
                }}
                className="absolute right-14 top-3 text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-forest-700 text-white text-xs font-semibold rounded-lg hover:bg-forest-800 transition shadow-xs"
            >
              Search
            </button>
          </form>
        </div>

        {/* 1-Tap Category Pill Bar (Airbnb / OLX style) */}
        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none pb-2">
          <div className="flex items-center gap-2 min-w-max">
            {/* 'All' pill */}
            <button
              type="button"
              onClick={() => handleCategoryClick('all')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs ${
                categoryFilter === 'all'
                  ? 'bg-forest-800 text-white shadow-forest-900/20'
                  : 'bg-white text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 border border-charcoal-200/90'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-fresh-400" />
              <span>All Items</span>
            </button>

            {/* Category pills */}
            {CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Package;
              const isSelected = matchesCategory(cat.name, categoryFilter);

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition shadow-xs ${
                    isSelected
                      ? 'bg-forest-800 text-white shadow-forest-900/20'
                      : 'bg-white text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 border border-charcoal-200/90'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-fresh-300' : 'text-charcoal-400'}`} />
                  <span>{cat.shortName || cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter bar and controls */}
        <div className="bg-white p-4 rounded-2xl border border-charcoal-200/80 shadow-xs mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-forest-600" />
                Filters
              </span>
              {(categoryFilter !== 'all' || listingTypeFilter !== 'all' || conditionFilter !== 'all' || searchQuery) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 ml-2"
                >
                  <X className="w-3 h-3" /> Reset all filters
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-charcoal-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-charcoal-50 border border-charcoal-200 rounded-lg px-2.5 py-1.5 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-500 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Filter selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-charcoal-100 text-xs">
            {/* Listing Type */}
            <div>
              <label className="block text-charcoal-500 font-semibold mb-1">Listing Type</label>
              <select
                value={listingTypeFilter}
                onChange={(e) => setListingTypeFilter(e.target.value)}
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-lg p-2 text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="all">All Types (Free Giveaway, Sale, Lend, etc.)</option>
                {LISTING_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-charcoal-500 font-semibold mb-1">Physical Condition</label>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-lg p-2 text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="all">Any Condition</option>
                {CONDITIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-forest-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-charcoal-500">Searching active listings...</p>
          </div>
        ) : resources.length > 0 ? (
          <>
            <div className="text-xs text-charcoal-500 mb-4 font-medium flex items-center justify-between">
              <span>Showing {visibleResources.length} of {resources.length} available items</span>
              {categoryFilter !== 'all' && (
                <span className="font-semibold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-100">
                  Category: {categoryFilter}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Load More Button */}
            {itemsToShow < resources.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setItemsToShow(prev => prev + 8)}
                  className="px-6 py-2.5 rounded-xl bg-white border border-charcoal-200 text-xs sm:text-sm font-semibold text-charcoal-800 hover:bg-charcoal-50 transition shadow-xs"
                >
                  Load More ({resources.length - itemsToShow} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-charcoal-100 p-8 shadow-xs">
            <Package className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-charcoal-800">No resources found</h3>
            <p className="text-xs text-charcoal-500 mt-1 mb-6 max-w-sm mx-auto">
              We couldn't find items matching your search. Try resetting filters or post a need for what you are looking for.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-charcoal-100 text-charcoal-700 text-xs font-semibold hover:bg-charcoal-200"
              >
                Clear Filters
              </button>
              <a
                href="/needs/create"
                className="px-4 py-2 rounded-xl bg-forest-700 text-white text-xs font-semibold hover:bg-forest-800"
              >
                Publish a Need
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileQuestion,
  Search,
  ShieldCheck,
  CheckCircle2,
  Users,
  Package,
  Layers,
  MapPin,
  HeartHandshake,
  Wrench,
  Leaf,
  Cpu,
  Armchair,
  Shirt,
  BookOpen,
  Apple,
  Scissors,
  Gift
} from 'lucide-react';
import { CATEGORIES } from '../utils/categories';
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
  const [heroSearch, setHeroSearch] = useState('');
  const [recentResources, setRecentResources] = useState([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeListings: 0,
    completedExchanges: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [res, stats] = await Promise.all([
          getResources({ sort: 'newest' }),
          getAdminMetrics()
        ]);
        setRecentResources(res.slice(0, 4));
        setMetrics(stats);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/resources?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/resources');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-radial from-forest-800 via-forest-900 to-forest-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#52b788_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-800/80 border border-forest-600/50 text-fresh-300 text-xs sm:text-sm font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-fresh-400" />
            <span>ReLoop — One Resource, Many Possibilities</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Give Every Resource a <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fresh-300 via-fresh-400 to-emerald-200">
              Second Life.
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-forest-200 leading-relaxed font-normal">
            Connect directly with neighbors, workshops, charities, and makers to share, sell, donate, or find reusable goods. No delivery middlemen — direct collection only.
          </p>

          {/* Integrated Quick Search Box (OLX style) */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleHeroSearch} className="relative flex items-center shadow-2xl rounded-2xl bg-white p-1.5 border border-white/20">
              <Search className="w-5 h-5 text-charcoal-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search items (e.g. laptop, timber, desk, books) or city..."
                className="w-full px-3 py-3 text-xs sm:text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-fresh-500 hover:bg-fresh-400 text-forest-950 font-bold text-xs sm:text-sm transition shadow-sm shrink-0"
              >
                Search
              </button>
            </form>

            {/* Quick Category Chips below Hero Search */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
              <span className="text-forest-300/80 text-[11px] font-medium mr-1">Popular:</span>
              {['Electronics', 'Furniture', 'Tools & DIY', 'Free Stuff', 'Clothing', 'Books'].map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/resources?search=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 rounded-full bg-forest-800/80 hover:bg-forest-700 text-forest-200 hover:text-white border border-forest-700/60 transition text-[11px] font-medium"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/resources"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-forest-900 font-bold text-xs sm:text-sm hover:bg-forest-50 transition shadow-sm"
            >
              <Search className="w-4 h-4 text-forest-700" />
              <span>Explore Marketplace</span>
            </Link>

            <Link
              to="/resources/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-forest-800/90 hover:bg-forest-700 text-white font-semibold text-xs sm:text-sm border border-forest-600/70 transition"
            >
              <PlusCircle className="w-4 h-4 text-fresh-300" />
              <span>List a Resource</span>
            </Link>

            <Link
              to="/needs/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-forest-950/70 hover:bg-forest-950 text-forest-200 hover:text-white font-semibold text-xs sm:text-sm border border-forest-800 transition"
            >
              <FileQuestion className="w-4 h-4 text-forest-400" />
              <span>Publish a Need</span>
            </Link>
          </div>

          {/* Direct Collection Clarification */}
          <p className="text-[11px] sm:text-xs text-forest-300/80 pt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-fresh-400 shrink-0" />
            <span>Independent direct arrangement — ReLoop does not operate delivery services or delivery partners.</span>
          </p>
        </div>
      </section>

      {/* POPULAR CATEGORIES SECTION */}
      <section className="py-16 bg-offwhite px-4 sm:px-6 lg:px-8 border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-1.5">
                Streamlined Sharing
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                Popular Resource Categories
              </h3>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-forest-700 hover:text-forest-900"
            >
              <span>Explore all categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map(cat => {
              const IconComp = ICON_MAP[cat.icon] || Recycle;
              return (
                <Link
                  key={cat.id}
                  to={`/resources?category=${encodeURIComponent(cat.name)}`}
                  className="group bg-white p-5 rounded-2xl border border-charcoal-200/80 shadow-xs hover:shadow-lg hover:border-forest-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${cat.bgLight}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-charcoal-900 mb-1 group-hover:text-forest-700 transition">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed mb-3">
                      {cat.tagline}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between text-[11px] text-forest-700 font-semibold">
                    <span>Browse items</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* RECENTLY LISTED RESOURCES */}
      <section className="py-16 bg-white border-b border-charcoal-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-1.5">
                Live Feed
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                Recently Available Resources
              </h3>
            </div>
            <Link
              to="/resources"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-forest-700 hover:text-forest-900"
            >
              <span>View full marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-charcoal-400 text-sm">
              Loading recent listings...
            </div>
          ) : recentResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-offwhite rounded-2xl border border-charcoal-100 p-8">
              <Package className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
              <h4 className="font-bold text-charcoal-800">No resources listed yet</h4>
              <p className="text-xs text-charcoal-500 mt-1 mb-4">Be the first to list an unused resource!</p>
              <Link to="/resources/create" className="px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-semibold">
                List a Resource
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* HOW RELOOP WORKS SECTION */}
      <section className="py-16 bg-offwhite border-b border-charcoal-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-1.5">
              Simple 4-Step Process
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              How ReLoop Works
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-2">
              Share locally and arrange pickup directly with complete independence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-charcoal-200/80 text-center relative group hover:border-forest-300 shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3 font-black text-base">
                1
              </div>
              <h4 className="font-bold text-sm text-charcoal-900 mb-1.5">List or Request</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Post surplus items with photos, condition, and location. Or publish a request for what you need.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-charcoal-200/80 text-center relative group hover:border-forest-300 shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3 font-black text-base">
                2
              </div>
              <h4 className="font-bold text-sm text-charcoal-900 mb-1.5">Smart Match</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Rule-based matching connects resource owners with nearby community needs automatically.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-charcoal-200/80 text-center relative group hover:border-forest-300 shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3 font-black text-base">
                3
              </div>
              <h4 className="font-bold text-sm text-charcoal-900 mb-1.5">Chat Directly</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Coordinate details, confirm condition, and agree on collection times using in-app messaging.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-charcoal-200/80 text-center relative group hover:border-forest-300 shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3 font-black text-base">
                4
              </div>
              <h4 className="font-bold text-sm text-charcoal-900 mb-1.5">Independent Pickup</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Navigate via Google Maps links, inspect items in person, and complete the handoff directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT BEST USE PHILOSOPHY SECTION */}
      <section className="py-16 bg-forest-950 text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800 text-fresh-300 text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5" />
                <span>Circular Economy Principle</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                The "Next Best Use" Concept
              </h2>

              <p className="text-xs sm:text-sm text-forest-200 leading-relaxed">
                When a resource cannot find a direct buyer or recipient, it shouldn't go to landfill. ReLoop's algorithm automatically suggests practical alternative circular pathways:
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 bg-forest-900/60 p-3 rounded-xl border border-forest-800">
                  <HeartHandshake className="w-4 h-4 text-fresh-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Community & Shelter Donation:</strong>
                    <p className="text-forest-300 text-[11px] mt-0.5">Surplus pantry goods, linens, and furniture routed to shelters and local drives.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-forest-900/60 p-3 rounded-xl border border-forest-800">
                  <Wrench className="w-4 h-4 text-fresh-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Repair & Component Salvage:</strong>
                    <p className="text-forest-300 text-[11px] mt-0.5">Appliances and electronics saved for repair clinics, student labs, or parts harvesting.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-forest-900/60 p-3 rounded-xl border border-forest-800">
                  <Recycle className="w-4 h-4 text-fresh-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Upcycling & Clean Composting:</strong>
                    <p className="text-forest-300 text-[11px] mt-0.5">Lumber offcuts for woodworking; coffee grounds and organic items for rich compost.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-forest-900/40 rounded-3xl p-6 sm:p-8 border border-forest-800/80 backdrop-blur-xs space-y-5">
              <h3 className="font-bold text-base sm:text-lg text-white">Non-Negotiable Safety Rules</h3>
              <ul className="space-y-3 text-xs text-forest-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Spoiled Food:</strong> Expired or unsafe food must NEVER be offered for human consumption.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Hazardous Materials:</strong> Hazardous batteries, asbestos, and bio-contaminants require certified recyclers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-400 shrink-0 mt-0.5" />
                  <span><strong>Direct Inspection:</strong> Inspect all items in person to verify condition before accepting.</span>
                </li>
              </ul>
              <Link
                to="/about"
                className="inline-block text-xs font-bold text-fresh-300 hover:text-white underline pt-1"
              >
                Read our full circular charter & next best use philosophy →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REAL RECORDED PLATFORM IMPACT DATA */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-b border-charcoal-100">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-1.5">
              Transparent Metrics
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Community Impact Recorded on Database
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              ReLoop records genuine platform activity without fabricated statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-offwhite p-6 rounded-2xl border border-charcoal-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-forest-700 mb-1">
                {metrics.activeListings}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                Active Resource Listings
              </div>
            </div>

            <div className="bg-offwhite p-6 rounded-2xl border border-charcoal-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-forest-700 mb-1">
                {metrics.totalUsers}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                Registered Members
              </div>
            </div>

            <div className="bg-offwhite p-6 rounded-2xl border border-charcoal-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-forest-700 mb-1">
                {metrics.completedExchanges}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                Completed Direct Exchanges
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 bg-forest-900 text-white text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Have Resources to Share or Looking for Supplies?
          </h2>
          <p className="text-xs sm:text-sm text-forest-200">
            Join conscious community members, workshops, NGOs, and makers on ReLoop today. Free to register, no delivery middle-men.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-fresh-500 text-forest-950 font-bold text-xs sm:text-sm hover:bg-fresh-400 transition shadow-md"
            >
              Create Free Account
            </Link>
            <Link
              to="/resources"
              className="px-6 py-3 rounded-xl bg-forest-800 text-white font-semibold text-xs sm:text-sm hover:bg-forest-700 transition border border-forest-700"
            >
              Browse All Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

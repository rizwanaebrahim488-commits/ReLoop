import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileQuestion,
  Search,
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
      {/* CLEAN, VIBRANT GREEN HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-fresh-50/90 via-white to-offwhite border-b border-forest-100/90 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs sm:text-sm font-bold border border-forest-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-forest-700" />
            <span>ReLoop — One Resource, Many Possibilities</span>
          </div>

          {/* Heading - Maximum Visibility High-Contrast Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] text-charcoal-900">
            Give Every Resource a <br className="hidden sm:inline" />
            <span className="text-forest-700">
              Second Life.
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-charcoal-600 leading-relaxed font-normal">
            Connect with local neighbors, workshops, charities, and makers to share, sell, donate, or find reusable goods in your community.
          </p>

          {/* Integrated Quick Search Box (Clean Green Accent Style) */}
          <div className="max-w-2xl mx-auto pt-1">
            <form onSubmit={handleHeroSearch} className="relative flex items-center shadow-lg shadow-forest-900/5 rounded-2xl bg-white p-2 border-2 border-forest-200 focus-within:border-forest-600 transition">
              <Search className="w-5 h-5 text-forest-600 ml-3 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search items (e.g. laptop, timber, desk, books) or city..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm transition shadow-sm shrink-0"
              >
                Search
              </button>
            </form>

            {/* Quick Category Chips below Hero Search */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
              <span className="text-charcoal-500 text-[11px] font-semibold mr-1">Popular:</span>
              {['Electronics', 'Furniture', 'Tools & DIY', 'Free Stuff', 'Clothing', 'Books'].map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/resources?search=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full bg-white hover:bg-forest-50 text-forest-800 hover:text-forest-900 border border-forest-200 shadow-2xs transition text-[11px] font-semibold"
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-forest-900/15"
            >
              <Search className="w-4 h-4 text-fresh-300" />
              <span>Explore Marketplace</span>
            </Link>

            <Link
              to="/resources/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-forest-50 text-forest-800 font-bold text-xs sm:text-sm border-2 border-forest-600 shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4 text-forest-600" />
              <span>List a Resource</span>
            </Link>

            <Link
              to="/needs/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-100/80 hover:bg-forest-100 text-forest-900 font-bold text-xs sm:text-sm border border-forest-200 shadow-xs transition"
            >
              <FileQuestion className="w-4 h-4 text-forest-700" />
              <span>Publish a Need</span>
            </Link>
          </div>
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
              Share, connect, and give reusable materials a second life.
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
                Coordinate details, confirm condition, and agree on meetup times using in-app messaging.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-charcoal-200/80 text-center relative group hover:border-forest-300 shadow-xs transition">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3 font-black text-base">
                4
              </div>
              <h4 className="font-bold text-sm text-charcoal-900 mb-1.5">Pick Up & Reuse</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Meet locally via Google Maps directions, verify items in person, and give them a useful second life.
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
      <section className="py-16 bg-gradient-to-r from-forest-800 to-forest-900 text-white text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Have Resources to Share or Looking for Supplies?
          </h2>
          <p className="text-xs sm:text-sm text-forest-200">
            Join conscious community members, workshops, NGOs, and makers on ReLoop today. Free to register, connect directly with your local community.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-fresh-400 hover:bg-fresh-300 text-forest-950 font-bold text-xs sm:text-sm transition shadow-md"
            >
              Create Free Account
            </Link>
            <Link
              to="/resources"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition border border-white/20"
            >
              Browse All Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

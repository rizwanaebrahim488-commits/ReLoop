import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Armchair,
  Shirt,
  Wrench,
  BookOpen,
  Apple,
  Scissors,
  Gift,
  Recycle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Search,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { CATEGORIES } from '../utils/categories';

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

export function CategoriesPage() {
  const [expandedSafetyId, setExpandedSafetyId] = useState(null);

  const toggleSafety = (id) => {
    setExpandedSafetyId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-offwhite py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            <span>Clean & Direct Sharing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Browse by Category
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
            Quickly explore available items, publish what you need, or give surplus resources a useful second life.
          </p>

          {/* Quick Action Links */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/resources"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-700 text-white text-xs font-semibold hover:bg-forest-800 transition shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse All Resources</span>
            </Link>
            <Link
              to="/resources/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-charcoal-200 text-charcoal-700 text-xs font-semibold hover:bg-charcoal-50 transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-forest-600" />
              <span>List a Surplus Item</span>
            </Link>
          </div>
        </div>

        {/* Streamlined Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Recycle;
            const isSafetyOpen = expandedSafetyId === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-6 border border-charcoal-200/80 shadow-xs hover:shadow-xl hover:border-forest-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Icon & Category Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${cat.bgLight}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-charcoal-400 bg-charcoal-50 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h2 className="text-lg font-bold text-charcoal-900 mb-1 group-hover:text-forest-700 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-charcoal-500 leading-relaxed mb-4 min-h-[32px]">
                    {cat.tagline}
                  </p>

                  {/* Popular Tags / Item Pills */}
                  {cat.popularTags && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {cat.popularTags.slice(0, 3).map((tag, tIdx) => (
                        <Link
                          key={tIdx}
                          to={`/resources?search=${encodeURIComponent(tag)}`}
                          className="text-[10px] font-medium bg-offwhite hover:bg-forest-50 hover:text-forest-800 text-charcoal-600 px-2 py-1 rounded-lg border border-charcoal-100 transition"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Collapsible Guidelines (Only if user wants to read) */}
                  <div className="border-t border-charcoal-100 pt-2 mb-4">
                    <button
                      type="button"
                      onClick={() => toggleSafety(cat.id)}
                      className="w-full flex items-center justify-between text-[11px] text-charcoal-500 hover:text-charcoal-800 font-medium py-1"
                    >
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-forest-600" />
                        <span>Safety & Circular Guide</span>
                      </span>
                      {isSafetyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isSafetyOpen && (
                      <div className="mt-2 p-3 bg-forest-50/70 rounded-xl text-[11px] space-y-2 border border-forest-100 animate-in fade-in duration-150">
                        <div>
                          <strong className="text-forest-900 block font-bold mb-0.5">Safety Rule:</strong>
                          <p className="text-forest-800 leading-normal">{cat.safetyGuidelines}</p>
                        </div>
                        <div>
                          <strong className="text-forest-900 block font-bold mb-0.5">Next Best Use:</strong>
                          <p className="text-forest-700 leading-normal">{cat.nextBestUse}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Card Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    to={`/resources?category=${encodeURIComponent(cat.name)}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold text-xs transition shadow-xs"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    to={`/needs/create?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center justify-center py-2.5 px-3 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 font-semibold text-xs transition"
                    title="Publish a request or need in this category"
                  >
                    Need This
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean Direct Collection Notice */}
        <div className="mt-12 bg-white rounded-2xl p-4 sm:p-5 border border-charcoal-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-600">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-charcoal-900 block">Direct Peer-to-Peer Pickups Only</span>
              <span>ReLoop connects community members directly. Pickups and transportation are coordinated independently.</span>
            </div>
          </div>
          <Link
            to="/how-it-works"
            className="text-forest-700 hover:text-forest-800 font-bold whitespace-nowrap inline-flex items-center gap-1"
          >
            <span>Learn How It Works</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

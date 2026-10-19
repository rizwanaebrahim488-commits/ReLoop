import React from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Leaf,
  Sparkles,
  ShieldAlert,
  AlertCircle,
  HeartHandshake,
  Wrench,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-offwhite py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Recycle className="w-4 h-4 text-forest-600" />
            <span>Our Mission & Circular Philosophy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-charcoal-900 tracking-tight">
            One Resource, Many Possibilities
          </h1>
          <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed font-normal">
            ReLoop was created to solve a profound modern paradox: usable timber, electronics, fabric, organic matter, and household equipment end up in landfills while neighbors, makers, and non-profits are actively searching for those exact materials.
          </p>
        </div>

        {/* The Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white p-8 rounded-3xl border border-charcoal-100 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              The Linear Problem
            </span>
            <h2 className="text-2xl font-bold text-charcoal-900">
              The Cost of Premature Disposal
            </h2>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Every day, businesses and individuals discard architectural timber, surplus conference floral arrangements, functional electronics with minor cosmetic defects, and organic composting feedstocks simply because they lack an immediate local destination.
            </p>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Traditional marketplaces favor high-margin consumer products, leaving circular materials, partial lots, and repair projects without a dedicated discovery home.
            </p>
          </div>

          <div className="bg-forest-900 text-white p-8 rounded-3xl border border-forest-800 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-fresh-400">
              The ReLoop Solution
            </span>
            <h2 className="text-2xl font-bold text-white">
              Hyper-Local Circular Connection
            </h2>
            <p className="text-sm text-forest-200 leading-relaxed">
              ReLoop bridges this gap by creating an open, rule-matched ecosystem where individuals, community workshops, repairers, charities, and recyclers publish their surplus resources and material needs.
            </p>
            <p className="text-sm text-forest-200 leading-relaxed">
              By facilitating direct, face-to-face collections without delivery intermediaries, ReLoop minimizes transit carbon and builds resilient community relationships.
            </p>
          </div>
        </div>

        {/* Circular Hierarchy */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-charcoal-100 shadow-xs space-y-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-2">
              Circular Hierarchy
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Seven Pathways for Every Resource
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
              <strong className="text-forest-800 text-base block mb-1">1. Direct Reuse</strong>
              <p className="text-charcoal-600 leading-relaxed">Using an item in its existing state without processing — the highest environmental value.</p>
            </div>
            <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
              <strong className="text-forest-800 text-base block mb-1">2. Charity Donation</strong>
              <p className="text-charcoal-600 leading-relaxed">Transferring surplus goods directly to verified non-profits, shelters, and educational bodies.</p>
            </div>
            <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
              <strong className="text-forest-800 text-base block mb-1">3. Repair & Clinic Fixes</strong>
              <p className="text-charcoal-600 leading-relaxed">Pairing salvageable electronics and furniture with repairers and vocational students.</p>
            </div>
            <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
              <strong className="text-forest-800 text-base block mb-1">4. Repurposing & Upcycling</strong>
              <p className="text-charcoal-600 leading-relaxed">Creative transformation of denim scraps into bags or timber offcuts into furniture.</p>
            </div>
            <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
              <strong className="text-forest-800 text-base block mb-1">5. Material Recycling</strong>
              <p className="text-charcoal-600 leading-relaxed">Reclaiming clean cardboard, metals, and scrap through authorized collectors.</p>
            </div>
            <div className="p-4 rounded-2xl bg-offwhite border border-charcoal-100">
              <strong className="text-forest-800 text-base block mb-1">6. Composting & Soil Loop</strong>
              <p className="text-charcoal-600 leading-relaxed">Returning organic residues and floral petal scraps to fertile community garden soil.</p>
            </div>
          </div>
        </div>


        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md"
          >
            <span>Explore Active Community Resources</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

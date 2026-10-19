import React from 'react';
import { Link } from 'react-router-dom';
import {
  ListPlus,
  Search,
  Sparkles,
  MessageSquare,
  Gift,
  Heart,
  DollarSign,
  Repeat,
  Clock,
  Wrench,
  Recycle,
  CheckCircle2,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { LISTING_TYPES } from '../utils/categories';

export function HowItWorksPage() {
  const listingExplanations = [
    {
      title: 'Free Giveaways',
      icon: Gift,
      color: 'text-emerald-700 bg-emerald-50',
      description: 'Surplus items offered to the community with zero financial charge. Requesters simply coordinate direct collection with the owner.'
    },
    {
      title: 'Charity Donations',
      icon: Heart,
      color: 'text-rose-700 bg-rose-50',
      description: 'Dedicated to verified non-profits, educational institutions, or community groups to support philanthropic and civic initiatives.'
    },
    {
      title: 'Buying and Selling',
      icon: DollarSign,
      color: 'text-blue-700 bg-blue-50',
      description: 'Higher-value circular equipment or materials priced fairly. Payment terms are arranged directly between buyer and seller.'
    },
    {
      title: 'Material Exchanges',
      icon: Repeat,
      color: 'text-purple-700 bg-purple-50',
      description: 'Barter or trade materials with another maker or workshop (e.g. trading hardwood offcuts for ceramic glazes or compost bins).'
    },
    {
      title: 'Renting & Lending',
      icon: Clock,
      color: 'text-amber-700 bg-amber-50',
      description: 'Temporary loans of specialized equipment, lawn aerators, sewing machines, or tools for short-term community projects.'
    },
    {
      title: 'Repairs & Clinics',
      icon: Wrench,
      color: 'text-orange-700 bg-orange-50',
      description: 'Connecting broken or salvage-grade appliances with tinkerers and repair clinics to restore items to active service.'
    },
    {
      title: 'Recycling & Recovery',
      icon: Recycle,
      color: 'text-forest-700 bg-forest-50',
      description: 'Material collection specifically aimed at depollution, scrap smelting, pulp recycling, or aerobic soil composting.'
    }
  ];

  return (
    <div className="min-h-screen bg-offwhite py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            How ReLoop Works
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
            A transparent guide to listing surplus, finding materials, rule-based algorithmic matching, and organizing direct pickup.
          </p>
        </div>

        {/* The 4 Core Workflows */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
              <ListPlus className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">Step 1</span>
              <h2 className="text-xl font-bold text-charcoal-900">Publishing Listings & Needs</h2>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                <strong>Have something to offer?</strong> List it with clear photos, description, condition, available quantities, and pickup location. You control location privacy: approximate area publicly, or exact details upon approved request.
              </p>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                <strong>Looking for something?</strong> Use "Publish a Need" to declare the materials, acceptable conditions, deadlines, and budget you require.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">Step 2</span>
              <h2 className="text-xl font-bold text-charcoal-900">Rule-Based Matching Engine</h2>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Our automated algorithm analyzes your needs against the live resource pool. It scores compatibility based on:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-700 pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-forest-600" /> Exact Category compatibility</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-forest-600" /> Material & Title keyword correlation</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-forest-600" /> Acceptable condition parameters</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-forest-600" /> Quantity (full or partial match)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-forest-600" /> Proximity & geographic location</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-forest-600" /> Target budget or free listing</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">Step 3</span>
              <h2 className="text-xl font-bold text-charcoal-900">Direct Communication & Requests</h2>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                ReLoop provides private in-app messaging. When you find a resource, submit a formal request for your needed quantity. The owner reviews your intended use and accepts or declines. Once accepted, available inventory is reserved automatically to prevent double-booking.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">Step 4</span>
              <h2 className="text-xl font-bold text-charcoal-900">Independent Collection</h2>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Click "View on Google Maps" on the listing to find the collection spot or navigate directly. Inspect the items in person to verify quality and safety. Once loaded, either party marks the exchange as completed on ReLoop to record community waste diversion.
              </p>
            </div>
          </div>
        </div>

        {/* SEPARATE EXPLANATIONS FOR ALL LISTING TYPES */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-charcoal-100 shadow-xs space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-1">
              Transaction Models
            </h2>
            <h3 className="text-2xl font-extrabold text-charcoal-900">
              Understanding Every Listing Type
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listingExplanations.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-offwhite border border-charcoal-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <strong className="text-charcoal-900 text-sm">{item.title}</strong>
                  </div>
                  <p className="text-xs text-charcoal-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md"
          >
            <span>Join ReLoop to Start Sharing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

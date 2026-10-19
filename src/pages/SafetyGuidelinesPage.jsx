import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Lock,
  Eye,
  Flag,
  Apple,
  Cpu,
  Flame
} from 'lucide-react';

export function SafetyGuidelinesPage() {
  return (
    <div className="min-h-screen bg-offwhite py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            <span>Community Trust & Integrity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Safety & Resource Guidelines
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed max-w-2xl mx-auto">
            ReLoop is built on trust, transparency, and environmental stewardship. Please follow these core principles to ensure every exchange is safe and respectful.
          </p>
        </div>

        {/* Absolute Red Lines */}
        <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Ban className="w-7 h-7 text-rose-600 shrink-0" />
            <h2 className="text-xl font-bold text-rose-950">
              Strictly Prohibited Items & Safety Violations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-rose-900">
            <div className="bg-white/80 p-4 rounded-2xl border border-rose-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-950">
                <Apple className="w-4 h-4 text-rose-600" />
                <span>Zero Spoiled or Unsafe Food</span>
              </div>
              <p className="leading-relaxed">
                Expired, moldy, thawed perishable meats, opened dairy, or prepared foods with unknown temperature history must <strong>NEVER</strong> be offered for human consumption.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-rose-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-950">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>Hazardous Chemicals & Asbestos</span>
              </div>
              <p className="leading-relaxed">
                Pesticides, open industrial solvents, creosote-treated railroad ties, mercury switches, unlabelled chemicals, and asbestos tiles are strictly forbidden.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-rose-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-950">
                <Cpu className="w-4 h-4 text-rose-600" />
                <span>Damaged Batteries & Certified E-Waste</span>
              </div>
              <p className="leading-relaxed">
                Swollen or punctured lithium batteries must not be exchanged curbside. Irreparable hazardous e-waste must be taken directly to certified municipal WEEE depollution centers.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-rose-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-950">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>Stolen or Counterfeit Goods</span>
              </div>
              <p className="leading-relaxed">
                Listing property you do not own or possess lawful authority to share, sell, or donate violates our terms and will be reported to appropriate authorities.
              </p>
            </div>
          </div>
        </div>

        {/* Guidelines for Safe Listings & In-Person Verification */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-charcoal-900">
            Rules for Accurate Listings & Direct Collection
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-charcoal-700">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-900 block mb-0.5">Accurate Descriptions and Photos:</strong>
                <p className="text-charcoal-600 leading-relaxed">
                  Always use recent, genuine photographs of the actual items. Clearly state any defects, missing hardware, structural flaws, or required tools for loading.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-900 block mb-0.5">On-Site Inspection Before Handover:</strong>
                <p className="text-charcoal-600 leading-relaxed">
                  Both parties must verify item specifications directly before loading. You are never obligated to accept an item if it differs significantly from its description.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-900 block mb-0.5">Location Privacy Controls:</strong>
                <p className="text-charcoal-600 leading-relaxed">
                  Never publish your private apartment number or private home gate codes in public listing descriptions. Use ReLoop's built-in "Approximate Area" or "Private upon Request" settings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-900 block mb-0.5">Safe Pickup Practices:</strong>
                <p className="text-charcoal-600 leading-relaxed">
                  We recommend meeting during daylight hours, having a friend assist with heavy loads (e.g. timber, appliances), and using secure tie-down straps for vehicular transport.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reporting Suspicious Activity */}
        <div className="bg-charcoal-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Flag className="w-6 h-6 text-amber-400 shrink-0" />
            <h2 className="text-lg font-bold">Reporting Suspicious or Dangerous Listings</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-300 leading-relaxed">
            Every resource page includes a "Report" button. If you suspect fraud, prohibited toxic waste, food safety risks, or harassment, submit a report immediately. Our administration team inspects reports and takes decisive moderation action.
          </p>
        </div>
      </div>
    </div>
  );
}

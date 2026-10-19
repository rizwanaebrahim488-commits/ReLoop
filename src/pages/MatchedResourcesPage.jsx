import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  MapPin,
  ExternalLink,
  Info,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getUserNeeds } from '../services/needsService';
import { getResources } from '../services/resourceService';
import { findRankedMatchesForNeed } from '../utils/matchingEngine';
import { Badge } from '../components/Badge';
import { GoogleMapsButton } from '../components/GoogleMapsButton';

export function MatchedResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [userNeeds, setUserNeeds] = useState([]);
  const [selectedNeedId, setSelectedNeedId] = useState(searchParams.get('needId') || '');
  const [allResources, setAllResources] = useState([]);
  const [rankedMatches, setRankedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function loadNeedsAndResources() {
      setLoading(true);
      try {
        const [needs, resources] = await Promise.all([
          getUserNeeds(user.id),
          getResources({ status: 'active' })
        ]);

        setUserNeeds(needs);
        setAllResources(resources);

        // If needId in query param matches, set it, else default to first active need
        const targetId = searchParams.get('needId') || needs[0]?.id;
        if (targetId) setSelectedNeedId(targetId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadNeedsAndResources();
  }, [user?.id, searchParams]);

  useEffect(() => {
    if (selectedNeedId && userNeeds.length > 0 && allResources.length > 0) {
      const activeNeed = userNeeds.find(n => n.id === selectedNeedId);
      if (activeNeed) {
        const matches = findRankedMatchesForNeed(activeNeed, allResources);
        setRankedMatches(matches);
      } else {
        setRankedMatches([]);
      }
    }
  }, [selectedNeedId, userNeeds, allResources]);

  const activeNeed = userNeeds.find(n => n.id === selectedNeedId);

  return (
    <DashboardLayout
      title="Rule-Based Resource Matching"
      subtitle="Resources evaluated by algorithm against your published needs with compatibility rankings."
    >
      <div className="space-y-8">
        {/* Need Selector Bar */}
        {userNeeds.length > 0 ? (
          <div className="bg-white rounded-2xl p-5 border border-charcoal-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-1">
                Select One of Your Published Needs
              </label>
              <select
                value={selectedNeedId}
                onChange={(e) => {
                  setSelectedNeedId(e.target.value);
                  setSearchParams({ needId: e.target.value });
                }}
                className="bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-charcoal-900 focus:ring-2 focus:ring-forest-500"
              >
                {userNeeds.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.title} ({n.quantity_required} {n.unit})
                  </option>
                ))}
              </select>
            </div>

            {activeNeed && (
              <div className="text-xs text-charcoal-500 bg-charcoal-50 p-3 rounded-xl border border-charcoal-200">
                <span className="font-semibold text-charcoal-800">Criteria:</span> Category: {activeNeed.category} • Budget: {activeNeed.budget > 0 ? `$${activeNeed.budget}` : 'Free'}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-charcoal-100 space-y-3">
            <Sparkles className="w-12 h-12 text-forest-600 mx-auto" />
            <h3 className="font-bold text-base text-charcoal-900">No Published Needs Yet</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              Publish a need declaring the timber, fabric, or equipment you require to view algorithmic recommendations.
            </p>
            <Link
              to="/needs/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-700 text-white text-xs font-semibold"
            >
              Publish a Need
            </Link>
          </div>
        )}

        {/* Disclaimer Banner */}
        <div className="bg-forest-50 border border-forest-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-forest-900">
          <Info className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Algorithmic Recommendation Notice:</strong> Match rankings are generated from rule-based comparison of category, keywords, quantity, condition, and location. Scores are recommendations to facilitate discovery — please independently verify specifications directly with the resource owner.
          </p>
        </div>

        {/* Ranked Matches List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-400">
            Evaluating database compatibility...
          </div>
        ) : rankedMatches.length > 0 ? (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Found {rankedMatches.length} Compatible Resources for "{activeNeed?.title}"
            </div>

            <div className="grid grid-cols-1 gap-6">
              {rankedMatches.map(({ resource, score, reasons, matchLevel }) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-charcoal-100 shadow-xs hover:shadow-md transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  {/* Left: Resource preview */}
                  <div className="flex items-start space-x-4 overflow-hidden flex-1">
                    <img
                      src={resource.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80'}
                      alt={resource.title}
                      className="w-24 h-24 rounded-2xl object-cover ring-1 ring-charcoal-100 shrink-0"
                    />

                    <div className="space-y-2 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <Badge variant={score >= 75 ? 'success' : score >= 55 ? 'primary' : 'warning'}>
                          {score}% {matchLevel} Match
                        </Badge>
                        <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wider">
                          {resource.category}
                        </span>
                      </div>

                      <Link
                        to={`/resources/${resource.id}`}
                        className="font-bold text-base text-charcoal-900 hover:text-forest-700 transition block truncate"
                      >
                        {resource.title}
                      </Link>

                      <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                        {resource.description}
                      </p>

                      {/* Explanation Reasons Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {reasons.map((reason, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] bg-charcoal-50 text-charcoal-700 px-2 py-0.5 rounded-md border border-charcoal-200"
                          >
                            <CheckCircle2 className="w-3 h-3 text-forest-600 shrink-0" />
                            <span>{reason}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-48 pt-4 lg:pt-0 border-t lg:border-t-0 border-charcoal-100">
                    <div className="text-left lg:text-right mb-1">
                      <span className="text-xs text-charcoal-400 block">Listing Value</span>
                      <span className="text-lg font-extrabold text-charcoal-900">
                        {resource.price > 0 ? `$${resource.price}` : <span className="text-forest-700">FREE</span>}
                      </span>
                    </div>

                    <Link
                      to={`/resources/${resource.id}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition shadow-xs"
                    >
                      <span>View Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <GoogleMapsButton location={resource} size="sm" className="w-full justify-center" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeNeed ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 space-y-3">
            <Package className="w-12 h-12 text-charcoal-300 mx-auto" />
            <h3 className="font-bold text-base text-charcoal-900">No Direct Matches Right Now</h3>
            <p className="text-xs text-charcoal-500 max-w-md mx-auto leading-relaxed">
              We did not find any active listings strictly matching your criteria for "{activeNeed.title}". Our rule-based engine runs continuously as new resources are published!
            </p>
            <Link
              to="/resources"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-forest-700 text-white font-semibold text-xs"
            >
              Browse All Available Resources
            </Link>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}

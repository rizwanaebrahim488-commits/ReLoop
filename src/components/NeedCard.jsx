import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Calendar, User, Sparkles, MapPin } from 'lucide-react';
import { Badge } from './Badge';

export function NeedCard({ need, showMatchButton = true }) {
  const profile = need.profiles || {};

  return (
    <div className="bg-white rounded-2xl border border-charcoal-100/90 shadow-xs hover:shadow-lg hover:border-forest-200 transition-all p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="purple" className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            Need Published
          </Badge>
          <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
            {need.category}
          </span>
        </div>

        <h3 className="font-bold text-base text-charcoal-900 mb-2 leading-snug">
          {need.title}
        </h3>

        <p className="text-sm text-charcoal-600 line-clamp-2 mb-4 leading-relaxed">
          {need.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs bg-charcoal-50 p-3 rounded-xl mb-4">
          <div>
            <span className="text-charcoal-400 block">Quantity Needed:</span>
            <span className="font-semibold text-charcoal-800">
              {need.quantity_required} {need.unit}
            </span>
          </div>
          <div>
            <span className="text-charcoal-400 block">Target Budget:</span>
            <span className="font-semibold text-forest-700">
              {need.budget > 0 ? `$${need.budget}` : 'Free / Donation'}
            </span>
          </div>
        </div>

        {need.acceptable_condition?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs text-charcoal-400 self-center mr-1">Condition:</span>
            {need.acceptable_condition.map(c => (
              <span key={c} className="text-[11px] bg-charcoal-100 text-charcoal-700 px-2 py-0.5 rounded-md capitalize">
                {c.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-charcoal-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-charcoal-500">
          <div className="flex items-center gap-1 truncate max-w-[150px]">
            <User className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
            <span className="truncate">{profile.full_name || 'Community Member'}</span>
          </div>
          {need.preferred_location && (
            <div className="flex items-center gap-1 text-charcoal-400 truncate max-w-[130px]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{need.preferred_location}</span>
            </div>
          )}
        </div>

        {showMatchButton && (
          <Link
            to={`/matches?needId=${need.id}`}
            className="mt-1 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-forest-50 text-forest-700 hover:bg-forest-100 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            Find Matched Resources
          </Link>
        )}
      </div>
    </div>
  );
}

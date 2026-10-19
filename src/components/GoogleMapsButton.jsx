import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { getGoogleMapsUrl } from '../utils/maps';

export function GoogleMapsButton({ location, label = 'View on Google Maps', className = '', size = 'md' }) {
  const url = getGoogleMapsUrl(location);

  if (!url) {
    return (
      <span className="inline-flex items-center text-xs text-charcoal-400">
        <MapPin className="w-3.5 h-3.5 mr-1" />
        Location upon contact
      </span>
    );
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-xs' 
    : 'px-3.5 py-1.5 text-xs sm:text-sm font-medium';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center rounded-lg bg-fresh-50 text-fresh-700 hover:bg-fresh-100 hover:text-fresh-800 transition-colors border border-fresh-200/60 shadow-xs focus:outline-none focus:ring-2 focus:ring-fresh-400 focus:ring-offset-1 ${sizeClasses} ${className}`}
      title="Open location on Google Maps in a new tab"
    >
      <MapPin className="w-3.5 h-3.5 mr-1.5 text-fresh-600 shrink-0" />
      <span>{label}</span>
      <ExternalLink className="w-3 h-3 ml-1.5 opacity-70 shrink-0" />
    </a>
  );
}

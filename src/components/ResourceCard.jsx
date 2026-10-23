import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';
import { GoogleMapsButton } from './GoogleMapsButton';
import { formatPublicLocation } from '../utils/maps';
import { toggleFavorite } from '../services/favoritesService';
import { useAuth } from '../context/AuthContext';

export function ResourceCard({ resource, isFavoriteInit = false, onFavoriteChange }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isFavoriteInit);
  const [favLoading, setFavLoading] = useState(false);

  const images = resource.images || [];
  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80';
  const displayLocation = formatPublicLocation(resource, false);

  const listingTypeVariants = {
    giveaway: 'success',
    donation: 'primary',
    sale: 'info',
    exchange: 'purple',
    rent_lend: 'warning',
    recovery: 'default'
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in or register to save items to your favorites.');
      return;
    }
    setFavLoading(true);
    try {
      const res = await toggleFavorite(user.id, resource.id);
      setIsFavorite(res.isFavorite);
      if (onFavoriteChange) onFavoriteChange(resource.id, res.isFavorite);
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-charcoal-100/80 shadow-xs hover:shadow-xl hover:border-forest-200 transition-all duration-200 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-charcoal-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={resource.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant={listingTypeVariants[resource.listing_type] || 'primary'}>
            {resource.listing_type === 'giveaway'
              ? 'Free Giveaway'
              : (resource.listing_type ? resource.listing_type.replace('_', ' / ') : 'Available')}
          </Badge>
          <Badge variant="default" className="bg-white/90 backdrop-blur-xs text-charcoal-800">
            {resource.condition ? resource.condition.replace('_', ' ') : 'Good condition'}
          </Badge>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={favLoading}
          aria-label={isFavorite ? "Remove from saved resources" : "Save resource"}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-charcoal-600 hover:text-rose-600 shadow-md transition transform active:scale-95"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Available Quantity Overlay */}
        <div className="absolute bottom-2 left-3 bg-charcoal-900/75 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium">
          {resource.available_quantity ?? resource.quantity} {resource.unit || 'units'} available
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="text-xs font-semibold text-forest-600 uppercase tracking-wider mb-1">
          {resource.category}
        </div>

        <Link to={`/resources/${resource.id}`} className="group-hover:text-forest-700 transition">
          <h3 className="font-bold text-base text-charcoal-900 line-clamp-1 mb-2">
            {resource.title}
          </h3>
        </Link>

        <p className="text-sm text-charcoal-600 line-clamp-2 mb-4 leading-relaxed">
          {resource.description}
        </p>

        {/* Seller Info & Location */}
        <div className="mt-auto pt-3 border-t border-charcoal-100 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-charcoal-500">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-charcoal-800 truncate max-w-[140px]">
                {resource.profiles?.full_name || 'Community Member'}
              </span>
              {resource.profiles?.is_verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600 shrink-0" title="Verified Member/Org" />
              )}
            </div>

            <span className="font-bold text-sm text-charcoal-900">
              {resource.listing_type === 'giveaway' || resource.listing_type === 'donation' || resource.price === 0
                ? <span className="text-forest-700 font-extrabold">FREE</span>
                : `$${resource.price}`}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-charcoal-500 truncate" title={displayLocation}>
              📍 {displayLocation}
            </span>
            <GoogleMapsButton location={resource} size="sm" label="Maps" />
          </div>
        </div>
      </div>
    </div>
  );
}

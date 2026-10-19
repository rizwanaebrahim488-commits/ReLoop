import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Package, ArrowRight, ExternalLink } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getUserFavorites, toggleFavorite } from '../services/favoritesService';
import { Badge } from '../components/Badge';
import { GoogleMapsButton } from '../components/GoogleMapsButton';

export function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadFavorites();
  }, [user?.id]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await getUserFavorites(user.id);
      setFavorites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (resourceId) => {
    try {
      await toggleFavorite(user.id, resourceId);
      setFavorites(prev => prev.filter(f => f.resource?.id !== resourceId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      title="Saved Resources"
      subtitle="Track resources you have bookmarked for your projects or workshops."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-400">
            Loading saved resources...
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(({ id, resource }) => {
              if (!resource) return null;
              const isAvailable = resource.status === 'active' && (resource.available_quantity ?? resource.quantity) > 0;

              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl border border-charcoal-100 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 w-full bg-charcoal-100">
                      <img
                        src={resource.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80'}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveFavorite(resource.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-rose-50 shadow-sm transition"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-2 left-3">
                        <Badge variant={isAvailable ? 'success' : 'default'} className="bg-white/95">
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wider block">
                        {resource.category}
                      </span>
                      <Link
                        to={`/resources/${resource.id}`}
                        className="font-bold text-base text-charcoal-900 hover:text-forest-700 transition block truncate"
                      >
                        {resource.title}
                      </Link>
                      <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-charcoal-100 mt-4 flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-charcoal-900">
                      {resource.price > 0 ? `$${resource.price}` : <span className="text-forest-700">FREE</span>}
                    </span>

                    <div className="flex items-center gap-2">
                      <GoogleMapsButton location={resource} size="sm" label="Map" />
                      <Link
                        to={`/resources/${resource.id}`}
                        className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-forest-700 text-white font-semibold text-xs hover:bg-forest-800 transition"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 space-y-3">
            <Heart className="w-12 h-12 text-charcoal-300 mx-auto" />
            <h3 className="font-bold text-base text-charcoal-900">No Saved Resources Yet</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              Click the heart icon on any resource card in the marketplace to save items for future reference.
            </p>
            <Link
              to="/resources"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-forest-700 text-white font-semibold text-xs"
            >
              Browse Resources
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

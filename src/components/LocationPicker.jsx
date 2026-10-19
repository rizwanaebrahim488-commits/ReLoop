import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Search,
  Crosshair,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Navigation,
  X,
  ChevronDown,
  ChevronUp,
  Building,
  Compass
} from 'lucide-react';
import { getGoogleMapsUrl } from '../utils/maps';

// Popular reference cities for instant 1-click selection (OLX style)
const POPULAR_LOCATIONS = [
  { name: 'Bengaluru', subtitle: 'Karnataka, India', lat: 12.9716, lng: 77.5946, city: 'Bengaluru' },
  { name: 'Mumbai', subtitle: 'Maharashtra, India', lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
  { name: 'Delhi NCR', subtitle: 'Delhi, India', lat: 28.6139, lng: 77.2090, city: 'Delhi' },
  { name: 'Hyderabad', subtitle: 'Telangana, India', lat: 17.3850, lng: 78.4867, city: 'Hyderabad' },
  { name: 'Chennai', subtitle: 'Tamil Nadu, India', lat: 13.0827, lng: 80.2707, city: 'Chennai' },
  { name: 'New York', subtitle: 'New York, USA', lat: 40.7128, lng: -74.0060, city: 'New York' },
  { name: 'Seattle', subtitle: 'Washington, USA', lat: 47.6062, lng: -122.3321, city: 'Seattle' },
  { name: 'Portland', subtitle: 'Oregon, USA', lat: 45.5152, lng: -122.6658, city: 'Portland' }
];

export function LocationPicker({
  initialLocation = '',
  initialLat = 12.9716,
  initialLng = 77.5946,
  onLocationSelect,
  label = "Select Place / Location"
}) {
  const [query, setQuery] = useState(initialLocation || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [selectedPlace, setSelectedPlace] = useState({
    name: initialLocation ? initialLocation.split(',')[0] : '',
    fullAddress: initialLocation || '',
    lat: initialLat || 12.9716,
    lng: initialLng || 77.5946,
    city: '',
    state: '',
    country: ''
  });

  const dropdownRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real-time place suggestions (Photon + Nominatim fallback, like OLX & Google Places)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        // Query Photon Komoot (real-time OpenStreetMap global place index)
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query.trim())}&limit=8`,
          { signal: controller.signal }
        );
        const data = await res.json();

        if (data && data.features && data.features.length > 0) {
          const formatted = data.features.map(f => {
            const p = f.properties || {};
            const coords = f.geometry?.coordinates || [0, 0];
            const primaryName = p.name || p.street || p.city || 'Location';
            
            // Build rich subtitle: [neighborhood/locality, city, state, country]
            const parts = [
              p.locality || p.district || p.suburb,
              p.city,
              p.state,
              p.country
            ].filter(Boolean);

            const subtitle = parts.filter(item => item !== primaryName).join(', ');

            return {
              id: `${p.osm_id || Math.random()}`,
              primaryName,
              subtitle: subtitle || p.country || '',
              fullAddress: subtitle ? `${primaryName}, ${subtitle}` : primaryName,
              lat: coords[1],
              lng: coords[0],
              city: p.city || p.locality || primaryName,
              state: p.state || '',
              country: p.country || '',
              type: p.type || p.osm_value || 'place'
            };
          });

          setSuggestions(formatted);
          setIsOpen(true);
        } else {
          // Fallback to Nominatim
          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=5&addressdetails=1`,
            { signal: controller.signal }
          );
          const nomData = await nomRes.json();
          if (nomData && nomData.length > 0) {
            const nomFormatted = nomData.map(item => {
              const addr = item.address || {};
              const firstPart = item.display_name.split(',')[0];
              const rest = item.display_name.split(',').slice(1).join(',').trim();
              return {
                id: item.place_id,
                primaryName: firstPart,
                subtitle: rest,
                fullAddress: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                city: addr.city || addr.town || addr.village || firstPart,
                state: addr.state || '',
                country: addr.country || '',
                type: item.type || 'place'
              };
            });
            setSuggestions(nomFormatted);
            setIsOpen(true);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Place search fallback:', err);
        }
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Handle place selection
  const handleSelectPlace = (place) => {
    setSelectedPlace({
      name: place.primaryName,
      fullAddress: place.fullAddress,
      lat: place.lat,
      lng: place.lng,
      city: place.city,
      state: place.state,
      country: place.country
    });

    setQuery(place.fullAddress);
    setSuggestions([]);
    setIsOpen(false);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([place.lat, place.lng], 15);
      markerRef.current.setLatLng([place.lat, place.lng]);
    }

    if (onLocationSelect) {
      onLocationSelect({
        address: place.fullAddress,
        city: place.city || place.primaryName,
        lat: place.lat,
        lng: place.lng,
        state: place.state,
        country: place.country
      });
    }
  };

  // Device Geolocation (Locate Me)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.display_name) {
            const addr = data.address || {};
            const first = data.display_name.split(',')[0];
            const rest = data.display_name.split(',').slice(1).join(',').trim();
            handleSelectPlace({
              primaryName: first,
              subtitle: rest,
              fullAddress: data.display_name,
              lat,
              lng,
              city: addr.city || addr.town || addr.suburb || first,
              state: addr.state || '',
              country: addr.country || ''
            });
          }
        } catch (e) {
          handleSelectPlace({
            primaryName: 'Current Location',
            subtitle: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            fullAddress: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            lat,
            lng,
            city: 'My Location',
            state: '',
            country: ''
          });
        } finally {
          setGeolocating(false);
        }
      },
      () => {
        setGeolocating(false);
        alert('Could not access your location. Please type your place name.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Initialize interactive map when toggled
  useEffect(() => {
    if (!showMap || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedPlace.lat, selectedPlace.lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background-color: #1b4332; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
            <div style="width: 10px; height: 10px; background-color: #52b788; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([selectedPlace.lat, selectedPlace.lng], {
        icon: customIcon,
        draggable: true
      }).addTo(map);

      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.display_name) {
            const addr = data.address || {};
            handleSelectPlace({
              primaryName: data.display_name.split(',')[0],
              subtitle: data.display_name.split(',').slice(1).join(',').trim(),
              fullAddress: data.display_name,
              lat: pos.lat,
              lng: pos.lng,
              city: addr.city || addr.town || addr.suburb || '',
              state: addr.state || '',
              country: addr.country || ''
            });
          }
        } catch (e) {
          // fallback
        }
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([selectedPlace.lat, selectedPlace.lng], 14);
      if (markerRef.current) {
        markerRef.current.setLatLng([selectedPlace.lat, selectedPlace.lng]);
      }
    }
  }, [showMap, selectedPlace.lat, selectedPlace.lng]);

  const googleMapsUrl = getGoogleMapsUrl({
    lat: selectedPlace.lat,
    lng: selectedPlace.lng,
    location_name: selectedPlace.fullAddress
  });

  return (
    <div className="space-y-3" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
          {label} *
        </label>
        <span className="text-[11px] text-forest-700 font-medium">
          OLX-Style Real Places Auto-Suggestion
        </span>
      </div>

      {/* Main Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <MapPin className="w-4 h-4 text-forest-600 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Type a location (e.g. Indiranagar, Whitefield, Brooklyn, Bandra, Seattle)..."
            className="w-full pl-10 pr-20 py-3 rounded-2xl border-2 border-charcoal-200 focus:border-forest-600 bg-white text-xs sm:text-sm font-medium text-charcoal-900 placeholder-charcoal-400 focus:outline-none shadow-xs transition"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {searching ? (
              <Loader2 className="w-4 h-4 text-forest-600 animate-spin" />
            ) : query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setIsOpen(true);
                }}
                className="p-1 rounded-full text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Real Places Dropdown (OLX Style) */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-charcoal-200 z-50 overflow-hidden divide-y divide-charcoal-100 max-h-80 overflow-y-auto animate-in fade-in duration-150">
            {/* Action 1: Use Current Location (GPS) */}
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={geolocating}
              className="w-full p-3.5 text-left hover:bg-forest-50/80 transition flex items-center gap-3 bg-forest-50/30 text-forest-800"
            >
              <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center shrink-0">
                {geolocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-forest-700" />
                ) : (
                  <Navigation className="w-4 h-4 text-forest-700" />
                )}
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-forest-900 block">
                  {geolocating ? 'Detecting your GPS position...' : 'Use Current Location'}
                </span>
                <span className="text-[11px] text-forest-700">
                  Detect precise area via browser GPS
                </span>
              </div>
            </button>

            {/* Dynamic Suggestions List */}
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPlace(item)}
                  className="w-full p-3.5 text-left hover:bg-forest-50 transition flex items-start space-x-3 text-xs group"
                >
                  <div className="w-7 h-7 rounded-xl bg-charcoal-100 text-charcoal-600 flex items-center justify-center shrink-0 group-hover:bg-forest-100 group-hover:text-forest-700 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs sm:text-sm text-charcoal-900 group-hover:text-forest-800 truncate">
                        {item.primaryName}
                      </span>
                      {item.type && (
                        <span className="text-[10px] uppercase font-bold text-charcoal-400 px-1.5 py-0.5 rounded bg-charcoal-50 capitalize">
                          {item.type.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <span className="text-[11px] text-charcoal-500 block truncate mt-0.5">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : query.length >= 2 && !searching ? (
              <div className="p-4 text-center text-xs text-charcoal-500">
                No matching places found for "{query}". Try typing city or district name.
              </div>
            ) : null}

            {/* Popular Places / Quick Suggestions (Shown when query is empty or short) */}
            {query.length < 2 && (
              <div className="p-3 bg-offwhite/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block px-2 mb-2">
                  Popular Hubs & Cities
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {POPULAR_LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPlace({
                        primaryName: loc.name,
                        subtitle: loc.subtitle,
                        fullAddress: `${loc.name}, ${loc.subtitle}`,
                        lat: loc.lat,
                        lng: loc.lng,
                        city: loc.city,
                        state: loc.subtitle.split(',')[0],
                        country: loc.subtitle.split(',')[1]?.trim() || ''
                      })}
                      className="p-2 rounded-xl text-left hover:bg-white hover:border-forest-200 border border-transparent transition text-xs font-semibold text-charcoal-800 flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                      <div className="truncate">
                        <span className="block truncate leading-tight">{loc.name}</span>
                        <span className="text-[10px] text-charcoal-400 block truncate">{loc.subtitle}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Verified Place Banner (OLX-style confirmation) */}
      {selectedPlace.fullAddress && (
        <div className="bg-forest-50/70 border border-forest-200/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 overflow-hidden">
            <div className="flex items-center gap-1.5 text-forest-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
              <span className="truncate">Verified Location: {selectedPlace.name || selectedPlace.fullAddress}</span>
            </div>
            <p className="text-[11px] text-forest-700 truncate max-w-lg">
              {selectedPlace.fullAddress}
            </p>
            <p className="text-[10px] text-charcoal-400 font-mono">
              Coordinates: {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-forest-800 hover:bg-forest-100 border border-forest-200 text-xs font-semibold shadow-xs transition"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3 text-forest-600" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forest-700 text-white hover:bg-forest-800 text-xs font-semibold shadow-xs transition"
            >
              <span>{showMap ? 'Hide Map' : 'Show Map Pin'}</span>
              {showMap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Optional Expandable Map Pin View */}
      {showMap && (
        <div className="relative rounded-2xl overflow-hidden border border-charcoal-200 shadow-sm animate-in fade-in duration-200">
          <div ref={mapContainerRef} className="w-full h-56" style={{ minHeight: '220px' }} />
          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-charcoal-700 border border-charcoal-200 pointer-events-none flex items-center gap-1">
            <Compass className="w-3 h-3 text-forest-600" />
            <span>Drag the pin to fine-tune exact gate or door collection spot</span>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { getGoogleMapsUrl, getGoogleMapsDirectionsUrl } from '../utils/maps';

export function ResourceLocationMap({
  lat = 45.5152,
  lng = -122.6658,
  title = "Collection Location",
  locationName = "",
  city = "",
  height = "200px"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Pin
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background-color: #1b4332; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
            <div style="width: 8px; height: 8px; background-color: #52b788; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 14);
    }
  }, [lat, lng]);

  const mapsUrl = getGoogleMapsUrl({ lat, lng, location_name: locationName || city });
  const directionsUrl = getGoogleMapsDirectionsUrl({ lat, lng, location_name: locationName || city });

  return (
    <div className="space-y-3">
      {/* Map Preview */}
      <div className="relative rounded-2xl overflow-hidden border border-charcoal-200/80 shadow-xs">
        <div ref={mapContainerRef} style={{ height, width: '100%' }} />

        {/* Floating coordinates badge */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium text-charcoal-700 shadow-xs border border-charcoal-200/60">
          📍 {lat.toFixed(4)}, {lng.toFixed(4)}
        </div>
      </div>

      {/* Action Links */}
      <div className="grid grid-cols-2 gap-2">
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200/60 text-xs font-semibold transition"
          >
            <MapPin className="w-3.5 h-3.5 text-forest-600" />
            <span>Open in Google Maps</span>
          </a>
        )}

        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-charcoal-50 hover:bg-charcoal-100 text-charcoal-800 border border-charcoal-200 text-xs font-semibold transition"
          >
            <Navigation className="w-3.5 h-3.5 text-charcoal-600" />
            <span>Get Directions</span>
          </a>
        )}
      </div>
    </div>
  );
}

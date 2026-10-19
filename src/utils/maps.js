// Google Maps & Location Privacy Utilities for ReLoop

/**
 * Generate a free, reliable Google Maps search URL from address or coordinates.
 * No paid Google Maps API key required.
 */
export function getGoogleMapsUrl(location) {
  if (!location) return null;

  // If coordinates are provided
  if (typeof location.lat === 'number' && typeof location.lng === 'number' && location.lat !== 0 && location.lng !== 0) {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  }

  // If string query / address is provided
  const queryStr = typeof location === 'string' ? location : (location.address || location.city || location.location_name);
  if (!queryStr) return null;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr.trim())}`;
}

/**
 * Generate a Google Maps directions URL
 */
export function getGoogleMapsDirectionsUrl(destination) {
  if (!destination) return null;

  if (typeof destination.lat === 'number' && typeof destination.lng === 'number') {
    return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
  }

  const queryStr = typeof destination === 'string' ? destination : (destination.address || destination.city || destination.location_name);
  if (!queryStr) return null;

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(queryStr.trim())}`;
}

/**
 * Calculate distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Privacy display formatter:
 * Never exposes full private pickup addresses to unauthenticated or unconfirmed public viewers
 */
export function formatPublicLocation(resource, isAuthorizedParticipant = false) {
  if (!resource) return 'Location specified on request';

  const privacy = resource.location_privacy || 'approximate';

  if (privacy === 'private_on_request' && !isAuthorizedParticipant) {
    return resource.city ? `${resource.city} (Exact address shared upon confirmed request)` : 'Pickup details shared upon confirmed request';
  }

  if (privacy === 'city_only') {
    return resource.city || 'City-wide collection';
  }

  // Approximate or participant viewing
  if (isAuthorizedParticipant && resource.pickup_instructions) {
    return `${resource.location_name || resource.city} — ${resource.pickup_instructions}`;
  }

  return resource.location_name || resource.city || 'General local area';
}

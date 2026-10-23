import { supabase, isConfigured } from '../lib/supabase';
import { getStoreData, setStoreData, STORAGE_KEYS } from './localStore';
import { calculateDistanceKm } from '../utils/maps';
import { matchesCategory } from '../utils/categories';
import { sanitizeText, sanitizeUrl, checkRateLimit } from '../utils/security';

export async function getResources(filters = {}) {
  const {
    category,
    search,
    listingType,
    condition,
    quantityType = 'all',
    locationQuery = '',
    sort = 'newest',
    userLat,
    userLng,
    status = 'active'
  } = filters;

  if (isConfigured) {
    try {
      let query = supabase
        .from('resources')
        .select(`
          *,
          profiles:user_id (id, full_name, avatar_url, account_type, is_verified, city),
          resource_images (id, image_url, is_primary)
        `);

      if (status) {
        query = query.eq('status', status);
      }
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (listingType && listingType !== 'all') {
        query = query.eq('listing_type', listingType);
      }
      if (condition && condition !== 'all') {
        query = query.eq('condition', condition);
      }
      if (search && search.trim()) {
        const clean = search.trim();
        query = query.or(`title.ilike.%${clean}%,description.ilike.%${clean}%,location_name.ilike.%${clean}%,category.ilike.%${clean}%,city.ilike.%${clean}%`);
      }
      if (locationQuery && locationQuery !== 'All Locations') {
        const cleanLoc = locationQuery.trim();
        query = query.or(`city.ilike.%${cleanLoc}%,location_name.ilike.%${cleanLoc}%`);
      }

      if (sort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      let { data, error } = await query;
      if (error) {
        // Fallback to simple select without joins if schema relationships aren't created yet
        let fallbackQuery = supabase.from('resources').select('*');
        if (status) fallbackQuery = fallbackQuery.eq('status', status);
        if (category && category !== 'all') fallbackQuery = fallbackQuery.eq('category', category);
        if (listingType && listingType !== 'all') fallbackQuery = fallbackQuery.eq('listing_type', listingType);
        if (condition && condition !== 'all') fallbackQuery = fallbackQuery.eq('condition', condition);

        const simpleQuery = await fallbackQuery;
        if (!simpleQuery.error && simpleQuery.data) {
          data = simpleQuery.data;
          error = null;
        } else {
          throw error;
        }
      }

      // Normalize images with resilient fallback
      let normalized = (data || []).map(item => {
        let imgs = [];
        if (item.resource_images && item.resource_images.length > 0) {
          imgs = item.resource_images.map(i => i.image_url);
        } else if (item.image_url) {
          imgs = [item.image_url];
        } else if (Array.isArray(item.images) && item.images.length > 0) {
          imgs = item.images;
        } else {
          imgs = ['https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80'];
        }
        return {
          ...item,
          listing_type: item.listing_type || 'giveaway',
          condition: item.condition || 'good',
          available_quantity: item.available_quantity ?? item.quantity ?? 1,
          quantity: item.quantity ?? 1,
          images: imgs
        };
      });

      // High-accuracy multi-word fuzzy matching on client side
      if (search && search.trim()) {
        const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
        normalized = normalized.filter(item => {
          const haystack = `${item.title} ${item.description} ${item.category} ${item.city} ${item.location_name}`.toLowerCase();
          return words.every(w => haystack.includes(w));
        });
      }

      if (locationQuery && locationQuery !== 'All Locations') {
        const locLower = locationQuery.toLowerCase().trim();
        normalized = normalized.filter(item => {
          const cityMatch = (item.city || '').toLowerCase().includes(locLower);
          const nameMatch = (item.location_name || '').toLowerCase().includes(locLower);
          return cityMatch || nameMatch;
        });
      }

      return normalized;
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }

  // Fallback to local store
  let items = getStoreData(STORAGE_KEYS.RESOURCES);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);

  // Attach profile
  items = items.map(res => ({
    ...res,
    profiles: profiles.find(p => p.id === res.user_id) || null
  }));

  if (status) {
    items = items.filter(r => r.status === status);
  }
  if (category && category !== 'all') {
    items = items.filter(r => matchesCategory(r.category, category));
  }
  if (listingType && listingType !== 'all') {
    items = items.filter(r => r.listing_type === listingType);
  }
  if (condition && condition !== 'all') {
    items = items.filter(r => r.condition === condition);
  }
  if (quantityType && quantityType !== 'all') {
    if (quantityType === 'single') {
      items = items.filter(r => r.quantity === 1 || r.allow_partial_quantity === false);
    } else if (quantityType === 'bulk') {
      items = items.filter(r => r.quantity > 1);
    }
  }
  if (locationQuery && locationQuery !== 'all' && locationQuery.trim()) {
    const locLower = locationQuery.toLowerCase().trim();
    items = items.filter(r =>
      (r.location_name && r.location_name.toLowerCase().includes(locLower)) ||
      (r.city && r.city.toLowerCase().includes(locLower))
    );
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.location_name && r.location_name.toLowerCase().includes(q)) ||
      (r.city && r.city.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'price_asc') {
    items.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === 'price_desc') {
    items.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sort === 'proximity' && userLat && userLng) {
    items.sort((a, b) => {
      const distA = calculateDistanceKm(userLat, userLng, a.lat, a.lng) ?? 999999;
      const distB = calculateDistanceKm(userLat, userLng, b.lat, b.lng) ?? 999999;
      return distA - distB;
    });
  } else {
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return items;
}

export async function getResourceById(id) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          profiles:user_id (*),
          resource_images (id, image_url, is_primary)
        `)
        .eq('id', id)
        .single();
      if (!error && data) {
        return {
          ...data,
          images: data.resource_images?.map(i => i.image_url) || []
        };
      }
    } catch (e) {
      console.warn('Supabase getResourceById fallback:', e);
    }
  }

  const items = getStoreData(STORAGE_KEYS.RESOURCES);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  const found = items.find(r => r.id === id);
  if (!found) return null;

  return {
    ...found,
    profiles: profiles.find(p => p.id === found.user_id) || null
  };
}

export async function createResource(resourceData, images = []) {
  // Anti-Spam Rate Limit
  const rateLimit = checkRateLimit(`post_resource_${resourceData.user_id || 'anon'}`, { maxAttempts: 10, windowMs: 60000 });
  if (!rateLimit.allowed) {
    throw new Error(`Posting limit reached. Please wait ${rateLimit.retryAfterSec} seconds before creating another resource listing.`);
  }

  // Security Sanitization
  const sanitizedResource = {
    ...resourceData,
    title: sanitizeText(resourceData.title, 200),
    description: sanitizeText(resourceData.description, 4000),
    category: sanitizeText(resourceData.category, 100),
    location_name: sanitizeText(resourceData.location_name, 250),
    city: sanitizeText(resourceData.city, 100),
    pickup_instructions: sanitizeText(resourceData.pickup_instructions, 1000),
    safety_notes: sanitizeText(resourceData.safety_notes, 1000),
    quantity: Math.max(0.01, parseFloat(resourceData.quantity) || 1),
    available_quantity: Math.max(0.01, parseFloat(resourceData.quantity) || 1),
    price: Math.max(0, parseFloat(resourceData.price) || 0)
  };

  const safeImages = images
    .map(url => sanitizeUrl(url))
    .filter(Boolean);

  if (isConfigured) {
    try {
      const { data: resData, error: resError } = await supabase
        .from('resources')
        .insert([sanitizedResource])
        .select()
        .single();
      if (resError) throw resError;

      if (safeImages.length > 0) {
        const imageInserts = safeImages.map((url, idx) => ({
          resource_id: resData.id,
          image_url: url,
          is_primary: idx === 0
        }));
        await supabase.from('resource_images').insert(imageInserts);
      }
      return resData;
    } catch (e) {
      console.warn('Supabase createResource fallback:', e);
    }
  }

  const items = getStoreData(STORAGE_KEYS.RESOURCES);
  const newId = `res-${Date.now()}`;
  const newResource = {
    ...sanitizedResource,
    id: newId,
    status: 'active',
    images: safeImages.length > 0 ? safeImages : ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  items.unshift(newResource);
  setStoreData(STORAGE_KEYS.RESOURCES, items);
  return newResource;
}

export async function updateResource(id, updateData) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase updateResource fallback:', e);
    }
  }

  const items = getStoreData(STORAGE_KEYS.RESOURCES);
  const index = items.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Resource not found');

  const updated = { ...items[index], ...updateData, updated_at: new Date().toISOString() };
  items[index] = updated;
  setStoreData(STORAGE_KEYS.RESOURCES, items);
  return updated;
}

export async function deleteResource(id) {
  if (isConfigured) {
    try {
      await supabase.from('resources').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteResource fallback:', e);
    }
  }

  const items = getStoreData(STORAGE_KEYS.RESOURCES);
  const filtered = items.filter(r => r.id !== id);
  setStoreData(STORAGE_KEYS.RESOURCES, filtered);
  return true;
}

export async function getUserResources(userId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`*, resource_images(image_url)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(item => ({
          ...item,
          images: item.resource_images?.map(i => i.image_url) || []
        }));
      }
    } catch (e) {
      console.warn('Supabase getUserResources fallback:', e);
    }
  }

  const items = getStoreData(STORAGE_KEYS.RESOURCES);
  return items.filter(r => r.user_id === userId);
}

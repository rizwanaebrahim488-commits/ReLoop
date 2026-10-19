import { supabase, isConfigured } from '../lib/supabase';
import { getStoreData, setStoreData, STORAGE_KEYS } from './localStore';
import { getResourceById } from './resourceService';

export async function getUserFavorites(userId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          resources:resource_id (
            *,
            profiles:user_id (id, full_name, avatar_url, city),
            resource_images (image_url)
          )
        `)
        .eq('user_id', userId);
      if (!error && data) {
        return data.map(f => ({
          id: f.id,
          created_at: f.created_at,
          resource: {
            ...f.resources,
            images: f.resources?.resource_images?.map(i => i.image_url) || []
          }
        }));
      }
    } catch (e) {
      console.warn('Supabase getUserFavorites fallback:', e);
    }
  }

  const favs = getStoreData(STORAGE_KEYS.FAVORITES).filter(f => f.user_id === userId);
  const result = [];
  for (const f of favs) {
    const resource = await getResourceById(f.resource_id);
    if (resource) {
      result.push({
        id: f.id,
        created_at: f.created_at,
        resource
      });
    }
  }
  return result;
}

export async function toggleFavorite(userId, resourceId) {
  if (isConfigured) {
    try {
      // Check existing
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('resource_id', resourceId)
        .maybeSingle();

      if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id);
        return { isFavorite: false };
      } else {
        await supabase.from('favorites').insert([{ user_id: userId, resource_id: resourceId }]);
        return { isFavorite: true };
      }
    } catch (e) {
      console.warn('Supabase toggleFavorite fallback:', e);
    }
  }

  const favs = getStoreData(STORAGE_KEYS.FAVORITES);
  const index = favs.findIndex(f => f.user_id === userId && f.resource_id === resourceId);
  if (index >= 0) {
    favs.splice(index, 1);
    setStoreData(STORAGE_KEYS.FAVORITES, favs);
    return { isFavorite: false };
  } else {
    favs.push({
      id: `fav-${Date.now()}`,
      user_id: userId,
      resource_id: resourceId,
      created_at: new Date().toISOString()
    });
    setStoreData(STORAGE_KEYS.FAVORITES, favs);
    return { isFavorite: true };
  }
}

export async function checkIsFavorite(userId, resourceId) {
  if (!userId || !resourceId) return false;

  if (isConfigured) {
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('resource_id', resourceId)
        .maybeSingle();
      return Boolean(data);
    } catch (e) {
      console.warn('Supabase checkIsFavorite fallback:', e);
    }
  }

  const favs = getStoreData(STORAGE_KEYS.FAVORITES);
  return favs.some(f => f.user_id === userId && f.resource_id === resourceId);
}

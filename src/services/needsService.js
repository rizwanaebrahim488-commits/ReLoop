import { supabase, isConfigured } from '../lib/supabase';
import { getStoreData, setStoreData, STORAGE_KEYS } from './localStore';

export async function getNeeds(filters = {}) {
  const { category, search, status = 'active' } = filters;

  if (isConfigured) {
    try {
      let query = supabase
        .from('needs')
        .select(`
          *,
          profiles:user_id (id, full_name, avatar_url, account_type, is_verified, city)
        `);

      if (status) query = query.eq('status', status);
      if (category && category !== 'all') query = query.eq('category', category);
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getNeeds fallback:', e);
    }
  }

  let items = getStoreData(STORAGE_KEYS.NEEDS);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);

  items = items.map(need => ({
    ...need,
    profiles: profiles.find(p => p.id === need.user_id) || null
  }));

  if (status) items = items.filter(n => n.status === status);
  if (category && category !== 'all') items = items.filter(n => n.category.toLowerCase() === category.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
  }

  return items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function getNeedById(id) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('needs')
        .select(`*, profiles:user_id (*)`)
        .eq('id', id)
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getNeedById fallback:', e);
    }
  }

  const items = getStoreData(STORAGE_KEYS.NEEDS);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  const found = items.find(n => n.id === id);
  if (!found) return null;

  return {
    ...found,
    profiles: profiles.find(p => p.id === found.user_id) || null
  };
}

export async function createNeed(needData) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('needs')
        .insert([needData])
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase createNeed fallback:', e);
    }
  }

  const items = getStoreData(STORAGE_KEYS.NEEDS);
  const newNeed = {
    ...needData,
    id: `need-${Date.now()}`,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  items.unshift(newNeed);
  setStoreData(STORAGE_KEYS.NEEDS, items);
  return newNeed;
}

export async function updateNeed(id, updateData) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('needs')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase updateNeed fallback:', e);
    }
  }

  const items = getStoreData(STORAGE_KEYS.NEEDS);
  const idx = items.findIndex(n => n.id === id);
  if (idx === -1) throw new Error('Need not found');

  const updated = { ...items[idx], ...updateData, updated_at: new Date().toISOString() };
  items[idx] = updated;
  setStoreData(STORAGE_KEYS.NEEDS, items);
  return updated;
}

export async function getUserNeeds(userId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('needs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getUserNeeds fallback:', e);
    }
  }

  const items = getStoreData(STORAGE_KEYS.NEEDS);
  return items.filter(n => n.user_id === userId);
}

import { supabase, isConfigured } from '../lib/supabase';
import { getStoreData, setStoreData, STORAGE_KEYS } from './localStore';

export async function getUserNotifications(userId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getUserNotifications fallback:', e);
    }
  }

  const notifs = getStoreData(STORAGE_KEYS.NOTIFICATIONS);
  return notifs
    .filter(n => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function markNotificationAsRead(notificationId) {
  if (isConfigured) {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
    } catch (e) {
      console.warn('Supabase markNotificationAsRead fallback:', e);
    }
  }

  const notifs = getStoreData(STORAGE_KEYS.NOTIFICATIONS);
  const item = notifs.find(n => n.id === notificationId);
  if (item) {
    item.is_read = true;
    setStoreData(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
}

export async function markAllNotificationsAsRead(userId) {
  if (isConfigured) {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId);
    } catch (e) {
      console.warn('Supabase markAllNotificationsAsRead fallback:', e);
    }
  }

  const notifs = getStoreData(STORAGE_KEYS.NOTIFICATIONS);
  notifs.forEach(n => {
    if (n.user_id === userId) n.is_read = true;
  });
  setStoreData(STORAGE_KEYS.NOTIFICATIONS, notifs);
}

export async function createNotification({ userId, type, title, message, link }) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          type,
          title,
          message,
          link,
          is_read: false
        }])
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase createNotification fallback:', e);
    }
  }

  const notifs = getStoreData(STORAGE_KEYS.NOTIFICATIONS);
  const newNotif = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    user_id: userId,
    type,
    title,
    message,
    link,
    is_read: false,
    created_at: new Date().toISOString()
  };
  notifs.unshift(newNotif);
  setStoreData(STORAGE_KEYS.NOTIFICATIONS, notifs);
  return newNotif;
}

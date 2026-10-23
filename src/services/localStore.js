// Local State Persistence Engine for ReLoop
// Simulates a full PostgreSQL database in the browser when running without a Supabase cloud instance.

import {
  INITIAL_PROFILES,
  INITIAL_RESOURCES,
  INITIAL_NEEDS,
  INITIAL_FAVORITES,
  INITIAL_REQUESTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_SUPPORT_REQUESTS
} from '../data/mockData';

const STORAGE_KEYS = {
  PROFILES: 'reloop_profiles',
  RESOURCES: 'reloop_resources',
  NEEDS: 'reloop_needs',
  FAVORITES: 'reloop_favorites',
  REQUESTS: 'reloop_requests',
  CONVERSATIONS: 'reloop_conversations',
  MESSAGES: 'reloop_messages',
  NOTIFICATIONS: 'reloop_notifications',
  REPORTS: 'reloop_reports',
  SUPPORT: 'reloop_support_requests',
  ACTIVE_USER: 'reloop_active_user',
};

function initStore(key, defaultData) {
  try {
    const existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    const parsed = JSON.parse(existing);
    if (Array.isArray(parsed) && Array.isArray(defaultData) && parsed.length < defaultData.length && key === STORAGE_KEYS.RESOURCES) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return parsed;
  } catch (err) {
    return defaultData;
  }
}

export function getStoreData(key, defaultData = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initStore(key, defaultData);
  } catch {
    return defaultData;
  }
}

export function setStoreData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

// Initialize all collections on first load
export function initializeLocalStorage() {
  initStore(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  initStore(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  initStore(STORAGE_KEYS.NEEDS, INITIAL_NEEDS);
  initStore(STORAGE_KEYS.FAVORITES, INITIAL_FAVORITES);
  initStore(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  initStore(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  initStore(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  initStore(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  initStore(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  initStore(STORAGE_KEYS.SUPPORT, INITIAL_SUPPORT_REQUESTS);
}

export { STORAGE_KEYS };

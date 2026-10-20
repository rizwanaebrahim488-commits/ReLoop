import { supabase, isConfigured } from '../lib/supabase';
import { getStoreData, setStoreData, STORAGE_KEYS } from './localStore';
import { updateResource } from './resourceService';

export async function getAdminMetrics() {
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  const resources = getStoreData(STORAGE_KEYS.RESOURCES);
  const reports = getStoreData(STORAGE_KEYS.REPORTS);
  const support = getStoreData(STORAGE_KEYS.SUPPORT);
  const requests = getStoreData(STORAGE_KEYS.REQUESTS);

  const totalUsers = profiles.length;
  const activeListings = resources.filter(r => r.status === 'active').length;
  const reportedListings = reports.filter(r => r.status === 'pending').length;
  const openSupportRequests = support.filter(s => s.status === 'open' || s.status === 'in_progress').length;
  const completedExchanges = requests.filter(r => r.status === 'completed').length;

  return {
    totalUsers,
    activeListings,
    reportedListings,
    openSupportRequests,
    completedExchanges
  };
}

export async function getAllUsers() {
  if (isConfigured) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getAllUsers fallback:', e);
    }
  }

  return getStoreData(STORAGE_KEYS.PROFILES);
}

export async function updateUserVerification(userId, isVerified, adminId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_verified: isVerified })
        .eq('id', userId)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase updateUserVerification fallback:', e);
    }
  }

  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  const profile = profiles.find(p => p.id === userId);
  if (profile) {
    profile.is_verified = isVerified;
    setStoreData(STORAGE_KEYS.PROFILES, profiles);
  }
  return profile;
}

export async function getReportedListings() {
  const reports = getStoreData(STORAGE_KEYS.REPORTS);
  const resources = getStoreData(STORAGE_KEYS.RESOURCES);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);

  return reports.map(rep => ({
    ...rep,
    reporter: profiles.find(p => p.id === rep.reporter_id) || null,
    resource: resources.find(r => r.id === rep.reported_resource_id) || null
  }));
}

export async function takeModerationAction({ reportId, resourceId, action, notes, adminId }) {
  // Actions: 'dismiss', 'hide_listing', 'delete_listing'
  const reports = getStoreData(STORAGE_KEYS.REPORTS);
  const rep = reports.find(r => r.id === reportId);
  if (rep) {
    rep.status = action === 'dismiss' ? 'dismissed' : 'action_taken';
    rep.admin_notes = notes;
    rep.updated_at = new Date().toISOString();
    setStoreData(STORAGE_KEYS.REPORTS, reports);
  }

  if (resourceId && action === 'hide_listing') {
    await updateResource(resourceId, { status: 'unavailable' });
  }

  return { success: true };
}

export async function getSupportRequests() {
  return getStoreData(STORAGE_KEYS.SUPPORT);
}

export async function updateSupportTicket(ticketId, status, adminNotes) {
  const support = getStoreData(STORAGE_KEYS.SUPPORT);
  const ticket = support.find(s => s.id === ticketId);
  if (ticket) {
    ticket.status = status;
    if (adminNotes) ticket.admin_notes = adminNotes;
    ticket.updated_at = new Date().toISOString();
    setStoreData(STORAGE_KEYS.SUPPORT, support);
  }
  return ticket;
}

export async function createSupportRequest({ userId, name, email, subject, message }) {
  const support = getStoreData(STORAGE_KEYS.SUPPORT);
  const newTicket = {
    id: `sup-${Date.now()}`,
    user_id: userId || null,
    name,
    email,
    subject,
    message,
    status: 'open',
    admin_notes: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  support.unshift(newTicket);
  setStoreData(STORAGE_KEYS.SUPPORT, support);
  return newTicket;
}

export async function deleteSupportTicket(ticketId) {
  let support = getStoreData(STORAGE_KEYS.SUPPORT);
  support = support.filter(s => s.id !== ticketId);
  setStoreData(STORAGE_KEYS.SUPPORT, support);
  return { success: true };
}

export async function getAllListings() {
  const resources = getStoreData(STORAGE_KEYS.RESOURCES);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  return resources.map(res => ({
    ...res,
    seller: profiles.find(p => p.id === res.user_id) || { full_name: 'Community Member', email: '' }
  }));
}

export async function updateListingModeration(resourceId, updates) {
  const resources = getStoreData(STORAGE_KEYS.RESOURCES);
  const idx = resources.findIndex(r => r.id === resourceId);
  if (idx !== -1) {
    resources[idx] = { ...resources[idx], ...updates, updated_at: new Date().toISOString() };
    setStoreData(STORAGE_KEYS.RESOURCES, resources);
    return resources[idx];
  }
  return null;
}

export async function deleteListing(resourceId) {
  let resources = getStoreData(STORAGE_KEYS.RESOURCES);
  resources = resources.filter(r => r.id !== resourceId);
  setStoreData(STORAGE_KEYS.RESOURCES, resources);
  return { success: true };
}

export async function updateUserAdmin(userId, isAdmin) {
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  const profile = profiles.find(p => p.id === userId);
  if (profile) {
    profile.is_admin = isAdmin;
    setStoreData(STORAGE_KEYS.PROFILES, profiles);
  }
  return profile;
}

export async function deleteUser(userId) {
  let profiles = getStoreData(STORAGE_KEYS.PROFILES);
  profiles = profiles.filter(p => p.id !== userId);
  setStoreData(STORAGE_KEYS.PROFILES, profiles);
  return { success: true };
}

export async function createReport({ reporterId, reportedResourceId, reportedUserId, reason, description }) {
  const reports = getStoreData(STORAGE_KEYS.REPORTS);
  const newReport = {
    id: `rep-${Date.now()}`,
    reporter_id: reporterId,
    reported_resource_id: reportedResourceId || null,
    reported_user_id: reportedUserId || null,
    reason,
    description,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  reports.unshift(newReport);
  setStoreData(STORAGE_KEYS.REPORTS, reports);
  return newReport;
}

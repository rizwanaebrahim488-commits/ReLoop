import { supabase, isConfigured } from '../lib/supabase';
import { getStoreData, setStoreData, STORAGE_KEYS } from './localStore';
import { updateResource } from './resourceService';
import { sanitizeText, checkRateLimit } from '../utils/security';

export async function getAdminMetrics() {
  if (isConfigured) {
    try {
      const [
        { count: userCount, error: userErr },
        { count: activeCount, error: activeErr },
        { count: reportCount, error: reportErr },
        { count: supportCount, error: supportErr },
        { count: exchangeCount, error: exchangeErr }
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('resources').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('support_requests').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
        supabase.from('resource_requests').select('id', { count: 'exact', head: true }).eq('status', 'completed')
      ]);

      if (!userErr && !activeErr) {
        return {
          totalUsers: userCount || 0,
          activeListings: activeCount || 0,
          reportedListings: reportCount || 0,
          openSupportRequests: supportCount || 0,
          completedExchanges: exchangeCount || 0
        };
      }
    } catch (e) {
      console.warn('Supabase getAdminMetrics fallback:', e);
    }
  }

  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  const resources = getStoreData(STORAGE_KEYS.RESOURCES);
  const reports = getStoreData(STORAGE_KEYS.REPORTS);
  const support = getStoreData(STORAGE_KEYS.SUPPORT);
  const requests = getStoreData(STORAGE_KEYS.REQUESTS);

  return {
    totalUsers: profiles.length,
    activeListings: resources.filter(r => r.status === 'active').length,
    reportedListings: reports.filter(r => r.status === 'pending').length,
    openSupportRequests: support.filter(s => s.status === 'open' || s.status === 'in_progress').length,
    completedExchanges: requests.filter(r => r.status === 'completed').length
  };
}

export async function getAllUsers() {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
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
        .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
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

export async function updateUserAdmin(userId, isAdmin) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_admin: isAdmin, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase updateUserAdmin fallback:', e);
    }
  }

  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  const profile = profiles.find(p => p.id === userId);
  if (profile) {
    profile.is_admin = isAdmin;
    setStoreData(STORAGE_KEYS.PROFILES, profiles);
  }
  return profile;
}

export async function deleteUser(userId) {
  if (isConfigured) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (!error) return { success: true };
    } catch (e) {
      console.warn('Supabase deleteUser fallback:', e);
    }
  }

  let profiles = getStoreData(STORAGE_KEYS.PROFILES);
  profiles = profiles.filter(p => p.id !== userId);
  setStoreData(STORAGE_KEYS.PROFILES, profiles);
  return { success: true };
}

export async function getReportedListings() {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:reporter_id (id, full_name, email, avatar_url),
          resource:reported_resource_id (*, profiles:user_id (id, full_name, email))
        `)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getReportedListings fallback:', e);
    }
  }

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
  if (isConfigured) {
    try {
      const newStatus = action === 'dismiss' ? 'dismissed' : 'action_taken';
      await supabase
        .from('reports')
        .update({
          status: newStatus,
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (resourceId && action === 'hide_listing') {
        await supabase
          .from('resources')
          .update({ status: 'unavailable', updated_at: new Date().toISOString() })
          .eq('id', resourceId);
      } else if (resourceId && action === 'delete_listing') {
        await supabase
          .from('resources')
          .delete()
          .eq('id', resourceId);
      }
      return { success: true };
    } catch (e) {
      console.warn('Supabase takeModerationAction fallback:', e);
    }
  }

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
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getSupportRequests fallback:', e);
    }
  }

  return getStoreData(STORAGE_KEYS.SUPPORT);
}

export async function updateSupportTicket(ticketId, status, adminNotes) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .update({
          status,
          admin_notes: adminNotes || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase updateSupportTicket fallback:', e);
    }
  }

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
  // Rate limiting against spam
  const rateLimit = checkRateLimit(`support_req_${email || 'anon'}`, { maxAttempts: 5, windowMs: 60000 });
  if (!rateLimit.allowed) {
    throw new Error(`Inquiry submission limit reached. Please wait ${rateLimit.retryAfterSec} seconds.`);
  }

  const cleanName = sanitizeText(name, 100);
  const cleanEmail = sanitizeText(email, 150).toLowerCase();
  const cleanSubject = sanitizeText(subject, 200);
  const cleanMessage = sanitizeText(message, 3000);

  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .insert([{
          user_id: userId || null,
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          status: 'open'
        }])
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase createSupportRequest fallback:', e);
    }
  }

  const support = getStoreData(STORAGE_KEYS.SUPPORT);
  const newTicket = {
    id: `sup-${Date.now()}`,
    user_id: userId || null,
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
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
  if (isConfigured) {
    try {
      const { error } = await supabase
        .from('support_requests')
        .delete()
        .eq('id', ticketId);
      if (!error) return { success: true };
    } catch (e) {
      console.warn('Supabase deleteSupportTicket fallback:', e);
    }
  }

  let support = getStoreData(STORAGE_KEYS.SUPPORT);
  support = support.filter(s => s.id !== ticketId);
  setStoreData(STORAGE_KEYS.SUPPORT, support);
  return { success: true };
}

export async function getAllListings() {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          seller:user_id (id, full_name, email, avatar_url, is_verified),
          resource_images (image_url, is_primary)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(item => {
          let imgs = [];
          if (item.resource_images && item.resource_images.length > 0) {
            imgs = item.resource_images.map(i => i.image_url);
          } else if (item.image_url) {
            imgs = [item.image_url];
          } else {
            imgs = ['https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80'];
          }
          return {
            ...item,
            images: imgs,
            seller: item.seller || { full_name: 'Community Member', email: '' }
          };
        });
      }
    } catch (e) {
      console.warn('Supabase getAllListings fallback:', e);
    }
  }

  const resources = getStoreData(STORAGE_KEYS.RESOURCES);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  return resources.map(res => ({
    ...res,
    seller: profiles.find(p => p.id === res.user_id) || { full_name: 'Community Member', email: '' }
  }));
}

export async function updateListingModeration(resourceId, updates) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', resourceId)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase updateListingModeration fallback:', e);
    }
  }

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
  if (isConfigured) {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);
      if (!error) return { success: true };
    } catch (e) {
      console.warn('Supabase deleteListing fallback:', e);
    }
  }

  let resources = getStoreData(STORAGE_KEYS.RESOURCES);
  resources = resources.filter(r => r.id !== resourceId);
  setStoreData(STORAGE_KEYS.RESOURCES, resources);
  return { success: true };
}

export async function createReport({ reporterId, reportedResourceId, reportedUserId, reason, description }) {
  // Rate limiting against harassment / spam reports
  const rateLimit = checkRateLimit(`report_${reporterId || 'anon'}`, { maxAttempts: 5, windowMs: 60000 });
  if (!rateLimit.allowed) {
    throw new Error(`Report submission limit reached. Please wait ${rateLimit.retryAfterSec} seconds.`);
  }

  const cleanReason = sanitizeText(reason, 150);
  const cleanDescription = sanitizeText(description, 2000);

  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          reporter_id: reporterId,
          reported_resource_id: reportedResourceId || null,
          reported_user_id: reportedUserId || null,
          reason: cleanReason,
          description: cleanDescription,
          status: 'pending'
        }])
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase createReport fallback:', e);
    }
  }

  const reports = getStoreData(STORAGE_KEYS.REPORTS);
  const newReport = {
    id: `rep-${Date.now()}`,
    reporter_id: reporterId,
    reported_resource_id: reportedResourceId || null,
    reported_user_id: reportedUserId || null,
    reason: cleanReason,
    description: cleanDescription,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  reports.unshift(newReport);
  setStoreData(STORAGE_KEYS.REPORTS, reports);
  return newReport;
}

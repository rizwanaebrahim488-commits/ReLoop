import { supabase, isConfigured } from '../lib/supabase';
import { getStoreData, setStoreData, STORAGE_KEYS } from './localStore';
import { getResourceById, updateResource } from './resourceService';
import { createNotification } from './notificationsService';

export async function getUserRequests(userId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('resource_requests')
        .select(`
          *,
          resource:resource_id (*, resource_images(image_url)),
          requester:requester_id (id, full_name, avatar_url, email, city),
          owner:owner_id (id, full_name, avatar_url, email, city)
        `)
        .or(`requester_id.eq.${userId},owner_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return {
          incoming: data.filter(r => r.owner_id === userId),
          outgoing: data.filter(r => r.requester_id === userId)
        };
      }
    } catch (e) {
      console.warn('Supabase getUserRequests fallback:', e);
    }
  }

  const allReqs = getStoreData(STORAGE_KEYS.REQUESTS);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  const resources = getStoreData(STORAGE_KEYS.RESOURCES);

  const populated = allReqs.map(req => ({
    ...req,
    resource: resources.find(r => r.id === req.resource_id) || null,
    requester: profiles.find(p => p.id === req.requester_id) || null,
    owner: profiles.find(p => p.id === req.owner_id) || null
  }));

  return {
    incoming: populated.filter(r => r.owner_id === userId),
    outgoing: populated.filter(r => r.requester_id === userId)
  };
}

export async function createRequest({ resourceId, requesterId, ownerId, quantity, message }) {
  if (requesterId === ownerId) {
    throw new Error('You cannot request your own resource.');
  }

  const resource = await getResourceById(resourceId);
  if (!resource) throw new Error('Resource not found');
  if (resource.status !== 'active') throw new Error('This resource is no longer active or available.');

  const requestedNum = parseFloat(quantity);
  const availableNum = parseFloat(resource.available_quantity ?? resource.quantity);

  if (requestedNum <= 0) throw new Error('Requested quantity must be greater than zero.');
  if (requestedNum > availableNum) {
    throw new Error(`Requested quantity (${requestedNum}) exceeds available quantity (${availableNum}).`);
  }

  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('resource_requests')
        .insert([{
          resource_id: resourceId,
          requester_id: requesterId,
          owner_id: ownerId,
          requested_quantity: requestedNum,
          message,
          status: 'pending'
        }])
        .select()
        .single();
      if (!error && data) {
        // Send notification
        await createNotification({
          userId: ownerId,
          type: 'request_received',
          title: 'New Resource Request',
          message: `Someone requested ${requestedNum} ${resource.unit} of "${resource.title}".`,
          link: '/requests'
        });
        return data;
      }
    } catch (e) {
      console.warn('Supabase createRequest fallback:', e);
    }
  }

  const reqs = getStoreData(STORAGE_KEYS.REQUESTS);
  const newReq = {
    id: `req-${Date.now()}`,
    resource_id: resourceId,
    requester_id: requesterId,
    owner_id: ownerId,
    requested_quantity: requestedNum,
    message,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  reqs.unshift(newReq);
  setStoreData(STORAGE_KEYS.REQUESTS, reqs);

  // Notify owner
  await createNotification({
    userId: ownerId,
    type: 'request_received',
    title: 'New Resource Request',
    message: `A community member requested ${requestedNum} ${resource.unit} of "${resource.title}".`,
    link: '/requests'
  });

  return newReq;
}

export async function updateRequestStatus(requestId, newStatus, currentUserId) {
  const reqs = getStoreData(STORAGE_KEYS.REQUESTS);
  const req = reqs.find(r => r.id === requestId);
  if (!req) throw new Error('Request not found');

  const resource = await getResourceById(req.resource_id);

  if (newStatus === 'accepted') {
    if (req.owner_id !== currentUserId) throw new Error('Only the listing owner can accept requests.');
    if (!resource) throw new Error('Resource not found');

    const available = parseFloat(resource.available_quantity ?? resource.quantity);
    const requested = parseFloat(req.requested_quantity);

    if (requested > available) {
      throw new Error(`Cannot accept request: available quantity (${available}) is less than requested (${requested}).`);
    }

    const newAvailable = Math.max(0, available - requested);
    const newStatusResource = newAvailable === 0 ? 'reserved' : resource.status;

    await updateResource(resource.id, {
      available_quantity: newAvailable,
      status: newStatusResource
    });

    await createNotification({
      userId: req.requester_id,
      type: 'request_accepted',
      title: 'Request Approved!',
      message: `Your request for ${requested} ${resource.unit} of "${resource.title}" was accepted. Open messages to coordinate collection!`,
      link: '/requests'
    });
  } else if (newStatus === 'rejected') {
    if (req.owner_id !== currentUserId) throw new Error('Only the listing owner can decline requests.');
    await createNotification({
      userId: req.requester_id,
      type: 'request_rejected',
      title: 'Request Declined',
      message: `Your request for "${resource?.title || 'Resource'}" was not accepted.`,
      link: '/requests'
    });
  } else if (newStatus === 'cancelled') {
    if (req.requester_id !== currentUserId) throw new Error('Only the requester can cancel a request.');
  }

  req.status = newStatus;
  req.updated_at = new Date().toISOString();
  setStoreData(STORAGE_KEYS.REQUESTS, reqs);
  return req;
}

export async function completeExchange({ requestId, resourceId, ownerId, receiverId, confirmedQty, unit, outcomeType, notes }) {
  // Mark request completed
  await updateRequestStatus(requestId, 'completed', ownerId);

  // Check if resource is fully handed off
  const res = await getResourceById(resourceId);
  if (res && res.available_quantity <= 0) {
    await updateResource(resourceId, { status: 'completed' });
  }

  // Create notification
  await createNotification({
    userId: receiverId,
    type: 'exchange_completed',
    title: 'Exchange Completed!',
    message: `The resource exchange for "${res?.title || 'Resource'}" has been marked as completed. Thank you for giving it a second life!`,
    link: '/requests'
  });

  return { success: true };
}

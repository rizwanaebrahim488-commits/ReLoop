import { supabase, isConfigured } from '../lib/supabase';
import { getStoreData, setStoreData, STORAGE_KEYS } from './localStore';
import { createNotification } from './notificationsService';

export async function getUserConversations(userId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          resource:resource_id (id, title, category, status, price, listing_type),
          participant_1:participant_one (id, full_name, avatar_url, city, is_verified),
          participant_2:participant_two (id, full_name, avatar_url, city, is_verified)
        `)
        .or(`participant_one.eq.${userId},participant_two.eq.${userId}`)
        .order('last_message_at', { ascending: false });

      if (!error && data) {
        return data.map(conv => {
          const otherUser = conv.participant_one === userId ? conv.participant_2 : conv.participant_1;
          return {
            ...conv,
            otherUser
          };
        });
      }
    } catch (e) {
      console.warn('Supabase getUserConversations fallback:', e);
    }
  }

  const convs = getStoreData(STORAGE_KEYS.CONVERSATIONS);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);
  const resources = getStoreData(STORAGE_KEYS.RESOURCES);
  const messages = getStoreData(STORAGE_KEYS.MESSAGES);

  const userConvs = convs.filter(c => c.participant_one === userId || c.participant_two === userId);

  return userConvs.map(conv => {
    const otherUserId = conv.participant_one === userId ? conv.participant_two : conv.participant_one;
    const otherUser = profiles.find(p => p.id === otherUserId) || { id: otherUserId, full_name: 'Community Member' };
    const resource = resources.find(r => r.id === conv.resource_id) || null;

    const convMessages = messages.filter(m => m.conversation_id === conv.id);
    const lastMsg = convMessages[convMessages.length - 1];
    const unreadCount = convMessages.filter(m => m.conversation_id === conv.id && m.sender_id !== userId && !m.is_read).length;

    return {
      ...conv,
      otherUser,
      resource,
      lastMessage: lastMsg ? lastMsg.content : null,
      lastMessageAt: lastMsg ? lastMsg.created_at : conv.last_message_at,
      unreadCount
    };
  }).sort((a, b) => new Date(b.lastMessageAt || b.last_message_at) - new Date(a.lastMessageAt || a.last_message_at));
}

export async function getOrCreateConversation(resourceId, participantOne, participantTwo) {
  if (participantOne === participantTwo) {
    throw new Error('You cannot message yourself.');
  }

  if (isConfigured) {
    try {
      // Find existing
      const { data: existing } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant_one.eq.${participantOne},participant_two.eq.${participantTwo}),and(participant_one.eq.${participantTwo},participant_two.eq.${participantOne})`)
        .maybeSingle();

      if (existing) return existing;

      // Create new
      const { data: created, error } = await supabase
        .from('conversations')
        .insert([{
          resource_id: resourceId || null,
          participant_one: participantOne,
          participant_two: participantTwo,
          last_message_at: new Date().toISOString()
        }])
        .select()
        .single();
      if (!error && created) return created;
    } catch (e) {
      console.warn('Supabase getOrCreateConversation fallback:', e);
    }
  }

  const convs = getStoreData(STORAGE_KEYS.CONVERSATIONS);
  const found = convs.find(c =>
    (c.participant_one === participantOne && c.participant_two === participantTwo) ||
    (c.participant_one === participantTwo && c.participant_two === participantOne)
  );

  if (found) return found;

  const newConv = {
    id: `conv-${Date.now()}`,
    resource_id: resourceId || null,
    participant_one: participantOne,
    participant_two: participantTwo,
    last_message_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  convs.push(newConv);
  setStoreData(STORAGE_KEYS.CONVERSATIONS, convs);
  return newConv;
}

export async function getMessages(conversationId) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (id, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getMessages fallback:', e);
    }
  }

  const msgs = getStoreData(STORAGE_KEYS.MESSAGES);
  const profiles = getStoreData(STORAGE_KEYS.PROFILES);

  return msgs
    .filter(m => m.conversation_id === conversationId)
    .map(m => ({
      ...m,
      sender: profiles.find(p => p.id === m.sender_id) || null
    }))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

export async function sendMessage(conversationId, senderId, content) {
  if (!content || !content.trim()) throw new Error('Message cannot be empty.');
  if (content.length > 2000) throw new Error('Message exceeds 2,000 character limit.');

  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: senderId,
          content: content.trim(),
          is_read: false
        }])
        .select()
        .single();

      if (!error && data) {
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationId);
        return data;
      }
    } catch (e) {
      console.warn('Supabase sendMessage fallback:', e);
    }
  }

  const msgs = getStoreData(STORAGE_KEYS.MESSAGES);
  const convs = getStoreData(STORAGE_KEYS.CONVERSATIONS);

  const newMsg = {
    id: `msg-${Date.now()}`,
    conversation_id: conversationId,
    sender_id: senderId,
    content: content.trim(),
    is_read: false,
    created_at: new Date().toISOString()
  };
  msgs.push(newMsg);
  setStoreData(STORAGE_KEYS.MESSAGES, msgs);

  // Update conversation last_message_at
  const conv = convs.find(c => c.id === conversationId);
  if (conv) {
    conv.last_message_at = new Date().toISOString();
    setStoreData(STORAGE_KEYS.CONVERSATIONS, convs);

    const recipientId = conv.participant_one === senderId ? conv.participant_two : conv.participant_one;
    await createNotification({
      userId: recipientId,
      type: 'message',
      title: 'New Direct Message',
      message: `You received a message: "${content.slice(0, 50)}${content.length > 50 ? '...' : ''}"`,
      link: `/messages/${conversationId}`
    });
  }

  return newMsg;
}

export async function markConversationAsRead(conversationId, currentUserId) {
  if (isConfigured) {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', currentUserId);
    } catch (e) {
      console.warn('Supabase markConversationAsRead fallback:', e);
    }
  }

  const msgs = getStoreData(STORAGE_KEYS.MESSAGES);
  let changed = false;
  msgs.forEach(m => {
    if (m.conversation_id === conversationId && m.sender_id !== currentUserId && !m.is_read) {
      m.is_read = true;
      changed = true;
    }
  });
  if (changed) {
    setStoreData(STORAGE_KEYS.MESSAGES, msgs);
  }
}

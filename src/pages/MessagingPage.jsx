import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  User,
  Package,
  ShieldAlert,
  Clock,
  MoreVertical,
  CheckCheck,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
  getUserConversations,
  getMessages,
  sendMessage,
  markConversationAsRead
} from '../services/messagesService';
import { supabase, isConfigured } from '../lib/supabase';

export function MessagingPage() {
  const { conversationId } = useParams();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(conversationId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.id) loadConversations();
  }, [user?.id]);

  useEffect(() => {
    if (conversationId) {
      setActiveConvId(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (activeConvId && user?.id) {
      loadActiveMessages(activeConvId);
      markConversationAsRead(activeConvId, user.id);

      // Setup Realtime listener if configured
      if (isConfigured) {
        const channel = supabase
          .channel(`messages:${activeConvId}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConvId}` },
            (payload) => {
              setMessages(prev => [...prev, payload.new]);
              scrollToBottom();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [activeConvId, user?.id]);

  const loadConversations = async () => {
    setLoadingConvs(true);
    try {
      const data = await getUserConversations(user.id);
      setConversations(data);
      if (!activeConvId && data.length > 0) {
        setActiveConvId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvs(false);
    }
  };

  const loadActiveMessages = async (convId) => {
    setLoadingMessages(true);
    try {
      const data = await getMessages(convId);
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const sent = await sendMessage(activeConvId, user.id, content);
      setMessages(prev => [...prev, sent]);
      scrollToBottom();
      loadConversations(); // refresh list snippet
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <DashboardLayout
      title="Direct Messaging"
      subtitle="Coordinate resource collections, exchange terms, and questions directly with community members."
    >
      <div className="bg-white rounded-3xl border border-charcoal-100 shadow-xs overflow-hidden h-[650px] flex flex-col md:flex-row">
        {/* Left: Conversation List */}
        <div className="w-full md:w-80 border-r border-charcoal-100 flex flex-col h-full bg-offwhite/50">
          <div className="p-4 border-b border-charcoal-100">
            <h3 className="font-bold text-sm text-charcoal-900">
              Conversations ({conversations.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-charcoal-100">
            {loadingConvs ? (
              <div className="p-8 text-center text-xs text-charcoal-400">
                Loading chats...
              </div>
            ) : conversations.length > 0 ? (
              conversations.map(conv => {
                const isSelected = conv.id === activeConvId;
                const other = conv.otherUser || {};

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-4 text-left transition flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-forest-700 shadow-xs'
                        : 'hover:bg-white/70'
                    }`}
                  >
                    <img
                      src={other.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={other.full_name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-charcoal-200 shrink-0"
                    />

                    <div className="flex-1 overflow-hidden text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-charcoal-900 truncate">
                          {other.full_name || 'Member'}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-forest-600 text-white font-bold text-[10px] flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>

                      {conv.resource && (
                        <span className="text-[10px] text-forest-700 font-semibold block truncate">
                          📦 {conv.resource.title}
                        </span>
                      )}

                      <p className="text-charcoal-500 truncate mt-1">
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-charcoal-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-charcoal-300" />
                <p>No active conversations.</p>
                <p className="text-[11px] text-charcoal-400">
                  Open any resource card and click "Contact Seller" to start a chat.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="flex-1 flex flex-col h-full bg-white">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-charcoal-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeConv.otherUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={activeConv.otherUser?.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-charcoal-900">
                      {activeConv.otherUser?.full_name || 'Community Member'}
                    </h4>
                    {activeConv.resource && (
                      <Link
                        to={`/resources/${activeConv.resource.id}`}
                        className="text-xs text-forest-700 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Package className="w-3 h-3" />
                        <span>Regarding: {activeConv.resource.title}</span>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-charcoal-400">
                  Direct In-App Communication
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-offwhite/30">
                {loadingMessages ? (
                  <div className="py-20 text-center text-xs text-charcoal-400">
                    Loading message history...
                  </div>
                ) : messages.length > 0 ? (
                  messages.map(msg => {
                    const isMine = msg.sender_id === user?.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMine
                              ? 'bg-forest-700 text-white rounded-br-xs shadow-xs'
                              : 'bg-white text-charcoal-900 border border-charcoal-200 rounded-bl-xs shadow-xs'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-charcoal-400 mt-1 px-1 flex items-center gap-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMine && <CheckCheck className="w-3 h-3 text-forest-600" />}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-16 text-center text-xs text-charcoal-400 space-y-1">
                    <p>This is the start of your direct conversation.</p>
                    <p className="text-[11px]">Coordinate pickup location and timing safely.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-charcoal-100 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message (e.g. Can I collect on Friday at 2pm?)..."
                  maxLength={2000}
                  className="flex-1 p-2.5 rounded-xl border border-charcoal-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-2.5 rounded-xl bg-forest-700 text-white hover:bg-forest-800 transition disabled:opacity-50"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-charcoal-400 space-y-3">
              <MessageSquare className="w-12 h-12 text-charcoal-300" />
              <h3 className="font-bold text-charcoal-700">Select a Conversation</h3>
              <p className="text-xs max-w-xs text-charcoal-500">
                Choose a conversation from the left to view message history and send direct replies.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

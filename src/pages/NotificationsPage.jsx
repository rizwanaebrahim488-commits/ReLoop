import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  CalendarCheck,
  MessageSquare,
  Sparkles,
  Package,
  AlertTriangle,
  ExternalLink,
  CheckCheck
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/notificationsService';

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadNotifications();
  }, [user?.id]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getUserNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request_received':
      case 'request_accepted':
      case 'request_rejected':
      case 'exchange_completed':
        return <CalendarCheck className="w-5 h-5 text-forest-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-sky-600" />;
      case 'match_found':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-charcoal-500" />;
    }
  };

  return (
    <DashboardLayout
      title="Activity Center & Notifications"
      subtitle="Stay up to date on your resource requests, direct messages, and matched needs."
      action={
        notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 font-semibold text-xs transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )
      }
    >
      <div className="space-y-4 max-w-3xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-400">
            Loading notifications...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                n.is_read
                  ? 'bg-white border-charcoal-100 shadow-xs'
                  : 'bg-forest-50/40 border-forest-200/80 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-charcoal-100 shadow-xs shrink-0">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-charcoal-900 text-sm">{n.title}</h4>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-forest-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-charcoal-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-charcoal-400 block pt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.link && (
                  <Link
                    to={n.link}
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-2 rounded-xl bg-forest-700 text-white hover:bg-forest-800 transition"
                    title="Open related activity"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-2 rounded-xl border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-100 transition text-[11px] font-medium"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 space-y-3">
            <Bell className="w-12 h-12 text-charcoal-300 mx-auto" />
            <h3 className="font-bold text-base text-charcoal-900">All Caught Up</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              You have no notifications right now. Activity regarding requests and matches will appear here.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

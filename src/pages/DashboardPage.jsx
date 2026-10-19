import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FileQuestion,
  Sparkles,
  Heart,
  CalendarCheck,
  MessageSquare,
  Bell,
  PlusCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getUserResources } from '../services/resourceService';
import { getUserNeeds } from '../services/needsService';
import { getUserFavorites } from '../services/favoritesService';
import { getUserRequests } from '../services/requestsService';
import { getUserConversations } from '../services/messagesService';
import { getUserNotifications } from '../services/notificationsService';
import { ResourceCard } from '../components/ResourceCard';

export function DashboardPage() {
  const { user, profile } = useAuth();

  const [stats, setStats] = useState({
    activeListings: 0,
    savedFavorites: 0,
    publishedNeeds: 0,
    incomingRequests: 0,
    outgoingRequests: 0,
    unreadMessages: 0,
    unreadNotifications: 0
  });

  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function loadDashboardData() {
      setLoading(true);
      try {
        const [
          listings,
          needs,
          favorites,
          requests,
          conversations,
          notifications
        ] = await Promise.all([
          getUserResources(user.id),
          getUserNeeds(user.id),
          getUserFavorites(user.id),
          getUserRequests(user.id),
          getUserConversations(user.id),
          getUserNotifications(user.id)
        ]);

        const unreadMsgs = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        const unreadNotifs = notifications.filter(n => !n.is_read).length;

        setStats({
          activeListings: listings.filter(l => l.status === 'active').length,
          savedFavorites: favorites.length,
          publishedNeeds: needs.filter(n => n.status === 'active').length,
          incomingRequests: requests.incoming.filter(r => r.status === 'pending').length,
          outgoingRequests: requests.outgoing.length,
          unreadMessages: unreadMsgs,
          unreadNotifications: unreadNotifs
        });

        setRecentListings(listings.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user?.id]);

  const statCards = [
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: Package,
      link: '/my-listings',
      color: 'text-forest-700 bg-forest-50'
    },
    {
      title: 'Published Needs',
      value: stats.publishedNeeds,
      icon: FileQuestion,
      link: '/my-needs',
      color: 'text-purple-700 bg-purple-50'
    },
    {
      title: 'Incoming Requests',
      value: stats.incomingRequests,
      icon: CalendarCheck,
      link: '/requests',
      color: 'text-amber-700 bg-amber-50'
    },
    {
      title: 'Saved Favorites',
      value: stats.savedFavorites,
      icon: Heart,
      link: '/favorites',
      color: 'text-rose-700 bg-rose-50'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      link: '/messages',
      color: 'text-sky-700 bg-sky-50'
    },
    {
      title: 'Notifications',
      value: stats.unreadNotifications,
      icon: Bell,
      link: '/notifications',
      color: 'text-emerald-700 bg-emerald-50'
    }
  ];

  return (
    <DashboardLayout
      title={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'Member'}`}
      subtitle="Here is your active circular resource activity, incoming requests, and messages."
      action={
        <div className="flex gap-2">
          <Link
            to="/resources/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-fresh-300" />
            <span>List a Resource</span>
          </Link>
          <Link
            to="/needs/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-charcoal-200 text-charcoal-800 font-semibold text-xs hover:bg-charcoal-50 transition"
          >
            <FileQuestion className="w-4 h-4 text-charcoal-500" />
            <span>Publish a Need</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.link}
                className="bg-white rounded-2xl p-4 border border-charcoal-100 shadow-xs hover:shadow-md hover:border-forest-200 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-extrabold text-charcoal-900">
                    {loading ? '...' : card.value}
                  </span>
                </div>
                <div className="text-xs font-semibold text-charcoal-600 truncate">
                  {card.title}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions Banner */}
        <div className="bg-gradient-to-r from-forest-800 to-forest-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-fresh-300">
              Community Circular Loop
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              Looking for materials or ready to clear space?
            </h2>
            <p className="text-xs sm:text-sm text-forest-200 max-w-lg leading-relaxed">
              Explore listings across 13 circular categories or let the community know what you need. Remember: all exchanges are coordinated directly!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/resources"
              className="px-4 py-2.5 rounded-xl bg-fresh-500 text-forest-950 font-bold text-xs hover:bg-fresh-400 transition"
            >
              Browse Resources
            </Link>
            <Link
              to="/matches"
              className="px-4 py-2.5 rounded-xl bg-forest-700/80 hover:bg-forest-700 text-white font-semibold text-xs border border-forest-600 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-fresh-300" />
              <span>View Matches</span>
            </Link>
          </div>
        </div>

        {/* Recent Listings Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-charcoal-900">
                Your Recent Listings
              </h3>
              <p className="text-xs text-charcoal-500">
                Manage your active and completed resource offers
              </p>
            </div>
            <Link
              to="/my-listings"
              className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1"
            >
              <span>View all listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-charcoal-400">
              Loading listings...
            </div>
          ) : recentListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentListings.map(res => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-offwhite rounded-2xl border border-charcoal-100 p-8 space-y-3">
              <Package className="w-10 h-10 text-charcoal-300 mx-auto" />
              <h4 className="font-bold text-charcoal-800 text-sm">You haven't listed any resources yet</h4>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                Got leftover timber, electronics, fabric, or organic compost material? Give it a second life.
              </p>
              <Link
                to="/resources/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-700 text-white text-xs font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish First Resource</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

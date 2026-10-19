import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Recycle,
  PlusCircle,
  FileQuestion,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldAlert,
  Sparkles,
  Heart,
  Package,
  Layers,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserNotifications } from '../services/notificationsService';
import { getUserConversations } from '../services/messagesService';

export function Navbar() {
  const { user, profile, signOut, switchDemoUser, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadBadgeCounts();
      const interval = setInterval(loadBadgeCounts, 8000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const loadBadgeCounts = async () => {
    if (!user) return;
    try {
      const notifs = await getUserNotifications(user.id);
      setUnreadNotifs(notifs.filter(n => !n.is_read).length);

      const convs = await getUserConversations(user.id);
      const unreadTotal = convs.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      setUnreadMsgs(unreadTotal);
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'text-forest-700 bg-forest-50 font-semibold'
        : 'text-charcoal-600 hover:text-forest-700 hover:bg-forest-50/50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-charcoal-100 shadow-xs">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-md shadow-forest-900/10">
              <Recycle className="w-6 h-6 text-fresh-300 animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-forest-950 block leading-tight">
                Re<span className="text-forest-600">Loop</span>
              </span>
              <span className="text-[10px] text-charcoal-500 font-medium tracking-wide block">
                One Resource, Many Possibilities
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/resources" className={navLinkClass}>
              Explore Resources
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              Categories
            </NavLink>
            <NavLink to="/how-it-works" className={navLinkClass}>
              How It Works
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/safety-and-guidelines" className={navLinkClass}>
              Safety
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Quick Demo Switcher if not connected to live Supabase */}
            {!isSupabaseConnected && (
              <div className="hidden xl:flex items-center bg-charcoal-50 border border-charcoal-200 rounded-lg p-1 text-xs">
                <span className="text-[10px] text-charcoal-400 font-semibold px-2">Role:</span>
                <button
                  onClick={() => switchDemoUser('user-1')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${profile?.id === 'user-1' ? 'bg-forest-600 text-white shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'}`}
                >
                  Elena (Workshop)
                </button>
                <button
                  onClick={() => switchDemoUser('user-2')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${profile?.id === 'user-2' ? 'bg-forest-600 text-white shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'}`}
                >
                  Marcus (NGO)
                </button>
                <button
                  onClick={() => switchDemoUser('user-3')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${profile?.id === 'user-3' ? 'bg-forest-600 text-white shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'}`}
                >
                  Amina (Repairer)
                </button>
                <button
                  onClick={() => switchDemoUser('user-admin')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${profile?.id === 'user-admin' ? 'bg-forest-600 text-white shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'}`}
                >
                  Admin
                </button>
              </div>
            )}

            {user ? (
              <>
                {/* Post Resource button */}
                <Link
                  to="/resources/create"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-forest-700 text-white hover:bg-forest-800 shadow-xs transition"
                >
                  <PlusCircle className="w-4 h-4 text-fresh-300" />
                  <span>List a Resource</span>
                </Link>

                {/* Notifications Link */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-xl text-charcoal-600 hover:text-forest-700 hover:bg-forest-50 transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadNotifs}
                    </span>
                  )}
                </Link>

                {/* Messages Link */}
                <Link
                  to="/messages"
                  className="relative p-2 rounded-xl text-charcoal-600 hover:text-forest-700 hover:bg-forest-50 transition"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMsgs > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-fresh-600 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadMsgs}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-charcoal-50 transition border border-transparent hover:border-charcoal-200"
                  >
                    <img
                      src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={profile?.full_name || 'User Avatar'}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-forest-200"
                    />
                    <span className="text-xs font-semibold text-charcoal-800 hidden md:block max-w-[100px] truncate">
                      {profile?.full_name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-charcoal-100 py-2 z-50 text-xs"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-charcoal-100">
                        <p className="font-bold text-charcoal-900 truncate">{profile?.full_name}</p>
                        <p className="text-[11px] text-charcoal-500 capitalize">{profile?.account_type || 'User'}</p>
                      </div>

                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-forest-50 text-charcoal-700">
                        <Layers className="w-4 h-4 text-forest-600" /> Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-forest-50 text-charcoal-700">
                        <User className="w-4 h-4 text-forest-600" /> My Profile
                      </Link>
                      <Link to="/my-listings" className="flex items-center gap-2 px-4 py-2 hover:bg-forest-50 text-charcoal-700">
                        <Package className="w-4 h-4 text-forest-600" /> My Listings
                      </Link>
                      <Link to="/my-needs" className="flex items-center gap-2 px-4 py-2 hover:bg-forest-50 text-charcoal-700">
                        <FileQuestion className="w-4 h-4 text-forest-600" /> My Needs
                      </Link>
                      <Link to="/matches" className="flex items-center gap-2 px-4 py-2 hover:bg-forest-50 text-charcoal-700">
                        <Sparkles className="w-4 h-4 text-forest-600" /> Matched Resources
                      </Link>
                      <Link to="/favorites" className="flex items-center gap-2 px-4 py-2 hover:bg-forest-50 text-charcoal-700">
                        <Heart className="w-4 h-4 text-forest-600" /> Favorites
                      </Link>
                      <Link to="/requests" className="flex items-center gap-2 px-4 py-2 hover:bg-forest-50 text-charcoal-700">
                        <Package className="w-4 h-4 text-forest-600" /> Requests & Reservations
                      </Link>

                      {profile?.is_admin && (
                        <div className="border-t border-charcoal-100 my-1 pt-1">
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 text-amber-900 font-semibold">
                            <ShieldAlert className="w-4 h-4 text-amber-600" /> Admin Moderation Portal
                          </Link>
                        </div>
                      )}

                      <div className="border-t border-charcoal-100 my-1 pt-1">
                        <Link to="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-forest-50 text-charcoal-700">
                          <Settings className="w-4 h-4 text-charcoal-500" /> Account Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 font-medium text-left"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-charcoal-700 hover:text-forest-700 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-forest-700 text-white hover:bg-forest-800 shadow-xs transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {user && (
              <Link to="/notifications" className="relative p-2 text-charcoal-600">
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-600 hover:bg-charcoal-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-charcoal-100 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-charcoal-700 hover:bg-forest-50"
          >
            Explore Resources
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-charcoal-700 hover:bg-forest-50"
          >
            Resource Categories
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-charcoal-700 hover:bg-forest-50"
          >
            How It Works
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-charcoal-700 hover:bg-forest-50"
          >
            About ReLoop
          </Link>
          <Link
            to="/safety-and-guidelines"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-charcoal-700 hover:bg-forest-50"
          >
            Safety Guidelines
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-charcoal-700 hover:bg-forest-50"
          >
            Contact & Support
          </Link>

          {user ? (
            <div className="pt-4 border-t border-charcoal-100 space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-forest-800 bg-forest-50"
              >
                Dashboard
              </Link>
              <Link
                to="/resources/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-charcoal-700 hover:bg-charcoal-50"
              >
                List a Resource
              </Link>
              <Link
                to="/needs/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-charcoal-700 hover:bg-charcoal-50"
              >
                Publish a Need
              </Link>
              <Link
                to="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-charcoal-700 hover:bg-charcoal-50"
              >
                Messages ({unreadMsgs})
              </Link>
              <Link
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-charcoal-700 hover:bg-charcoal-50"
              >
                Requests & Reservations
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-charcoal-700 hover:bg-charcoal-50"
              >
                Favorites
              </Link>
              {profile?.is_admin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg font-bold text-amber-800 bg-amber-50"
                >
                  Admin Portal
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-charcoal-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-charcoal-200 text-sm font-semibold text-charcoal-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-forest-700 text-sm font-semibold text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

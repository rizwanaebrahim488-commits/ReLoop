import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Package,
  FileQuestion,
  Sparkles,
  Heart,
  CalendarCheck,
  MessageSquare,
  Bell,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Users,
  Flag,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DashboardLayout({ children, title, subtitle, action }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
      isActive
        ? 'bg-forest-700 text-white shadow-xs font-semibold'
        : 'text-charcoal-600 hover:text-forest-800 hover:bg-forest-50'
    }`;

  const adminNavItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
      isActive
        ? 'bg-amber-600 text-white shadow-xs font-semibold'
        : 'text-amber-900 hover:bg-amber-50'
    }`;

  return (
    <div className="min-h-screen bg-offwhite flex flex-col">
      {/* Mobile Sidebar Trigger Bar */}
      <div className="lg:hidden bg-white border-b border-charcoal-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-charcoal-800 px-2.5 py-1.5 rounded-lg border border-charcoal-200 hover:bg-charcoal-50"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Dashboard Menu</span>
        </button>
        <span className="text-xs font-semibold text-charcoal-700 truncate max-w-[150px]">
          {profile?.full_name}
        </span>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Navigation Sidebar */}
          <aside className={`lg:block ${sidebarOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-6`}>
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-5 border border-charcoal-100 shadow-xs">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={profile?.full_name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-forest-200"
                />
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm text-charcoal-900 truncate">
                    {profile?.full_name || 'My Account'}
                  </h3>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-50 text-forest-700 capitalize">
                    {profile?.account_type || 'User'}
                  </span>
                </div>
              </div>

              {profile?.city && (
                <p className="text-xs text-charcoal-500 mb-4 truncate">
                  📍 {profile.city}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/resources/create"
                  className="flex items-center justify-center gap-1 py-2 px-2 text-[11px] font-semibold rounded-lg bg-forest-700 text-white hover:bg-forest-800 transition shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-fresh-300" />
                  <span>List Resource</span>
                </Link>
                <Link
                  to="/needs/create"
                  className="flex items-center justify-center gap-1 py-2 px-2 text-[11px] font-semibold rounded-lg bg-charcoal-100 text-charcoal-800 hover:bg-charcoal-200 transition"
                >
                  <FileQuestion className="w-3.5 h-3.5 text-charcoal-600" />
                  <span>Publish Need</span>
                </Link>
              </div>
            </div>

            {/* Main Navigation Links */}
            <nav className="bg-white rounded-2xl p-3 border border-charcoal-100 shadow-xs space-y-1">
              <NavLink to="/dashboard" className={navItemClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/profile" className={navItemClass}>
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </NavLink>
              <NavLink to="/my-listings" className={navItemClass}>
                <Package className="w-4 h-4" />
                <span>My Listings</span>
              </NavLink>
              <NavLink to="/my-needs" className={navItemClass}>
                <FileQuestion className="w-4 h-4" />
                <span>My Needs</span>
              </NavLink>
              <NavLink to="/matches" className={navItemClass}>
                <Sparkles className="w-4 h-4" />
                <span>Matched Resources</span>
              </NavLink>
              <NavLink to="/requests" className={navItemClass}>
                <CalendarCheck className="w-4 h-4" />
                <span>Requests & Reservations</span>
              </NavLink>
              <NavLink to="/favorites" className={navItemClass}>
                <Heart className="w-4 h-4" />
                <span>Favorites</span>
              </NavLink>
              <NavLink to="/messages" className={navItemClass}>
                <MessageSquare className="w-4 h-4" />
                <span>Messaging</span>
              </NavLink>
              <NavLink to="/notifications" className={navItemClass}>
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </NavLink>
              <NavLink to="/settings" className={navItemClass}>
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </NavLink>

              {/* Admin Section if applicable */}
              {profile?.is_admin && (
                <div className="pt-3 mt-3 border-t border-charcoal-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 px-3 block">
                    Admin Moderation
                  </span>
                  <NavLink to="/admin" end className={adminNavItemClass}>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin Overview</span>
                  </NavLink>
                  <NavLink to="/admin/users" className={adminNavItemClass}>
                    <Users className="w-4 h-4" />
                    <span>User Verification</span>
                  </NavLink>
                  <NavLink to="/admin/listings" className={adminNavItemClass}>
                    <Package className="w-4 h-4" />
                    <span>Listing Moderation</span>
                  </NavLink>
                  <NavLink to="/admin/reports" className={adminNavItemClass}>
                    <Flag className="w-4 h-4" />
                    <span>Reports & Support</span>
                  </NavLink>
                </div>
              )}

              <div className="pt-3 mt-3 border-t border-charcoal-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {/* Header / Breadcrumb / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-charcoal-200/80 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-charcoal-500 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              {action && <div>{action}</div>}
            </div>

            {/* Page Body */}
            <div>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

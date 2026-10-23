import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Recycle,
  Plus,
  Search,
  MapPin,
  ChevronDown,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Navigation,
  Loader2,
  Check,
  ShieldCheck,
  HelpCircle,
  FileQuestion,
  Layers,
  Heart,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserNotifications } from '../services/notificationsService';
import { getUserConversations } from '../services/messagesService';

const POPULAR_CITIES = [
  { name: 'All Locations', subtitle: 'Search everywhere' },
  { name: 'Bengaluru', subtitle: 'Karnataka, India' },
  { name: 'Mumbai', subtitle: 'Maharashtra, India' },
  { name: 'Delhi NCR', subtitle: 'Delhi, India' },
  { name: 'Hyderabad', subtitle: 'Telangana, India' },
  { name: 'Chennai', subtitle: 'Tamil Nadu, India' },
  { name: 'Portland', subtitle: 'Oregon, USA' },
  { name: 'Seattle', subtitle: 'Washington, USA' },
  { name: 'New York', subtitle: 'New York, USA' }
];

export function Navbar() {
  const { user, profile, signOut, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and Location States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All Locations');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  // User UI states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  const locationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Sync state with URL params
  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) setSearchTerm(s);
    const l = searchParams.get('location');
    if (l !== null) setSelectedLocation(l || 'All Locations');
  }, [searchParams]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Polling unread counts
  useEffect(() => {
    if (user?.id) {
      loadBadgeCounts();
      const interval = setInterval(loadBadgeCounts, 10000);
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

  // Real place search for location dropdown
  useEffect(() => {
    if (!locationInput || locationInput.trim().length < 2) {
      setLocationSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingLocation(true);
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(locationInput.trim())}&limit=5`);
        const data = await res.json();
        if (data && data.features) {
          const list = data.features.map(f => {
            const p = f.properties || {};
            const primary = p.name || p.city || 'Location';
            const sub = [p.locality || p.district, p.city, p.state, p.country].filter(Boolean).filter(x => x !== primary).join(', ');
            return {
              name: primary,
              subtitle: sub || p.country || ''
            };
          });
          setLocationSuggestions(list);
        }
      } catch (err) {
        // ignore
      } finally {
        setSearchingLocation(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [locationInput]);

  // Handle location selection
  const handleSelectLocation = (locName) => {
    setSelectedLocation(locName);
    setLocationDropdownOpen(false);
    setLocationInput('');

    // Update query params
    const params = new URLSearchParams(searchParams);
    if (locName === 'All Locations' || !locName) {
      params.delete('location');
    } else {
      params.set('location', locName);
    }
    setSearchParams(params);

    if (window.location.hash.split('?')[0] !== '#/') {
      navigate(`/?${params.toString()}`);
    }
  };

  // GPS Current Location Detection
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=12&addressdetails=1`
          );
          const data = await res.json();
          const city = data?.address?.city || data?.address?.town || data?.address?.suburb || 'Current Location';
          handleSelectLocation(city);
        } catch (e) {
          handleSelectLocation('Current Location');
        } finally {
          setDetectingGps(false);
        }
      },
      () => {
        setDetectingGps(false);
        alert('Could not determine your GPS location. Please select from the list.');
      },
      { timeout: 7000 }
    );
  };

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    if (selectedLocation && selectedLocation !== 'All Locations') {
      params.set('location', selectedLocation);
    }
    setSearchParams(params);

    if (window.location.hash.split('?')[0] !== '#/') {
      navigate(`/?${params.toString()}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-charcoal-200/90 shadow-2xs">
      {/* Top Main Navigation (OLX / Flipkart Style) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8" ref={locationRef}>
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 sm:gap-4">
          {/* 1. Logo & Mobile Location Pill */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link to="/" className="flex items-center space-x-2 shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-md">
                <Recycle className="w-5 h-5 md:w-6 md:h-6 text-fresh-300" />
              </div>
              <div>
                <span className="font-black text-xl md:text-2xl tracking-tight text-forest-950 block leading-tight">
                  Re<span className="text-forest-600">Loop</span>
                </span>
                <span className="text-[9px] md:text-[10px] text-charcoal-500 font-semibold tracking-wide hidden sm:block">
                  Resource Exchange
                </span>
              </div>
            </Link>

            {/* Mobile Location Selector Pill (OLX-style city quick button) */}
            <button
              type="button"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="md:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg border border-charcoal-200 bg-forest-50/70 hover:bg-forest-100/80 text-xs font-bold text-forest-900 transition max-w-[125px] truncate shadow-2xs"
              title="Change city"
            >
              <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
              <span className="truncate text-[11px]">
                {selectedLocation === 'All Locations' ? 'All Cities' : selectedLocation}
              </span>
              <ChevronDown className={`w-3 h-3 text-forest-600 shrink-0 transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* 2. Desktop Location Selector Box */}
          <div className="relative hidden md:block shrink-0 w-48 lg:w-60">
            <button
              type="button"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 border-charcoal-300 hover:border-forest-600 bg-white transition text-xs font-bold text-charcoal-900 shadow-2xs group"
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
                <span className="truncate">{selectedLocation}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-charcoal-400 group-hover:text-charcoal-700 transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Location Dropdown Modal (Works for both Mobile pill and Desktop box) */}
          {locationDropdownOpen && (
            <div className="fixed inset-x-3 top-16 md:absolute md:top-18 md:left-44 lg:md:left-56 md:inset-x-auto md:w-80 bg-white rounded-2xl shadow-2xl border border-charcoal-200 z-50 overflow-hidden divide-y divide-charcoal-100 animate-in fade-in duration-150">
              {/* GPS detect button */}
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={detectingGps}
                className="w-full p-3 text-left hover:bg-forest-50 transition flex items-center gap-2.5 text-xs font-bold text-forest-800 bg-forest-50/40"
              >
                {detectingGps ? (
                  <Loader2 className="w-4 h-4 animate-spin text-forest-600 shrink-0" />
                ) : (
                  <Navigation className="w-4 h-4 text-forest-600 shrink-0" />
                )}
                <span>{detectingGps ? 'Detecting your city...' : 'Use Current Location'}</span>
              </button>

              {/* Location search input */}
              <div className="p-2.5 bg-offwhite">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Search city or area..."
                    className="w-full pl-8 pr-2.5 py-1.5 bg-white rounded-lg border border-charcoal-200 text-xs focus:ring-1 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Autocomplete suggestions or popular cities */}
              <div className="max-h-60 overflow-y-auto p-1.5">
                {locationSuggestions.length > 0 ? (
                  locationSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectLocation(sug.name)}
                      className="w-full p-2 text-left hover:bg-forest-50 rounded-lg transition text-xs font-semibold text-charcoal-800 flex items-center justify-between"
                    >
                      <div className="truncate">
                        <span className="block truncate">{sug.name}</span>
                        <span className="text-[10px] text-charcoal-400 block truncate">{sug.subtitle}</span>
                      </div>
                      {selectedLocation === sug.name && <Check className="w-3.5 h-3.5 text-forest-600" />}
                    </button>
                  ))
                ) : (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block px-2 py-1">
                      Popular Locations
                    </span>
                    {POPULAR_CITIES.map((city, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectLocation(city.name)}
                        className={`w-full p-2 text-left hover:bg-forest-50 rounded-lg transition text-xs font-semibold flex items-center justify-between ${
                          selectedLocation === city.name ? 'text-forest-800 bg-forest-50/70' : 'text-charcoal-700'
                        }`}
                      >
                        <div className="truncate">
                          <span className="block truncate">{city.name}</span>
                          <span className="text-[10px] text-charcoal-400 block truncate">{city.subtitle}</span>
                        </div>
                        {selectedLocation === city.name && <Check className="w-3.5 h-3.5 text-forest-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Main Search Bar (Desktop View Only - Full width dedicated bar is below for mobile) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:block flex-1 max-w-xl relative">
            <div className="flex items-center rounded-xl border-2 border-charcoal-300 focus-within:border-forest-600 bg-white transition shadow-2xs overflow-hidden">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find timber, laptops, appliances, furniture, books, surplus..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                aria-label="Search items"
                className="px-4 sm:px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center shrink-0"
              >
                <Search className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          {/* 4. About Link (Positioned in Navbar next to Search Bar on Desktop) */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hidden md:inline-flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                isActive
                  ? 'bg-forest-100 text-forest-800 border border-forest-300'
                  : 'text-charcoal-700 hover:text-forest-700 hover:bg-forest-50'
              }`
            }
          >
            About
          </NavLink>

          {/* 5. Right Side: Chat, Notifications, User Profile & + POST Button */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Admin Portal Shortcut (when logged in as admin) */}
            {profile?.is_admin && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition border border-amber-300 shadow-2xs"
                title="Admin Control Center"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin</span>
              </Link>
            )}

            {/* Messages Icon (when logged in) */}
            {user && (
              <Link
                to="/messages"
                className="relative p-2.5 rounded-full text-charcoal-600 hover:text-forest-700 hover:bg-forest-50 transition"
                title="Messages & Chats"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMsgs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-forest-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {unreadMsgs}
                  </span>
                )}
              </Link>
            )}

            {/* Notifications Icon (when logged in) */}
            {user && (
              <Link
                to="/notifications"
                className="relative p-2.5 rounded-full text-charcoal-600 hover:text-forest-700 hover:bg-forest-50 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {unreadNotifs}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile or Login Button */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-charcoal-100 transition"
                >
                  <img
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-charcoal-200"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-500 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-charcoal-100 py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-charcoal-100">
                      <span className="font-bold text-charcoal-900 block truncate">
                        {profile?.full_name || 'Community Member'}
                      </span>
                      <span className="text-[11px] text-charcoal-400 block truncate">
                        {user.email}
                      </span>
                    </div>

                    {profile?.is_admin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-amber-900 bg-amber-50 hover:bg-amber-100 font-bold border-b border-amber-200/60"
                      >
                        🛡️ Admin Moderation Center
                      </Link>
                    )}

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-listings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 font-medium"
                    >
                      My Resource Listings
                    </Link>
                    <Link
                      to="/my-needs"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 font-medium"
                    >
                      My Published Needs
                    </Link>
                    <Link
                      to="/requests"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 font-medium"
                    >
                      Exchange Requests
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 font-medium"
                    >
                      Saved Favorites
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 font-medium"
                    >
                      Profile Settings
                    </Link>

                    <div className="pt-1 mt-1 border-t border-charcoal-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-forest-800 hover:text-forest-900 hover:underline transition"
              >
                Login
              </Link>
            )}

            {/* 5. OLX Style "+ POST" / "+ SELL" Button */}
            <Link
              to="/resources/create"
              className="inline-flex items-center gap-1 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-forest-700 md:bg-white md:hover:bg-forest-50 text-white md:text-forest-900 border-2 border-forest-600 hover:border-forest-700 transition shadow-xs group font-black text-xs sm:text-sm shrink-0"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white md:text-forest-700 group-hover:scale-110 transition-transform stroke-[3]" />
              <span className="uppercase tracking-wide text-[11px] sm:text-xs">POST</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-charcoal-600 hover:bg-charcoal-100 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Dedicated Mobile Search Row (Full width on mobile, prominent Search Icon and button) */}
        <div className="md:hidden pb-3 pt-0.5">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center w-full rounded-xl border-2 border-charcoal-300 focus-within:border-forest-600 bg-white shadow-2xs overflow-hidden transition">
              <Search className="w-4 h-4 text-forest-700 absolute left-3 pointer-events-none shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find timber, laptops, appliances, surplus..."
                className="w-full pl-9 pr-20 py-2.5 text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none bg-transparent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    const params = new URLSearchParams(searchParams);
                    params.delete('search');
                    setSearchParams(params);
                  }}
                  className="p-1 text-charcoal-400 hover:text-charcoal-700 mr-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Search items"
                className="px-3.5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs transition flex items-center gap-1 shrink-0"
              >
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-charcoal-100 space-y-3 animate-in fade-in duration-150">
            {/* Mobile Nav Links */}
            <div className="space-y-1 text-xs font-semibold">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2.5 rounded-xl text-charcoal-800 hover:bg-forest-50 hover:text-forest-800"
              >
                About, Safety & Support
              </Link>
              <Link
                to="/resources/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2.5 rounded-xl text-forest-800 bg-forest-50 font-bold"
              >
                + Post a Resource
              </Link>
              <Link
                to="/needs/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2.5 rounded-xl text-charcoal-700 hover:bg-forest-50"
              >
                Publish a Material Need
              </Link>

              {user ? (
                <>
                  <div className="pt-2 border-t border-charcoal-100">
                    <span className="text-[10px] uppercase font-bold text-charcoal-400 px-2.5 block mb-1">
                      My Account
                    </span>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2.5 rounded-xl text-charcoal-700 hover:bg-forest-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-listings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2.5 rounded-xl text-charcoal-700 hover:bg-forest-50"
                    >
                      My Resource Listings
                    </Link>
                    <Link
                      to="/my-needs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2.5 rounded-xl text-charcoal-700 hover:bg-forest-50"
                    >
                      My Published Needs
                    </Link>
                    <Link
                      to="/requests"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2.5 rounded-xl text-charcoal-700 hover:bg-forest-50"
                    >
                      Exchange Requests
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2.5 rounded-xl text-charcoal-700 hover:bg-forest-50"
                    >
                      Saved Favorites
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2.5 rounded-xl text-charcoal-700 hover:bg-forest-50"
                    >
                      Profile Settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-charcoal-100">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2.5 rounded-xl text-center bg-forest-700 text-white font-bold"
                  >
                    Login / Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

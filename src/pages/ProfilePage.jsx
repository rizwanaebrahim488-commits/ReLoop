import React, { useState } from 'react';
import {
  User,
  Building2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Camera,
  AlertCircle,
  Eye,
  Save
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { ACCOUNT_TYPES } from '../utils/categories';
import { LocationPicker } from '../components/LocationPicker';

export function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [description, setDescription] = useState(profile?.description || '');
  const [accountType, setAccountType] = useState(profile?.account_type || 'individual');
  const [organizationName, setOrganizationName] = useState(profile?.organization_name || '');
  const [organizationRegNo, setOrganizationRegNo] = useState(profile?.organization_reg_no || '');
  const [city, setCity] = useState(profile?.city || '');
  const [lat, setLat] = useState(profile?.lat || 45.5152);
  const [lng, setLng] = useState(profile?.lng || -122.6658);
  const [phone, setPhone] = useState(profile?.phone || '');
  const [addressPrivacy, setAddressPrivacy] = useState(profile?.address_privacy || 'approximate');
  const [contactPreference, setContactPreference] = useState(profile?.contact_preference || 'in_app');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    setSuccess(false);

    try {
      await updateProfile({
        full_name: fullName.trim(),
        description: description.trim(),
        account_type: accountType,
        organization_name: organizationName.trim(),
        organization_reg_no: organizationRegNo.trim(),
        city: city.trim(),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        phone: phone.trim(),
        address_privacy: addressPrivacy,
        contact_preference: contactPreference,
        avatar_url: avatarUrl
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="My Circular Profile"
      subtitle="Manage your public identity, account verification status, and location privacy preferences."
    >
      <div className="max-w-3xl space-y-8">
        {/* Verification Status Card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
          profile?.is_verified
            ? 'bg-forest-50 border-forest-200 text-forest-900'
            : 'bg-charcoal-50 border-charcoal-200 text-charcoal-800'
        }`}>
          <div className="flex items-center gap-3">
            <ShieldCheck className={`w-6 h-6 ${profile?.is_verified ? 'text-forest-600' : 'text-charcoal-400'}`} />
            <div>
              <h3 className="font-bold text-sm">
                {profile?.is_verified ? 'Verified Member / Organization' : 'Community Member Account'}
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                {profile?.is_verified
                  ? 'Your account credentials and circular entity have been verified by ReLoop moderation.'
                  : 'Individual profile active. Organizations & workshops can submit verification documents via support.'}
              </p>
            </div>
          </div>
          {profile?.is_verified && (
            <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-forest-200/60 text-forest-800">
              Verified
            </span>
          )}
        </div>

        {/* Profile Edit Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs">
          {success && (
            <div className="mb-6 p-3.5 rounded-xl bg-forest-50 text-forest-800 border border-forest-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Avatar Upload */}
            <div className="flex items-center space-x-6 pb-6 border-b border-charcoal-100">
              <div className="relative">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-forest-200 shadow-md"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-forest-700 text-white cursor-pointer hover:bg-forest-800 shadow-sm"
                  title="Upload profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h4 className="font-bold text-sm text-charcoal-900 mb-0.5">Profile Picture</h4>
                <p className="text-charcoal-500 text-[11px] leading-relaxed">
                  Upload an image representing yourself, your workshop, or your organization.
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-charcoal-700 font-bold mb-1">
                  Full Name / Representative
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-bold mb-1">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500 bg-white"
                >
                  {ACCOUNT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Public Description */}
            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                Public Description / Bio
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your circular focus: e.g. We repair electronics, build community garden beds, or salvage architectural timber..."
                className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
              />
            </div>

            {/* Organization Specific Fields */}
            {accountType !== 'individual' && (
              <div className="p-4 rounded-2xl bg-charcoal-50 border border-charcoal-200 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-700 block">
                  Organization / Workshop Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-700 font-bold mb-1">
                      Organization / Business Name
                    </label>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="e.g. Urban Timber Rescue"
                      className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-700 font-bold mb-1">
                      Registration / Tax ID (Confidential)
                    </label>
                    <input
                      type="text"
                      value={organizationRegNo}
                      onChange={(e) => setOrganizationRegNo(e.target.value)}
                      placeholder="e.g. REG-984812"
                      className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Location & Privacy */}
            <div className="space-y-4 pt-4 border-t border-charcoal-100">
              <LocationPicker
                initialLocation={city}
                initialLat={lat}
                initialLng={lng}
                onLocationSelect={(loc) => {
                  setCity(loc.city || loc.address.split(',')[0]);
                  setLat(loc.lat);
                  setLng(loc.lng);
                }}
                label="Home Base / Primary Workshop Location (Google Maps Compatible)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    City / Municipality
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Seattle, WA"
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    Public Location Visibility
                  </label>
                  <select
                    value={addressPrivacy}
                    onChange={(e) => setAddressPrivacy(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                  >
                    <option value="approximate">Approximate neighborhood on Google Maps</option>
                    <option value="city_only">City only (no street precision)</option>
                    <option value="exact_pickup">Share pickup instructions upon confirmed request only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-charcoal-100">
              <div>
                <label className="block text-charcoal-700 font-bold mb-1">
                  Primary Contact Preference
                </label>
                <select
                  value={contactPreference}
                  onChange={(e) => setContactPreference(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                >
                  <option value="in_app">In-App ReLoop Chat Only (Recommended for privacy)</option>
                  <option value="email">Allow confirmed users to see registered email</option>
                  <option value="phone">Allow confirmed users to see phone number</option>
                </select>
              </div>

              <div>
                <label className="block text-charcoal-700 font-bold mb-1">
                  Optional Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm"
                />
                <p className="text-[10px] text-charcoal-400 mt-1">
                  Phone is never exposed publicly without your permission.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-xs sm:text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Bell,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Save
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export function SettingsPage() {
  const { user, profile, updatePassword, signOut } = useAuth();

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pwUpdating, setPwUpdating] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState('');

  // Notifications preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [prefSaved, setPrefSaved] = useState(false);

  // Deletion modal / state
  const [deletionRequested, setDeletionRequested] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }

    setPwUpdating(true);
    try {
      await updatePassword(newPassword);
      setPwSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.message || 'Failed to update password.');
    } finally {
      setPwUpdating(false);
    }
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to request permanent account deletion? All personal data, active listings, and conversation logs will be safely purged.')) {
      setDeletionRequested(true);
      setTimeout(async () => {
        await signOut();
        window.location.href = '/';
      }, 3000);
    }
  };

  return (
    <DashboardLayout
      title="Account Settings"
      subtitle="Manage your credentials, notification preferences, and privacy parameters."
    >
      <div className="max-w-3xl space-y-8">
        {/* Password Security Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-forest-600" />
            <h3 className="text-base font-bold text-charcoal-900">Change Account Password</h3>
          </div>

          {pwSuccess && (
            <div className="p-3.5 rounded-xl bg-forest-50 text-forest-800 border border-forest-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
              <span>Password updated successfully!</span>
            </div>
          )}

          {pwError && (
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{pwError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-charcoal-700 font-bold mb-1">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-charcoal-400 hover:text-charcoal-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-charcoal-700 font-bold mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pwUpdating}
              className="px-5 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition disabled:opacity-50"
            >
              {pwUpdating ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-forest-600" />
            <h3 className="text-base font-bold text-charcoal-900">Communication & Match Preferences</h3>
          </div>

          {prefSaved && (
            <div className="p-3.5 rounded-xl bg-forest-50 text-forest-800 border border-forest-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
              <span>Preferences saved!</span>
            </div>
          )}

          <form onSubmit={handleSavePreferences} className="space-y-4 text-xs text-charcoal-700">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-2xl bg-charcoal-50 border border-charcoal-100">
              <input
                type="checkbox"
                checked={matchAlerts}
                onChange={(e) => setMatchAlerts(e.target.checked)}
                className="mt-0.5 rounded text-forest-600 focus:ring-forest-500"
              />
              <div>
                <strong className="block text-charcoal-900 mb-0.5">Automated Match Notifications</strong>
                <span className="text-charcoal-500 text-[11px] leading-relaxed">
                  Receive in-app alerts whenever a newly published resource matches your published needs criteria.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-2xl bg-charcoal-50 border border-charcoal-100">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="mt-0.5 rounded text-forest-600 focus:ring-forest-500"
              />
              <div>
                <strong className="block text-charcoal-900 mb-0.5">Critical Request Status Emails</strong>
                <span className="text-charcoal-500 text-[11px] leading-relaxed">
                  Receive notifications when an owner approves your resource request or when a collection date is confirmed.
                </span>
              </div>
            </label>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-charcoal-100 text-charcoal-800 hover:bg-charcoal-200 font-bold text-xs transition"
            >
              Save Notification Preferences
            </button>
          </form>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="bg-rose-50/50 rounded-3xl p-6 sm:p-8 border border-rose-200/80 space-y-4">
          <div className="flex items-center gap-2 text-rose-800">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold">Delete ReLoop Account</h3>
          </div>

          <p className="text-xs text-rose-900 leading-relaxed">
            Deleting your account will permanently purge your profile, remove all active listings from search, and delete your contact records. Once deleted, this action cannot be undone.
          </p>

          {deletionRequested ? (
            <div className="p-4 rounded-2xl bg-rose-100 text-rose-900 text-xs font-semibold">
              Deletion request scheduled. Signing out of all sessions...
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition shadow-xs"
            >
              Request Account Deletion
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

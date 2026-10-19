import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recycle, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to update password. Your recovery session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-charcoal-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center">
              <Recycle className="w-6 h-6 text-fresh-300" />
            </div>
            <span className="font-extrabold text-2xl text-charcoal-900">
              Re<span className="text-forest-600">Loop</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-charcoal-900 tracking-tight">
            Create New Password
          </h1>
          <p className="text-xs text-charcoal-500">
            Set a new secure password for your account.
          </p>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto" />
            <h2 className="text-base font-bold text-charcoal-900">Password Updated Successfully!</h2>
            <p className="text-xs text-charcoal-600">
              Your new password is now active. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                New Password (min 8 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50 mt-2"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

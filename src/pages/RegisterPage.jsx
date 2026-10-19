import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Recycle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { ACCOUNT_TYPES } from '../utils/categories';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('individual');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please complete all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the community terms and safety guidelines.');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        account_type: accountType
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
            Create Free Account
          </h1>
          <p className="text-xs text-charcoal-500">
            Join the local circular sharing and waste diversion community.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto" />
            <h2 className="text-lg font-bold text-charcoal-900">Registration Successful!</h2>
            <p className="text-xs text-charcoal-600">
              Your profile has been created. Redirecting you to your circular dashboard...
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

            {/* Full Name */}
            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                Full Name or Organization Rep
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
                <User className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.org"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                Account Type
              </label>
              <div className="relative">
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500 bg-white"
                >
                  {ACCOUNT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <Building2 className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              </div>
              <p className="text-[10px] text-charcoal-400 mt-1">
                Note: Business, NGO, or workshop accounts undergo manual verification before a verified badge is granted.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                Password (min 8 characters)
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

            {/* Confirm Password */}
            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                Confirm Password
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

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-forest-600 focus:ring-forest-500"
              />
              <label htmlFor="terms" className="text-charcoal-600 text-[11px] leading-relaxed">
                I agree to the <Link to="/safety-and-guidelines" className="text-forest-700 underline font-semibold">Terms & Safety Guidelines</Link>, acknowledging that ReLoop provides direct matching with independent self-collection and no delivery services.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50 mt-4"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-charcoal-100 text-center text-xs text-charcoal-500">
          Already registered?{' '}
          <Link to="/login" className="text-forest-700 font-bold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Recycle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, switchDemoUser, isSupabaseConnected } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (userId) => {
    switchDemoUser(userId);
    navigate('/dashboard');
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
            Sign In to ReLoop
          </h1>
          <p className="text-xs text-charcoal-500">
            Access your resources, published needs, requests, and direct chats.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Email */}
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

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-charcoal-700 font-bold">
                Password
              </label>
              <Link to="/forgot-password" className="text-forest-700 hover:underline font-semibold text-[11px]">
                Forgot password?
              </Link>
            </div>
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

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-charcoal-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-forest-600 focus:ring-forest-500"
              />
              <span>Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Reviewer Demo Accounts */}
        {!isSupabaseConnected && (
          <div className="pt-4 border-t border-charcoal-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 block mb-2 text-center">
              Quick Reviewer Logins
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-1')}
                className="p-2 rounded-xl bg-charcoal-50 hover:bg-forest-50 hover:text-forest-800 font-semibold border border-charcoal-200 transition text-left"
              >
                🪵 Elena (Workshop)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-2')}
                className="p-2 rounded-xl bg-charcoal-50 hover:bg-forest-50 hover:text-forest-800 font-semibold border border-charcoal-200 transition text-left"
              >
                🌱 Marcus (NGO)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-3')}
                className="p-2 rounded-xl bg-charcoal-50 hover:bg-forest-50 hover:text-forest-800 font-semibold border border-charcoal-200 transition text-left"
              >
                ⚡ Amina (Repairer)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-admin')}
                className="p-2 rounded-xl bg-charcoal-50 hover:bg-amber-50 hover:text-amber-800 font-semibold border border-charcoal-200 transition text-left"
              >
                🛡️ ReLoop Admin
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 text-center text-xs text-charcoal-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-forest-700 font-bold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Recycle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkRateLimit, sanitizeText } from '../utils/security';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, sendOtp, verifyOtp, isSupabaseConnected } = useAuth();

  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  // Password Login
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = sanitizeText(email).toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Rate Limiting Protection (Anti-Brute Force)
    const rateCheck = checkRateLimit(`login_${cleanEmail}`, { maxAttempts: 5, windowMs: 60000 });
    if (!rateCheck.allowed) {
      setError(`Too many login attempts. For security, please wait ${rateCheck.retryAfterSec} seconds.`);
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: cleanEmail, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = sanitizeText(email).toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Rate Limiting on OTP Dispatch
    const rateCheck = checkRateLimit(`otp_${cleanEmail}`, { maxAttempts: 3, windowMs: 60000 });
    if (!rateCheck.allowed) {
      setError(`Verification code requests exceeded. Please wait ${rateCheck.retryAfterSec} seconds.`);
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(cleanEmail);
      setOtpSent(true);
      setGeneratedOtpDisplay(res.code);
      setSuccessMsg(`Verification code sent to ${cleanEmail}`);
    } catch (err) {
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpCode.trim()) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({ email: email.trim(), otp: otpCode.trim() });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-charcoal-200/80 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-md">
              <Recycle className="w-6 h-6 text-fresh-300" />
            </div>
            <span className="font-extrabold text-2xl text-charcoal-900">
              Re<span className="text-forest-600">Loop</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-charcoal-500">
            No registration needed — enter your email to access your resources and chats.
          </p>
        </div>

        {/* Login Method Tabs */}
        <div className="flex rounded-2xl bg-charcoal-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setLoginMode('password');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition ${
              loginMode === 'password'
                ? 'bg-white text-charcoal-900 shadow-xs'
                : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('otp');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition ${
              loginMode === 'otp'
                ? 'bg-white text-charcoal-900 shadow-xs'
                : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Email OTP Login
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode 1: Password Login Form */}
        {loginMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              </div>
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Mode 2: OTP Login Form */}
        {loginMode === 'otp' && (
          <div className="space-y-4 text-xs">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    Enter Email for OTP
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                    />
                    <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* OTP Demo Banner */}
                {generatedOtpDisplay && (
                  <div className="p-3 bg-forest-50 rounded-xl border border-forest-200 text-center space-y-1">
                    <span className="text-[11px] text-forest-800 font-medium block">
                      Demo verification code:
                    </span>
                    <span className="font-mono font-black text-lg tracking-widest text-forest-900 bg-white px-3 py-1 rounded-lg border border-forest-300 inline-block">
                      {generatedOtpDisplay}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    Enter 6-Digit Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-charcoal-200 text-center font-mono text-base tracking-widest focus:ring-2 focus:ring-forest-500"
                    />
                    <KeyRound className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Code & Sign In'}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                    }}
                    className="text-xs text-charcoal-500 hover:text-charcoal-800 font-semibold underline"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* No Registration Note */}
        <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-200 text-center text-xs text-forest-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-forest-600 inline mr-1.5 -mt-0.5" />
          <span>New members are automatically activated upon first sign-in.</span>
        </div>
      </div>
    </div>
  );
}

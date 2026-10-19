import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Mail, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordForEmail(email.trim());
      // Always show generic message for security
      setSubmitted(true);
    } catch (err) {
      // Still display generic confirmation to avoid account enumeration
      setSubmitted(true);
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
            Reset Password
          </h1>
          <p className="text-xs text-charcoal-500">
            Enter your email to receive recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-charcoal-900">Recovery Instructions Sent</h2>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              If an account is associated with <span className="font-semibold text-charcoal-900">{email}</span>, you will receive password reset instructions within a few moments.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
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
                Registered Email Address
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50 mt-2"
            >
              {loading ? 'Sending Recovery Link...' : 'Send Recovery Link'}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-charcoal-500 hover:text-forest-700 font-medium">
                Remember your password? Log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

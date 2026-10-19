import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Recycle, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase, isConfigured } from '../lib/supabase';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email link and restoring your secure session...');

  useEffect(() => {
    async function handleAuthCallback() {
      if (!isConfigured) {
        setStatus('success');
        setMessage('Local verification confirmed! Redirecting to your dashboard...');
        setTimeout(() => navigate('/dashboard'), 1500);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session) {
          setStatus('success');
          setMessage('Email verified successfully! Taking you to your dashboard...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          // If no session found in URL hash, give a retry message
          setStatus('error');
          setMessage('The verification link is expired, invalid, or has already been used.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'An error occurred during verification.');
      }
    }

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-charcoal-100 shadow-xl text-center space-y-6">
        <div className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center">
            <Recycle className="w-6 h-6 text-fresh-300" />
          </div>
          <span className="font-extrabold text-2xl text-charcoal-900">
            Re<span className="text-forest-600">Loop</span>
          </span>
        </div>

        {status === 'verifying' && (
          <div className="space-y-4 py-6">
            <RefreshCw className="w-10 h-10 text-forest-600 animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-charcoal-900">Verifying Authentication</h2>
            <p className="text-xs text-charcoal-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-6">
            <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto" />
            <h2 className="text-lg font-bold text-charcoal-900">Session Confirmed</h2>
            <p className="text-xs text-charcoal-600">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-6">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-lg font-bold text-charcoal-900">Verification Incomplete</h2>
            <p className="text-xs text-charcoal-600 leading-relaxed">{message}</p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                className="px-4 py-2.5 rounded-xl bg-forest-700 text-white font-semibold text-xs hover:bg-forest-800 transition"
              >
                Sign In to ReLoop
              </Link>
              <Link
                to="/"
                className="text-xs text-charcoal-500 hover:text-charcoal-700"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

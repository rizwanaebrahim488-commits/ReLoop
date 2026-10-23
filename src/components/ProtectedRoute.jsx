import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite text-xs font-semibold text-charcoal-500">
        <div className="animate-pulse flex items-center gap-2">
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !profile?.is_admin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-offwhite">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-charcoal-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
              403 - Access Restricted
            </h1>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              This portal requires verified administrative privileges. Your current account (<span className="font-semibold text-charcoal-800">{user.email}</span>) does not have moderator access.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Safe Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

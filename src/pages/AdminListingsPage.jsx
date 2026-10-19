import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flag,
  ShieldAlert,
  Package,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Ban
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getReportedListings, takeModerationAction } from '../services/adminService';
import { Badge } from '../components/Badge';

export function AdminListingsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    if (profile && !profile.is_admin) {
      navigate('/dashboard');
      return;
    }
    loadReports();
  }, [profile, navigate]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReportedListings();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId, resourceId, action) => {
    setActionId(reportId);
    try {
      await takeModerationAction({
        reportId,
        resourceId,
        action,
        notes: `Action taken by admin ${profile?.full_name}`,
        adminId: user.id
      });
      await loadReports();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardLayout
      title="Listing Moderation Queue"
      subtitle="Review community reports regarding safety violations, spoiled food, or prohibited items."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-400">
            Loading reported listings...
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map(rep => {
              const res = rep.resource;

              return (
                <div
                  key={rep.id}
                  className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-charcoal-100 gap-2">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-rose-600" />
                      <span className="font-bold text-sm text-charcoal-900">
                        Reason: {rep.reason}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={rep.status === 'pending' ? 'danger' : 'success'}>
                        {rep.status}
                      </Badge>
                      <span className="text-[11px] text-charcoal-400">
                        {new Date(rep.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-charcoal-700 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                    <span className="font-semibold text-rose-950 block mb-0.5">Reporter Statement:</span>
                    <p className="leading-relaxed">{rep.description}</p>
                  </div>

                  {res && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-charcoal-50 border border-charcoal-200 text-xs">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <img
                          src={res.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80'}
                          alt={res.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="truncate">
                          <h4 className="font-bold text-charcoal-900 truncate">{res.title}</h4>
                          <span className="text-charcoal-500">{res.category} • Current Status: {res.status}</span>
                        </div>
                      </div>

                      <Link
                        to={`/resources/${res.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-charcoal-200 rounded-lg text-charcoal-800 font-semibold hover:bg-charcoal-100 shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Listing</span>
                      </Link>
                    </div>
                  )}

                  {rep.status === 'pending' && (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        disabled={actionId === rep.id}
                        onClick={() => handleAction(rep.id, rep.reported_resource_id, 'dismiss')}
                        className="px-4 py-2 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 font-bold text-xs transition"
                      >
                        Dismiss Report (Safe)
                      </button>

                      <button
                        type="button"
                        disabled={actionId === rep.id}
                        onClick={() => handleAction(rep.id, rep.reported_resource_id, 'hide_listing')}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs"
                      >
                        Hide Listing (Unavailable)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto" />
            <h3 className="font-bold text-base text-charcoal-900">Zero Pending Reports</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              All community reports have been resolved and audited.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

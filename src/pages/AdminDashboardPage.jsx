import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Package,
  Flag,
  HelpCircle,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getAdminMetrics, getReportedListings, getSupportRequests } from '../services/adminService';
import { Badge } from '../components/Badge';

export function AdminDashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeListings: 0,
    reportedListings: 0,
    openSupportRequests: 0,
    completedExchanges: 0
  });

  const [recentReports, setRecentReports] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // RLS / Admin Guard
    if (profile && !profile.is_admin) {
      navigate('/dashboard');
      return;
    }

    async function loadAdminData() {
      setLoading(true);
      try {
        const [stats, reps, tickets] = await Promise.all([
          getAdminMetrics(),
          getReportedListings(),
          getSupportRequests()
        ]);
        setMetrics(stats);
        setRecentReports(reps.slice(0, 4));
        setRecentTickets(tickets.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [profile, navigate]);

  const cards = [
    { title: 'Registered Users', value: metrics.totalUsers, icon: Users, link: '/admin/users', color: 'text-forest-700 bg-forest-50' },
    { title: 'Active Listings', value: metrics.activeListings, icon: Package, link: '/admin/listings', color: 'text-emerald-700 bg-emerald-50' },
    { title: 'Pending Reports', value: metrics.reportedListings, icon: Flag, link: '/admin/listings', color: 'text-rose-700 bg-rose-50' },
    { title: 'Open Support Tickets', value: metrics.openSupportRequests, icon: HelpCircle, link: '/admin/reports', color: 'text-amber-700 bg-amber-50' },
    { title: 'Completed Exchanges', value: metrics.completedExchanges, icon: Award, link: '/admin', color: 'text-purple-700 bg-purple-50' },
  ];

  return (
    <DashboardLayout
      title="Admin Moderation Portal"
      subtitle="Restricted administrator console for platform integrity, verification, and audit logs."
    >
      <div className="space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.link}
                className="bg-white rounded-3xl p-5 border border-charcoal-100 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-2xl ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-extrabold text-charcoal-900">
                    {loading ? '...' : card.value}
                  </span>
                </div>
                <div className="text-xs font-semibold text-charcoal-600">
                  {card.title}
                </div>
              </Link>
            );
          })}
        </div>

        {/* 2 Column Moderation Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-charcoal-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-charcoal-900">Flagged Listings</h3>
              </div>
              <Link to="/admin/listings" className="text-xs font-bold text-forest-700 hover:underline">
                View All
              </Link>
            </div>

            {recentReports.length > 0 ? (
              <div className="divide-y divide-charcoal-100">
                {recentReports.map(rep => (
                  <div key={rep.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-900">{rep.reason}</span>
                      <Badge variant={rep.status === 'pending' ? 'danger' : 'success'}>
                        {rep.status}
                      </Badge>
                    </div>
                    <p className="text-charcoal-600 line-clamp-1">{rep.description}</p>
                    <span className="text-[10px] text-charcoal-400">
                      Reported: {new Date(rep.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-400 py-6 text-center">No reported listings pending.</p>
            )}
          </div>

          {/* Recent Support Requests */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-charcoal-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-forest-600" />
                <h3 className="text-sm font-bold text-charcoal-900">Support Inquiries</h3>
              </div>
              <Link to="/admin/reports" className="text-xs font-bold text-forest-700 hover:underline">
                View All
              </Link>
            </div>

            {recentTickets.length > 0 ? (
              <div className="divide-y divide-charcoal-100">
                {recentTickets.map(t => (
                  <div key={t.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-900">{t.subject}</span>
                      <Badge variant={t.status === 'open' ? 'warning' : 'primary'}>
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-charcoal-600 line-clamp-1">{t.message}</p>
                    <span className="text-[10px] text-charcoal-400">
                      From: {t.name} ({t.email})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-400 py-6 text-center">No open support tickets.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

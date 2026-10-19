import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Package,
  User,
  ArrowRight,
  AlertTriangle,
  Award
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getUserRequests, updateRequestStatus, completeExchange } from '../services/requestsService';
import { getOrCreateConversation } from '../services/messagesService';
import { Badge } from '../components/Badge';

export function RequestsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (user?.id) loadRequests();
  }, [user?.id]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getUserRequests(user.id);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    setActionLoading(requestId);
    try {
      await updateRequestStatus(requestId, newStatus, user.id);
      await loadRequests();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteExchange = async (req) => {
    if (!window.confirm('Confirm that this resource collection has taken place successfully?')) return;
    setActionLoading(req.id);
    try {
      await completeExchange({
        requestId: req.id,
        resourceId: req.resource_id,
        ownerId: req.owner_id,
        receiverId: req.requester_id,
        confirmedQty: req.requested_quantity,
        unit: req.resource?.unit || 'units',
        outcomeType: 'reuse',
        notes: 'Confirmed completed by participant.'
      });
      await loadRequests();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const currentList = activeTab === 'incoming' ? requests.incoming : requests.outgoing;

  return (
    <DashboardLayout
      title="Requests & Reservations"
      subtitle="Manage incoming inquiries for your resources and coordinate collection with members."
    >
      <div className="space-y-6">
        {/* Tab switch */}
        <div className="flex border-b border-charcoal-200 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'incoming'
                ? 'border-forest-700 text-forest-800'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <span>Incoming Requests ({requests.incoming.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'outgoing'
                ? 'border-forest-700 text-forest-800'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            <span>My Outgoing Requests ({requests.outgoing.length})</span>
          </button>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-400">
            Loading resource requests...
          </div>
        ) : currentList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {currentList.map(req => {
              const res = req.resource || {};
              const partner = activeTab === 'incoming' ? req.requester : req.owner;

              const statusVariants = {
                pending: 'warning',
                accepted: 'success',
                rejected: 'danger',
                cancelled: 'default',
                completed: 'primary'
              };

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariants[req.status] || 'default'}>
                        {req.status === 'accepted' ? 'Accepted & Reserved' : req.status}
                      </Badge>
                      <span className="text-xs text-charcoal-400">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-forest-600 shrink-0" />
                      <Link
                        to={`/resources/${res.id}`}
                        className="font-bold text-base text-charcoal-900 hover:text-forest-700 transition truncate"
                      >
                        {res.title || 'Requested Resource'}
                      </Link>
                    </div>

                    <div className="text-xs text-charcoal-600 space-y-1">
                      <p>
                        <strong>Quantity Requested:</strong> {req.requested_quantity} {res.unit || 'units'}
                      </p>
                      <p>
                        <strong>{activeTab === 'incoming' ? 'Requester:' : 'Owner:'}</strong> {partner?.full_name || 'Community Member'} ({partner?.city || 'Local area'})
                      </p>
                      {req.message && (
                        <p className="bg-charcoal-50 p-2.5 rounded-xl border border-charcoal-100 text-charcoal-700 italic">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-56 pt-3 md:pt-0 border-t md:border-t-0 border-charcoal-100">
                    <Link
                      to={`/messages`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-charcoal-200 text-charcoal-800 hover:bg-charcoal-50 font-semibold text-xs transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-forest-600" />
                      <span>Message Participant</span>
                    </Link>

                    {/* Owner controls for incoming */}
                    {activeTab === 'incoming' && req.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={actionLoading === req.id}
                          onClick={() => handleUpdateStatus(req.id, 'accepted')}
                          className="py-2 px-3 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === req.id}
                          onClick={() => handleUpdateStatus(req.id, 'rejected')}
                          className="py-2 px-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Requester controls for outgoing pending */}
                    {activeTab === 'outgoing' && req.status === 'pending' && (
                      <button
                        type="button"
                        disabled={actionLoading === req.id}
                        onClick={() => handleUpdateStatus(req.id, 'cancelled')}
                        className="py-2 px-3 rounded-xl bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200 font-semibold text-xs transition"
                      >
                        Cancel Request
                      </button>
                    )}

                    {/* Accepted: Both can mark Completed */}
                    {req.status === 'accepted' && (
                      <button
                        type="button"
                        disabled={actionLoading === req.id}
                        onClick={() => handleCompleteExchange(req)}
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Handoff Completed</span>
                      </button>
                    )}

                    {req.status === 'completed' && (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-forest-700 font-semibold bg-forest-50 p-2 rounded-xl">
                        <Award className="w-4 h-4" />
                        <span>Exchange Complete</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 space-y-3">
            <CalendarCheck className="w-12 h-12 text-charcoal-300 mx-auto" />
            <h3 className="font-bold text-base text-charcoal-900">
              No {activeTab} requests at this time
            </h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              When community members request quantities of your resources or accept your requests, they will appear here.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

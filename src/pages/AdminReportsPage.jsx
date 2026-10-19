import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  Save,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getSupportRequests, updateSupportTicket } from '../services/adminService';
import { Badge } from '../components/Badge';

export function AdminReportsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [statusVal, setStatusVal] = useState('');
  const [notesVal, setNotesVal] = useState('');

  useEffect(() => {
    if (profile && !profile.is_admin) {
      navigate('/dashboard');
      return;
    }
    loadTickets();
  }, [profile, navigate]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getSupportRequests();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (t) => {
    setEditingId(t.id);
    setStatusVal(t.status);
    setNotesVal(t.admin_notes || '');
  };

  const handleSaveTicket = async (tId) => {
    try {
      await updateSupportTicket(tId, statusVal, notesVal);
      setEditingId(null);
      await loadTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout
      title="Support Tickets & Inquiries"
      subtitle="Manage incoming support requests, track internal notes, and record resolution status."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-400">
            Loading support inquiries...
          </div>
        ) : tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map(t => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-charcoal-100 gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-charcoal-900">{t.subject}</h3>
                    <span className="text-xs text-charcoal-500">
                      From: <strong>{t.name}</strong> ({t.email})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={t.status === 'open' ? 'warning' : t.status === 'in_progress' ? 'primary' : 'success'}>
                      {t.status}
                    </Badge>
                    <span className="text-[11px] text-charcoal-400">
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-charcoal-700 bg-charcoal-50 p-4 rounded-2xl leading-relaxed whitespace-pre-line">
                  {t.message}
                </div>

                {editingId === t.id ? (
                  <div className="p-4 rounded-2xl bg-forest-50/50 border border-forest-200/80 space-y-3 text-xs">
                    <span className="font-bold text-forest-900 block">Edit Status & Internal Notes:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-charcoal-600 font-semibold mb-1">Status</label>
                        <select
                          value={statusVal}
                          onChange={(e) => setStatusVal(e.target.value)}
                          className="w-full p-2 rounded-xl border border-charcoal-200 text-xs bg-white"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-charcoal-600 font-semibold mb-1">Internal Admin Notes</label>
                        <input
                          type="text"
                          value={notesVal}
                          onChange={(e) => setNotesVal(e.target.value)}
                          placeholder="Add internal resolution comments..."
                          className="w-full p-2 rounded-xl border border-charcoal-200 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg border border-charcoal-200 text-charcoal-700 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveTicket(t.id)}
                        className="px-4 py-1.5 rounded-lg bg-forest-700 text-white font-bold"
                      >
                        Save Ticket
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-charcoal-500">
                      {t.admin_notes ? <span>Admin Note: <em>"{t.admin_notes}"</em></span> : <span>No internal notes yet</span>}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(t)}
                      className="px-3 py-1.5 rounded-xl border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50 text-xs font-semibold"
                    >
                      Update Status
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto" />
            <h3 className="font-bold text-base text-charcoal-900">No Support Requests Pending</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              All inquiries submitted through the contact page have been addressed.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

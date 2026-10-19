import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileQuestion,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Calendar,
  DollarSign,
  MapPin,
  Trash2,
  XCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getUserNeeds, updateNeed } from '../services/needsService';
import { Badge } from '../components/Badge';

export function MyNeedsPage() {
  const { user } = useAuth();
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadNeeds();
  }, [user?.id]);

  const loadNeeds = async () => {
    setLoading(true);
    try {
      const data = await getUserNeeds(user.id);
      setNeeds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (needId, newStatus) => {
    try {
      await updateNeed(needId, { status: newStatus });
      loadNeeds();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout
      title="My Published Needs"
      subtitle="Resources you are actively seeking for projects, workshops, or community initiatives."
      action={
        <Link
          to="/needs/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition shadow-xs"
        >
          <PlusCircle className="w-4 h-4 text-fresh-300" />
          <span>Publish a Need</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-xs text-charcoal-400">
            Loading your published needs...
          </div>
        ) : needs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {needs.map(need => (
              <div
                key={need.id}
                className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={need.status === 'active' ? 'purple' : need.status === 'fulfilled' ? 'success' : 'default'}>
                      {need.status === 'active' ? 'Active Need' : need.status === 'fulfilled' ? 'Fulfilled' : 'Cancelled'}
                    </Badge>
                    <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
                      {need.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-charcoal-900">
                    {need.title}
                  </h3>

                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                    {need.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-charcoal-500 pt-1">
                    <span>
                      Required: <strong className="text-charcoal-800">{need.quantity_required} {need.unit}</strong>
                    </span>
                    <span>
                      Budget: <strong className="text-forest-700">{need.budget > 0 ? `$${need.budget}` : 'Free/Donation'}</strong>
                    </span>
                    {need.preferred_location && (
                      <span>
                        Area: <strong className="text-charcoal-800">{need.preferred_location}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-charcoal-100">
                  <Link
                    to={`/matches?needId=${need.id}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-fresh-300" />
                    <span>View Matched Resources</span>
                  </Link>

                  {need.status === 'active' ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(need.id, 'fulfilled')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition"
                      >
                        Mark Fulfilled
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(need.id, 'cancelled')}
                        className="py-2 px-3 rounded-xl bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200 font-semibold text-xs transition"
                      >
                        Deactivate
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(need.id, 'active')}
                      className="py-2 px-3 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-800 font-semibold text-xs transition text-center"
                    >
                      Reactivate Need
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal-100 space-y-3">
            <FileQuestion className="w-12 h-12 text-charcoal-300 mx-auto" />
            <h3 className="font-bold text-charcoal-800 text-base">You haven't published any needs yet</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              Looking for raw timber, spend coffee grounds, or electronics components? Let our matching algorithm help.
            </p>
            <Link
              to="/needs/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-700 text-white text-xs font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Publish First Need</span>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

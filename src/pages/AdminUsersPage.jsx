import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Building2
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, updateUserVerification } from '../services/adminService';
import { Badge } from '../components/Badge';

export function AdminUsersPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (profile && !profile.is_admin) {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [profile, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsersList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (targetUser) => {
    setUpdatingId(targetUser.id);
    try {
      await updateUserVerification(targetUser.id, !targetUser.is_verified, user.id);
      await loadUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = usersList.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.account_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      title="User & Organization Verification"
      subtitle="Inspect member accounts, audit registration data, and grant verified status to legitimate workshops and NGOs."
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-charcoal-100 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or account type..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-forest-500"
            />
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          </div>
          <span className="text-xs text-charcoal-500 font-medium">
            Total Users: {usersList.length}
          </span>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-charcoal-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-offwhite text-charcoal-500 font-bold uppercase tracking-wider text-[10px] border-b border-charcoal-100">
                <tr>
                  <th className="p-4">User / Organization</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Account Type</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Moderator Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-offwhite/50 transition">
                    <td className="p-4 font-bold text-charcoal-900 flex items-center gap-2">
                      <img
                        src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={u.full_name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <span>{u.full_name}</span>
                        {u.organization_name && (
                          <span className="text-[10px] text-charcoal-400 block font-normal">
                            Org: {u.organization_name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-charcoal-600">{u.email}</td>
                    <td className="p-4 capitalize">
                      <Badge variant="primary">{u.account_type}</Badge>
                    </td>
                    <td className="p-4">{u.city || '—'}</td>
                    <td className="p-4">
                      {u.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Verified
                        </span>
                      ) : (
                        <span className="text-charcoal-400">Standard</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        disabled={updatingId === u.id}
                        onClick={() => handleToggleVerification(u)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                          u.is_verified
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-forest-700 text-white hover:bg-forest-800'
                        }`}
                      >
                        {u.is_verified ? 'Revoke Verification' : 'Grant Verified'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

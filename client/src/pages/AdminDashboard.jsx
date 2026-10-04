import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  FileText,
  MessageSquare,
  Megaphone,
  Ban,
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  UserX,
  Trash2,
  AlertTriangle,
  Lock,
  TrendingUp,
  Award,
} from 'lucide-react';
import API from '../services/api';

const AdminDashboard = ({ setActiveTab }) => {
  const { user, language } = useAuth();
  const isKannada = language === 'kn';

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // User management state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await API.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Fetch admin stats error:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = {};
      if (selectedRole && selectedRole !== 'all') params.role = selectedRole;
      if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await API.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Fetch admin users error:', err);
    } finally {
      setUsersLoading(false);
    }
  }, [selectedRole, selectedStatus, searchQuery]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      fetchUsers();
    }
  }, [user, fetchStats, fetchUsers]);

  // Block / Unblock Toggle
  const handleToggleBlock = async (userId, currentBlocked, userName) => {
    try {
      const res = await API.put(`/admin/users/${userId}/block`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isBlocked: res.data.isBlocked } : u))
        );
        setActionMessage({
          type: 'success',
          text: res.data.message,
        });
        fetchStats();
        setTimeout(() => setActionMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update user status',
      });
    }
  };

  // Change Role
  const handleRoleChange = async (userId, newRole, userName) => {
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        setActionMessage({
          type: 'success',
          text: res.data.message,
        });
        fetchStats();
        setTimeout(() => setActionMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update role',
      });
    }
  };

  // Delete User
  const handleDeleteUser = async (userId, userName) => {
    const confirmMsg = isKannada
      ? `ಖಾತೆ '${userName}' ಮತ್ತು ಅವರ ಎಲ್ಲಾ ಪೋಸ್ಟ್‌ಗಳನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?`
      : `Are you sure you want to permanently delete account '${userName}' and all their posts?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await API.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setActionMessage({
          type: 'success',
          text: res.data.message,
        });
        fetchStats();
        setTimeout(() => setActionMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to delete user',
      });
    }
  };

  // Security Gate
  if (user?.role !== 'admin') {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <Lock size={48} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
          <h3>{isKannada ? 'ಪ್ರವೇಶ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ (Admin Only)' : 'Administrator Access Restricted'}</h3>
          <p style={{ color: '#64748b', margin: '0.75rem 0 1.5rem' }}>
            {isKannada
              ? 'ಈ ಪುಟವನ್ನು ವೀಕ್ಷಿಸಲು ಕೇವಲ ವ್ಯವಸ್ಥಾಪಕರಿಗೆ (Admin) ಮಾತ್ರ ಅಧಿಕಾರವಿದೆ.'
              : 'You do not have administrative privileges to access this management dashboard.'}
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab('feed')}>
            {isKannada ? 'ಫೀಡ್‌ಗೆ ಹಿಂತಿರುಗಿ' : 'Return to Community Feed'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 700, fontSize: '0.85rem' }}>
            <Shield size={18} />
            <span>{isKannada ? 'ದಿನ ೮: ಆಡಳಿತ ಮಂಡಳಿ & ನಿಯಂತ್ರಣ' : 'Day 8: Admin Control & User Management'}</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', marginTop: '0.25rem' }}>
            {isKannada ? '🛡️ ಅಗ್ರಿಚಾಟ್ ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : '🛡️ AgriChat Admin Dashboard'}
          </h1>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => {
            fetchStats();
            fetchUsers();
          }}
          style={{ padding: '0.6rem 1rem' }}
        >
          <RefreshCw size={16} className={statsLoading || usersLoading ? 'spin-icon' : ''} />
          <span>{isKannada ? 'ಡೇಟಾ ನವೀಕರಿಸಿ' : 'Refresh Metrics'}</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          {/* Total Members */}
          <div
            style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {isKannada ? 'ಒಟ್ಟು ಸದಸ್ಯರು' : 'Total Members'}
              </span>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} color="#15803d" />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats.users.total}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              🌾 {stats.users.farmers} {isKannada ? 'ರೈತರು' : 'Farmers'} • 🎓 {stats.users.experts} {isKannada ? 'ತಜ್ಞರು' : 'Experts'}
            </div>
          </div>

          {/* Total Posts */}
          <div
            style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {isKannada ? 'ಒಟ್ಟು ಪೋಸ್ಟ್‌ಗಳು' : 'Community Posts'}
              </span>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="#1d4ed8" />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats.posts.total}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              📢 {stats.posts.announcements} {isKannada ? 'ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು' : 'Announcements'}
            </div>
          </div>

          {/* Total Comments */}
          <div
            style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {isKannada ? 'ಒಟ್ಟು ಪ್ರತಿಕ್ರಿಯೆಗಳು' : 'Farmer Advice/Replies'}
              </span>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={18} color="#b45309" />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats.comments.total}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>
              💬 {isKannada ? 'ಸಕ್ರಿಯ ಸಂವಾದಗಳು' : 'Active farmer advice'}
            </div>
          </div>

          {/* Suspended Accounts */}
          <div
            style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {isKannada ? 'ನಿರ್ಬಂಧಿತ ಖಾತೆಗಳು' : 'Suspended Users'}
              </span>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ban size={18} color="#dc2626" />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: stats.users.blocked > 0 ? '#dc2626' : 'var(--text-main)' }}>
              {stats.users.blocked}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              🛡️ {isKannada ? 'ವೇದಿಕೆ ಸುರಕ್ಷತೆ' : 'Platform safety'}
            </div>
          </div>
        </div>
      )}

      {/* Action Notification Alert */}
      {actionMessage.text && (
        <div
          className={`alert ${actionMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}
          style={{ marginBottom: '1.5rem' }}
        >
          {actionMessage.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* User Management Section */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              {isKannada ? '👥 ಬಳಕೆದಾರರ ನಿರ್ವಹಣೆ ಮತ್ತು ಪಾತ್ರ ನಿಯಂತ್ರಣ' : '👥 User Moderation & Role Control'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isKannada
                ? 'ರೈತರು ಮತ್ತು ತಜ್ಞರ ಖಾತೆಗಳನ್ನು ನಿರ್ಬಂಧಿಸಿ ಅಥವಾ ಪಾತ್ರಗಳನ್ನು ಬದಲಾಯಿಸಿ.'
                : 'Manage permissions, promote members to Agricultural Experts, or suspend accounts.'}
            </p>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-box" style={{ width: '220px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isKannada ? 'ಹೆಸರು / ಇಮೇಲ್ ಹುಡುಕಿ...' : 'Search name/email...'}
                className="search-input"
                style={{ padding: '0.5rem 0.75rem 0.5rem 2.25rem', fontSize: '0.85rem' }}
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input-field select-field"
              style={{ width: '130px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="all">{isKannada ? 'ಎಲ್ಲಾ ಪಾತ್ರಗಳು' : 'All Roles'}</option>
              <option value="farmer">🌾 Farmer</option>
              <option value="expert">🎓 Expert</option>
              <option value="admin">🛡️ Admin</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field select-field"
              style={{ width: '130px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="all">{isKannada ? 'ಎಲ್ಲಾ ಸ್ಥಿತಿ' : 'All Status'}</option>
              <option value="active">Active</option>
              <option value="blocked">Suspended</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>{isKannada ? 'ಸದಸ್ಯ' : 'Member'}</th>
                <th style={{ padding: '0.9rem 1rem' }}>{isKannada ? 'ಇಮೇಲ್' : 'Email'}</th>
                <th style={{ padding: '0.9rem 1rem' }}>{isKannada ? 'ಪಾತ್ರ' : 'Role'}</th>
                <th style={{ padding: '0.9rem 1rem' }}>{isKannada ? 'ಸ್ಥಳ' : 'Location'}</th>
                <th style={{ padding: '0.9rem 1rem' }}>{isKannada ? 'ಪೋಸ್ಟ್‌ಗಳು' : 'Posts'}</th>
                <th style={{ padding: '0.9rem 1rem' }}>{isKannada ? 'ಸ್ಥಿತಿ' : 'Status'}</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>{isKannada ? 'ಕ್ರಮಗಳು' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <RefreshCw size={24} className="spin-icon" style={{ margin: '0 auto 0.5rem', color: 'var(--primary)' }} />
                    <p>{isKannada ? 'ಬಳಕೆದಾರರನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading user directory...'}</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    {isKannada ? 'ಯಾವುದೇ ಬಳಕೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ.' : 'No users match the selected filters.'}
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                    {/* Member */}
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar" style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}>
                          {u.profilePic && u.profilePic.length <= 4 ? u.profilePic : u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '0.9rem 1rem', color: '#64748b' }}>{u.email}</td>

                    {/* Role selector */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value, u.name)}
                        disabled={u._id === user?.id}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: '1px solid var(--border)',
                          background: '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="farmer">🌾 Farmer</option>
                        <option value="expert">🎓 Expert</option>
                        <option value="admin">🛡️ Admin</option>
                      </select>
                    </td>

                    {/* Location */}
                    <td style={{ padding: '0.9rem 1rem', color: '#475569', fontSize: '0.85rem' }}>
                      {u.village ? `${u.village}, ` : ''}
                      {u.district || 'Karnataka'}
                    </td>

                    {/* Post Count */}
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{u.postCount || 0}</td>

                    {/* Status Badge */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      {u.isBlocked ? (
                        <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                          🚫 Suspended
                        </span>
                      ) : (
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                          ✅ Active
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        {/* Suspend / Reactivate */}
                        {u._id !== user?.id && (
                          <button
                            onClick={() => handleToggleBlock(u._id, u.isBlocked, u.name)}
                            className={`btn ${u.isBlocked ? 'btn-outline' : 'btn-danger-ghost'}`}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            title={u.isBlocked ? 'Reactivate Account' : 'Suspend Account'}
                          >
                            {u.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
                            <span>{u.isBlocked ? (isKannada ? 'ಸಕ್ರಿಯಗೊಳಿಸಿ' : 'Reactivate') : (isKannada ? 'ನಿರ್ಬಂಧಿಸಿ' : 'Suspend')}</span>
                          </button>
                        )}

                        {/* Delete User */}
                        {u._id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="btn btn-danger-ghost"
                            style={{ padding: '0.3rem 0.5rem' }}
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

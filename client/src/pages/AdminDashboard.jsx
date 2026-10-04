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
  Pin,
  Send,
  Sparkles,
  MapPin,
  Tag,
  Radio,
} from 'lucide-react';
import API from '../services/api';

const CATEGORIES = [
  'All',
  'Crops',
  'Pest Control',
  'Weather',
  'Market Prices',
  'Govt Schemes',
  'Machinery',
  'General',
];

const AdminDashboard = ({ setActiveTab }) => {
  const { user, language } = useAuth();
  const isKannada = language === 'kn';

  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users', 'moderation', 'announcements'

  // KPI Stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // User Management State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchUserQuery, setSearchUserQuery] = useState('');

  // Content Moderation State
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedPostCategory, setSelectedPostCategory] = useState('All');
  const [announcementFilter, setAnnouncementFilter] = useState('all');
  const [searchPostQuery, setSearchPostQuery] = useState('');

  // Announcement Broadcast State
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    content: '',
    category: 'Govt Schemes',
    crop: '',
    image: '',
    tags: 'OfficialNotice, AgriAlert',
  });
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  // Notification Message
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const notify = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage({ type: '', text: '' }), 4000);
  };

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
      if (searchUserQuery.trim()) params.search = searchUserQuery.trim();

      const res = await API.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Fetch admin users error:', err);
    } finally {
      setUsersLoading(false);
    }
  }, [selectedRole, selectedStatus, searchUserQuery]);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const params = {};
      if (selectedPostCategory && selectedPostCategory !== 'All') params.category = selectedPostCategory;
      if (announcementFilter === 'announcement') params.isAnnouncement = 'true';
      if (announcementFilter === 'regular') params.isAnnouncement = 'false';
      if (searchPostQuery.trim()) params.search = searchPostQuery.trim();

      const res = await API.get('/admin/posts', { params });
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error('Fetch admin posts error:', err);
    } finally {
      setPostsLoading(false);
    }
  }, [selectedPostCategory, announcementFilter, searchPostQuery]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      if (activeAdminTab === 'users') fetchUsers();
      if (activeAdminTab === 'moderation') fetchPosts();
    }
  }, [user, activeAdminTab, fetchStats, fetchUsers, fetchPosts]);

  // Block / Unblock User
  const handleToggleBlock = async (userId, userName) => {
    try {
      const res = await API.put(`/admin/users/${userId}/block`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isBlocked: res.data.isBlocked } : u))
        );
        notify('success', res.data.message);
        fetchStats();
      }
    } catch (err) {
      notify('error', err.response?.data?.error || 'Failed to update user status');
    }
  };

  // Change Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        notify('success', res.data.message);
        fetchStats();
      }
    } catch (err) {
      notify('error', err.response?.data?.error || 'Failed to update role');
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
        notify('success', res.data.message);
        fetchStats();
      }
    } catch (err) {
      notify('error', err.response?.data?.error || 'Failed to delete user');
    }
  };

  // Toggle Pin / Unpin Post Announcement
  const handleTogglePin = async (postId) => {
    try {
      const res = await API.put(`/admin/posts/${postId}/pin`);
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, isAnnouncement: res.data.isAnnouncement } : p))
        );
        notify('success', res.data.message);
        fetchStats();
      }
    } catch (err) {
      notify('error', err.response?.data?.error || 'Failed to pin/unpin announcement');
    }
  };

  // Delete Post (Admin Moderate)
  const handleDeletePostAdmin = async (postId) => {
    const confirmMsg = isKannada
      ? 'ಈ ಪೋಸ್ಟ್ ಅನ್ನು ಅಳಿಸಲು ಮತ್ತು ಮಾಡರೇಟ್ ಮಾಡಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?'
      : 'Are you sure you want to moderate and delete this post?';
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await API.delete(`/admin/posts/${postId}`);
      if (res.data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        notify('success', res.data.message);
        fetchStats();
      }
    } catch (err) {
      notify('error', err.response?.data?.error || 'Failed to delete post');
    }
  };

  // Broadcast Announcement Submit
  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastData.content.trim()) {
      notify('error', isKannada ? 'ದಯವಿಟ್ಟು ಪ್ರಕಟಣೆಯ ವಿವರ ನಮೂದಿಸಿ' : 'Announcement content is required');
      return;
    }

    setBroadcastLoading(true);
    try {
      const res = await API.post('/admin/announcements', broadcastData);
      if (res.data.success) {
        notify('success', res.data.message);
        setBroadcastData({
          title: '',
          content: '',
          category: 'Govt Schemes',
          crop: '',
          image: '',
          tags: 'OfficialNotice, AgriAlert',
        });
        fetchStats();
      }
    } catch (err) {
      notify('error', err.response?.data?.error || 'Failed to broadcast announcement');
    } finally {
      setBroadcastLoading(false);
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
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 700, fontSize: '0.85rem' }}>
            <Shield size={18} />
            <span>{isKannada ? 'ದಿನ ೯: ಪೋಸ್ಟ್ ಮಾಡರೇಶನ್ & ಪ್ರಕಟಣೆಗಳು' : 'Day 9: Moderation & Announcements'}</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', marginTop: '0.25rem' }}>
            {isKannada ? '🛡️ ಅಗ್ರಿಚಾಟ್ ಅಡ್ಮಿನ್ ಕಂಟ್ರೋಲ್ ಪ್ಯಾನಲ್' : '🛡️ AgriChat Admin Control Center'}
          </h1>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => {
            fetchStats();
            if (activeAdminTab === 'users') fetchUsers();
            if (activeAdminTab === 'moderation') fetchPosts();
          }}
          style={{ padding: '0.6rem 1rem' }}
        >
          <RefreshCw size={16} className={statsLoading || usersLoading || postsLoading ? 'spin-icon' : ''} />
          <span>{isKannada ? 'ನವೀಕರಿಸಿ' : 'Refresh'}</span>
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
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{isKannada ? 'ಒಟ್ಟು ಸದಸ್ಯರು' : 'Total Members'}</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={18} color="#15803d" /></div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{stats.users.total}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>🌾 {stats.users.farmers} {isKannada ? 'ರೈತರು' : 'Farmers'} • 🎓 {stats.users.experts} {isKannada ? 'ತಜ್ಞರು' : 'Experts'}</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{isKannada ? 'ಒಟ್ಟು ಪೋಸ್ಟ್‌ಗಳು' : 'Community Posts'}</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} color="#1d4ed8" /></div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{stats.posts.total}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>📢 {stats.posts.announcements} {isKannada ? 'ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು' : 'Announcements'}</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{isKannada ? 'ಒಟ್ಟು ಪ್ರತಿಕ್ರಿಯೆಗಳು' : 'Farmer Advice/Replies'}</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={18} color="#b45309" /></div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>{stats.comments.total}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>💬 {isKannada ? 'ಸಕ್ರಿಯ ಸಂವಾದಗಳು' : 'Active farmer advice'}</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{isKannada ? 'ನಿರ್ಬಂಧಿತ ಖಾತೆಗಳು' : 'Suspended Users'}</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ban size={18} color="#dc2626" /></div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: stats.users.blocked > 0 ? '#dc2626' : 'var(--text-main)' }}>{stats.users.blocked}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>🛡️ {isKannada ? 'ವೇದಿಕೆ ಸುರಕ್ಷತೆ' : 'Platform safety'}</div>
          </div>
        </div>
      )}

      {/* Notification Alert */}
      {actionMessage.text && (
        <div className={`alert ${actionMessage.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1.5rem' }}>
          {actionMessage.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Admin Tabs Navigation */}
      <div className="tab-nav" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`tab-btn ${activeAdminTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('users')}
        >
          <Users size={18} />
          <span>{isKannada ? 'ಬಳಕೆದಾರರ ನಿರ್ವಹಣೆ' : 'User Moderation'}</span>
        </button>

        <button
          className={`tab-btn ${activeAdminTab === 'moderation' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('moderation')}
        >
          <FileText size={18} />
          <span>{isKannada ? 'ಪೋಸ್ಟ್ ಮಾಡರೇಶನ್ ಕ್ಯೂ' : 'Post Moderation Queue'}</span>
        </button>

        <button
          className={`tab-btn ${activeAdminTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('announcements')}
        >
          <Megaphone size={18} />
          <span>{isKannada ? 'ಪ್ರಕಟಣೆ ಪ್ರಸಾರ' : 'Broadcast Announcement'}</span>
        </button>
      </div>

      {/* TAB 1: User Management */}
      {activeAdminTab === 'users' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>{isKannada ? 'ಸದಸ್ಯರ ಪಟ್ಟಿ & ಪಾತ್ರಗಳು' : 'Community Members & Role Controls'}</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="search-box" style={{ width: '220px' }}>
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  placeholder={isKannada ? 'ಹುಡುಕಿ...' : 'Search user...'}
                  className="search-input"
                  style={{ padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.85rem' }}
                />
              </div>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="input-field select-field"
                style={{ width: '130px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
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
                style={{ width: '130px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              >
                <option value="all">{isKannada ? 'ಎಲ್ಲಾ ಸ್ಥಿತಿ' : 'All Status'}</option>
                <option value="active">Active</option>
                <option value="blocked">Suspended</option>
              </select>
            </div>
          </div>

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
                      <p>{isKannada ? 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading user list...'}</p>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="avatar" style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}>
                            {u.profilePic && u.profilePic.length <= 4 ? u.profilePic : u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 700 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: '#64748b' }}>{u.email}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === user?.id}
                          style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--border)', background: '#ffffff', cursor: 'pointer' }}
                        >
                          <option value="farmer">🌾 Farmer</option>
                          <option value="expert">🎓 Expert</option>
                          <option value="admin">🛡️ Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: '#475569', fontSize: '0.85rem' }}>{u.village ? `${u.village}, ` : ''}{u.district || 'Karnataka'}</td>
                      <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{u.postCount || 0}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {u.isBlocked ? (
                          <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>🚫 Suspended</span>
                        ) : (
                          <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>✅ Active</span>
                        )}
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          {u._id !== user?.id && (
                            <button
                              onClick={() => handleToggleBlock(u._id, u.name)}
                              className={`btn ${u.isBlocked ? 'btn-outline' : 'btn-danger-ghost'}`}
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            >
                              {u.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
                              <span>{u.isBlocked ? (isKannada ? 'ಸಕ್ರಿಯಗೊಳಿಸಿ' : 'Reactivate') : (isKannada ? 'ನಿರ್ಬಂಧಿಸಿ' : 'Suspend')}</span>
                            </button>
                          )}
                          {u._id !== user?.id && (
                            <button onClick={() => handleDeleteUser(u._id, u.name)} className="btn btn-danger-ghost" style={{ padding: '0.3rem 0.5rem' }}>
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
      )}

      {/* TAB 2: Content Moderation Queue */}
      {activeAdminTab === 'moderation' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>{isKannada ? 'ಕೃಷಿ ಪೋಸ್ಟ್ ಮಾಡರೇಶನ್ ಕ್ಯೂ' : 'Community Feed Moderation Queue'}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isKannada ? 'ಅನಪೇಕ್ಷಿತ ಪೋಸ್ಟ್‌ಗಳನ್ನು ಅಳಿಸಿ ಅಥವಾ ಪ್ರಮುಖ ಸಲಹೆಗಳನ್ನು ಪಿನ್ ಮಾಡಿ.' : 'Review posts, pin emergency farm notices, or delete inappropriate content.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="search-box" style={{ width: '200px' }}>
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  value={searchPostQuery}
                  onChange={(e) => setSearchPostQuery(e.target.value)}
                  placeholder={isKannada ? 'ಪೋಸ್ಟ್ ಹುಡುಕಿ...' : 'Search posts...'}
                  className="search-input"
                  style={{ padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.85rem' }}
                />
              </div>

              <select
                value={selectedPostCategory}
                onChange={(e) => setSelectedPostCategory(e.target.value)}
                className="input-field select-field"
                style={{ width: '130px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={announcementFilter}
                onChange={(e) => setAnnouncementFilter(e.target.value)}
                className="input-field select-field"
                style={{ width: '140px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              >
                <option value="all">{isKannada ? 'ಎಲ್ಲಾ ಪೋಸ್ಟ್‌ಗಳು' : 'All Posts'}</option>
                <option value="announcement">📢 Announcements</option>
                <option value="regular">🌾 Regular Posts</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.9rem 1.25rem' }}>{isKannada ? 'ಪೋಸ್ಟ್ / ವಿವರ' : 'Post / Content'}</th>
                  <th style={{ padding: '0.9rem 1rem' }}>{isKannada ? 'ಕರ್ತೃ' : 'Author'}</th>
                  <th style={{ padding: '0.9rem 1rem' }}>{isKannada ? 'ವರ್ಗ & ಬೆಳೆ' : 'Category & Crop'}</th>
                  <th style={{ padding: '0.9rem 1rem' }}>{isKannada ? 'ಲೈಕ್ಸ್ & ಕಾಮೆಂಟ್ಸ್' : 'Engagement'}</th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>{isKannada ? 'ಮಾಡರೇಶನ್' : 'Moderation'}</th>
                </tr>
              </thead>
              <tbody>
                {postsLoading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <RefreshCw size={24} className="spin-icon" style={{ margin: '0 auto 0.5rem', color: 'var(--primary)' }} />
                      <p>{isKannada ? 'ಪೋಸ್ಟ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading posts queue...'}</p>
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                      {isKannada ? 'ಯಾವುದೇ ಪೋಸ್ಟ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' : 'No posts match criteria.'}
                    </td>
                  </tr>
                ) : (
                  posts.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9', background: p.isAnnouncement ? '#fefce8' : '#ffffff' }}>
                      <td style={{ padding: '0.9rem 1.25rem', maxWidth: '320px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                          {p.isAnnouncement && <span style={{ background: '#fef08a', color: '#854d0e', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>PINNED</span>}
                          <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{p.title || 'Untitled Post'}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {p.content}
                        </p>
                      </td>

                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.author?.name || 'Farmer'}</div>
                        <span className={`role-tag role-${p.author?.role || 'farmer'}`} style={{ fontSize: '0.65rem' }}>{p.author?.role}</span>
                      </td>

                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>🏷️ {p.category}</div>
                        {p.crop && <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>🌱 {p.crop}</div>}
                      </td>

                      <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem' }}>
                        ❤️ {p.likesCount || p.likes?.length || 0} • 💬 {p.commentsCount || 0}
                      </td>

                      <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          {/* Pin / Unpin Button */}
                          <button
                            onClick={() => handleTogglePin(p._id)}
                            className={`btn ${p.isAnnouncement ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            title={p.isAnnouncement ? 'Unpin Announcement' : 'Pin Announcement'}
                          >
                            <Pin size={13} />
                            <span>{p.isAnnouncement ? (isKannada ? 'ಅನ್‌ಪಿನ್' : 'Unpin') : (isKannada ? 'ಪಿನ್' : 'Pin')}</span>
                          </button>

                          {/* Delete Post Button */}
                          <button
                            onClick={() => handleDeletePostAdmin(p._id)}
                            className="btn btn-danger-ghost"
                            style={{ padding: '0.3rem 0.5rem' }}
                            title="Moderate & Delete Post"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Broadcast Announcement */}
      {activeAdminTab === 'announcements' && (
        <div style={{ maxWidth: '700px', margin: '0 auto', background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={22} color="#b45309" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
                {isKannada ? '📢 ಅಧಿಕೃತ ಕೃಷಿ ಪ್ರಕಟಣೆ ಪ್ರಸಾರ' : '📢 Broadcast Official Announcement'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isKannada ? 'ಈ ಪ್ರಕಟಣೆಯು ಎಲ್ಲಾ ರೈತರ ಫೀಡ್‌ನ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಹೈಲೈಟ್ ಆಗಿ ಪಿನ್ ಆಗಿ ಕಾಣಿಸುತ್ತದೆ.' : 'Broadcasted announcements are pinned to the top of all farmer feeds.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleBroadcastSubmit}>
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಪ್ರಕಟಣೆ ಶೀರ್ಷಿಕೆ *' : 'Announcement Headline *'}</label>
              <input
                type="text"
                value={broadcastData.title}
                onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                className="input-field"
                placeholder={isKannada ? 'ಉದಾ: 2026 ಮುಂಗಾರು ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಬೆಂಬಲ ಬೆಲೆ ಘೋಷಣೆ' : 'e.g. 2026 Kharif Crop Insurance & MSP Scheme Notice'}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{isKannada ? 'ವರ್ಗ' : 'Category'}</label>
                <select
                  value={broadcastData.category}
                  onChange={(e) => setBroadcastData({ ...broadcastData, category: e.target.value })}
                  className="input-field select-field"
                >
                  <option value="Govt Schemes">🏛️ Govt Schemes</option>
                  <option value="Weather">🌧️ Weather Alert</option>
                  <option value="Pest Control">🐛 Emergency Pest Alert</option>
                  <option value="Market Prices">💰 Mandi & Market Prices</option>
                  <option value="General">📢 General Announcement</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{isKannada ? 'ಉದ್ದೇಶಿತ ಬೆಳೆ (ಐಚ್ಛಿಕ)' : 'Target Crop (Optional)'}</label>
                <input
                  type="text"
                  value={broadcastData.crop}
                  onChange={(e) => setBroadcastData({ ...broadcastData, crop: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Cotton / Paddy / All Crops"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಪ್ರಕಟಣೆಯ ವಿವರ *' : 'Announcement Details *'}</label>
              <textarea
                value={broadcastData.content}
                onChange={(e) => setBroadcastData({ ...broadcastData, content: e.target.value })}
                className="input-field"
                rows="5"
                required
                placeholder={isKannada ? 'ರೈತರಿಗೆ ಪ್ರಮುಖ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ದಿನಾಂಕಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...' : 'Write detailed guidelines, eligibility, and deadlines for farmers...'}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಬ್ಯಾನರ್ ಚಿತ್ರ URL (ಐಚ್ಛಿಕ)' : 'Banner Image URL (Optional)'}</label>
              <input
                type="url"
                value={broadcastData.image}
                onChange={(e) => setBroadcastData({ ...broadcastData, image: e.target.value })}
                className="input-field"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
              disabled={broadcastLoading}
            >
              <Send size={18} />
              <span>{broadcastLoading ? (isKannada ? 'ಪ್ರಸಾರ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Broadcasting Notice...') : (isKannada ? 'ಎಲ್ಲಾ ರೈತರಿಗೆ ಪ್ರಕಟಿಸಿ' : 'Broadcast to All Farmers')}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

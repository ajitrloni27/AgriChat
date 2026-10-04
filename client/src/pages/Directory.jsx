import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Users,
  MapPin,
  Globe,
  Calendar,
  FileText,
  RefreshCw,
  X,
  ExternalLink,
  Shield,
  GraduationCap,
  Sprout,
  AlertCircle,
} from 'lucide-react';
import API from '../services/api';
import PostCard from '../components/PostCard';

const KARNATAKA_DISTRICTS = [
  'All Districts',
  'Gadag',
  'Dharwad',
  'Belagavi',
  'Uttara Kannada',
  'Mandya',
  'Haveri',
  'Shivamogga',
  'Ballari',
  'Bengaluru Urban',
];

const Directory = ({ setActiveTab }) => {
  const { language } = useAuth();
  const isKannada = language === 'kn';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected User Modal (Public View)
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedRole && selectedRole !== 'all') {
        params.role = selectedRole;
      }
      if (selectedDistrict && selectedDistrict !== 'All Districts') {
        params.district = selectedDistrict;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await API.get('/users', { params });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err.response?.data?.error || 'Failed to load community directory');
    } finally {
      setLoading(false);
    }
  }, [selectedRole, selectedDistrict, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch single user profile & posts when clicking "View Posts"
  const handleViewUser = async (userId) => {
    setModalLoading(true);
    try {
      const res = await API.get(`/users/${userId}`);
      if (res.data.success) {
        setSelectedUser(res.data.user);
        setUserPosts(res.data.posts);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to load user details');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Directory Hero Header */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 2.5rem',
          background: 'linear-gradient(180deg, rgba(220, 252, 231, 0.4) 0%, rgba(255, 255, 255, 0) 100%)',
          padding: '2.5rem 1.5rem',
          borderRadius: '20px',
          border: '1px solid #dcfce7',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#dcfce7',
            color: '#15803d',
            padding: '0.35rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <Users size={16} />
          {isKannada ? 'ದಿನ ೭: ಸಮುದಾಯ ಕೋಶ ಮತ್ತು ಬಹುಭಾಷೆ' : 'Day 7: Community Directory & Multi-language'}
        </div>

        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>
          {isKannada ? '🌾 ರೈತ ಸಮುದಾಯ ಮತ್ತು ಕೃಷಿ ತಜ್ಞರ ಕೋಶ' : '🌾 Farmer & Expert Directory'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          {isKannada
            ? 'ಕರ್ನಾಟಕದ ವಿವಿಧ ಜಿಲ್ಲೆಗಳ ರೈತರು, ಕೃಷಿ ಅಧಿಕಾರಿಗಳು ಮತ್ತು ಬೆಳೆ ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.'
            : 'Discover fellow farmers, local agricultural specialists, and advisory officers across Karnataka districts.'}
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: '1rem',
          marginBottom: '2rem',
          alignItems: 'center',
          background: '#ffffff',
          padding: '1rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Search */}
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isKannada
                ? 'ಹೆಸರು, ಗ್ರಾಮ ಅಥವಾ ಜಿಲ್ಲೆಯ ಮೂಲಕ ಹುಡುಕಿ...'
                : 'Search by farmer name, village, or district...'
            }
            className="search-input"
          />
        </div>

        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px' }}>
          {[
            { id: 'all', label: isKannada ? 'ಎಲ್ಲಾ' : 'All' },
            { id: 'farmer', label: isKannada ? '🌾 ರೈತರು' : '🌾 Farmers' },
            { id: 'expert', label: isKannada ? '🎓 ತಜ್ಞರು' : '🎓 Experts' },
            { id: 'admin', label: isKannada ? '🛡️ ಅಡ್ಮಿನ್' : '🛡️ Admins' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id)}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                background: selectedRole === tab.id ? '#ffffff' : 'none',
                color: selectedRole === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: selectedRole === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* District Filter */}
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="input-field select-field"
          style={{ width: '160px', padding: '0.55rem 1rem', fontSize: '0.85rem' }}
        >
          {KARNATAKA_DISTRICTS.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>

        {/* Refresh */}
        <button
          className="btn btn-outline"
          onClick={fetchUsers}
          title="Refresh Directory"
          style={{ padding: '0.55rem 0.85rem' }}
        >
          <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Member Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="spin-icon" style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
          <p>{isKannada ? 'ಸದಸ್ಯರ ಕೋಶ ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading community directory...'}</p>
        </div>
      ) : users.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <Users size={48} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
          <h3>{isKannada ? 'ಯಾವುದೇ ಸದಸ್ಯರು ಕಂಡುಬಂದಿಲ್ಲ' : 'No Members Found'}</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {isKannada
              ? 'ನಿಮ್ಮ ಹುಡುಕಾಟ ಮಾನದಂಡವನ್ನು ಬದಲಾಯಿಸಿ ಅಥವಾ ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ.'
              : 'Try adjusting your search criteria or resetting filters.'}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {users.map((member) => (
            <div
              key={member._id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
              }}
            >
              <div>
                {/* Header: Avatar & Role */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #047857)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {member.profilePic && member.profilePic.length <= 4 ? (
                      member.profilePic
                    ) : member.profilePic ? (
                      <img src={member.profilePic} alt="Avatar" className="profile-avatar-img" />
                    ) : (
                      member.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {member.name}
                    </h3>
                    <span className={`role-tag role-${member.role}`}>
                      {member.role === 'admin'
                        ? '🛡️ Admin'
                        : member.role === 'expert'
                        ? '🎓 Agri Expert'
                        : '🌾 Farmer'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
                  <div className="info-item" style={{ padding: '0.4rem 0' }}>
                    <span className="info-label">
                      <MapPin size={14} /> {isKannada ? 'ಸ್ಥಳ' : 'Location'}
                    </span>
                    <span className="info-value">
                      {member.village ? `${member.village}, ` : ''}
                      {member.district || 'Karnataka'}
                    </span>
                  </div>

                  <div className="info-item" style={{ padding: '0.4rem 0' }}>
                    <span className="info-label">
                      <Globe size={14} /> {isKannada ? 'ಆದ್ಯತೆಯ ಭಾಷೆ' : 'Language'}
                    </span>
                    <span className="info-value">
                      {member.preferredLanguage === 'kn' ? 'ಕನ್ನಡ (KN)' : 'English (EN)'}
                    </span>
                  </div>

                  <div className="info-item" style={{ padding: '0.4rem 0' }}>
                    <span className="info-label">
                      <FileText size={14} /> {isKannada ? 'ಪೋಸ್ಟ್‌ಗಳು' : 'Contributions'}
                    </span>
                    <span className="info-value" style={{ color: 'var(--primary)' }}>
                      {member.postCount || 0} {isKannada ? 'ಪೋಸ್ಟ್‌ಗಳು' : 'posts'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="btn btn-outline"
                style={{ width: '100%', marginTop: '1.25rem', fontSize: '0.85rem', padding: '0.5rem' }}
                onClick={() => handleViewUser(member._id)}
              >
                <ExternalLink size={15} />
                <span>{isKannada ? 'ಪೋಸ್ಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View Profile & Posts'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* User Public Profile & Posts Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #047857)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedUser.profilePic && selectedUser.profilePic.length <= 4 ? (
                    selectedUser.profilePic
                  ) : (
                    selectedUser.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>{selectedUser.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                    <span className={`role-tag role-${selectedUser.role}`}>{selectedUser.role}</span>
                    <span>•</span>
                    <span>
                      {selectedUser.village ? `${selectedUser.village}, ` : ''}
                      {selectedUser.district || 'Karnataka'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                🌾 {isKannada ? `${selectedUser.name} ಅವರ ಕೃಷಿ ಪೋಸ್ಟ್‌ಗಳು` : `Posts by ${selectedUser.name}`} ({userPosts.length})
              </h4>

              {userPosts.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0' }}>
                  {isKannada
                    ? 'ಈ ಬಳಕೆದಾರರು ಇನ್ನೂ ಯಾವುದೇ ಪೋಸ್ಟ್ ಹಂಚಿಕೊಂಡಿಲ್ಲ.'
                    : 'This member has not published any posts yet.'}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {userPosts.map((p) => (
                    <PostCard
                      key={p._id}
                      post={p}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      setActiveTab={setActiveTab}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>
                {isKannada ? 'ಮುಚ್ಚಿ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;

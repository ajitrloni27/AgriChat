import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut, User as UserIcon, Languages, Users, Shield } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, logout, language, toggleLanguage } = useAuth();

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => setActiveTab('feed')}>
          <Sprout size={28} color="#16a34a" />
          <span>AgriChat</span>
          <span className="brand-badge">
            {language === 'kn' ? 'ರೈತರ ವೇದಿಕೆ' : 'Farmer Community'}
          </span>
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">
          {/* Feed Button */}
          <button
            className={`btn ${activeTab === 'feed' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('feed')}
          >
            <Sprout size={16} />
            <span>{language === 'kn' ? 'ಕೃಷಿ ಫೀಡ್' : 'Feed'}</span>
          </button>

          {/* Directory Button */}
          <button
            className={`btn ${activeTab === 'directory' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('directory')}
          >
            <Users size={16} />
            <span>{language === 'kn' ? 'ಸಮುದಾಯ' : 'Directory'}</span>
          </button>

          {/* Language Switcher */}
          <button
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            onClick={toggleLanguage}
            title="Toggle Language (English / Kannada)"
          >
            <Languages size={16} />
            <span>{language === 'en' ? 'ಕನ್ನಡ (KN)' : 'English (EN)'}</span>
          </button>

          {isAuthenticated ? (
            <>
              {/* User Profile Badge / Tab */}
              <div
                className="user-badge"
                onClick={() => setActiveTab('profile')}
                style={{
                  cursor: 'pointer',
                  borderColor: activeTab === 'profile' ? 'var(--primary)' : 'var(--border)',
                  background: activeTab === 'profile' ? 'var(--primary-light)' : '#f1f5f9',
                }}
                title={language === 'kn' ? 'ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ / ಬದಲಾಯಿಸಿ' : 'View / Edit Profile'}
              >
                <div className="avatar">
                  {user?.profilePic && user.profilePic.length <= 4 ? (
                    user.profilePic
                  ) : user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    'U'
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</span>
                  <span className={`role-tag role-${user?.role}`}>
                    {user?.role === 'admin' ? '🛡️ Admin' : user?.role === 'expert' ? '🎓 Expert' : '🌾 Farmer'}
                  </span>
                </div>
              </div>

              {/* Admin Panel Button (Admin Only) */}
              {user?.role === 'admin' && (
                <button
                  className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.85rem',
                    background: activeTab === 'admin' ? '#92400e' : '#fef3c7',
                    color: activeTab === 'admin' ? '#ffffff' : '#92400e',
                    borderColor: '#fde68a',
                  }}
                  onClick={() => setActiveTab('admin')}
                >
                  <Shield size={16} />
                  <span>{language === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ಯಾನಲ್' : 'Admin Panel'}</span>
                </button>
              )}

              {/* Profile Button */}
              <button
                className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                onClick={() => setActiveTab('profile')}
              >
                <UserIcon size={16} />
                <span>{language === 'kn' ? 'ಪ್ರೊಫೈಲ್' : 'Profile'}</span>
              </button>

              {/* Logout Button */}
              <button
                className="btn btn-danger-ghost"
                onClick={logout}
                title="Logout"
                style={{ padding: '0.45rem 0.75rem' }}
              >
                <LogOut size={18} />
                <span>{language === 'kn' ? 'ನಿರ್ಗಮಿಸಿ' : 'Logout'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab('login')}
              >
                {language === 'kn' ? 'ಲಾಗಿನ್' : 'Sign In'}
              </button>
              <button
                className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('register')}
              >
                {language === 'kn' ? 'ನೋಂದಣಿ' : 'Register'}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


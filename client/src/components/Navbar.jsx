import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut, User as UserIcon, Languages, Shield, Sparkles } from 'lucide-react';

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
              {/* User Profile Badge */}
              <div className="user-badge">
                <div className="avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</span>
                  <span className={`role-tag role-${user?.role}`}>
                    {user?.role === 'admin' ? '🛡️ Admin' : user?.role === 'expert' ? '🎓 Expert' : '🌾 Farmer'}
                  </span>
                </div>
              </div>

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

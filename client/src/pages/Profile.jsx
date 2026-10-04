import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  MapPin,
  Globe,
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
  Shield,
  KeyRound,
  Sparkles,
  Camera,
  Calendar,
  Mail,
} from 'lucide-react';

const AVATAR_OPTIONS = ['👨‍🌾', '👩‍🌾', '🌾', '🌱', '🚜', '🧑‍🔬', '🌻', '🌽', '🍅', '🐄', '🛡️', '🏡'];

const Profile = ({ setActiveTab }) => {
  const { user, updateProfile, updatePassword, language } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('details'); // 'details' or 'security'

  // Profile details state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    village: user?.village || '',
    district: user?.district || '',
    state: user?.state || 'Karnataka',
    preferredLanguage: user?.preferredLanguage || 'en',
    profilePic: user?.profilePic || '👨‍🌾',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        village: user.village || '',
        district: user.district || '',
        state: user.state || 'Karnataka',
        preferredLanguage: user.preferredLanguage || 'en',
        profilePic: user.profilePic || '👨‍🌾',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordMessage({ type: '', text: '' });
  };

  const handleAvatarSelect = (avatar) => {
    setFormData({ ...formData, profilePic: avatar });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const res = await updateProfile(formData);
    setLoading(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text:
          language === 'kn'
            ? 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!'
            : 'Profile updated successfully!',
      });
    } else {
      setMessage({
        type: 'error',
        text: res.error || (language === 'kn' ? 'ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ' : 'Update failed'),
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text:
          language === 'kn'
            ? 'ಹೊಸ ಪಾಸ್ವರ್ಡ್ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ'
            : 'New passwords do not match',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: 'error',
        text:
          language === 'kn'
            ? 'ಪಾಸ್ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು'
            : 'Password must be at least 6 characters',
      });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });

    const res = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
    setPasswordLoading(false);

    if (res.success) {
      setPasswordMessage({
        type: 'success',
        text:
          language === 'kn'
            ? 'ಪಾಸ್ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ!'
            : 'Password changed successfully!',
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordMessage({
        type: 'error',
        text: res.error || (language === 'kn' ? 'ಬದಲಾವಣೆ ವಿಫಲವಾಗಿದೆ' : 'Password change failed'),
      });
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h3>{language === 'kn' ? 'ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ' : 'Please Sign In'}</h3>
          <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
            {language === 'kn'
              ? 'ಪ್ರೊಫೈಲ್ ನೋಡಲು ಲಾಗಿನ್ ಆಗುವುದು ಅವಶ್ಯಕ.'
              : 'You must be signed in to view and edit your profile.'}
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab('login')}>
            {language === 'kn' ? 'ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹೋಗಿ' : 'Go to Login'}
          </button>
        </div>
      </div>
    );
  }

  const isKannada = language === 'kn';

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="profile-layout">
        {/* Left Sidebar: User Summary */}
        <aside className="profile-sidebar-card">
          <div className="profile-avatar-large">
            {formData.profilePic && formData.profilePic.length <= 4 ? (
              <span>{formData.profilePic}</span>
            ) : formData.profilePic ? (
              <img src={formData.profilePic} alt="Avatar" className="profile-avatar-img" />
            ) : (
              <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            )}
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            {user.email}
          </p>

          <span
            className={`role-tag role-${user.role}`}
            style={{ display: 'inline-block', marginBottom: '1.5rem' }}
          >
            {user.role === 'admin'
              ? '🛡️ ' + (isKannada ? 'ನಿರ್ವಾಹಕ (Admin)' : 'Administrator')
              : user.role === 'expert'
              ? '🎓 ' + (isKannada ? 'ಕೃಷಿ ತಜ್ಞ (Expert)' : 'Agri Expert')
              : '🌾 ' + (isKannada ? 'ರೈತ (Farmer)' : 'Farmer')}
          </span>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', textAlign: 'left' }}>
            <div className="info-item">
              <span className="info-label">
                <MapPin size={15} /> {isKannada ? 'ಸ್ಥಳ' : 'Location'}
              </span>
              <span className="info-value">
                {user.village ? `${user.village}, ` : ''}
                {user.district || 'Karnataka'}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <Globe size={15} /> {isKannada ? 'ಭಾಷೆ' : 'Language'}
              </span>
              <span className="info-value">
                {user.preferredLanguage === 'kn' ? 'ಕನ್ನಡ (Kannada)' : 'English'}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <Calendar size={15} /> {isKannada ? 'ಸೇರ್ಪಡೆ ದಿನಾಂಕ' : 'Member Since'}
              </span>
              <span className="info-value">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
              </span>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="profile-content-card">
          {/* Sub Tab Navigation */}
          <div className="tab-nav">
            <button
              className={`tab-btn ${activeSubTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('details')}
            >
              <User size={18} />
              {isKannada ? 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು' : 'Profile Details'}
            </button>
            <button
              className={`tab-btn ${activeSubTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('security')}
            >
              <KeyRound size={18} />
              {isKannada ? 'ಭದ್ರತೆ ಮತ್ತು ಪಾಸ್ವರ್ಡ್' : 'Security & Password'}
            </button>
          </div>

          {/* Sub Tab 1: Profile Details Form */}
          {activeSubTab === 'details' && (
            <form onSubmit={handleProfileSubmit}>
              {message.text && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                  {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Avatar Selector */}
              <div className="form-group">
                <label className="form-label">
                  {isKannada ? 'ಅವತಾರ / ಪ್ರೊಫೈಲ್ ಐಕಾನ್ ಆಯ್ಕೆಮಾಡಿ' : 'Choose Avatar Icon'}
                </label>
                <div className="avatar-grid">
                  {AVATAR_OPTIONS.map((icon) => (
                    <button
                      type="button"
                      key={icon}
                      className={`avatar-option ${formData.profilePic === icon ? 'selected' : ''}`}
                      onClick={() => handleAvatarSelect(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="form-group">
                <label className="form-label">
                  {isKannada ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Village & District */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    {isKannada ? 'ಗ್ರಾಮ / ಊರು' : 'Village / Town'}
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Shirhatti"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {isKannada ? 'ಜಿಲ್ಲೆ' : 'District'}
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Gadag / Belagavi"
                  />
                </div>
              </div>

              {/* State & Language */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    {isKannada ? 'ರಾಜ್ಯ' : 'State'}
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {isKannada ? 'ಆದ್ಯತೆಯ ಭಾಷೆ' : 'Preferred Language'}
                  </label>
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    className="input-field select-field"
                  >
                    <option value="en">English (English)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={loading}
              >
                <Save size={18} />
                {loading
                  ? isKannada
                    ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...'
                    : 'Saving Changes...'
                  : isKannada
                  ? 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ'
                  : 'Save Profile Changes'}
              </button>
            </form>
          )}

          {/* Sub Tab 2: Security / Password Change */}
          {activeSubTab === 'security' && (
            <form onSubmit={handlePasswordSubmit}>
              {passwordMessage.text && (
                <div
                  className={`alert ${
                    passwordMessage.type === 'error' ? 'alert-error' : 'alert-success'
                  }`}
                >
                  {passwordMessage.type === 'error' ? (
                    <AlertCircle size={18} />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  {isKannada ? 'ಪ್ರಸ್ತುತ ಪಾಸ್ವರ್ಡ್' : 'Current Password'}
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isKannada ? 'ಹೊಸ ಪಾಸ್ವರ್ಡ್' : 'New Password'}
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                  placeholder={
                    isKannada ? 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು' : 'Minimum 6 characters'
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isKannada ? 'ಹೊಸ ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಿಸಿ' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={passwordLoading}
              >
                <Lock size={18} />
                {passwordLoading
                  ? isKannada
                    ? 'ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...'
                    : 'Updating Password...'
                  : isKannada
                  ? 'ಪಾಸ್ವರ್ಡ್ ನವೀಕರಿಸಿ'
                  : 'Update Password'}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, KeyRound, CheckCircle, AlertCircle, ArrowLeft, Check } from 'lucide-react';

const ResetPassword = ({ setActiveTab, resetToken: initialToken }) => {
  const { resetPassword, language } = useAuth();
  const [token, setToken] = useState(initialToken || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [success, setSuccess] = useState(false);

  const isKannada = language === 'kn';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setMessage({
        type: 'error',
        text: isKannada ? 'ದಯವಿಟ್ಟು ಮರುಹೊಂದಿಕೆ ಟೋಕನ್ ನಮೂದಿಸಿ' : 'Please provide the reset token',
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: isKannada ? 'ಪಾಸ್ವರ್ಡ್ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ' : 'Passwords do not match',
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: 'error',
        text: isKannada ? 'ಪಾಸ್ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು' : 'Password must be at least 6 characters',
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const res = await resetPassword(token.trim(), password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setMessage({
        type: 'success',
        text:
          isKannada
            ? 'ಪಾಸ್ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಮರುಹೊಂದಿಸಲಾಗಿದೆ! ನೀವು ಈಗ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ.'
            : 'Password successfully reset! You are now logged in.',
      });
      setTimeout(() => {
        setActiveTab('profile');
      }, 2000);
    } else {
      setMessage({
        type: 'error',
        text: res.error || (isKannada ? 'ಮರುಹೊಂದಿಕೆ ವಿಫಲವಾಗಿದೆ' : 'Password reset failed'),
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Lock size={28} />
          </div>
          <h2>{isKannada ? 'ಹೊಸ ಪಾಸ್ವರ್ಡ್ ಹೊಂದಿಸಿ' : 'Reset Password'}</h2>
          <p>
            {isKannada
              ? 'ನಿಮ್ಮ ಭದ್ರತಾ ಟೋಕನ್ ಮತ್ತು ಹೊಸ ಪಾಸ್ವರ್ಡ್ ಅನ್ನು ನಮೂದಿಸಿ.'
              : 'Enter your security reset token and choose a new password.'}
          </p>
        </div>

        {message.text && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {isKannada
                ? 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪುಟಕ್ಕೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...'
                : 'Redirecting to your profile page...'}
            </p>
            <button className="btn btn-primary" onClick={() => setActiveTab('profile')}>
              {isKannada ? 'ಪ್ರೊಫೈಲ್ಗೆ ಹೋಗಿ' : 'Go to Profile'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                {isKannada ? 'ಭದ್ರತಾ ಮರುಹೊಂದಿಕೆ ಟೋಕನ್' : 'Security Reset Token'}
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="input-field"
                placeholder="Paste the 40-character reset token"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {isKannada ? 'ಹೊಸ ಪಾಸ್ವರ್ಡ್' : 'New Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder={isKannada ? 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು' : 'Minimum 6 characters'}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {isKannada ? 'ಹೊಸ ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಿಸಿ' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', marginBottom: '1rem' }}
              disabled={loading}
            >
              <Check size={18} />
              {loading
                ? isKannada
                  ? 'ಮರುಹೊಂದಿಸಲಾಗುತ್ತಿದೆ...'
                  : 'Resetting Password...'
                : isKannada
                ? 'ಪಾಸ್ವರ್ಡ್ ಬದಲಾಯಿಸಿ'
                : 'Confirm & Reset Password'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '0.875rem' }}
                onClick={() => setActiveTab('login')}
              >
                <ArrowLeft size={16} />
                <span>{isKannada ? 'ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Sign In'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

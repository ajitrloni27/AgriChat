import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, KeyRound, ArrowLeft, CheckCircle, AlertCircle, Copy, ArrowRight, ShieldCheck } from 'lucide-react';

const ForgotPassword = ({ setActiveTab, setResetToken }) => {
  const { forgotPassword, language } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const isKannada = language === 'kn';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await forgotPassword(email);
    setLoading(false);
    setResult(res);
  };

  const copyToken = () => {
    if (result?.resetToken) {
      navigator.clipboard.writeText(result.resetToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProceedToReset = () => {
    if (result?.resetToken && setResetToken) {
      setResetToken(result.resetToken);
    }
    setActiveTab('reset-password');
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
            <KeyRound size={28} />
          </div>
          <h2>{isKannada ? 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರುವಿರಾ?' : 'Forgot Password?'}</h2>
          <p>
            {isKannada
              ? 'ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ. ನಾವು ಮರುಹೊಂದಿಸುವ ಟೋಕನ್ ಕಳುಹಿಸುತ್ತೇವೆ.'
              : 'Enter your registered email address and we will generate a password reset token for you.'}
          </p>
        </div>

        {result && !result.success && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{result.error}</span>
          </div>
        )}

        {result && result.success ? (
          <div>
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>
                {isKannada
                  ? 'ಪಾಸ್ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಟೋಕನ್ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!'
                  : 'Password reset token generated successfully!'}
              </span>
            </div>

            <div style={{ margin: '1.25rem 0' }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                {isKannada ? 'ನಿಮ್ಮ ಮರುಹೊಂದಿಕೆ ಟೋಕನ್ (15 ನಿಮಿಷ ಮಾನ್ಯ):' : 'Your Reset Token (Valid for 15 mins):'}
              </label>
              <div className="copy-box">
                <span>{result.resetToken}</span>
                <button
                  onClick={copyToken}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontWeight: 600,
                  }}
                  title="Copy Token"
                >
                  <Copy size={16} />
                  {copied ? (isKannada ? 'ನಕಲಿಸಲಾಗಿದೆ!' : 'Copied!') : (isKannada ? 'ನಕಲಿಸಿ' : 'Copy')}
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
              onClick={handleProceedToReset}
            >
              <span>{isKannada ? 'ಹೊಸ ಪಾಸ್ವರ್ಡ್ ಹೊಂದಿಸಲು ಮುಂದುವರಿಯಿರಿ' : 'Proceed to Set New Password'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                className="btn btn-ghost"
                style={{ fontSize: '0.875rem' }}
                onClick={() => setActiveTab('login')}
              >
                <ArrowLeft size={16} />
                <span>{isKannada ? 'ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Sign In'}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                {isKannada ? 'ನೋಂದಾಯಿತ ಇಮೇಲ್ ವಿಳಾಸ' : 'Registered Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="e.g. basavaraj@agrichat.com"
                required
              />
            </div>

            {/* Quick Demo Fills */}
            <div className="demo-box">
              <div className="demo-title">
                {isKannada ? '💡 ತ್ವರಿತ ಡೆಮೊ ಇಮೇಲ್ ಪರೀಕ್ಷೆ:' : '💡 Quick Demo Email Test:'}
              </div>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => setEmail('basavaraj@agrichat.com')}
                >
                  🌾 Farmer Basavaraj
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => setEmail('dr.sharma@agrichat.com')}
                >
                  🎓 Expert Dr. Sharma
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', marginBottom: '1rem' }}
              disabled={loading}
            >
              <Mail size={18} />
              {loading
                ? isKannada
                  ? 'ಟೋಕನ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...'
                  : 'Generating Reset Token...'
                : isKannada
                ? 'ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಪಡೆಯಿರಿ'
                : 'Get Reset Token'}
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

export default ForgotPassword;

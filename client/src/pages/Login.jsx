import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login = ({ setActiveTab }) => {
  const { login, language } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isKannada = language === 'kn';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res?.success) {
      setActiveTab('feed');
    } else {
      setError(res?.error || 'Invalid credentials');
    }
  };

  const handleDemoFill = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isKannada ? 'ಮರಳಿ ಸ್ವಾಗತ! 👋' : 'Welcome Back 👋'}</h2>
          <p>
            {isKannada
              ? 'ನಿಮ್ಮ ಕೃಷಿ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ'
              : 'Sign in to access your farmer community & insights'}
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{isKannada ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'}</label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="farmer@agrichat.in"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                {isKannada ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password'}
              </label>
              <span
                onClick={() => setActiveTab('forgot-password')}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                {isKannada ? 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರುವಿರಾ?' : 'Forgot Password?'}
              </span>
            </div>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? (
              <span>{isKannada ? 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Verifying...'}</span>
            ) : (
              <>
                <span>{isKannada ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          {isKannada ? 'ಖಾತೆ ಇಲ್ಲವೇ?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setActiveTab('register')}
            style={{ color: '#16a34a', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isKannada ? 'ಹೊಸ ಖಾತೆ ರಚಿಸಿ' : 'Register now'}
          </span>
        </p>

        {/* Quick Demo Credentials */}
        <div className="demo-box">
          <div className="demo-title">
            ⚡ {isKannada ? 'ತ್ವರಿತ ಪರೀಕ್ಷಾರ್ಥ ಖಾತೆಗಳು' : 'Quick Demo Credentials'}
          </div>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoFill('farmer_test@agrichat.in', 'securepassword123')}
            >
              🌾 Test Farmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

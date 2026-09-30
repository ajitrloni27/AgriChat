import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, ArrowRight } from 'lucide-react';

const Register = ({ setActiveTab }) => {
  const { register, language } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    village: '',
    district: '',
    state: 'Karnataka',
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

    const res = await register(formData);
    setLoading(false);

    if (res?.success) {
      setActiveTab('feed');
    } else {
      setError(res?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '540px' }}>
        <div className="auth-header">
          <h2>{isKannada ? 'ಕೃಷಿ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ 🌱' : 'Join AgriChat Community 🌱'}</h2>
          <p>
            {isKannada
              ? 'ರೈತರು ಮತ್ತು ಕೃಷಿ ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ'
              : 'Connect with fellow farmers, get expert advice, and share knowledge'}
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'}</label>
              <input
                type="text"
                name="name"
                className="input-field"
                placeholder="Ramesh Gowda"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಪಾತ್ರ / ವರ್ಗ' : 'Role'}</label>
              <select
                name="role"
                className="input-field select-field"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="farmer">🌾 {isKannada ? 'ರೈತ (Farmer)' : 'Farmer'}</option>
                <option value="expert">🎓 {isKannada ? 'ಕೃಷಿ ತಜ್ಞ (Agri Expert)' : 'Agri Expert'}</option>
                <option value="admin">🛡️ {isKannada ? 'ನಿರ್ವಾಹಕ (Admin)' : 'Admin'}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{isKannada ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'}</label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="ramesh@agrichat.in"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isKannada ? 'ಗುಪ್ತಪದ (ಪಾಸ್‌ವರ್ಡ್)' : 'Password (min 6 chars)'}</label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಗ್ರಾಮ / ಊರು' : 'Village / Town'}</label>
              <input
                type="text"
                name="village"
                className="input-field"
                placeholder="Mandya"
                value={formData.village}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಜಿಲ್ಲೆ' : 'District'}</label>
              <input
                type="text"
                name="district"
                className="input-field"
                placeholder="Mandya"
                value={formData.district}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? (
              <span>{isKannada ? 'ಖಾತೆ ಸೃಷ್ಟಿಸಲಾಗುತ್ತಿದೆ...' : 'Creating Account...'}</span>
            ) : (
              <>
                <span>{isKannada ? 'ಖಾತೆ ರಚಿಸಿ' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          {isKannada ? 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?' : 'Already have an account?'}{' '}
          <span
            onClick={() => setActiveTab('login')}
            style={{ color: '#16a34a', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isKannada ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

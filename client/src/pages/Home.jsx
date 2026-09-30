import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, CheckCircle2, Shield, Users, MessageSquare, ArrowRight, UserCheck } from 'lucide-react';

const Home = ({ setActiveTab }) => {
  const { user, isAuthenticated, language } = useAuth();
  const isKannada = language === 'kn';

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Hero Header */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 3rem auto',
          background: 'linear-gradient(180deg, rgba(220, 252, 231, 0.5) 0%, rgba(255, 255, 255, 0) 100%)',
          padding: '3rem 2rem',
          borderRadius: '24px',
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
            marginBottom: '1rem',
          }}
        >
          <Sprout size={16} />
          {isKannada ? 'ದಿನ ೨: ಬಳಕೆದಾರ ದೃಢೀಕರಣ ಸಿದ್ಧವಾಗಿದೆ' : 'Day 2: Authentication Active'}
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
          {isKannada
            ? 'ರೈತರಿಗಾಗಿ ಕೃಷಿ ವೇದಿಕೆ & ಸಮಾಲೋಚನೆ'
            : 'Connecting Farmers, Growing Together'}
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>
          {isKannada
            ? 'ಬೆಳೆಗಳು, ಕೀಟ ನಿಯಂತ್ರಣ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಚರ್ಚಿಸಲು ನಿಮ್ಮ ಖಾತೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಿ.'
            : 'A dedicated digital community for farmers and agricultural experts to share crop insights, market updates, and pest solutions.'}
        </p>

        {isAuthenticated ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              background: '#ffffff',
              padding: '1rem 1.5rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <UserCheck color="#16a34a" size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>
                {isKannada ? `ಸ್ವಾಗತ, ${user?.name}!` : `Welcome back, ${user?.name}!`}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {user?.village ? `${user.village}, ` : ''}{user?.district || user?.state} • Role: {user?.role}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('login')}>
              {isKannada ? 'ಈಗಲೇ ಲಾಗಿನ್ ಮಾಡಿ' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
            <button className="btn btn-outline" onClick={() => setActiveTab('register')}>
              {isKannada ? 'ಹೊಸ ಖಾತೆ ರಚಿಸಿ' : 'Create Free Account'}
            </button>
          </div>
        )}
      </div>

      {/* Highlights Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Shield color="#15803d" size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            {isKannada ? 'ಸುರಕ್ಷಿತ ದೃಢೀಕರಣ' : 'Secure JWT & Bcrypt'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {isKannada
              ? 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು 10 rounds bcrypt ನೊಂದಿಗೆ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆಗಿವೆ.'
              : 'Passwords hashed with 10 salt rounds and verified via stateless JSON Web Tokens.'}
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Users color="#1e40af" size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            {isKannada ? 'ಪಾತ್ರ ಆಧಾರಿತ ಪ್ರವೇಶ (RBAC)' : 'Role-Based Access'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {isKannada
              ? 'ರೈತರು, ತಜ್ಞರು ಮತ್ತು ನಿರ್ವಾಹಕರಿಗೆ ವಿಭಿನ್ನ ಹಕ್ಕುಗಳು.'
              : 'Distinct privileges tailored for Farmers, Agri Experts, and Administrators.'}
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <MessageSquare color="#b45309" size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            {isKannada ? 'ಸಮುದಾಯ ಫೀಡ್ (ಮುಂದಿನ ಹಂತ)' : 'Community Feed (Day 4-5)'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {isKannada
              ? 'ಚಿತ್ರಗಳೊಂದಿಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ ಮತ್ತು ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ.'
              : 'Post farming updates with photo uploads, get likes, and comment on discussions.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

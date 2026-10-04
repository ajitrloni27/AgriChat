import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function MainApp() {
  const [activeTab, setActiveTab] = useState('feed');
  const [resetToken, setResetToken] = useState('');
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'feed' && <Feed setActiveTab={setActiveTab} />}
        {activeTab === 'login' && <Login setActiveTab={setActiveTab} />}
        {activeTab === 'register' && <Register setActiveTab={setActiveTab} />}
        {activeTab === 'profile' && <Profile setActiveTab={setActiveTab} />}
        {activeTab === 'forgot-password' && (
          <ForgotPassword setActiveTab={setActiveTab} setResetToken={setResetToken} />
        )}
        {activeTab === 'reset-password' && (
          <ResetPassword setActiveTab={setActiveTab} resetToken={resetToken} />
        )}
      </main>
      <footer
        style={{
          textAlign: 'center',
          padding: '1.5rem',
          fontSize: '0.875rem',
          color: '#64748b',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
        }}
      >
        🌾 AgriChat © 2026 • 10-Day MERN Stack Mini Project • Empowering Farmers
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;


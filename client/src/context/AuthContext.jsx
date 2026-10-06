import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agrichat_token') || null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('agrichat_lang') || 'en');

  // Language toggle function
  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'kn' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('agrichat_lang', nextLang);
  };

  // Fetch logged in user on initial load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            if (res.data.user.preferredLanguage) {
              setLanguage(res.data.user.preferredLanguage);
            }
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Register function
  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('agrichat_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('agrichat_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('agrichat_token');
    setToken(null);
    setUser(null);
  };

  // Update Profile function
  const updateProfile = async (profileData) => {
    try {
      const res = await API.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        if (profileData.preferredLanguage) {
          setLanguage(profileData.preferredLanguage);
          localStorage.setItem('agrichat_lang', profileData.preferredLanguage);
        }
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile',
      };
    }
  };

  // Update / Change Password function
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const res = await API.put('/auth/updatepassword', { currentPassword, newPassword });
      if (res.data.success) {
        localStorage.setItem('agrichat_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to change password',
      };
    }
  };

  // Forgot Password function
  const forgotPassword = async (email) => {
    try {
      const res = await API.post('/auth/forgotpassword', { email });
      return {
        success: true,
        message: res.data.message,
        resetToken: res.data.resetToken,
        resetUrl: res.data.resetUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate reset request',
      };
    }
  };

  // Reset Password function
  const resetPassword = async (resetToken, newPassword) => {
    try {
      const res = await API.put(`/auth/resetpassword/${resetToken}`, { password: newPassword });
      if (res.data.success) {
        localStorage.setItem('agrichat_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to reset password',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        language,
        toggleLanguage,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isExpert: user?.role === 'expert',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

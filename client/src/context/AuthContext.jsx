import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Separate loading states
  const [authLoading, setAuthLoading] = useState(false);    // initial login check
  const [actionLoading, setActionLoading] = useState(false); // signup/login buttons

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const signup = async ({ name, email, password }) => {
    setActionLoading(true);
    try {
      const res = await authAPI.signupWithEmail(email, password, name);
      if (res && res.success) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const checkLoginStatus = async () => {
    setAuthLoading(true);
    try {
      const res = await authAPI.checkLoginStatus();
      if (res.success) setUser(res.user);
      else setUser(null);
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async ({ email, password, OAuthProvider }) => {
    setActionLoading(true);
    try {
      let data = OAuthProvider
        ? await authAPI.login()
        : await authAPI.loginWithEmail(email, password);

      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login Error: ", err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    setActionLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    authLoading,
    actionLoading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

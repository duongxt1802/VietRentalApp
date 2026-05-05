// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuth, saveAuth, clearAllUserData } from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedUser = await getAuth();
        setUser(savedUser);
      } catch (e) {
        console.error('[AuthContext] init error:', e);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (userData) => {
    try {
      const success = await saveAuth(userData);
      if (success) {
        setUser(userData);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearAllUserData();
      setUser(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateUser = useCallback(async (updates) => {
    try {
      const updated = { ...user, ...updates };
      const success = await saveAuth(updated);
      if (success) {
        setUser(updated);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider');
  return ctx;
};

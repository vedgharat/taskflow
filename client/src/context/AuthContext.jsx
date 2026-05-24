import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token'));
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('taskflow_theme') || 'light');

  // Sync theme to document element class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // On mount (or token change), verify the stored token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authAPI.getMe();
        setUser(data.user);
      } catch {
        // Token is invalid or expired
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = useCallback(async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const { data } = await authAPI.updateProfile(profileData);
    localStorage.setItem('taskflow_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    theme,
    toggleTheme,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (userData: { name: string; email: string; role: string; department?: string }) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_EMAILS: Record<UserRole, string> = {
  student: 'student@demo.com',
  faculty: 'faculty@demo.com',
  advisor: 'advisor@demo.com',
  admin: 'admin@demo.com'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('assip_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const res = await api.getMe();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('assip_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session check failed, reverting to cached or demo state.');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
    localStorage.setItem('assip_user', JSON.stringify(res.user));
  };

  const register = async (userData: { name: string; email: string; role: string; department?: string }) => {
    const res = await api.register(userData);
    setUser(res.user);
    localStorage.setItem('assip_user', JSON.stringify(res.user));
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    localStorage.removeItem('assip_user');
  };

  const quickSwitchRole = async (role: UserRole) => {
    const email = DEMO_EMAILS[role];
    try {
      await login(email, 'demo123');
    } catch (e) {
      // Local fallback in case network hiccup
      const fallbackUser: User = {
        id: `usr-${role}-1`,
        email,
        role,
        name: role === 'student' ? 'Alex Kumar' :
              role === 'faculty' ? 'Dr. Sunita Ramanathan' :
              role === 'advisor' ? 'Prof. Rajeshwar Kulkarni' : 'Dr. Meenakshi Sundaram',
        department: role === 'student' || role === 'advisor' ? 'IT' : 'CSE',
        studentId: role === 'student' ? 'ST2024-1001' : undefined,
        createdAt: new Date().toISOString()
      };
      setUser(fallbackUser);
      localStorage.setItem('assip_user', JSON.stringify(fallbackUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        quickSwitchRole,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

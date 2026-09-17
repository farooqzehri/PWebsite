import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { resolveEndpoint, CUSTOM_API_URL } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (emailOrToken: string, passwordOrUser?: string | User) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bsa_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('bsa_token');
      if (storedToken) {
        try {
          const endpoint = '/api/auth/me';
          const targetUrl = resolveEndpoint(endpoint);
          let res: Response;
          try {
            res = await fetch(targetUrl, {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
          } catch (fetchErr) {
            if (CUSTOM_API_URL && targetUrl !== endpoint) {
              res = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${storedToken}` }
              });
            } else {
              throw fetchErr;
            }
          }
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('bsa_token');
            setToken(null);
            setUser(null);
          }
        } catch {
          // Token could still be locally valid if network offline
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (
    emailOrToken: string,
    passwordOrUser?: string | User
  ): Promise<{ success: boolean; message?: string }> => {
    // If second arg is an object or omitted, treat as (token, user)
    if (typeof passwordOrUser === 'object') {
      setToken(emailOrToken);
      setUser(passwordOrUser);
      localStorage.setItem('bsa_token', emailOrToken);
      return { success: true };
    }

    // Otherwise treat as (email, password)
    try {
      const endpoint = '/api/auth/login';
      const targetUrl = resolveEndpoint(endpoint);
      const reqOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrToken, password: passwordOrUser })
      };
      let res: Response;
      try {
        res = await fetch(targetUrl, reqOptions);
      } catch (fetchErr) {
        if (CUSTOM_API_URL && targetUrl !== endpoint) {
          res = await fetch(endpoint, reqOptions);
        } else {
          throw fetchErr;
        }
      }
      const data = await res.json();
      if (data.success && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('bsa_token', data.token);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch {
      return { success: false, message: 'Network error connecting to login server' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bsa_token');
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin,
        isLoading,
        loading: isLoading,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

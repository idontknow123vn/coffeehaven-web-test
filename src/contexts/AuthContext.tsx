import React, { createContext, useContext, useState, useEffect } from 'react';
import { _login } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  id: number | null;
  name: string | null;
  login: (username: string, password: string, role:  'EMPLOYEE' | 'CUSTOMER' | null) => Promise<string>;
  logout: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'EMPLOYEE' | 'CUSTOMER' | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const role = localStorage.getItem('role') as 'EMPLOYEE' | 'CUSTOMER' | null;
    if (role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const login = async (username: string, password: string, role: 'EMPLOYEE' | 'CUSTOMER' | null) => {
    const result = await _login({
      email: username,
      password,
      userType: role,
    });
    if (result.status === 200) {
      localStorage.setItem('accessToken', result.data.data.accessToken);
      setAccessToken(result.data.data.accessToken);
      setIsAuthenticated(true);
      setUserRole(result.data.data.role);
      setId(result.data.data.id);
      setName(result.data.data.name);
      return result.data.data.role;
    }
    else return "false";
  };

  const logout = () => {
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, accessToken, id, name }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
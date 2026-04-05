import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: 'U001',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  vehicles: [
    { id: 'V1', type: 'car', number: 'ABC-1234', model: 'Toyota Camry' },
    { id: 'V2', type: 'car', number: 'XYZ-5678', model: 'Honda Civic' },
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    if (email.includes('@')) {
      setUser({ ...mockUser, email });
      return true;
    }
    return false;
  };

  const signup = async (
    name: string,
    email: string,
    _password: string,
    phone: string,
  ): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser({ ...mockUser, name, email, phone });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

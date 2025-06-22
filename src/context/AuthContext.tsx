
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'StoreUser';
  storeId?: string;
  storeName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('posUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with actual API call
    const mockUsers = [
      { id: '1', username: 'admin', password: 'admin123', role: 'Admin' as const },
      { id: '2', username: 'store1', password: 'store123', role: 'StoreUser' as const, storeId: '1', storeName: 'Downtown Store' },
      { id: '3', username: 'store2', password: 'store123', role: 'StoreUser' as const, storeId: '2', storeName: 'Mall Store' }
    ];

    const foundUser = mockUsers.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('posUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('posUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

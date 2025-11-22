import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  registerNumber?: string;
  department?: string;
  year?: string;
  cgpa?: string;
  skills?: string[];
  contactNumber?: string;
  profilePhoto?: string;
  resume?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'student') => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'student'): Promise<boolean> => {
    // Allow any email/password, create user based on selected role
    if (role === 'admin') {
      const adminUser: User = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    } else {
      const studentUser: User = {
        id: '2',
        name: 'Student User',
        email: email,
        role: 'student',
        registerNumber: 'CS2021001',
        department: 'Computer Science',
        year: '2021',
        cgpa: '8.5',
        skills: ['JavaScript', 'React', 'Node.js'],
      };
      setUser(studentUser);
      localStorage.setItem('user', JSON.stringify(studentUser));
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
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

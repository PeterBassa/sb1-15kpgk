import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface User {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  login: async () => false,
  logout: () => {},
  register: async () => false,
});

const defaultAdminUser: User = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'password',
  isAdmin: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([defaultAdminUser]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        if (!parsedUsers.some((u: User) => u.isAdmin)) {
          parsedUsers.push(defaultAdminUser);
        }
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error parsing stored users:', error);
        setUsers([defaultAdminUser]);
      }
    } else {
      localStorage.setItem('users', JSON.stringify([defaultAdminUser]));
    }

    if (storedAuth) {
      setIsAuthenticated(storedAuth === 'true');
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(typeof parsedUser === 'string' ? parsedUser : null);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        setCurrentUser(null);
      }
    }
  }, []);

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const login = async (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(username));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('currentUser');
  };

  const register = async (username: string, email: string, password: string) => {
    if (users.some(u => u.username === username || u.email === email)) {
      return false; // Username or email already exists
    }
    const newUser = { username, email, password };
    saveUsers([...users, newUser]);
    setIsAuthenticated(true);
    setCurrentUser(username);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(username));
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
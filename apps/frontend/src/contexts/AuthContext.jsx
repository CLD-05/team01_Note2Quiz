import { createContext, useContext, useState } from 'react';
import { login as loginApi, logout as logoutApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const nickname = localStorage.getItem('nickname');
    return nickname ? { nickname } : null;
  });
  const [loading] = useState(false);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    const nickname = response.data.nickname;
    localStorage.setItem('nickname', nickname);
    setUser({ nickname });
    return response;
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem('nickname');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

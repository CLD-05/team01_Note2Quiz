import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, logout as logoutApi, authMe } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authMe()
      .then((res) => setUser({ nickname: res.data.nickname }))
      .catch(() => {
        localStorage.removeItem('nickname');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

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

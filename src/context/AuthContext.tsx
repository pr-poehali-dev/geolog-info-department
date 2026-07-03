import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, isBoss } from '@/types/employee';
import func2url from '../../backend/func2url.json';

const API_URL = func2url.employees;
const STORAGE_KEY = 'geomonitor_auth';

interface AuthContextValue {
  user: Employee | null;
  isBoss: boolean;
  login: (login: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: Employee) => void;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<Employee | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUserState(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persist = (u: Employee | null) => {
    setUserState(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (loginValue: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', login: loginValue, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data.error || 'Неверный логин или пароль' };
      }
      const u = await res.json();
      persist(u);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Ошибка соединения с сервером' };
    }
  };

  const logout = () => persist(null);

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!user?.login) return { ok: false, error: 'Требуется авторизация' };
    try {
      const res = await fetch(`${API_URL}?action=change_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Login': user.login },
        body: JSON.stringify({ action: 'change_password', oldPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data.error || 'Не удалось сменить пароль' };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: 'Ошибка соединения с сервером' };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isBoss: isBoss(user), login, logout, setUser: persist, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
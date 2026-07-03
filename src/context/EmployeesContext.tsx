import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '@/types/employee';
import { useAuth } from '@/context/AuthContext';
import func2url from '../../backend/func2url.json';

const API_URL = func2url.employees;

interface EmployeesContextValue {
  employees: Employee[];
  loading: boolean;
  getById: (id: string) => Employee | undefined;
  save: (employee: Employee) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

const EmployeesContext = createContext<EmployeesContextValue | null>(null);

export const EmployeesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = (): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(user?.login ? { 'X-Login': user.login } : {}),
  });

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: authHeaders() });
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.login]);

  const getById = (id: string) => employees.find((e) => e.id === id);

  const save = async (employee: Employee) => {
    const isNew = !employees.some((e) => e.id === employee.id);
    const res = await fetch(API_URL, {
      method: isNew ? 'POST' : 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error('Недостаточно прав для сохранения');
    const saved = await res.json();
    setEmployees((prev) =>
      isNew ? [...prev, saved] : prev.map((e) => (e.id === saved.id ? saved : e))
    );
  };

  const remove = async (id: string) => {
    await fetch(`${API_URL}?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <EmployeesContext.Provider
      value={{ employees, loading, getById, save, remove, reload }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  const ctx = useContext(EmployeesContext);
  if (!ctx) throw new Error('useEmployees must be used within EmployeesProvider');
  return ctx;
};

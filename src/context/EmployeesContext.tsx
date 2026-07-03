import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '@/types/employee';
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
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
  }, []);

  const getById = (id: string) => employees.find((e) => e.id === id);

  const save = async (employee: Employee) => {
    const isNew = !employees.some((e) => e.id === employee.id);
    const res = await fetch(API_URL, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    const saved = await res.json();
    setEmployees((prev) =>
      isNew ? [...prev, saved] : prev.map((e) => (e.id === saved.id ? saved : e))
    );
  };

  const remove = async (id: string) => {
    await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
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

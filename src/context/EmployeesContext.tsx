import { createContext, useContext, useState, ReactNode } from 'react';
import { Employee, EMPLOYEES } from '@/types/employee';

interface EmployeesContextValue {
  employees: Employee[];
  getById: (id: string) => Employee | undefined;
  save: (employee: Employee) => void;
  remove: (id: string) => void;
}

const EmployeesContext = createContext<EmployeesContextValue | null>(null);

export const EmployeesProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);

  const getById = (id: string) => employees.find((e) => e.id === id);

  const save = (employee: Employee) =>
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === employee.id);
      return exists
        ? prev.map((e) => (e.id === employee.id ? employee : e))
        : [...prev, employee];
    });

  const remove = (id: string) =>
    setEmployees((prev) => prev.filter((e) => e.id !== id));

  return (
    <EmployeesContext.Provider value={{ employees, getById, save, remove }}>
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  const ctx = useContext(EmployeesContext);
  if (!ctx) throw new Error('useEmployees must be used within EmployeesProvider');
  return ctx;
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/types/task';
import { useAuth } from '@/context/AuthContext';
import func2url from '../../backend/func2url.json';

const API_URL = func2url.tasks;

interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  create: (task: Partial<Task>) => Promise<{ ok: boolean; error?: string }>;
  update: (task: Partial<Task> & { id: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
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
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.login]);

  const create = async (task: Partial<Task>) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(task),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.error || 'Не удалось создать задачу' };
    }
    const saved = await res.json();
    setTasks((prev) => [saved, ...prev]);
    return { ok: true };
  };

  const update = async (task: Partial<Task> & { id: string }) => {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Не удалось обновить задачу');
    const saved = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
  };

  const remove = async (id: string) => {
    await fetch(`${API_URL}?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, create, update, remove, reload }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
};

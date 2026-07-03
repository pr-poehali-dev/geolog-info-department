import { Employee, EmployeePosition } from '@/types/employee';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'new' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  creatorId: string;
  creatorName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

export const PRIORITY_META: Record<
  TaskPriority,
  { label: string; color: string; icon: string }
> = {
  low: { label: 'Низкий', color: 'bg-zinc-100 text-zinc-600 border-zinc-200', icon: 'ArrowDown' },
  medium: { label: 'Средний', color: 'bg-sky-100 text-sky-700 border-sky-200', icon: 'Minus' },
  high: { label: 'Высокий', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: 'ArrowUp' },
};

export const TASK_STATUS_META: Record<
  TaskStatus,
  { label: string; color: string; dot: string }
> = {
  new: { label: 'Новая', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  in_progress: { label: 'В работе', color: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  done: { label: 'Выполнена', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};

// Ранг должности: чем выше — тем главнее в иерархии
export const POSITION_RANK: Record<EmployeePosition, number> = {
  'Начальник отдела': 4,
  'Заместитель начальника отдела': 3,
  'Главный специалист': 2,
  'Ведущий специалист': 1,
  'Специалист': 0,
};

// Может ли actor назначить исполнителем сотрудника assignee (по иерархии)
export const canAssign = (
  actor: Employee | null,
  assignee: Employee
): boolean => {
  if (!actor) return false;
  const actorRank = POSITION_RANK[actor.position] ?? 0;
  const assigneeRank = POSITION_RANK[assignee.position] ?? 0;
  if (actorRank >= POSITION_RANK['Начальник отдела']) return true;
  return assigneeRank <= actorRank;
};

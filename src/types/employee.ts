export type EmployeeStatus = 'active' | 'vacation' | 'sick' | 'business_trip' | 'fired';

export type EmployeePosition =
  | 'Начальник отдела'
  | 'Заместитель начальника отдела'
  | 'Главный специалист'
  | 'Ведущий специалист'
  | 'Специалист';

export interface CustomField {
  label: string;
  value: string;
}

export interface Employee {
  id: string;
  fullName: string;
  position: EmployeePosition;
  status: EmployeeStatus;
  email: string;
  phone: string;
  birthDate: string;
  hiredAt: string;
  location: string;
  about: string;
  avatarColor: string;
  login?: string;
  password?: string;
  customFields: CustomField[];
  stats: {
    tasksDone: number;
    tasksInProgress: number;
    reports: number;
    efficiency: number;
  };
}

export const isBoss = (employee: Employee | null): boolean =>
  employee?.position === 'Начальник отдела';

export const POSITIONS: EmployeePosition[] = [
  'Начальник отдела',
  'Заместитель начальника отдела',
  'Главный специалист',
  'Ведущий специалист',
  'Специалист',
];

export const STATUS_META: Record<
  EmployeeStatus,
  { label: string; color: string; dot: string; icon: string }
> = {
  active: { label: 'На работе', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', icon: 'CircleCheck' },
  vacation: { label: 'В отпуске', color: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', icon: 'Palmtree' },
  sick: { label: 'На больничном', color: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', icon: 'Thermometer' },
  business_trip: { label: 'В командировке', color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', icon: 'Plane' },
  fired: { label: 'Уволен', color: 'bg-zinc-100 text-zinc-600 border-zinc-200', dot: 'bg-zinc-400', icon: 'CircleX' },
};

export const DEPARTMENT_NAME = 'Отдел мониторинга геологической информации';
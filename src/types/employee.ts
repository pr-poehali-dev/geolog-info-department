export type EmployeeStatus = 'active' | 'vacation' | 'sick' | 'business_trip' | 'fired';

export type EmployeePosition =
  | 'Начальник отдела'
  | 'Заместитель начальника отдела'
  | 'Главный специалист'
  | 'Ведущий специалист'
  | 'Специалист';

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
  stats: {
    tasksDone: number;
    tasksInProgress: number;
    reports: number;
    efficiency: number;
  };
}

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

export const EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    fullName: 'Соколов Андрей Викторович',
    position: 'Начальник отдела',
    status: 'active',
    email: 'a.sokolov@geomonitor.ru',
    phone: '+7 (495) 120-45-01',
    birthDate: '1976-03-14',
    hiredAt: '2009-06-01',
    location: 'Москва, каб. 401',
    about: 'Руководит отделом, отвечает за стратегию мониторинга геологической информации и взаимодействие с профильными ведомствами.',
    avatarColor: 'from-emerald-500 to-teal-700',
    stats: { tasksDone: 214, tasksInProgress: 6, reports: 48, efficiency: 96 },
  },
  {
    id: 'emp-2',
    fullName: 'Морозова Елена Сергеевна',
    position: 'Заместитель начальника отдела',
    status: 'business_trip',
    email: 'e.morozova@geomonitor.ru',
    phone: '+7 (495) 120-45-02',
    birthDate: '1982-09-27',
    hiredAt: '2012-02-15',
    location: 'Москва, каб. 402',
    about: 'Координирует оперативную работу специалистов, контролирует качество и сроки подготовки аналитических отчётов.',
    avatarColor: 'from-sky-500 to-indigo-700',
    stats: { tasksDone: 187, tasksInProgress: 9, reports: 41, efficiency: 92 },
  },
  {
    id: 'emp-3',
    fullName: 'Гаврилов Дмитрий Олегович',
    position: 'Главный специалист',
    status: 'active',
    email: 'd.gavrilov@geomonitor.ru',
    phone: '+7 (495) 120-45-03',
    birthDate: '1988-11-05',
    hiredAt: '2015-09-10',
    location: 'Москва, каб. 405',
    about: 'Ведёт сбор и первичную обработку данных геологического мониторинга, отвечает за аналитику по региональным участкам.',
    avatarColor: 'from-amber-500 to-orange-700',
    stats: { tasksDone: 156, tasksInProgress: 11, reports: 33, efficiency: 89 },
  },
];

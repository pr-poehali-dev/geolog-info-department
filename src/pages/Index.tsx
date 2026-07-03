import { useNavigate } from 'react-router-dom';
import { DEPARTMENT_NAME } from '@/types/employee';
import { useEmployees } from '@/context/EmployeesContext';
import Icon from '@/components/ui/icon';

const Index = () => {
  const navigate = useNavigate();
  const { employees } = useEmployees();
  const active = employees.filter((e) => e.status === 'active').length;

  const sections = [
    {
      title: 'Сотрудники',
      description: 'Список сотрудников, фильтрация, добавление и редактирование',
      icon: 'Users',
      to: '/employees',
      accent: 'from-emerald-500 to-teal-700',
      badge: `${employees.length} чел.`,
    },
    {
      title: 'Личные кабинеты',
      description: 'Карточки сотрудников с данными и персональной статистикой',
      icon: 'IdCard',
      to: '/employees',
      accent: 'from-sky-500 to-indigo-700',
      badge: `${active} на работе`,
    },
    {
      title: 'Настройки системы',
      description: 'Управление ролями доступа и параметрами отдела',
      icon: 'Settings',
      to: '/settings',
      accent: 'from-amber-500 to-orange-700',
      badge: 'Роли',
    },
  ];

  return (
    <div className="topo-grid min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            <Icon name="Mountain" size={16} />
            Система управления отделом
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-primary md:text-6xl">
            {DEPARTMENT_NAME}
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Единая рабочая среда отдела: сотрудники, личные кабинеты и статистика
            в одном месте.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {sections.map((s, i) => (
            <button
              key={s.title}
              onClick={() => navigate(s.to)}
              style={{ animationDelay: `${i * 100}ms` }}
              className="group animate-fade-in rounded-3xl border border-border bg-card p-7 text-left opacity-0 shadow-sm transition-all hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-2xl [animation-fill-mode:forwards]"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.accent} text-white shadow-lg`}
              >
                <Icon name={s.icon} size={26} />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold tracking-wide text-foreground">
                  {s.title}
                </h3>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {s.badge}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-accent">
                Перейти
                <Icon
                  name="ArrowRight"
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-border pt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="Users" size={16} className="text-accent" />
            Всего сотрудников: <span className="font-semibold text-foreground">{employees.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="CircleCheck" size={16} className="text-accent" />
            На работе: <span className="font-semibold text-foreground">{active}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

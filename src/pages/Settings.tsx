import { useNavigate } from 'react-router-dom';
import { DEPARTMENT_NAME } from '@/types/employee';
import Icon from '@/components/ui/icon';

const ROLES = [
  {
    name: 'Администратор',
    description: 'Полный доступ: добавление, удаление и редактирование любых сотрудников и настроек',
    icon: 'ShieldCheck',
    color: 'from-emerald-500 to-teal-700',
    permissions: ['Управление сотрудниками', 'Настройки системы', 'Роли доступа'],
  },
  {
    name: 'Руководитель',
    description: 'Просмотр всех данных, редактирование карточек сотрудников отдела',
    icon: 'UserCog',
    color: 'from-sky-500 to-indigo-700',
    permissions: ['Редактирование сотрудников', 'Просмотр статистики'],
  },
  {
    name: 'Сотрудник',
    description: 'Доступ к личному кабинету и редактированию собственных данных',
    icon: 'User',
    color: 'from-amber-500 to-orange-700',
    permissions: ['Свой кабинет', 'Просмотр списка'],
  },
];

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-accent"
          >
            <Icon name="ArrowLeft" size={16} />
            Отдел
          </button>
          <div className="hidden truncate font-display text-sm uppercase tracking-widest text-muted-foreground md:block">
            {DEPARTMENT_NAME}
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="font-display text-3xl font-bold tracking-wide text-primary">
          Настройки системы
        </h1>
        <p className="mt-1 text-muted-foreground">Управление ролями доступа и параметрами отдела</p>

        <h2 className="mt-10 font-display text-lg font-semibold uppercase tracking-wide text-foreground">
          Роли доступа
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {ROLES.map((role, i) => (
            <div
              key={role.name}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-fade-in rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${role.color} text-white shadow-lg`}
              >
                <Icon name={role.icon} size={22} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-wide text-foreground">
                {role.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {role.permissions.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-foreground">
                    <Icon name="Check" size={15} className="text-accent" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-lg font-semibold uppercase tracking-wide text-foreground">
          Параметры отдела
        </h2>
        <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
          {[
            { label: 'Наименование отдела', value: DEPARTMENT_NAME, icon: 'Building2' },
            { label: 'Язык интерфейса', value: 'Русский', icon: 'Languages' },
            { label: 'Часовой пояс', value: 'МСК (UTC+3)', icon: 'Clock' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name={row.icon} size={16} />
                </div>
                <span className="text-sm font-medium text-foreground">{row.label}</span>
              </div>
              <span className="text-right text-sm text-muted-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;

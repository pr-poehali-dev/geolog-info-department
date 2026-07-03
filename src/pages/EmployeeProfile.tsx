import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeesContext';
import { STATUS_META } from '@/types/employee';
import EmployeeAvatar from '@/components/EmployeeAvatar';
import EmployeeFormDialog from '@/components/EmployeeFormDialog';
import Icon from '@/components/ui/icon';

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, save } = useEmployees();
  const [editOpen, setEditOpen] = useState(false);

  const employee = id ? getById(id) : undefined;

  if (!employee) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
        <Icon name="UserX" size={48} className="text-muted-foreground/50" />
        <p className="text-muted-foreground">Сотрудник не найден</p>
        <button
          onClick={() => navigate('/employees')}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          К списку сотрудников
        </button>
      </div>
    );
  }

  const status = STATUS_META[employee.status];

  const stats = [
    { label: 'Задач выполнено', value: employee.stats.tasksDone, icon: 'CircleCheckBig', color: 'text-emerald-600' },
    { label: 'В работе', value: employee.stats.tasksInProgress, icon: 'Clock', color: 'text-amber-600' },
    { label: 'Отчётов', value: employee.stats.reports, icon: 'FileText', color: 'text-sky-600' },
    { label: 'Эффективность', value: `${employee.stats.efficiency}%`, icon: 'TrendingUp', color: 'text-violet-600' },
  ];

  const details = [
    { label: 'Email', value: employee.email, icon: 'Mail' },
    { label: 'Телефон', value: employee.phone, icon: 'Phone' },
    { label: 'Дата рождения', value: formatDate(employee.birthDate), icon: 'Cake' },
    { label: 'В отделе с', value: formatDate(employee.hiredAt), icon: 'CalendarDays' },
    { label: 'Расположение', value: employee.location, icon: 'MapPin' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/employees')}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-accent"
          >
            <Icon name="ArrowLeft" size={16} />
            К списку
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            <Icon name="Pencil" size={15} />
            Редактировать
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="animate-fade-in overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className={`h-28 bg-gradient-to-r ${employee.avatarColor}`} />
          <div className="px-6 pb-6">
            <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <EmployeeAvatar fullName={employee.fullName} color={employee.avatarColor} size="xl" />
                <div className="pb-1">
                  <h1 className="font-display text-2xl font-bold tracking-wide text-foreground md:text-3xl">
                    {employee.fullName}
                  </h1>
                  <p className="text-muted-foreground">{employee.position}</p>
                </div>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1.5 text-sm font-semibold ${status.color}`}
              >
                <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                {status.label}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-scale-in rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <Icon name={s.icon} size={22} className={s.color} />
              <div className="mt-3 font-display text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="font-display text-lg font-semibold tracking-wide text-foreground">
              Контакты и данные
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon name={d.icon} size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {d.label}
                    </div>
                    <div className="truncate font-medium text-foreground">{d.value || '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold tracking-wide text-foreground">
              О сотруднике
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {employee.about || 'Информация не заполнена.'}
            </p>
          </div>
        </div>
      </div>

      <EmployeeFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        employee={employee}
        onSave={save}
      />
    </div>
  );
};

export default EmployeeProfile;

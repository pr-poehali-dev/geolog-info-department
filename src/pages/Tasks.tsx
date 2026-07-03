import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEmployees } from '@/context/EmployeesContext';
import { useTasks } from '@/context/TasksContext';
import { DEPARTMENT_NAME } from '@/types/employee';
import { canAssign, TaskStatus, TASK_STATUS_META } from '@/types/task';
import TaskCard from '@/components/TaskCard';
import TaskFormDialog from '@/components/TaskFormDialog';
import Icon from '@/components/ui/icon';

const Tasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { tasks, update, remove, loading } = useTasks();
  const [taskOpen, setTaskOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');

  const myEmployeeId = useMemo(
    () => employees.find((e) => e.login && e.login === user?.login)?.id,
    [employees, user]
  );

  // ID сотрудников, которых текущий пользователь может назначать (подчинённые по иерархии)
  const subordinateIds = useMemo(() => {
    const ids = new Set<string>();
    employees.forEach((e) => {
      if (e.id !== myEmployeeId && canAssign(user, e)) ids.add(e.id);
    });
    return ids;
  }, [employees, user, myEmployeeId]);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === myEmployeeId),
    [tasks, myEmployeeId]
  );

  const subordinateTasks = useMemo(
    () => tasks.filter((t) => subordinateIds.has(t.assigneeId)),
    [tasks, subordinateIds]
  );

  const applyStatus = (list: typeof tasks) =>
    statusFilter === 'all' ? list : list.filter((t) => t.status === statusFilter);

  const filteredMy = applyStatus(myTasks);
  const filteredSub = applyStatus(subordinateTasks);

  const handleStatusChange = (taskId: string, status: TaskStatus) =>
    update({ id: taskId, status });

  const canManage = (assigneeId: string) =>
    assigneeId === myEmployeeId || subordinateIds.has(assigneeId);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
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
          <button
            onClick={() => setTaskOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
          >
            <Icon name="Plus" size={16} />
            Создать задачу
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="font-display text-3xl font-bold tracking-wide text-primary">Задачи</h1>
        <p className="mt-1 text-muted-foreground">
          Ваши задачи{subordinateIds.size > 0 ? ' и задачи назначенных вами сотрудников' : ''}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(['all', 'new', 'in_progress', 'done'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                statusFilter === s
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-accent/40'
              }`}
            >
              {s === 'all' ? 'Все' : TASK_STATUS_META[s].label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Icon name="LoaderCircle" size={28} className="animate-spin" />
            <p>Загружаем задачи...</p>
          </div>
        ) : (
          <>
            <section className="mt-8">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-wide text-foreground">
                <Icon name="UserCheck" size={18} className="text-accent" />
                Мои задачи
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {filteredMy.length}
                </span>
              </h2>
              {filteredMy.length === 0 ? (
                <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center text-muted-foreground">
                  <Icon name="ClipboardCheck" size={32} className="text-muted-foreground/40" />
                  <p className="text-sm">Назначенных вам задач нет</p>
                </div>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMy.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      canManage
                      onStatusChange={handleStatusChange}
                      onDelete={remove}
                    />
                  ))}
                </div>
              )}
            </section>

            {subordinateIds.size > 0 && (
              <section className="mt-10">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-wide text-foreground">
                  <Icon name="Users" size={18} className="text-accent" />
                  Задачи назначенных сотрудников
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {filteredSub.length}
                  </span>
                </h2>
                {filteredSub.length === 0 ? (
                  <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center text-muted-foreground">
                    <Icon name="ClipboardList" size={32} className="text-muted-foreground/40" />
                    <p className="text-sm">Задач у назначенных сотрудников нет</p>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSub.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        canManage={canManage(t.assigneeId)}
                        onStatusChange={handleStatusChange}
                        onDelete={remove}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      <TaskFormDialog open={taskOpen} onOpenChange={setTaskOpen} />
    </div>
  );
};

export default Tasks;

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeesContext';
import { useAuth } from '@/context/AuthContext';
import {
  DEPARTMENT_NAME,
  Employee,
  POSITIONS,
  STATUS_META,
  EmployeeStatus,
} from '@/types/employee';
import EmployeeCard from '@/components/EmployeeCard';
import EmployeeFormDialog from '@/components/EmployeeFormDialog';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Employees = () => {
  const navigate = useNavigate();
  const { employees, save, remove, loading } = useEmployees();
  const { isBoss, logout, user } = useAuth();

  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      employees.filter((e) => {
        const matchSearch = e.fullName.toLowerCase().includes(search.toLowerCase());
        const matchPos = posFilter === 'all' || e.position === posFilter;
        const matchStatus = statusFilter === 'all' || e.status === statusFilter;
        return matchSearch && matchPos && matchStatus;
      }),
    [employees, search, posFilter, statusFilter]
  );

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (id: string) => {
    setEditing(employees.find((e) => e.id === id) || null);
    setDialogOpen(true);
  };

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
          <div className="flex items-center gap-2">
            {isBoss && (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
              >
                <Icon name="Plus" size={16} />
                Добавить
              </button>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              title={`Выйти (${user?.fullName || ''})`}
            >
              <Icon name="LogOut" size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="font-display text-3xl font-bold tracking-wide text-primary">
          Сотрудники
        </h1>
        <p className="mt-1 text-muted-foreground">
          Найдено: {filtered.length} из {employees.length}
        </p>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по ФИО..."
              className="pl-9"
            />
          </div>
          <select
            value={posFilter}
            onChange={(e) => setPosFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">Все должности</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">Все статусы</option>
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center text-muted-foreground">
            <Icon name="LoaderCircle" size={36} className="animate-spin text-accent" />
            <p>Загружаем сотрудников...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <EmployeeCard
                key={e.id}
                employee={e}
                canManage={isBoss}
                onOpen={(id) => navigate(`/employees/${id}`)}
                onEdit={openEdit}
                onDelete={setDeleteId}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-3 text-center text-muted-foreground">
            <Icon name="SearchX" size={40} className="text-muted-foreground/50" />
            <p>Сотрудники не найдены</p>
          </div>
        )}
      </div>

      <EmployeeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editing}
        onSave={save}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить сотрудника?</AlertDialogTitle>
            <AlertDialogDescription>
              Действие нельзя отменить. Карточка сотрудника будет удалена из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) remove(deleteId);
                setDeleteId(null);
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Employees;
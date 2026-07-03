import { Employee, STATUS_META } from '@/types/employee';
import EmployeeAvatar from '@/components/EmployeeAvatar';
import Icon from '@/components/ui/icon';

interface EmployeeCardProps {
  employee: Employee;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EmployeeCard = ({ employee, onOpen, onEdit, onDelete }: EmployeeCardProps) => {
  const status = STATUS_META[employee.status];

  return (
    <div className="group relative animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <EmployeeAvatar fullName={employee.fullName} color={employee.avatarColor} size="md" />
        <div className="min-w-0 flex-1">
          <button
            onClick={() => onOpen(employee.id)}
            className="text-left font-display text-lg font-semibold leading-tight tracking-wide text-foreground transition-colors hover:text-accent"
          >
            {employee.fullName}
          </button>
          <p className="mt-0.5 text-sm text-muted-foreground">{employee.position}</p>
        </div>
      </div>

      <div
        className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.color}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 truncate">
          <Icon name="Mail" size={14} className="shrink-0 text-accent" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Phone" size={14} className="shrink-0 text-accent" />
          <span>{employee.phone}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
        <button
          onClick={() => onOpen(employee.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Icon name="User" size={15} />
          Кабинет
        </button>
        <button
          onClick={() => onEdit(employee.id)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          title="Редактировать"
        >
          <Icon name="Pencil" size={15} />
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
          title="Удалить"
        >
          <Icon name="Trash2" size={15} />
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;

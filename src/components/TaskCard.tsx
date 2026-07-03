import { Task, PRIORITY_META, TASK_STATUS_META, TaskStatus } from '@/types/task';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskCardProps {
  task: Task;
  canManage: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '';

const TaskCard = ({ task, canManage, onStatusChange, onDelete }: TaskCardProps) => {
  const priority = PRIORITY_META[task.priority];
  const status = TASK_STATUS_META[task.status];

  return (
    <div className="animate-fade-in rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug text-foreground">{task.title}</h3>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${priority.color}`}
        >
          <Icon name={priority.icon} size={11} />
          {priority.label}
        </span>
      </div>

      {task.description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{task.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Icon name="User" size={13} className="text-accent" />
          {task.assigneeName}
        </span>
        {task.creatorName && (
          <span className="flex items-center gap-1.5">
            <Icon name="UserPen" size={13} />
            от {task.creatorName}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center gap-1.5">
            <Icon name="CalendarClock" size={13} />
            до {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        {canManage ? (
          <Select value={task.status} onValueChange={(v) => onStatusChange(task.id, v as TaskStatus)}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TASK_STATUS_META).map(([key, meta]) => (
                <SelectItem key={key} value={key}>
                  {meta.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.color}`}
          >
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        )}

        {canManage && (
          <button
            onClick={() => onDelete(task.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            title="Удалить задачу"
          >
            <Icon name="Trash2" size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

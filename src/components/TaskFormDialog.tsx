import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';
import { useEmployees } from '@/context/EmployeesContext';
import { useTasks } from '@/context/TasksContext';
import { useToast } from '@/hooks/use-toast';
import { canAssign, PRIORITY_META, TaskPriority } from '@/types/task';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAssigneeId?: string;
}

const TaskFormDialog = ({ open, onOpenChange, defaultAssigneeId }: TaskFormDialogProps) => {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { create } = useTasks();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableAssignees = useMemo(
    () => employees.filter((e) => e.status !== 'fired' && canAssign(user, e)),
    [employees, user]
  );

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setError('');
    const allowedDefault =
      defaultAssigneeId &&
      availableAssignees.some((e) => e.id === defaultAssigneeId)
        ? defaultAssigneeId
        : availableAssignees[0]?.id || '';
    setAssigneeId(allowedDefault);
  }, [open, defaultAssigneeId, availableAssignees]);

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('Введите заголовок задачи');
      return;
    }
    if (!assigneeId) {
      setError('Выберите исполнителя');
      return;
    }
    setLoading(true);
    const res = await create({
      title: title.trim(),
      description: description.trim(),
      assigneeId,
      priority,
      status: 'new',
      dueDate,
    });
    setLoading(false);
    if (res.ok) {
      toast({ title: 'Задача создана', description: 'Исполнитель увидит её в своём кабинете.' });
      onOpenChange(false);
    } else {
      setError(res.error || 'Не удалось создать задачу');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl tracking-wide">
            <Icon name="ListPlus" size={18} className="text-accent" />
            Новая задача
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Заголовок</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Что нужно сделать"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label>Описание</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Детали, критерии, ссылки..."
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Исполнитель</Label>
            {availableAssignees.length === 0 ? (
              <p className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                Нет доступных сотрудников для назначения по вашим правам.
              </p>
            ) : (
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите сотрудника" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssignees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.fullName} — {e.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Приоритет</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_META).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Срок</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <Icon name="TriangleAlert" size={15} />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={loading || availableAssignees.length === 0}>
            {loading ? <Icon name="LoaderCircle" size={16} className="animate-spin" /> : 'Создать задачу'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;

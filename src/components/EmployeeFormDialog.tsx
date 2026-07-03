import { useEffect, useState } from 'react';
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
import {
  Employee,
  EmployeePosition,
  EmployeeStatus,
  POSITIONS,
  STATUS_META,
} from '@/types/employee';

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (employee: Employee) => void | Promise<void>;
}

const COLORS = [
  'from-emerald-500 to-teal-700',
  'from-sky-500 to-indigo-700',
  'from-amber-500 to-orange-700',
  'from-rose-500 to-pink-700',
  'from-violet-500 to-purple-700',
];

const empty = (): Employee => ({
  id: `emp-${Date.now()}`,
  fullName: '',
  position: 'Специалист',
  status: 'active',
  email: '',
  phone: '',
  birthDate: '',
  hiredAt: '',
  location: '',
  about: '',
  avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
  login: '',
  password: '',
  customFields: [],
  stats: { tasksDone: 0, tasksInProgress: 0, reports: 0, efficiency: 0 },
});

const EmployeeFormDialog = ({
  open,
  onOpenChange,
  employee,
  onSave,
}: EmployeeFormDialogProps) => {
  const [form, setForm] = useState<Employee>(empty());

  useEffect(() => {
    setForm(
      employee
        ? { ...employee, password: '', customFields: employee.customFields || [] }
        : empty()
    );
  }, [employee, open]);

  const set = (patch: Partial<Employee>) => setForm((f) => ({ ...f, ...patch }));

  const addField = () =>
    setForm((f) => ({
      ...f,
      customFields: [...(f.customFields || []), { label: '', value: '' }],
    }));

  const updateField = (i: number, patch: Partial<{ label: string; value: string }>) =>
    setForm((f) => ({
      ...f,
      customFields: f.customFields.map((cf, idx) =>
        idx === i ? { ...cf, ...patch } : cf
      ),
    }));

  const removeField = (i: number) =>
    setForm((f) => ({
      ...f,
      customFields: f.customFields.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = async () => {
    if (!form.fullName.trim()) return;
    try {
      await onSave(form);
      onOpenChange(false);
    } catch {
      /* ошибка сохранения — диалог остаётся открытым */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-wide">
            {employee ? 'Редактирование сотрудника' : 'Новый сотрудник'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>ФИО</Label>
            <Input
              value={form.fullName}
              onChange={(e) => set({ fullName: e.target.value })}
              placeholder="Иванов Иван Иванович"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Должность</Label>
              <Select
                value={form.position}
                onValueChange={(v) => set({ position: v as EmployeePosition })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Статус</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set({ status: v as EmployeeStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_META).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="name@geomonitor.ru"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Телефон</Label>
              <Input
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="+7 (___) ___-__-__"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Дата рождения</Label>
              <Input
                type="date"
                value={form.birthDate}
                onChange={(e) => set({ birthDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Дата приёма</Label>
              <Input
                type="date"
                value={form.hiredAt}
                onChange={(e) => set({ hiredAt: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Кабинет / расположение</Label>
            <Input
              value={form.location}
              onChange={(e) => set({ location: e.target.value })}
              placeholder="Москва, каб. 000"
            />
          </div>

          <div className="space-y-1.5">
            <Label>О сотруднике</Label>
            <Textarea
              value={form.about}
              onChange={(e) => set({ about: e.target.value })}
              placeholder="Зона ответственности, задачи..."
              rows={3}
            />
          </div>

          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Icon name="KeyRound" size={15} className="text-accent" />
              Доступ в систему
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Логин</Label>
                <Input
                  value={form.login || ''}
                  onChange={(e) => set({ login: e.target.value })}
                  placeholder="ivanov"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{employee ? 'Новый пароль' : 'Пароль'}</Label>
                <Input
                  type="password"
                  value={form.password || ''}
                  onChange={(e) => set({ password: e.target.value })}
                  placeholder={employee ? 'Оставьте пустым' : 'Задайте пароль'}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Icon name="ListPlus" size={15} className="text-accent" />
                Дополнительные поля
              </Label>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
              >
                <Icon name="Plus" size={14} />
                Добавить
              </button>
            </div>

            {form.customFields.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Например: «Учёная степень», «Категория допуска», «Куратор участка»
              </p>
            )}

            {form.customFields.map((cf, i) => (
              <div key={i} className="flex items-start gap-2">
                <Input
                  value={cf.label}
                  onChange={(e) => updateField(i, { label: e.target.value })}
                  placeholder="Название поля"
                  className="flex-1"
                />
                <Input
                  value={cf.value}
                  onChange={(e) => updateField(i, { value: e.target.value })}
                  placeholder="Значение"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                >
                  <Icon name="X" size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>
            {employee ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
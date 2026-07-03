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
  onSave: (employee: Employee) => void;
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
    setForm(employee ? { ...employee } : empty());
  }, [employee, open]);

  const set = (patch: Partial<Employee>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = () => {
    if (!form.fullName.trim()) return;
    onSave(form);
    onOpenChange(false);
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

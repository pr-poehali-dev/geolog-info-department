import Icon from '@/components/ui/icon';
import { DEPARTMENT_NAME } from '@/types/employee';

const PageLoader = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-center text-muted-foreground">
    <Icon name="LoaderCircle" size={36} className="animate-spin text-accent" />
    <p className="font-display text-lg font-semibold tracking-wide text-primary">{DEPARTMENT_NAME}</p>
    <p>Система управления отделом: сотрудники, личные кабинеты, статистика. Загрузка...</p>
  </div>
);

export default PageLoader;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DEPARTMENT_NAME } from '@/types/employee';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(loginValue.trim(), password);
    setLoading(false);
    if (res.ok) navigate('/');
    else setError(res.error || 'Ошибка входа');
  };

  return (
    <div className="topo-grid flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md animate-scale-in">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl">
            <Icon name="Mountain" size={30} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold tracking-wide text-primary">
            Вход в систему
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{DEPARTMENT_NAME}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-border bg-card p-8 shadow-lg"
        >
          <div className="space-y-1.5">
            <Label>Логин</Label>
            <Input
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              placeholder="Введите логин"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>Пароль</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <Icon name="TriangleAlert" size={15} />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Icon name="LoaderCircle" size={16} className="animate-spin" />
            ) : (
              'Войти'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Доступ выдаёт начальник отдела
        </p>
      </div>
    </div>
  );
};

export default Login;

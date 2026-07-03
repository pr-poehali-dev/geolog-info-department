import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  bossOnly?: boolean;
}

const ProtectedRoute = ({ children, bossOnly }: ProtectedRouteProps) => {
  const { user, isBoss } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (bossOnly && !isBoss) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;

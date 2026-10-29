import { ReactNode } from 'react';
import { Navigate } from "@/lib/router-compat";
import PageLoader from "@/components/PageLoader";
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  bossOnly?: boolean;
}

const ProtectedRoute = ({ children, bossOnly }: ProtectedRouteProps) => {
  const { user, isBoss, loaded } = useAuth();

  if (!loaded) return <PageLoader />;

  if (!user) return <Navigate to="/login" replace />;
  if (bossOnly && !isBoss) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
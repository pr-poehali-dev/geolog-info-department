import { createFileRoute } from "@tanstack/react-router";
import PageLoader from "@/components/PageLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import Employees from "@/pages/Employees";

export const Route = createFileRoute("/employees/")({
  ssr: false,
  pendingComponent: PageLoader,
  component: () => (
    <ProtectedRoute>
      <Employees />
    </ProtectedRoute>
  ),
});

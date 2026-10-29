import { createFileRoute } from "@tanstack/react-router";
import PageLoader from "@/components/PageLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeeProfile from "@/pages/EmployeeProfile";

export const Route = createFileRoute("/employees/$id")({
  ssr: false,
  pendingComponent: PageLoader,
  component: () => (
    <ProtectedRoute>
      <EmployeeProfile />
    </ProtectedRoute>
  ),
});

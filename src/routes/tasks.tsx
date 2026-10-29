import { createFileRoute } from "@tanstack/react-router";
import PageLoader from "@/components/PageLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import Tasks from "@/pages/Tasks";

export const Route = createFileRoute("/tasks")({
  ssr: false,
  pendingComponent: PageLoader,
  component: () => (
    <ProtectedRoute>
      <Tasks />
    </ProtectedRoute>
  ),
});

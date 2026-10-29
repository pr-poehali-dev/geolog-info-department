import { createFileRoute } from "@tanstack/react-router";
import PageLoader from "@/components/PageLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  ssr: false,
  pendingComponent: PageLoader,
  component: () => (
    <ProtectedRoute>
      <Index />
    </ProtectedRoute>
  ),
});

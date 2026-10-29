import { createFileRoute } from "@tanstack/react-router";
import PageLoader from "@/components/PageLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import Settings from "@/pages/Settings";

export const Route = createFileRoute("/settings")({
  ssr: false,
  pendingComponent: PageLoader,
  component: () => (
    <ProtectedRoute bossOnly>
      <Settings />
    </ProtectedRoute>
  ),
});

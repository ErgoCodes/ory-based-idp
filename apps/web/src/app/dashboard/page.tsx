import { AuthGuard } from "@/components/auth-guard"
import { DashboardView } from "@/modules/dashboard/containers/dashboard-container"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardView />
    </AuthGuard>
  )
}

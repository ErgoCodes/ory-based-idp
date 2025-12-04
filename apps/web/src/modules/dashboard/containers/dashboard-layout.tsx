import { SidebarProvider, SidebarInset } from "@workspace/ui/components/sidebar"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { DashboardHeader } from "../components/dashboard-header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

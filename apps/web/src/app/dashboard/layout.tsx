import { AppSidebar } from "@/components/common/dashboard-sidebar"
import DashboardNavBar from "@/components/common/nav-bar"
import React from "react"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - puede ser fixed o static según tu implementación */}
      <AppSidebar />

      {/* Main column: debe crecer, permitir scroll interno y no colapsar */}
      <main className="flex-1 min-h-0 min-w-0 flex flex-col">
        {/* NavBar (no poner sticky sin espacio en main) */}
        <DashboardNavBar />

        {/* Content wrapper: permite scroll vertical sin romper el header */}
        <div className="flex-1 overflow-auto">
          {/* Aquí van las páginas */}
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout

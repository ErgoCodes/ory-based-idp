import { AppSidebar } from "@/components/common/dashboard-sidebar"
import DashboardNavBar from "@/components/common/nav-bar"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import React from "react"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <main className="flex flex-col gap-6 pl-64 pt-25  ">
        {/* <SidebarTrigger /> */}
        <DashboardNavBar />
        {children}
      </main>
    </>
  )
}

export default Layout

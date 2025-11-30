import { authOptions } from "@/lib/auth/auth-config"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { Calendar, Database, Home, Inbox, Search, Settings, Users } from "lucide-react"
import { getServerSession } from "next-auth"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "OAuth2 Clients",
    url: "dashboard/clients",
    icon: Users,
  },
  {
    title: "User Management",
    url: "dashboard/users",
    icon: Users,
  },
]

export async function AppSidebar() {
  const session = await getServerSession(authOptions)
  return (
    <Sidebar className="z-50 bg-secondary">
      <SidebarHeader className="bg-secondary"></SidebarHeader>
      <SidebarContent className="bg-secondary">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

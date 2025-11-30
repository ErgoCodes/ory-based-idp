"use client"

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@workspace/ui/components/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"

interface Item {
  title: string
  url: string
  icon: React.ElementType
}

export function SidebarMenuItems({ items }: { items: Item[] }) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = pathname === `/${item.url}` || pathname.startsWith(`/${item.url}/`)

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={isActive ? "bg-primary text-primary-foreground" : ""}
            >
              <Link href={`/${item.url}`} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function RoleBasedNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const role = session?.user?.role

  if (!session) {
    return null
  }

  const isActive = (path: string) => {
    return pathname === path
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:text-foreground"
  }

  return (
    <nav className="flex gap-4">
      {role === "superadmin" && (
        <>
          <Link
            href="/dashboard/clients"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/clients")}`}
          >
            OAuth2 Clients
          </Link>
          <Link
            href="/dashboard/users"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/users")}`}
          >
            User Management
          </Link>
        </>
      )}
      <Link
        href="/dashboard/profile"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard/profile")}`}
      >
        My Profile
      </Link>
    </nav>
  )
}

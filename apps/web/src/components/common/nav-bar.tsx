"use client"
import { Button } from "@workspace/ui/components/button"
import { LogOut, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import React from "react"

export default function DashboardNavBar() {
  const { data: session } = useSession()
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }
  return (
    <header className="sticky top-0 z-40 w-full border-b ">
      <nav className=" z-40 top-0 left-0 w-full border-b backdrop-blur px-4 py-3 fixed bg-secondary">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-4">
          <Button variant="ghost" className="px-3 py-2 text-sm font-medium">
            <Link href="dashboard/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="capitalize">{session?.user?.name}</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="px-3 py-2 text-sm font-medium"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>
    </header>
  )
}

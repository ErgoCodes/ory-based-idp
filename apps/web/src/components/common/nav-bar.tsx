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
    <header className="sticky top-0 z-40 w-full border-b bg-secondary backdrop-blur">
      <nav className="w-full px-4 py-1">
        <div className="w-full flex justify-between items-center gap-4">
          <div>
            <Link href="/dashboard">
              <h1 className="flex gap-2 text-2xl font-bold cursor-pointer hover:opacity-80 transition">
                Dashboard
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground">Welcome back, {session?.user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/profile">
              <Button
                variant="ghost"
                className="px-3 py-2 cursor-pointer hover:border text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="capitalize">{session?.user?.name}</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              className="px-3 py-2 cursor-pointer text-sm font-medium flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

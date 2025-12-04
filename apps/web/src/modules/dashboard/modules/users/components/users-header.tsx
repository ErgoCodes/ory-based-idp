import { Button } from "@workspace/ui/components/button"
import { Users, UserPlus } from "lucide-react"
import Link from "next/link"

interface UsersHeaderProps {
  userCount: number
}

export function UsersHeader({ userCount }: UsersHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {userCount} user{userCount !== 1 ? "s" : ""} registered
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/users/new" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

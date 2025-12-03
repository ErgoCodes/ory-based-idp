import { Button } from "@workspace/ui/components/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface UsersHeaderProps {
  userCount: number
}

export function UsersHeader({ userCount }: UsersHeaderProps) {
  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">All Users</h2>
        <p className="text-sm text-muted-foreground">
          {userCount} user{userCount !== 1 ? "s" : ""} registered
        </p>
      </div>
    </div>
  )
}

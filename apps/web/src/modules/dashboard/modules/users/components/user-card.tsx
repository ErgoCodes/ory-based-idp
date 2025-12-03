import type { UserProfile } from "@/lib/services/actions"
import { UserActions } from "./user-actions"

interface UserCardProps {
  user: UserProfile
  currentUserId?: string
}

export function UserCard({ user, currentUserId }: UserCardProps) {
  const fullName = user.traits.name
    ? `${user.traits.name.first} ${user.traits.name.last}`
    : "No name set"

  const isCurrentUser = user.id === currentUserId

  return (
    <div className="p-6 bg-card border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{fullName}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                user.traits.role === "superadmin"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}
            >
              {user.traits.role}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2">{user.traits.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">User ID:</span>
              <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">{user.id}</code>
            </div>
            {user.created_at && (
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        <UserActions userId={user.id} userEmail={user.traits.email} disabled={isCurrentUser} />
      </div>
    </div>
  )
}

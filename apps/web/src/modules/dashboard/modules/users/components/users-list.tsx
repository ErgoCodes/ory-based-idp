import type { UserProfile } from "@/lib/services/actions"
import { UserCard } from "./user-card"
import { UsersEmptyState } from "./users-empty-state"

interface UsersListProps {
  users: UserProfile[]
  currentUserId?: string
}

export function UsersList({ users, currentUserId }: UsersListProps) {
  if (users.length === 0) {
    return <UsersEmptyState />
  }

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} currentUserId={currentUserId} />
      ))}
    </div>
  )
}
